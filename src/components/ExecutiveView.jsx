import React from 'react'
import { 
  Award, TrendingUp, Users, Building2, ShoppingBag, 
  CheckCircle2, AlertTriangle, ArrowUpRight, Zap, Flame, Compass, ChevronRight, Info, MessageSquare 
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, 
  PieChart, Pie, Cell 
} from 'recharts'
import MetricCard from './MetricCard'

// Tooltip customizado enriquecido para o comparativo
function ComparativeCustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    const qualContext = {
      'Experiência Geral': {
        exp: 'Média 9,05 • Considera estrutura física, montagem e retorno comercial',
        vis: 'Média 9,55 • 73,2% atribuíram nota máxima (10)'
      },
      'Intenção de Retorno': {
        exp: 'Média 9,00 • NPS +66 (Zona de Qualidade, 75,8% promotores)',
        vis: 'Média 9,75 • NPS +92 (Zona de Excelência, 93,4% promotores)'
      },
      'Negócios Concluídos (%)': {
        exp: '22,6% já fecharam vendas ou contratos no estande',
        vis: '32,0% já realizaram compras ou fecharam parcerias no evento'
      },
      'Negócios Efetivos/Potenciais (%)': {
        exp: '90,3% afirmam que a feira gerou ou tem potencial de gerar negócios',
        vis: '59,0% já realizaram ou pretendem realizar negócios decorrentes da feira'
      }
    }

    const info = qualContext[label] || {}

    return (
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xl border border-slate-700 max-w-sm text-xs space-y-2 z-50">
        <p className="font-bold text-slate-100 text-sm border-b border-slate-700 pb-1">{label}</p>
        
        <div className="space-y-1.5 pt-1">
          <div className="flex items-start gap-2">
            <span className="w-2.5 h-2.5 rounded bg-[#004B8D] shrink-0 mt-1"></span>
            <div>
              <span className="font-bold text-slate-200">Expositores: {payload[0]?.value}</span>
              {info.exp && <p className="text-[11px] text-slate-400">{info.exp}</p>}
            </div>
          </div>

          <div className="flex items-start gap-2">
            <span className="w-2.5 h-2.5 rounded bg-[#059669] shrink-0 mt-1"></span>
            <div>
              <span className="font-bold text-slate-200">Visitantes: {payload[1]?.value}</span>
              {info.vis && <p className="text-[11px] text-slate-400">{info.vis}</p>}
            </div>
          </div>
        </div>
      </div>
    )
  }
  return null
}

export default function ExecutiveView({ data, onSelectTab }) {
  const { kpis_principais, metadata } = data
  const exp = kpis_principais.expositores
  const vis = kpis_principais.visitantes

  const comparativeData = [
    {
      dimensao: 'Experiência Geral',
      Expositores: exp.media_experiencia,
      Visitantes: vis.media_experiencia,
    },
    {
      dimensao: 'Intenção de Retorno',
      Expositores: exp.media_retorno,
      Visitantes: vis.media_retorno,
    },
    {
      dimensao: 'Negócios Concluídos (%)',
      Expositores: exp.negocios_efetivos_pct,
      Visitantes: vis.negocio_realizado_pct,
    },
    {
      dimensao: 'Negócios Efetivos/Potenciais (%)',
      Expositores: exp.negocios_efetivos_ou_potenciais_pct,
      Visitantes: vis.negocio_realizado_ou_pretendido_pct,
    }
  ]

  const expNpsData = [
    { name: 'Promotores (9-10)', value: exp.promotores_qtd, pct: exp.promotores_pct, color: '#059669' },
    { name: 'Neutros (7-8)', value: exp.neutros_qtd, pct: exp.neutros_pct, color: '#D97706' },
    { name: 'Detratores (0-6)', value: exp.detratores_qtd, pct: exp.detratores_pct, color: '#DC2626' },
  ]

  const visNpsData = [
    { name: 'Promotores (9-10)', value: vis.promotores_qtd, pct: vis.promotores_pct, color: '#059669' },
    { name: 'Neutros (7-8)', value: vis.neutros_qtd, pct: vis.neutros_pct, color: '#D97706' },
    { name: 'Detratores (0-6)', value: vis.detratores_qtd, pct: vis.detratores_pct, color: '#DC2626' },
  ]

  return (
    <div className="space-y-6">
      
      {/* Top Banner Executive Announcement */}
      <div className="bg-gradient-to-r from-fecomercio-navy via-[#023e73] to-[#033B2E] rounded-2xl p-6 text-white shadow-md border border-slate-800 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-fesuper-emerald text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>Diagnóstico Consolidado Fecomércio AL & ASA</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
              Relatório Executivo de Desempenho e Satisfação FESUPER 2026
            </h2>
            <p className="text-slate-200 text-xs sm:text-sm leading-relaxed">
              Base primária com <strong>185 respostas certificadas</strong> (62 expositores e 123 visitantes). 
              Os indicadores confirmam o fortalecimento do varejo de alimentos e bebidas em Alagoas, com elevada intenção de retorno e geração de oportunidades de negócios em Arapiraca.
            </p>
          </div>

          <div className="flex flex-row lg:flex-col gap-2.5 shrink-0">
            <button 
              onClick={() => onSelectTab('recomendacoes')}
              className="flex items-center justify-between gap-3 bg-fecomercio-gold hover:bg-amber-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm active:scale-95"
            >
              <span>Recomendações Estruturais</span>
              <ChevronRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onSelectTab('voz_cliente')}
              className="flex items-center justify-between gap-3 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold px-4 py-2.5 rounded-xl transition-all border border-white/15 active:scale-95"
            >
              <span>Relatos Literais dos Participantes</span>
              <MessageSquare className="w-4 h-4 text-slate-300" />
            </button>
          </div>
        </div>
      </div>

      {/* Headline Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <MetricCard
          title="NPS Adaptado - Visitantes"
          value={vis.total_visitantes > 0 ? (vis.nps > 0 ? `+${vis.nps}` : `${vis.nps}`) : 'N/A'}
          subtitle={vis.total_visitantes > 0 ? `${vis.promotores_pct}% Promotores (${vis.promotores_qtd}) • Média ${vis.media_retorno}` : 'Sem respondentes no filtro'}
          badge={vis.total_visitantes > 0 ? vis.nps_zona : 'Filtro Ativo'}
          badgeType={vis.total_visitantes > 0 ? 'success' : 'neutral'}
          icon={Award}
          variant="green"
        />

        <MetricCard
          title="NPS Adaptado - Expositores"
          value={exp.total_expositores > 0 ? (exp.nps > 0 ? `+${exp.nps}` : `${exp.nps}`) : 'N/A'}
          subtitle={exp.total_expositores > 0 ? `${exp.promotores_pct}% Promotores (${exp.promotores_qtd}) • Média ${exp.media_retorno}` : 'Sem respondentes no filtro'}
          badge={exp.total_expositores > 0 ? exp.nps_zona : 'Filtro Ativo'}
          badgeType={exp.total_expositores > 0 ? 'info' : 'neutral'}
          icon={Building2}
          variant="blue"
        />

        <MetricCard
          title="Média de Experiência Geral"
          value={vis.total_visitantes > 0 || exp.total_expositores > 0 ? `${vis.total_visitantes > 0 ? vis.media_experiencia : exp.media_experiencia} / 10` : 'N/A'}
          subtitle={`Visitantes: ${vis.media_experiencia || '-'} | Expositores: ${exp.media_experiencia || '-'}`}
          badge="Aprovação"
          badgeType="success"
          icon={TrendingUp}
          variant="gold"
        />

        <MetricCard
          title="Efetividade Comercial B2B"
          value={exp.total_expositores > 0 ? `${exp.negocios_efetivos_ou_potenciais_pct}%` : 'N/A'}
          subtitle={exp.total_expositores > 0 ? `${exp.negocios_efetivos_pct}% fechados + ${exp.negocios_efetivos_ou_potenciais_pct}% potencial` : 'Sem expositores no filtro'}
          badge="Retorno Comercial"
          badgeType="success"
          icon={ShoppingBag}
          variant="green"
        />

      </div>

      {/* Comparative Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Bar Chart: Benchmarking Expositores vs Visitantes */}
        <div className="lg:col-span-2 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                Comparativo Entre Públicos: Expositores vs. Visitantes
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600">
                Toque ou passe o mouse nas barras para ler o contexto qualitativo
              </p>
            </div>
            <div className="flex items-center gap-3 text-xs font-semibold">
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded bg-fecomercio-blue"></span> Expositores
              </span>
              <span className="flex items-center gap-1.5 text-slate-700">
                <span className="w-2.5 h-2.5 rounded bg-fesuper-emerald"></span> Visitantes
              </span>
            </div>
          </div>

          <div className="h-64 sm:h-72 lg:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={comparativeData}
                margin={{ top: 15, right: 15, left: 0, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis 
                  dataKey="dimensao" 
                  tick={{ fontSize: 10, fill: '#475569', fontWeight: 500 }} 
                  interval={0}
                  angle={-10}
                  textAnchor="end"
                  tickFormatter={(val) => {
                    if (val.includes('Geral')) return 'Experiência Geral'
                    if (val.includes('Retorno')) return 'Intenção de Retorno'
                    if (val.includes('Concluídos')) return 'Negócios Fechados %'
                    if (val.includes('Potenciais')) return 'Negócios Potenciais %'
                    return val
                  }}
                />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip content={<ComparativeCustomTooltip />} />
                <Bar dataKey="Expositores" fill="#004B8D" radius={[6, 6, 0, 0]} isAnimationActive={false} />
                <Bar dataKey="Visitantes" fill="#059669" radius={[6, 6, 0, 0]} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] sm:text-xs text-slate-700 flex items-start gap-2">
            <Info className="w-4 h-4 text-fecomercio-blue shrink-0 mt-0.5" />
            <p>
              <strong>Interpretação Executiva:</strong> Enquanto os visitantes avaliaram a feira prioritariamente pela experiência e novidades do varejo (média 9,55 e NPS +92), os expositores (9,05 e NPS +66) ponderaram o investimento financeiro, a montagem e a infraestrutura elétrica compatível.
            </p>
          </div>
        </div>

        {/* NPS Breakdown Donut Cards */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
              Distribuição do NPS Adaptado
            </h3>
            <p className="text-[11px] sm:text-xs text-slate-600">
              Proporção de promotores, neutros e detratores
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 my-2">
            {/* Expositores */}
            <div className="text-center p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center space-y-1">
              <p className="text-[11px] sm:text-xs font-bold text-fecomercio-blue uppercase tracking-wider">Expositores</p>
              <div className="nps-donut-box w-[130px] h-[105px] flex items-center justify-center my-0.5">
                <PieChart width={130} height={105}>
                  <Pie 
                    data={expNpsData} 
                    cx={65} 
                    cy={52} 
                    innerRadius={25} 
                    outerRadius={45} 
                    dataKey="value"
                    isAnimationActive={false}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {expNpsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} respostas`, name]} />
                </PieChart>
              </div>
              <div>
                <p className="text-sm sm:text-base font-extrabold text-slate-800 leading-tight">NPS +{exp.nps}</p>
                <p className="text-[10px] sm:text-[11px] text-slate-600 font-semibold mt-0.5">{exp.promotores_pct}% Promotores</p>
              </div>
            </div>

            {/* Visitantes */}
            <div className="text-center p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col items-center justify-center space-y-1">
              <p className="text-[11px] sm:text-xs font-bold text-fesuper-emerald uppercase tracking-wider">Visitantes</p>
              <div className="nps-donut-box w-[130px] h-[105px] flex items-center justify-center my-0.5">
                <PieChart width={130} height={105}>
                  <Pie 
                    data={visNpsData} 
                    cx={65} 
                    cy={52} 
                    innerRadius={25} 
                    outerRadius={45} 
                    dataKey="value"
                    isAnimationActive={false}
                    stroke="#ffffff"
                    strokeWidth={2}
                  >
                    {visNpsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value, name) => [`${value} respostas`, name]} />
                </PieChart>
              </div>
              <div>
                <p className="text-sm sm:text-base font-extrabold text-slate-800 leading-tight">NPS +{vis.nps}</p>
                <p className="text-[10px] sm:text-[11px] text-slate-600 font-semibold mt-0.5">{vis.promotores_pct}% Promotores</p>
              </div>
            </div>
          </div>

          {/* Legenda NPS */}
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-1 text-[10px] sm:text-[11px] text-slate-600">
            <span className="flex items-center gap-1 font-semibold text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600"></span> Promotor (9-10)
            </span>
            <span className="flex items-center gap-1 font-semibold text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-600"></span> Neutro (7-8)
            </span>
            <span className="flex items-center gap-1 font-semibold text-red-800">
              <span className="w-2 h-2 rounded-full bg-red-600"></span> Detrator (0-6)
            </span>
          </div>
        </div>

      </div>

      {/* 4 Sínteses Estruturais do Relatório Técnico */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-50 text-fesuper-emerald flex items-center justify-center font-bold text-xs">
            01
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">Alta Conversão Comercial</h4>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
            <strong>90,3% dos expositores</strong> e <strong>59,0% dos visitantes</strong> concretizaram ou pretendem firmar negócios resultantes do evento.
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-blue-50 text-fecomercio-blue flex items-center justify-center font-bold text-xs">
            02
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">Mobilização de Equipes</h4>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
            Média de <strong>10,9 profissionais por empresa</strong> (mediana de 7; ~591 representantes declarados), com forte presença regional e interestadual.
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-red-200 bg-red-50/20 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-red-100 text-red-700 flex items-center justify-center font-bold text-xs">
            03
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">Estrutura e Energia Elétrica</h4>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
            Quesito com menor avaliação (média <strong>7,89</strong>). Expositores demandam climatização contínua e maior potência elétrica para refrigeração.
          </p>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm space-y-2">
          <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-xs">
            04
          </div>
          <h4 className="text-xs sm:text-sm font-bold text-slate-800">59,3% Renovação de Público</h4>
          <p className="text-[11px] sm:text-xs text-slate-600 leading-relaxed">
            A maioria compareceu pela 1ª vez. Demanda consolidada para atrair ainda mais proprietários de mercadinhos e padarias do interior alagoano.
          </p>
        </div>

      </div>

    </div>
  )
}
