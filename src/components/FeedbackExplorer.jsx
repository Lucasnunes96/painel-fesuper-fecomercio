import React, { useState, useMemo } from 'react'
import { 
  Search, MessageSquare, AlertTriangle, Lightbulb, Zap, Snowflake, 
  Maximize2, Clock, Megaphone, ThumbsUp, Filter, MessageSquareQuote 
} from 'lucide-react'

export default function FeedbackExplorer({ feedbacks, tagsSummary }) {
  const [selectedTag, setSelectedTag] = useState('todas')
  const [selectedTipo, setSelectedTipo] = useState('todos')
  const [selectedCategoria, setSelectedCategoria] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')

  const tagIcons = {
    'Energia Elétrica': Zap,
    'Climatização': Snowflake,
    'Espaço e Layout': Maximize2,
    'Montagem e Prazos': Clock,
    'Divulgação e Compradores': Megaphone,
    'Elogio e Reconhecimento': ThumbsUp,
  }

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter(fb => {
      if (selectedTag !== 'todas' && !fb.tags.includes(selectedTag)) {
        return false
      }
      if (selectedTipo !== 'todos' && fb.tipo !== selectedTipo) {
        return false
      }
      if (selectedCategoria === 'Abaixo' && !fb.tipo_comentario.includes('Abaixo')) {
        return false
      }
      if (selectedCategoria === 'Sugestao' && !fb.tipo_comentario.includes('Sugestão')) {
        return false
      }
      if (searchTerm.trim()) {
        const term = searchTerm.toLowerCase()
        const matchText = fb.texto.toLowerCase().includes(term)
        const matchAuthor = fb.empresa_ou_perfil.toLowerCase().includes(term)
        const matchTag = fb.tags.some(t => t.toLowerCase().includes(term))
        if (!matchText && !matchAuthor && !matchTag) return false
      }
      return true
    })
  }, [feedbacks, selectedTag, selectedTipo, selectedCategoria, searchTerm])

  const getTagBadgeStyle = (tag) => {
    switch (tag) {
      case 'Energia Elétrica': return 'bg-red-50 text-red-800 border-red-200'
      case 'Climatização': return 'bg-blue-50 text-blue-800 border-blue-200'
      case 'Espaço e Layout': return 'bg-purple-50 text-purple-800 border-purple-200'
      case 'Montagem e Prazos': return 'bg-amber-50 text-amber-800 border-amber-200'
      case 'Divulgação e Compradores': return 'bg-orange-50 text-orange-800 border-orange-200'
      case 'Elogio e Reconhecimento': return 'bg-emerald-50 text-emerald-800 border-emerald-200'
      default: return 'bg-slate-100 text-slate-700 border-slate-200'
    }
  }

  return (
    <div className="space-y-6">
      
      {/* Intro Header */}
      <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-fecomercio-blue uppercase tracking-wider mb-1">
              <MessageSquareQuote className="w-3.5 h-3.5" />
              <span>Análise Qualitativa Primária</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900">
              Banco de Depoimentos, Críticas e Sugestões dos Participantes
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-700">
              {feedbacks.length} registros literais catalogados por dimensão operacional para embasamento de decisões
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por termo (ex: freezer, ar, Maceió, atraso)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-fecomercio-blue/20 outline-none transition-all"
            />
            {searchTerm && (
              <button 
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-600 hover:text-slate-800"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Tag Cloud Filter Chips */}
        <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <button
            onClick={() => setSelectedTag('todas')}
            className={`text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-xl font-semibold border transition-all ${
              selectedTag === 'todas'
                ? 'bg-fecomercio-navy text-white border-fecomercio-navy shadow-sm'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
            }`}
          >
            Todas as Dimensões ({feedbacks.length})
          </button>

          {tagsSummary.map((item, idx) => {
            const Icon = tagIcons[item.tag] || MessageSquare
            const isActive = selectedTag === item.tag
            return (
              <button
                key={idx}
                onClick={() => setSelectedTag(isActive ? 'todas' : item.tag)}
                className={`flex items-center gap-1.5 text-[11px] sm:text-xs px-2.5 sm:px-3 py-1.5 rounded-xl font-semibold border transition-all ${
                  isActive
                    ? 'bg-fesuper-emerald text-white border-fesuper-emerald shadow-sm'
                    : 'bg-white hover:bg-slate-50 text-slate-700 border-slate-200'
                }`}
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.tag}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                  {item.count}
                </span>
              </button>
            )
          })}
        </div>

        {/* Sub-Filters: Tipo de Público & Categoria de Comentário */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pt-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
              <button
                onClick={() => setSelectedTipo('todos')}
                className={`px-2 py-1 rounded-md font-medium text-[11px] sm:text-xs transition-all ${selectedTipo === 'todos' ? 'bg-white font-bold text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Todos os Públicos
              </button>
              <button
                onClick={() => setSelectedTipo('Expositor')}
                className={`px-2 py-1 rounded-md font-medium text-[11px] sm:text-xs transition-all ${selectedTipo === 'Expositor' ? 'bg-white font-bold text-fecomercio-blue shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Expositores
              </button>
              <button
                onClick={() => setSelectedTipo('Visitante')}
                className={`px-2 py-1 rounded-md font-medium text-[11px] sm:text-xs transition-all ${selectedTipo === 'Visitante' ? 'bg-white font-bold text-fesuper-emerald shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Visitantes
              </button>
            </div>

            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
              <button
                onClick={() => setSelectedCategoria('todos')}
                className={`px-2 py-1 rounded-md font-medium text-[11px] sm:text-xs transition-all ${selectedCategoria === 'todos' ? 'bg-white font-bold text-slate-800 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                Todos
              </button>
              <button
                onClick={() => setSelectedCategoria('Abaixo')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium text-[11px] sm:text-xs transition-all ${selectedCategoria === 'Abaixo' ? 'bg-white font-bold text-red-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <AlertTriangle className="w-3 h-3 text-red-500" />
                <span>Abaixo</span>
              </button>
              <button
                onClick={() => setSelectedCategoria('Sugestao')}
                className={`flex items-center gap-1 px-2 py-1 rounded-md font-medium text-[11px] sm:text-xs transition-all ${selectedCategoria === 'Sugestao' ? 'bg-white font-bold text-amber-600 shadow-sm' : 'text-slate-600 hover:text-slate-900'}`}
              >
                <Lightbulb className="w-3 h-3 text-amber-500" />
                <span>Sugestão</span>
              </button>
            </div>
          </div>

          <span className="text-slate-600 font-semibold text-xs sm:ml-auto">
            Exibindo <strong>{filteredFeedbacks.length}</strong> relatos
          </span>
        </div>

      </div>

      {/* Feedbacks Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {filteredFeedbacks.length === 0 ? (
          <div className="col-span-2 bg-white p-8 sm:p-12 text-center rounded-2xl border border-slate-200 space-y-2">
            <p className="text-slate-500 text-xs sm:text-sm font-semibold">Nenhum comentário encontrado com os filtros selecionados.</p>
            <button 
              onClick={() => { setSelectedTag('todas'); setSelectedTipo('todos'); setSelectedCategoria('todos'); setSearchTerm(''); }}
              className="text-xs text-fecomercio-blue font-bold hover:underline"
            >
              Redefinir filtros
            </button>
          </div>
        ) : (
          filteredFeedbacks.map((fb, idx) => {
            const isNegative = fb.tipo_comentario.includes('Abaixo')
            return (
              <div 
                key={idx} 
                className="bg-white rounded-xl sm:rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2.5">
                  <div className="flex flex-wrap items-center justify-between gap-1.5 text-xs">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className={`font-bold px-1.5 sm:px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] shrink-0 ${
                        fb.tipo === 'Expositor' 
                          ? 'bg-blue-50 text-fecomercio-blue border border-blue-200' 
                          : 'bg-emerald-50 text-fesuper-emerald border border-emerald-200'
                      }`}>
                        {fb.tipo}
                      </span>
                      <span className="font-semibold text-slate-700 truncate max-w-[140px] sm:max-w-xs md:max-w-md" title={fb.empresa_ou_perfil}>
                        {fb.empresa_ou_perfil}
                      </span>
                    </div>

                    <span className={`text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border flex items-center gap-1 shrink-0 ${
                      isNegative 
                        ? 'bg-red-50 text-red-700 border-red-200' 
                        : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>
                      {isNegative ? <AlertTriangle className="w-2.5 h-2.5" /> : <Lightbulb className="w-2.5 h-2.5" />}
                      <span>{isNegative ? 'Abaixo da Exp.' : 'Sugestão'}</span>
                    </span>
                  </div>

                  <blockquote className="text-slate-800 text-xs sm:text-sm font-medium leading-relaxed bg-slate-50 p-3 sm:p-3.5 rounded-xl border border-slate-200 italic">
                    "{fb.texto}"
                  </blockquote>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 text-xs">
                  <div className="flex flex-wrap items-center gap-1 sm:gap-1.5">
                    {fb.tags.map((tag, tIdx) => (
                      <span 
                        key={tIdx} 
                        className={`text-[9.5px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border ${getTagBadgeStyle(tag)}`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {fb.nota_retorno !== null && (
                    <span className={`text-[9.5px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md shrink-0 ${
                      fb.nota_retorno >= 9 ? 'bg-emerald-100 text-emerald-800' :
                      fb.nota_retorno >= 7 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                    }`} title="Nota de probabilidade de retorno">
                      Retorno: {fb.nota_retorno}
                    </span>
                  )}
                </div>

              </div>
            )
          })
        )}
      </div>

    </div>
  )
}
