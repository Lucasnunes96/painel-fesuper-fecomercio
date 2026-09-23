import React, { useState } from 'react'
import { 
  X, Check, ArrowUp, ArrowDown, Printer, FileText, 
  Sparkles, CheckSquare, Square, RotateCcw, AlertCircle,
  LayoutDashboard, Building2, Users, MessageSquareText, Lightbulb
} from 'lucide-react'

const ICON_MAP = {
  executiva: LayoutDashboard,
  recomendacoes: Lightbulb,
  expositores: Building2,
  visitantes: Users,
  voz_cliente: MessageSquareText
}

export default function ReportModal({ isOpen, onClose, sections, onGenerateReport }) {
  const [localSections, setLocalSections] = useState(() => sections)

  // Sincroniza estado inicial sempre que o modal abre
  React.useEffect(() => {
    if (isOpen) {
      setLocalSections(sections)
    }
  }, [isOpen, sections])

  if (!isOpen) return null

  // Alternar inclusão da seção
  const toggleSection = (id) => {
    setLocalSections(prev => 
      prev.map(sec => sec.id === id ? { ...sec, included: !sec.included } : sec)
    )
  }

  // Mover seção para cima na ordem
  const moveUp = (index) => {
    if (index === 0) return
    setLocalSections(prev => {
      const copy = [...prev]
      const temp = copy[index]
      copy[index] = copy[index - 1]
      copy[index - 1] = temp
      return copy
    })
  }

  // Mover seção para baixo na ordem
  const moveDown = (index) => {
    if (index === localSections.length - 1) return
    setLocalSections(prev => {
      const copy = [...prev]
      const temp = copy[index]
      copy[index] = copy[index + 1]
      copy[index + 1] = temp
      return copy
    })
  }

  // Aplicar Presets Executivos (apenas os 5 módulos analíticos de alto valor)
  const applyPreset = (presetKey) => {
    if (presetKey === 'todos') {
      setLocalSections(prev => prev.map(s => ({ ...s, included: true })))
    } else if (presetKey === 'diretoria') {
      // Prioridade: Executiva -> Recomendações
      setLocalSections([
        { ...localSections.find(s => s.id === 'executiva'), included: true },
        { ...localSections.find(s => s.id === 'recomendacoes'), included: true },
        { ...localSections.find(s => s.id === 'expositores'), included: false },
        { ...localSections.find(s => s.id === 'visitantes'), included: false },
        { ...localSections.find(s => s.id === 'voz_cliente'), included: false }
      ].filter(Boolean))
    } else if (presetKey === 'comercial') {
      // Prioridade: Executiva -> Expositores -> Recomendações
      setLocalSections([
        { ...localSections.find(s => s.id === 'executiva'), included: true },
        { ...localSections.find(s => s.id === 'expositores'), included: true },
        { ...localSections.find(s => s.id === 'recomendacoes'), included: true },
        { ...localSections.find(s => s.id === 'visitantes'), included: false },
        { ...localSections.find(s => s.id === 'voz_cliente'), included: false }
      ].filter(Boolean))
    } else if (presetKey === 'varejo') {
      // Prioridade: Executiva -> Visitantes -> Depoimentos
      setLocalSections([
        { ...localSections.find(s => s.id === 'executiva'), included: true },
        { ...localSections.find(s => s.id === 'visitantes'), included: true },
        { ...localSections.find(s => s.id === 'voz_cliente'), included: true },
        { ...localSections.find(s => s.id === 'recomendacoes'), included: false },
        { ...localSections.find(s => s.id === 'expositores'), included: false }
      ].filter(Boolean))
    }
  }

  const selectedCount = localSections.filter(s => s.included).length

  const handleConfirm = () => {
    if (selectedCount === 0) return
    onGenerateReport(localSections)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/70 backdrop-blur-sm animate-fadeIn">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        
        {/* Cabeçalho do Modal */}
        <div className="bg-gradient-to-r from-fecomercio-navy to-[#023e73] text-white p-5 sm:p-6 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-1.5 bg-fecomercio-gold/20 text-amber-300 border border-fecomercio-gold/30 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              <Printer className="w-3 h-3" />
              <span>Personalização de Relatório A4</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold tracking-tight">
              Configurar Relatório & Impressão
            </h2>
            <p className="text-slate-200 text-xs sm:text-[13px] leading-relaxed">
              Selecione quais seções incluir e ajuste a ordem de apresentação para exportação em PDF ou impressão.
            </p>
          </div>

          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Barra de Presets Rápidos */}
        <div className="bg-slate-50 border-b border-slate-200 p-3 sm:px-6">
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-fecomercio-gold" />
              Modelos Prontos:
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              {selectedCount} de {localSections.length} seções ativas
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            <button
              onClick={() => applyPreset('diretoria')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
            >
              Diretoria Executiva
            </button>
            <button
              onClick={() => applyPreset('comercial')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
            >
              Comercial B2B
            </button>
            <button
              onClick={() => applyPreset('varejo')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:border-slate-300 transition-all cursor-pointer"
            >
              Voz do Cliente & Varejo
            </button>
            <button
              onClick={() => applyPreset('todos')}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-blue-200 bg-blue-50 text-blue-800 hover:bg-blue-100 transition-all cursor-pointer"
            >
              Relatório Completo
            </button>
          </div>
        </div>

        {/* Lista Reordenável de Módulos */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-2.5">
          <p className="text-[11px] text-slate-500 font-medium pb-1">
            Marque os itens desejados e use as setas para definir a sequência de capítulos:
          </p>

          {localSections.map((sec, idx) => {
            const Icon = ICON_MAP[sec.id] || FileText
            const isFirst = idx === 0
            const isLast = idx === localSections.length - 1

            return (
              <div 
                key={sec.id}
                className={`flex items-center justify-between gap-3 p-3 sm:p-3.5 rounded-xl border transition-all ${
                  sec.included 
                    ? 'bg-white border-slate-300 shadow-sm' 
                    : 'bg-slate-50/80 border-slate-200 opacity-60'
                }`}
              >
                {/* Lado Esquerdo: Checkbox + Ordem + Ícone + Textos */}
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  {/* Checkbox de Inclusão */}
                  <button
                    type="button"
                    onClick={() => toggleSection(sec.id)}
                    className="cursor-pointer shrink-0 text-slate-700 hover:text-fecomercio-blue focus:outline-none"
                    title={sec.included ? "Desmarcar seção" : "Incluir seção"}
                  >
                    {sec.included ? (
                      <div className="w-5 h-5 rounded-md bg-fecomercio-navy text-white flex items-center justify-center shadow-sm">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    ) : (
                      <div className="w-5 h-5 rounded-md border-2 border-slate-300 hover:border-slate-400 bg-white" />
                    )}
                  </button>

                  {/* Número da Ordem */}
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold font-mono shrink-0 ${
                    sec.included ? 'bg-slate-100 text-slate-800 border border-slate-200' : 'bg-slate-200 text-slate-400'
                  }`}>
                    {idx + 1}º
                  </span>

                  {/* Ícone */}
                  <div className={`p-2 rounded-lg shrink-0 ${
                    sec.included ? 'bg-blue-50 text-fecomercio-blue' : 'bg-slate-200 text-slate-400'
                  }`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Informações da Seção */}
                  <div className="min-w-0 flex-1">
                    <p className={`text-xs sm:text-sm font-bold truncate ${
                      sec.included ? 'text-slate-900' : 'text-slate-500'
                    }`}>
                      {sec.label}
                    </p>
                    <p className="text-[11px] text-slate-500 truncate">
                      {sec.description}
                    </p>
                  </div>
                </div>

                {/* Lado Direito: Botões de Ordenação */}
                <div className="flex items-center gap-1 shrink-0 bg-slate-50 p-1 rounded-lg border border-slate-200">
                  <button
                    type="button"
                    onClick={() => moveUp(idx)}
                    disabled={isFirst}
                    className={`p-1.5 rounded hover:bg-white transition-all ${
                      isFirst ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:text-blue-700 cursor-pointer shadow-xs'
                    }`}
                    title="Mover para cima"
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => moveDown(idx)}
                    disabled={isLast}
                    className={`p-1.5 rounded hover:bg-white transition-all ${
                      isLast ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:text-blue-700 cursor-pointer shadow-xs'
                    }`}
                    title="Mover para baixo"
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>

        {/* Rodapé com Ações */}
        <div className="bg-slate-50 border-t border-slate-200 p-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5 self-start sm:self-auto">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Folha A4 Retrato • Quebras de página automáticas</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200 rounded-xl transition-all cursor-pointer"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={selectedCount === 0}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition-all ${
                selectedCount === 0 
                  ? 'bg-slate-300 cursor-not-allowed' 
                  : 'bg-fecomercio-gold hover:bg-amber-600 active:scale-95 cursor-pointer'
              }`}
            >
              <Printer className="w-4 h-4" />
              <span>Gerar Relatório & Imprimir</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}
