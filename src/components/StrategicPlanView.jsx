import React from 'react'
import { 
  CheckCircle2, ArrowRight, Zap, Users, TrendingUp, BarChart3, ShieldCheck, 
  Lightbulb, AlertTriangle, Layers, Target, Clock, ArrowUpRight 
} from 'lucide-react'

export default function StrategicPlanView() {
  const pilares = [
    {
      num: '01',
      titulo: 'Infraestrutura e Operação Física',
      icon: Zap,
      cor: 'border-l-red-600',
      badge: 'Prioridade Zero',
      badgeColor: 'bg-red-50 text-red-800 border-red-200',
      itens: [
        'Dimensionamento prévio da demanda elétrica com capacidade dedicada para freezers, chopeiras e maquinários de alta potência.',
        'Realização de testes de carga e vistoria técnica de estandes 48 horas antes da abertura dos portões.',
        'Garantia de climatização contínua com equipamentos industriais capazes de atender a densidade máxima de visitantes.',
        'Unificação física do pavilhão para integrar todos os estandes em traçado contínuo, evitando salas e blocos isolados.',
        'Antecipação do cronograma de montagem com 1 a 2 dias de antecedência e credenciamento de montadores homologados.'
      ]
    },
    {
      num: '02',
      titulo: 'Atração de Público e Divulgação Segmentada',
      icon: Users,
      cor: 'border-l-blue-600',
      badge: 'Expansão de Mercado',
      badgeColor: 'bg-blue-50 text-blue-800 border-blue-200',
      itens: [
        'Campanha de comunicação direta direcionada a proprietários de mercadinhos de bairro, padarias, mercearias e hotéis.',
        'Articulação de caravanas de empresários em parceria com sindicatos varejistas e associações comerciais do Agreste e Sertão.',
        'Manutenção da mobilização direta pelos expositores com suporte de divulgação institucional nos canais da Fecomércio e ASA.',
        'Diferenciação visual de crachás por perfil (Supermercadista, Fornecedor, Representante) para orientar o networking comercial.'
      ]
    },
    {
      num: '03',
      titulo: 'Efetividade Comercial e Captação de Leads',
      icon: TrendingUp,
      cor: 'border-l-emerald-600',
      badge: 'Geração de Negócios',
      badgeColor: 'bg-emerald-50 text-emerald-800 border-emerald-200',
      itens: [
        'Implantação de crachás inteligentes com leitor de QR Code para captura e exportação digital e voluntária de contatos comerciais.',
        'Estruturação de rodadas formais de negócios entre indústrias fornecedoras e compradores de redes supermercadistas.',
        'Aplicação de pesquisa de acompanhamento (follow-up) de 60 a 90 dias para mensurar o volume financeiro dos negócios convertidos.',
        'Disponibilização de orientação pré-evento aos estandes sobre técnicas de prospecção e acompanhamento de propostas pós-feira.'
      ]
    },
    {
      num: '04',
      titulo: 'Metodologia e Monitoramento Contínuo',
      icon: BarChart3,
      cor: 'border-l-amber-600',
      badge: 'Qualidade Estatística',
      badgeColor: 'bg-amber-50 text-amber-800 border-amber-200',
      itens: [
        'Padronização de todas as perguntas avaliativas em escalas numéricas de 0 a 10, sem faixas agrupadas.',
        'Inclusão da métrica formal do Net Promoter Score (probabilidade de recomendar a FESUPER a parceiros do setor).',
        'Coleta de dados proporcional e distribuída nos três dias do evento, registrando data e hora de cada entrevista.',
        'Garantia de uma resposta por empresa expositora para manter a precisão amostral sem duplicidade corporativa.'
      ]
    },
    {
      num: '05',
      titulo: 'Governança e Parceria Institucional',
      icon: ShieldCheck,
      cor: 'border-l-purple-600',
      badge: 'Fortalecimento do Setor',
      badgeColor: 'bg-purple-50 text-purple-800 border-purple-200',
      itens: [
        'Reunião técnica de pactuação de metas entre a Diretoria da ASA e o Sistema Fecomércio Sesc Senac Alagoas.',
        'Apresentação pública dos resultados como prestação de contas aos expositores para incentivar a fidelização para 2027.',
        'Consolidação de Arapiraca como o polo regional indutor de abastecimento e desenvolvimento do comércio supermercadista.'
      ]
    }
  ]

  const matrizAcoes = [
    {
      tipo: 'Ganhos Imediatos (Menor Complexidade / Alto Retorno)',
      descricao: 'Ações operacionais com implementação direta para a 25ª edição',
      cor: 'border-emerald-300 bg-white',
      itens: [
        'Crachás inteligentes com QR Code para leitura rápida de contatos nos estandes',
        'Cores diferenciadas nos crachás por categoria de visitante e expositor',
        'Antecipação do cronograma de montagem com estandes liberados 24h antes',
        'Articulação de caravanas de compradores com entidades do Agreste e Sertão',
        'Padronização das escalas de 0 a 10 e pesquisa pós-evento de 90 dias'
      ]
    },
    {
      tipo: 'Projetos Estruturantes (Requer Planejamento e Investimento)',
      descricao: 'Decisões de engenharia e infraestrutura locacional',
      cor: 'border-blue-300 bg-white',
      itens: [
        'Subestação móvel ou gerador dedicado para suportar carga pesada de refrigeração',
        'Climatização contínua de alta capacidade cobrindo todo o pavilhão',
        'Planta baixa em pavilhão único sem fragmentação de fluxo de visitantes',
        'Ampliação da praça de alimentação e pontos de apoio aos expositores'
      ]
    }
  ]

  return (
    <div className="space-y-6 sm:space-y-8">
      
      {/* Banner */}
      <div className="bg-gradient-to-r from-[#002B55] via-[#023e73] to-[#033B2E] rounded-2xl p-4 sm:p-6 text-white shadow-md border border-slate-800">
        <span className="bg-fecomercio-gold text-white text-[10px] sm:text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
          Planejamento Diretor FESUPER 2027
        </span>
        <h2 className="text-lg sm:text-2xl font-bold tracking-tight mt-2">
          Diretrizes e Recomendações Estruturais para a 25ª Edição
        </h2>
        <p className="text-slate-200 text-xs sm:text-sm mt-1 max-w-3xl leading-relaxed">
          Com base nos achados da pesquisa de campo e no relatório técnico homologado pela Fecomércio Alagoas e ASA, apresentamos as intervenções prioritárias para consolidar o evento como referência do varejo regional.
        </p>
      </div>

      {/* Matriz de Priorização Gerencial */}
      <div className="space-y-3">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Layers className="w-4 h-4 text-fecomercio-blue" />
          Matriz de Priorização de Intervenções
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {matrizAcoes.map((bloco, idx) => (
            <div key={idx} className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border ${bloco.cor} shadow-sm space-y-3`}>
              <div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900">{bloco.tipo}</h4>
                <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5">{bloco.descricao}</p>
              </div>

              <ul className="space-y-2 pt-2 border-t border-slate-100">
                {bloco.itens.map((acao, aIdx) => (
                  <li key={aIdx} className="flex items-start gap-2 text-xs text-slate-700 leading-relaxed">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{acao}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Os 5 Pilares do Relatório Oficial */}
      <div className="space-y-4">
        <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
          <Target className="w-4 h-4 text-fesuper-emerald" />
          Os 5 Pilares Estratégicos Fecomércio AL & ASA
        </h3>

        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {pilares.map((pilar, idx) => (
            <div 
              key={idx}
              className={`bg-white rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-slate-200 shadow-sm border-l-4 ${pilar.cor} space-y-3 sm:space-y-4 hover:shadow-md transition-shadow`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <span className="text-base sm:text-lg font-extrabold text-slate-400 font-mono">{pilar.num}</span>
                  <h4 className="text-sm sm:text-base font-bold text-slate-900">{pilar.titulo}</h4>
                </div>
                <span className={`text-[10px] sm:text-[11px] font-bold px-2.5 sm:px-3 py-1 rounded-full border self-start sm:self-auto ${pilar.badgeColor}`}>
                  {pilar.badge}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5 sm:gap-3 pt-2">
                {pilar.itens.map((it, itIdx) => (
                  <div key={itIdx} className="flex items-start gap-2 p-2.5 sm:p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs text-slate-700 leading-relaxed">
                    <span className="w-1.5 h-1.5 rounded-full bg-fecomercio-blue shrink-0 mt-1.5"></span>
                    <span>{it}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
