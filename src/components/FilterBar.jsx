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
    <div className="bg-white border-b border-slate-200 shadow-sm sticky top-[72px] sm:top-[80px] z-30 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Label e contador dinâmico */}
          <div className="flex items-center gap-2 text-slate-700 font-semibold text-xs uppercase tracking-wider">
            <Filter className="w-4 h-4 text-fecomercio-blue" />
            <span>Filtros Globais:</span>
            <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border transition-colors ${
              isFiltered 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-slate-100 text-slate-600 border-slate-200'
            }`}>
              Exibindo {stats.filteredCount} de {stats.totalCount} respondentes
            </span>
          </div>

          {/* Seletores Interativos */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
            
            {/* Público */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-fecomercio-blue/20">
              <Building className="w-3.5 h-3.5 text-slate-500" />
              <label htmlFor="filter-publico" className="text-slate-500 font-medium">Público:</label>
              <select
                id="filter-publico"
                value={filters.publico}
                onChange={(e) => setFilters(prev => ({ ...prev, publico: e.target.value }))}
                className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
              >
                <option value="todos">Todos os Públicos (185)</option>
                <option value="expositores">Apenas Expositores (62)</option>
                <option value="visitantes">Apenas Visitantes (123)</option>
              </select>
            </div>

            {/* Classificação NPS */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-fesuper-emerald/20">
              <ThumbsUp className="w-3.5 h-3.5 text-slate-500" />
              <label htmlFor="filter-nps" className="text-slate-500 font-medium">Nota NPS:</label>
              <select
                id="filter-nps"
                value={filters.npsCat}
                onChange={(e) => setFilters(prev => ({ ...prev, npsCat: e.target.value }))}
                className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
              >
                <option value="todos">Todas as Notas</option>
                <option value="Promotor">Promotores (Notas 9-10)</option>
                <option value="Neutro">Neutros (Notas 7-8)</option>
                <option value="Detrator">Detratores (Notas 0-6)</option>
              </select>
            </div>

            {/* Origem Territorial */}
            <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 focus-within:ring-2 focus-within:ring-fecomercio-gold/20">
              <MapPin className="w-3.5 h-3.5 text-slate-500" />
              <label htmlFor="filter-origem" className="text-slate-500 font-medium">Município/Origem:</label>
              <select
                id="filter-origem"
                value={filters.origem}
                onChange={(e) => setFilters(prev => ({ ...prev, origem: e.target.value }))}
                className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
              >
                <option value="todos">Todas as Regiões</option>
                <option value="Arapiraca">Arapiraca (Sede da Feira)</option>
                <option value="Maceió">Maceió (Capital)</option>
                <option value="Demais Municípios de AL">Demais Municípios de AL</option>
                <option value="Outro Estado (PE/SE/etc)">Outros Estados</option>
              </select>
            </div>

            {/* Reset Button */}
            {isFiltered && (
              <button
                onClick={handleReset}
                className="flex items-center gap-1 text-slate-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded-lg font-semibold transition-all"
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
