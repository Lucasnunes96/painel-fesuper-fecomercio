import React, { useState, useMemo } from 'react'
import Header from './components/Header'
import FilterBar from './components/FilterBar'
import ExecutiveView from './components/ExecutiveView'
import ExhibitorsView from './components/ExhibitorsView'
import VisitorsView from './components/VisitorsView'
import FeedbackExplorer from './components/FeedbackExplorer'
import StrategicPlanView from './components/StrategicPlanView'
import DataGridExport from './components/DataGridExport'
import LoginPage from './components/LoginPage'
import ReportModal from './components/ReportModal'
import dashboardData from './data/dashboard_data.json'
import { filterAndRecalculateData } from './utils/filterData'

import { 
  LayoutDashboard, Building2, Users, MessageSquareText, 
  Lightbulb, Table, Filter, X, ArrowLeft, Printer 
} from 'lucide-react'

const DEFAULT_REPORT_SECTIONS = [
  { id: 'executiva', label: 'Visão Executiva & Síntese', description: 'KPIs, benchmarking entre públicos e distribuição de NPS', included: true },
  { id: 'recomendacoes', label: 'Recomendações Estruturais', description: 'Diretrizes 2027 e os 3 Pilares Estratégicos Fecomércio & ASA', included: true },
  { id: 'expositores', label: 'Expositores (B2B)', description: 'Efetividade comercial, radar de satisfação e conversão', included: true },
  { id: 'visitantes', label: 'Visitantes (Varejo)', description: 'Perfil de compras, motivações e índice de aprovação', included: true },
  { id: 'voz_cliente', label: 'Depoimentos & Críticas', description: 'Relatos literais e análise qualitativa de participantes', included: true }
]

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = sessionStorage.getItem('fesuper_auth_user')
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [activeTab, setActiveTab] = useState('executiva')
  const [filters, setFilters] = useState({
    publico: 'todos',
    npsCat: 'todos',
    origem: 'todos'
  })

  // Estado do Gerador de Relatório Personalizado
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [reportSections, setReportSections] = useState(DEFAULT_REPORT_SECTIONS)
  const [isReportMode, setIsReportMode] = useState(false)

  const handleGenerateReport = (configuredSections) => {
    setReportSections(configuredSections)
    setIsReportMode(true)
    setIsReportModalOpen(false)
    // Tempo seguro para que todos os gráficos Recharts realizem medição e renderização no DOM antes da impressão
    setTimeout(() => {
      window.print()
    }, 800)
  }

  const handleLogin = (user) => {
    setCurrentUser(user)
    try {
      sessionStorage.setItem('fesuper_auth_user', JSON.stringify(user))
    } catch (e) {
      console.error(e)
    }
  }

  const handleLogout = () => {
    setCurrentUser(null)
    try {
      sessionStorage.removeItem('fesuper_auth_user')
    } catch (e) {
      console.error(e)
    }
  }

  // Recálculo dinâmico e reativo de todos os dados com base nos filtros
  const dynamicData = useMemo(() => {
    return filterAndRecalculateData(dashboardData, filters)
  }, [filters])

  const isFiltered = filters.publico !== 'todos' || filters.npsCat !== 'todos' || filters.origem !== 'todos'

  const stats = {
    totalCount: dashboardData.metadata.total_geral_respostas,
    filteredCount: dynamicData.metadata.total_geral_filtrados
  }

  const handleResetFilters = () => {
    setFilters({
      publico: 'todos',
      npsCat: 'todos',
      origem: 'todos'
    })
  }

  const handleExportCSV = () => {
    let csvContent = "\uFEFF"
    csvContent += "ID;Tipo;Empresa/Perfil;Segmento/Motivo;Origem;Experiência Geral;Nota Retorno (NPS);Categoria NPS;Abaixo das Expectativas;Sugestão de Melhoria\r\n"
    
    dynamicData.filteredExpositores.forEach(r => {
      const escape = (txt) => `"${String(txt || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
      csvContent += `${r.id};Expositor;${escape(r.empresa)};${escape(r.segmento)};${escape(r.origem_macro)};${r.experiencia_geral || ''};${r.intencao_retorno_score || ''};${r.nps_categoria};${escape(r.abaixo_expectativas)};${escape(r.sugestao_melhoria)}\r\n`
    })

    dynamicData.filteredVisitantes.forEach(r => {
      const escape = (txt) => `"${String(txt || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`
      csvContent += `${r.id};Visitante;${escape(r.perfil_participante)};${escape(r.motivo_principal)};${escape(r.municipio_macro)};${r.experiencia_geral || ''};${r.intencao_retorno_score || ''};${r.nps_categoria};${escape(r.abaixo_expectativas)};${escape(r.sugestao_melhoria)}\r\n`
    })

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `pesquisa_satisfacao_fesuper_2026_${isFiltered ? 'filtrada' : 'completa'}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const tabs = [
    { id: 'executiva', label: 'Visão Executiva & Síntese', icon: LayoutDashboard },
    { id: 'expositores', label: 'Expositores (B2B)', icon: Building2, count: dynamicData.filteredExpositores.length },
    { id: 'visitantes', label: 'Visitantes (Varejo)', icon: Users, count: dynamicData.filteredVisitantes.length },
    { id: 'voz_cliente', label: 'Depoimentos & Críticas', icon: MessageSquareText, count: dynamicData.feedbacks.length },
    { id: 'recomendacoes', label: 'Recomendações Estruturais', icon: Lightbulb },
    { id: 'dados', label: 'Tabela de Dados & Auditoria', icon: Table, count: stats.filteredCount }
  ]

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      
      {/* Top Header */}
      <Header 
        metadata={dynamicData.metadata} 
        activeTab={activeTab}
        onExportCSV={handleExportCSV}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      {/* Global Filter Bar (apenas no modo painel regular; oculto no modo relatório e na impressão) */}
      {!isReportMode && (
        <>
          <FilterBar 
            filters={filters} 
            setFilters={setFilters} 
            stats={stats}
          />

          {/* Active Filter Notice Pill */}
          {isFiltered && (
            <div className="bg-blue-50 border-b border-blue-200 py-1.5 px-3 sm:px-4 text-xs text-blue-900 no-print">
              <div className="max-w-7xl mx-auto w-full flex flex-col sm:flex-row sm:items-center justify-between gap-1.5">
                <div className="flex items-center gap-2 font-medium">
                  <Filter className="w-3.5 h-3.5 text-fecomercio-blue shrink-0" />
                  <span className="text-[11px] sm:text-xs">
                    Filtro aplicado: 
                    {filters.publico !== 'todos' && <strong className="ml-1">Público: {filters.publico === 'expositores' ? 'Expositores' : 'Visitantes'};</strong>}
                    {filters.npsCat !== 'todos' && <strong className="ml-1">NPS: {filters.npsCat};</strong>}
                    {filters.origem !== 'todos' && <strong className="ml-1">Origem: {filters.origem};</strong>}
                    <span className="text-slate-600 ml-1">({stats.filteredCount} respondentes)</span>
                  </span>
                </div>
                <button 
                  onClick={handleResetFilters}
                  className="text-[11px] sm:text-xs text-blue-700 hover:text-red-700 font-bold underline flex items-center gap-1 self-end sm:self-auto cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Restaurar Visão Geral</span>
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Barra de Controle Exclusiva do Modo Relatório (apenas em tela) */}
      {isReportMode && (
        <div className="bg-slate-900 text-white px-3 sm:px-6 py-2.5 border-b border-slate-800 shadow-md no-print sticky top-0 z-40">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 sm:gap-3">
              <button
                onClick={() => setIsReportMode(false)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                title="Voltar à navegação regular por abas"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Voltar ao Painel</span>
              </button>
              <div className="h-4 w-px bg-white/20 hidden sm:block"></div>
              <span className="text-[11px] sm:text-xs text-slate-300 hidden sm:inline">
                Modo de Relatório Completo • <strong>{reportSections.filter(s => s.included).length} módulos ativos</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
              >
                Configurar Seções
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-fecomercio-gold hover:bg-amber-600 text-white text-xs font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir / Salvar PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs Bar (apenas quando não estiver no Modo Relatório) */}
      {!isReportMode && (
        <nav aria-label="Navegação do painel" className="bg-white border-b border-slate-200 shadow-sm no-print">
          <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8">
            <div className="flex space-x-1 sm:space-x-2 overflow-x-auto py-2 sm:py-2.5 scrollbar-none touch-pan-x">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 py-1.5 sm:py-2 text-[11px] sm:text-xs font-bold rounded-xl whitespace-nowrap transition-all cursor-pointer ${
                      isActive
                        ? 'bg-fecomercio-navy text-white shadow-sm ring-1 ring-fecomercio-navy'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isActive ? 'text-amber-400' : 'text-slate-500'}`} />
                    <span>{tab.label}</span>
                    {tab.count !== undefined && (
                      <span className={`text-[9px] sm:text-[10px] font-bold px-1.5 py-0.2 rounded-full transition-colors ${
                        isActive ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
                      }`}>
                        {tab.count}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6">
        {isReportMode ? (
          /* MODO RELATÓRIO COMPOSTO: Renderiza todos os módulos na tela com dimensões reais para os gráficos */
          <div className="w-full space-y-8 print:space-y-6">
            {reportSections.filter(s => s.included).map((section, idx) => (
              <section key={section.id} className={idx > 0 ? "page-break-before pt-4 sm:pt-6 border-t border-slate-200 print:border-none" : "pt-1"}>
                {/* Cabeçalho de Capítulo no Relatório */}
                <div className="mb-4 pb-2 border-b-2 border-[#002B55] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-md bg-[#002B55] text-white flex items-center justify-center text-xs font-bold font-mono">
                      {idx + 1}
                    </span>
                    <h2 className="text-sm font-bold text-[#002B55] uppercase tracking-wider">
                      {section.label}
                    </h2>
                  </div>
                  <span className="text-[11px] text-slate-500 font-medium">
                    Módulo {idx + 1} de {reportSections.filter(s => s.included).length}
                  </span>
                </div>

                {/* Conteúdo Renderizado do Módulo */}
                {section.id === 'executiva' && (
                  <ExecutiveView 
                    data={dynamicData} 
                    onSelectTab={setActiveTab}
                  />
                )}

                {section.id === 'recomendacoes' && (
                  <StrategicPlanView />
                )}

                {section.id === 'expositores' && (
                  <ExhibitorsView 
                    data={dynamicData} 
                  />
                )}

                {section.id === 'visitantes' && (
                  <VisitorsView 
                    data={dynamicData} 
                  />
                )}

                {section.id === 'voz_cliente' && (
                  <FeedbackExplorer 
                    feedbacks={dynamicData.feedbacks} 
                    tagsSummary={dynamicData.tags_qualitativas}
                  />
                )}
              </section>
            ))}
          </div>
        ) : (
          /* MODO REGULAR: Aba Ativa */
          <>
            {activeTab === 'executiva' && (
              <ExecutiveView 
                data={dynamicData} 
                onSelectTab={setActiveTab}
              />
            )}

            {activeTab === 'expositores' && (
              <ExhibitorsView 
                data={dynamicData} 
              />
            )}

            {activeTab === 'visitantes' && (
              <VisitorsView 
                data={dynamicData} 
              />
            )}

            {activeTab === 'voz_cliente' && (
              <FeedbackExplorer 
                feedbacks={dynamicData.feedbacks} 
                tagsSummary={dynamicData.tags_qualitativas}
              />
            )}

            {activeTab === 'recomendacoes' && (
              <StrategicPlanView />
            )}

            {activeTab === 'dados' && (
              <DataGridExport 
                expositores={dynamicData.filteredExpositores}
                visitantes={dynamicData.filteredVisitantes}
                onExportCSV={handleExportCSV}
              />
            )}
          </>
        )}
      </main>

      {/* Rodapé Executivo Exclusivo para Impressão A4 */}
      <div className="hidden print:block text-center mt-6 pt-3 border-t border-slate-300 text-[9px] text-slate-500 page-break-inside-avoid">
        <p className="font-bold text-slate-700">
          Relatório Executivo Oficial • 24ª Edição FESUPER 2026 • Arapiraca/AL
        </p>
        <p>
          Sistema Fecomércio Sesc Senac AL • Instituto Fecomércio AL • Associação dos Supermercados de Alagoas (ASA)
        </p>
      </div>

      {/* Institutional Footer (apenas tela) */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 mt-12 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
          
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 text-center sm:text-left">
            <div className="bg-white/10 px-3 py-2 rounded-xl flex items-center justify-center gap-3 shrink-0 border border-white/10 shadow-inner">
              <img 
                src="/assets/logo_fecomercio.png" 
                alt="Fecomércio AL" 
                className="h-6 sm:h-7 w-auto object-contain brightness-0 invert shrink-0"
              />
              <div className="h-5 w-px bg-white/20 shrink-0"></div>
              <img 
                src="/assets/logo_instituto_fecomercio.png" 
                alt="Instituto Fecomércio AL" 
                className="h-6 sm:h-7 w-auto object-contain brightness-0 invert shrink-0"
              />
            </div>
            <div className="space-y-0.5">
              <p className="font-bold text-white text-xs leading-snug">
                Sistema Fecomércio Sesc Senac & Instituto Fecomércio Alagoas
              </p>
              <p className="text-[11px] text-slate-400 leading-tight">
                Parceria Institucional com a Associação dos Supermercados de Alagoas (ASA)
              </p>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] space-y-1">
            <p className="text-slate-300 font-medium">
              FESUPER 2026 • 24ª Feira e Exposição Alagoana de Supermercados
            </p>
            <p className="text-slate-500">
              Centro de Convenções Fábio Henrique • Arapiraca - AL • 09 a 11 de Setembro de 2026
            </p>
            <p className="text-slate-600 text-[10px]">
              Pesquisa Primária de Satisfação com 185 participantes • Relatório Homologado
            </p>
          </div>

        </div>
      </footer>

      {/* Modal de Personalização e Geração de Relatório Oficial */}
      <ReportModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        sections={reportSections}
        onGenerateReport={handleGenerateReport}
      />

    </div>
  )
}
