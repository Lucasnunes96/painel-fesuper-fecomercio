// Utilitário para filtragem e recálculo dinâmico dos dados do dashboard

const OP_FIELD_MAP = {
  'Credenciamento e recepção': 'credenciamento',
  'Apoio prestado pela organização': 'apoio_organizacao',
  'Programação da feira': 'programacao',
  'Experiência geral da empresa': 'experiencia_geral',
  'Limpeza, conforto e segurança': 'limpeza_seguranca',
  'Organização geral': 'organizacao',
  'Quantidade e perfil dos visitantes': 'perfil_visitantes',
  'Comunicação pré e durante evento': 'comunicacao',
  'Estrutura e Montagem dos estandes': 'estrutura_montagem',
}

export function filterAndRecalculateData(rawData, filters) {
  // 1. Filtrar registros individuais
  const filteredExpositores = (filters.publico === 'visitantes') 
    ? [] 
    : rawData.registros_expositores.filter(item => {
        if (filters.npsCat !== 'todos' && item.nps_categoria !== filters.npsCat) return false
        if (filters.origem !== 'todos' && item.origem_macro !== filters.origem) return false
        return true
      })

  const filteredVisitantes = (filters.publico === 'expositores')
    ? []
    : rawData.registros_visitantes.filter(item => {
        if (filters.npsCat !== 'todos' && item.nps_categoria !== filters.npsCat) return false
        if (filters.origem !== 'todos' && item.municipio_macro !== filters.origem) return false
        return true
      })

  const activeIds = new Set([
    ...filteredExpositores.map(e => e.id),
    ...filteredVisitantes.map(v => v.id)
  ])

  // Filtrar feedbacks
  const filteredFeedbacks = rawData.feedbacks.filter(fb => activeIds.has(fb.id))

  // Recalcular tags qualitativas
  const tagCounter = {}
  filteredFeedbacks.forEach(fb => {
    fb.tags.forEach(t => {
      tagCounter[t] = (tagCounter[t] || 0) + 1
    })
  })
  const filteredTags = Object.entries(tagCounter)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)

  // 2. Recalcular KPIs Expositores
  const expTotal = filteredExpositores.length
  let expNps = 0
  let expPromCount = 0, expNeuCount = 0, expDetCount = 0
  let expMeanExp = 0, expMeanRet = 0
  let expDealsClosedCount = 0, expDealsPotentialCount = 0
  let expTeamSum = 0, expTeamCount = 0

  if (expTotal > 0) {
    let expScoreSum = 0, expScoreCount = 0
    let expRetSum = 0, expRetCount = 0

    filteredExpositores.forEach(r => {
      if (r.nps_categoria === 'Promotor') expPromCount++
      else if (r.nps_categoria === 'Neutro') expNeuCount++
      else if (r.nps_categoria === 'Detrator') expDetCount++

      if (r.experiencia_geral !== null && !isNaN(r.experiencia_geral)) {
        expScoreSum += Number(r.experiencia_geral)
        expScoreCount++
      }

      if (r.intencao_retorno_score !== null && !isNaN(r.intencao_retorno_score)) {
        expRetSum += Number(r.intencao_retorno_score)
        expRetCount++
      }

      const potNeg = (r.potencial_negocios || '').toLowerCase()
      if (potNeg.includes('já foram realizados') || potNeg.includes('ja foram')) {
        expDealsClosedCount++
        expDealsPotentialCount++
      } else if (potNeg.includes('oportunidades') || potNeg.includes('resultar')) {
        expDealsPotentialCount++
      }

      if (r.reps_equipe && !isNaN(r.reps_equipe)) {
        expTeamSum += Number(r.reps_equipe)
        expTeamCount++
      }
    })

    expNps = Math.round(((expPromCount - expDetCount) / expTotal) * 100)
    expMeanExp = expScoreCount > 0 ? Number((expScoreSum / expScoreCount).toFixed(2)) : 0
    expMeanRet = expRetCount > 0 ? Number((expRetSum / expRetCount).toFixed(2)) : 0
  }

  const expPromPct = expTotal > 0 ? Number(((expPromCount / expTotal) * 100).toFixed(1)) : 0
  const expNeuPct = expTotal > 0 ? Number(((expNeuCount / expTotal) * 100).toFixed(1)) : 0
  const expDetPct = expTotal > 0 ? Number(((expDetCount / expTotal) * 100).toFixed(1)) : 0
  const expDealsClosedPct = expTotal > 0 ? Number(((expDealsClosedCount / expTotal) * 100).toFixed(1)) : 0
  const expDealsPotentialPct = expTotal > 0 ? Number(((expDealsPotentialCount / expTotal) * 100).toFixed(1)) : 0
  const expTeamAvg = expTeamCount > 0 ? Number((expTeamSum / expTeamCount).toFixed(1)) : 5.2

  // 3. Recalcular KPIs Visitantes
  const visTotal = filteredVisitantes.length
  let visNps = 0
  let visPromCount = 0, visNeuCount = 0, visDetCount = 0
  let visMeanExp = 0, visMeanExpect = 0, visMeanRet = 0
  let visFirstTimeCount = 0
  let visDealsDoneCount = 0, visDealsTotalCount = 0

  if (visTotal > 0) {
    let visScoreSum = 0, visScoreCount = 0
    let visExpectSum = 0, visExpectCount = 0
    let visRetSum = 0, visRetCount = 0

    filteredVisitantes.forEach(r => {
      if (r.nps_categoria === 'Promotor') visPromCount++
      else if (r.nps_categoria === 'Neutro') visNeuCount++
      else if (r.nps_categoria === 'Detrator') visDetCount++

      if (r.experiencia_geral !== null && !isNaN(r.experiencia_geral)) {
        visScoreSum += Number(r.experiencia_geral)
        visScoreCount++
      }
      if (r.expectativas_atendidas !== null && !isNaN(r.expectativas_atendidas)) {
        visExpectSum += Number(r.expectativas_atendidas)
        visExpectCount++
      }
      if (r.intencao_retorno_score !== null && !isNaN(r.intencao_retorno_score)) {
        visRetSum += Number(r.intencao_retorno_score)
        visRetCount++
      }

      if ((r.primeira_vez || '').toLowerCase().includes('sim')) {
        visFirstTimeCount++
      }

      const dealStr = (r.realizou_negocio || '').toLowerCase()
      if (dealStr.includes('já realizei') || dealStr.includes('ja realizei')) {
        visDealsDoneCount++
        visDealsTotalCount++
      } else if (dealStr.includes('pretendo')) {
        visDealsTotalCount++
      }
    })

    visNps = Math.round(((visPromCount - visDetCount) / visTotal) * 100)
    visMeanExp = visScoreCount > 0 ? Number((visScoreSum / visScoreCount).toFixed(2)) : 0
    visMeanExpect = visExpectCount > 0 ? Number((visExpectSum / visExpectCount).toFixed(2)) : 0
    visMeanRet = visRetCount > 0 ? Number((visRetSum / visRetCount).toFixed(2)) : 0
  }

  const visPromPct = visTotal > 0 ? Number(((visPromCount / visTotal) * 100).toFixed(1)) : 0
  const visNeuPct = visTotal > 0 ? Number(((visNeuCount / visTotal) * 100).toFixed(1)) : 0
  const visDetPct = visTotal > 0 ? Number(((visDetCount / visTotal) * 100).toFixed(1)) : 0
  const visFirstTimePct = visTotal > 0 ? Number(((visFirstTimeCount / visTotal) * 100).toFixed(1)) : 0
  const visDealsDonePct = visTotal > 0 ? Number(((visDealsDoneCount / visTotal) * 100).toFixed(1)) : 0
  const visDealsTotalPct = visTotal > 0 ? Number(((visDealsTotalCount / visTotal) * 100).toFixed(1)) : 0

  // 4. Recalcular Dimensões Operacionais & Radar dos Expositores
  const updatedDimensoes = rawData.dimensoes_operacionais.map(dim => {
    const field = OP_FIELD_MAP[dim.dimensao]
    if (!field || expTotal === 0) return { ...dim, nota: expTotal === 0 ? 0 : dim.nota }

    let sum = 0, count = 0
    let n10 = 0, n89 = 0, n67 = 0, n5 = 0

    filteredExpositores.forEach(r => {
      const val = r[field]
      if (val !== null && val !== undefined && !isNaN(val)) {
        sum += Number(val)
        count++
        if (val >= 9.5) n10++
        else if (val >= 7.5) n89++
        else if (val >= 5.5) n67++
        else n5++
      }
    })

    const avg = count > 0 ? Number((sum / count).toFixed(2)) : dim.nota
    const pct10 = count > 0 ? Number(((n10 / count) * 100).toFixed(1)) : 0

    return {
      ...dim,
      nota: avg,
      respostas_validas: count,
      distribuicao: { nota_10: n10, nota_8_9: n89, nota_6_7: n67, nota_ate_5: n5 },
      pct_10: pct10
    }
  })

  const updatedRadar = updatedDimensoes.map(item => ({
    subject: item.sigla,
    nota: item.nota,
    full_name: item.dimensao,
    categoria: item.categoria,
    citacao: item.citacao_destaque,
    pct_10: item.pct_10,
    respostas: item.respostas_validas
  }))

  // 5. Recalcular Segmentos Expositores
  const segCounter = {}
  filteredExpositores.forEach(r => {
    const s = r.segmento || 'Outros'
    segCounter[s] = (segCounter[s] || 0) + 1
  })
  const updatedSegmentos = Object.entries(segCounter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({
      name: name.slice(0, 30),
      count,
      percent: expTotal > 0 ? Number(((count / expTotal) * 100).toFixed(1)) : 0
    }))

  // 6. Recalcular Contatos Expositores
  const contatosCounter = {}
  filteredExpositores.forEach(r => {
    const c = r.contatos_gerados || 'Não informado'
    contatosCounter[c] = (contatosCounter[c] || 0) + 1
  })
  const updatedContatos = Object.entries(contatosCounter).map(([name, count]) => ({
    name,
    count,
    percent: expTotal > 0 ? Number(((count / expTotal) * 100).toFixed(1)) : 0
  }))

  // 7. Recalcular Perfil Visitantes
  const perfilCounter = {}
  filteredVisitantes.forEach(r => {
    const p = r.perfil_participante || 'Outros'
    perfilCounter[p] = (perfilCounter[p] || 0) + 1
  })
  const updatedPerfil = Object.entries(perfilCounter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([name, count]) => ({
      name,
      count,
      percent: visTotal > 0 ? Number(((count / visTotal) * 100).toFixed(1)) : 0
    }))

  // 8. Recalcular Origem Visitantes
  const origemVisCounter = {}
  filteredVisitantes.forEach(r => {
    const o = r.municipio_macro || 'Outros'
    origemVisCounter[o] = (origemVisCounter[o] || 0) + 1
  })
  const updatedOrigemVis = Object.entries(origemVisCounter).map(([name, count]) => ({
    name,
    count,
    percent: visTotal > 0 ? Number(((count / visTotal) * 100).toFixed(1)) : 0
  }))

  // Montar objeto dinâmico completo
  return {
    metadata: {
      ...rawData.metadata,
      total_expositores_filtrados: expTotal,
      total_visitantes_filtrados: visTotal,
      total_geral_filtrados: expTotal + visTotal,
    },
    kpis_principais: {
      expositores: {
        nps: expNps,
        nps_zona: expNps >= 75 ? 'Zona de Excelência' : expNps >= 50 ? 'Zona de Qualidade' : expNps >= 0 ? 'Zona de Aperfeiçoamento' : 'Zona Crítica',
        media_experiencia: expMeanExp,
        media_retorno: expMeanRet,
        promotores_pct: expPromPct,
        neutros_pct: expNeuPct,
        detratores_pct: expDetPct,
        promotores_qtd: expPromCount,
        neutros_qtd: expNeuCount,
        detratores_qtd: expDetCount,
        negocios_efetivos_pct: expDealsClosedPct,
        negocios_efetivos_ou_potenciais_pct: expDealsPotentialPct,
        equipe_media_por_estande: expTeamAvg,
        total_profissionais_estimados: Math.round(expTeamAvg * expTotal),
        total_expositores: expTotal
      },
      visitantes: {
        nps: visNps,
        nps_zona: visNps >= 75 ? 'Zona de Excelência' : visNps >= 50 ? 'Zona de Qualidade' : visNps >= 0 ? 'Zona de Aperfeiçoamento' : 'Zona Crítica',
        media_experiencia: visMeanExp,
        media_expectativas: visMeanExpect,
        media_retorno: visMeanRet,
        promotores_pct: visPromPct,
        neutros_pct: visNeuPct,
        detratores_pct: visDetPct,
        promotores_qtd: visPromCount,
        neutros_qtd: visNeuCount,
        detratores_qtd: visDetCount,
        primeira_vez_pct: visFirstTimePct,
        negocio_realizado_pct: visDealsDonePct,
        negocio_realizado_ou_pretendido_pct: visDealsTotalPct,
        total_visitantes: visTotal
      }
    },
    dimensoes_operacionais: updatedDimensoes,
    radar_data: updatedRadar,
    segmentos_expositores: updatedSegmentos.length > 0 ? updatedSegmentos : rawData.segmentos_expositores,
    objetivos_expositores: rawData.objetivos_expositores,
    contatos_expositores: updatedContatos.length > 0 ? updatedContatos : rawData.contatos_expositores,
    perfil_visitantes: updatedPerfil.length > 0 ? updatedPerfil : rawData.perfil_visitantes,
    origem_visitantes: updatedOrigemVis.length > 0 ? updatedOrigemVis : rawData.origem_visitantes,
    origem_expositores: rawData.origem_expositores,
    motivos_visitantes: rawData.motivos_visitantes,
    canais_visitantes: rawData.canais_visitantes,
    tags_qualitativas: filteredTags.length > 0 ? filteredTags : rawData.tags_qualitativas,
    feedbacks: filteredFeedbacks,
    registros_expositores: filteredExpositores,
    registros_visitantes: filteredVisitantes,
    filteredExpositores,
    filteredVisitantes
  }
}

