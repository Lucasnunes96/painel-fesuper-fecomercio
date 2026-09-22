import React from 'react'
import { Filter, RotateCcw, Building, ThumbsUp, MapPin } from 'lucide-react'

export default function FilterBar({ filters, setFilters, stats }) {
  const isFiltered = filters.publico !== 'todos' || filters.npsCat !== 'todos' || filters.origem !== 'todos'

  const handleReset = () => {
    setFilters({
      publico: 'todos',
      npsCat: 'todos',
      origem: 'todos'
    })
  }

  return (
    <div className="bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5 sm:gap-3">
          
          {/* Label e contador dinâmico */}
          <div className="flex items-center justify-between sm:justify-start gap-2 text-slate-700 font-semibold text-[11px] sm:text-xs uppercase tracking-wider">
            <div className="flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-fecomercio-blue shrink-0" />
              <span>Filtros Globais:</span>
            </div>
            <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full border transition-colors ${
              isFiltered 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              Exibindo {stats.filteredCount} de {stats.totalCount} respondentes
            </span>
          </div>

          {/* Seletores Interativos */}
          <div className="flex flex-col sm:flex-row sm:flex-wrap items-stretch sm:items-center gap-2 sm:gap-3 text-xs">
            
            {/* Público */}
            <div className="flex items-center justify-between sm:justify-start gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-fecomercio-blue/20">
              <div className="flex items-center gap-1.5 shrink-0">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <label htmlFor="filter-publico" className="text-slate-500 font-medium">Público:</label>
              </div>
              <select
                id="filter-publico"
                value={filters.publico}
                onChange={(e) => setFilters(prev => ({ ...prev, publico: e.target.value }))}
                className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer text-right sm:text-left text-xs"
              >
                <option value="todos">Todos os Públicos (185)</option>
                <option value="expositores">Apenas Expositores (62)</option>
                <option value="visitantes">Apenas Visitantes (123)</option>
              </select>
            </div>

            {/* Classificação NPS */}
            <div className="flex items-center justify-between sm:justify-start gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-fesuper-emerald/20">
              <div className="flex items-center gap-1.5 shrink-0">
                <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
                <label htmlFor="filter-nps" className="text-slate-500 font-medium">Nota NPS:</label>
              </div>
              <select
                id="filter-nps"
                value={filters.npsCat}
                onChange={(e) => setFilters(prev => ({ ...prev, npsCat: e.target.value }))}
                className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer text-right sm:text-left text-xs"
              >
                <option value="todos">Todas as Notas</option>
                <option value="Promotor">Promotores (Notas 9-10)</option>
                <option value="Neutro">Neutros (Notas 7-8)</option>
                <option value="Detrator">Detratores (Notas 0-6)</option>
              </select>
            </div>

            {/* Origem Territorial */}
            <div className="flex items-center justify-between sm:justify-start gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-fecomercio-gold/20">
              <div className="flex items-center gap-1.5 shrink-0">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <label htmlFor="filter-origem" className="text-slate-500 font-medium">Origem:</label>
              </div>
              <select
                id="filter-origem"
                value={filters.origem}
                onChange={(e) => setFilters(prev => ({ ...prev, origem: e.target.value }))}
                className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer text-right sm:text-left text-xs"
              >
                <option value="todos">Todas as Regiões</option>
                <option value="Arapiraca">Arapiraca (Sede da Feira)</option>
                <option value="Maceió">Maceió (Capital)</option>
                <option value="Demais Municípios de AL">Demais Municípios de AL</option>
                <option value="Outro Estado (PE/SE/etc)">Outros Estados (PE, SE, etc.)</option>
              </select>
            </div>

            {/* Reset Button */}
            {isFiltered && (
              <button
                onClick={handleReset}
                className="flex items-center justify-center gap-1 text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg font-semibold transition-all text-xs"
                title="Limpar todos os filtros e ver base completa"
              >
                <RotateCcw className="w-3.5 h-3.5 text-red-600" />
                <span>Limpar Filtros</span>
              </button>
            )}

          </div>

        </div>
      </div>
    </div>
  )
}
