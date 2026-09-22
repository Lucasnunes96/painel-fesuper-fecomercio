import React, { useState, useMemo } from 'react'
import { Search, Download, Table, ChevronLeft, ChevronRight, Building2, Users } from 'lucide-react'

export default function DataGridExport({ expositores, visitantes, onExportCSV }) {
  const [activeDataset, setActiveDataset] = useState('expositores') // 'expositores' | 'visitantes'
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 12

  // Filtragem
  const filteredData = useMemo(() => {
    const list = activeDataset === 'expositores' ? expositores : visitantes
    if (!searchTerm.trim()) return list
    const term = searchTerm.toLowerCase()
    return list.filter(item => {
      return Object.values(item).some(val => 
        val !== null && val !== undefined && String(val).toLowerCase().includes(term)
      )
    })
  }, [activeDataset, expositores, visitantes, searchTerm])

  // Paginação
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredData.slice(start, start + pageSize)
  }, [filteredData, currentPage, pageSize])

  const handleDatasetChange = (ds) => {
    setActiveDataset(ds)
    setCurrentPage(1)
    setSearchTerm('')
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4 sm:space-y-5">
      
      {/* Table Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-fecomercio-blue shrink-0" />
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
              Explorador de Dados Brutos & Auditoria
            </h3>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-700 mt-0.5">
            Visualize todos os registros individuais com notas e comentários
          </p>
        </div>

        {/* Dataset Switcher & Export */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
            <button
              onClick={() => handleDatasetChange('expositores')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeDataset === 'expositores' 
                  ? 'bg-white text-fecomercio-blue shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>Expositores ({expositores.length})</span>
            </button>
            <button
              onClick={() => handleDatasetChange('visitantes')}
              className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeDataset === 'visitantes' 
                  ? 'bg-white text-fesuper-emerald shadow-sm' 
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Visitantes ({visitantes.length})</span>
            </button>
          </div>

          <button
            onClick={onExportCSV}
            className="flex items-center gap-1.5 bg-fesuper-emerald hover:bg-emerald-700 text-white text-xs font-semibold px-3 py-2 rounded-xl transition-all shadow-sm active:scale-95"
            title="Exportar planilha completa em CSV (UTF-8)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Baixar CSV</span>
          </button>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder={`Pesquisar entre ${filteredData.length} registros...`}
          value={searchTerm}
          onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          className="w-full pl-9 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-fecomercio-blue/20 outline-none transition-all"
        />
      </div>

      {/* Mobile Swipe Hint */}
      <div className="flex sm:hidden items-center justify-between text-[11px] text-slate-500 px-1">
        <span>← Deslize lateralmente para navegar pelas colunas →</span>
      </div>

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 -mx-1 sm:mx-0">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
              <th className="py-3 px-3">ID</th>
              {activeDataset === 'expositores' ? (
                <>
                  <th className="py-3 px-3">Empresa</th>
                  <th className="py-3 px-3">Segmento</th>
                  <th className="py-3 px-3">Origem</th>
                  <th className="py-3 px-3 text-center">Exp. Geral</th>
                  <th className="py-3 px-3 text-center">Retorno (NPS)</th>
                  <th className="py-3 px-3">Categoria NPS</th>
                  <th className="py-3 px-3">Comentário / Sugestão</th>
                </>
              ) : (
                <>
                  <th className="py-3 px-3">Perfil Participante</th>
                  <th className="py-3 px-3">Município</th>
                  <th className="py-3 px-3">1ª Vez?</th>
                  <th className="py-3 px-3 text-center">Exp. Geral</th>
                  <th className="py-3 px-3 text-center">Retorno (NPS)</th>
                  <th className="py-3 px-3">Categoria NPS</th>
                  <th className="py-3 px-3">Comentário / Sugestão</th>
                </>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {paginatedData.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-8 text-center text-slate-500">
                  Nenhum registro encontrado para o termo pesquisado.
                </td>
              </tr>
            ) : (
              paginatedData.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-slate-500">{row.id}</td>
                  
                  {activeDataset === 'expositores' ? (
                    <>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-[150px] truncate" title={row.empresa}>
                        {row.empresa}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600 max-w-[140px] truncate" title={row.segmento}>
                        {row.segmento}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{row.origem_macro}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                        {row.experiencia_geral !== null ? row.experiencia_geral : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                        {row.intencao_retorno_score !== null ? row.intencao_retorno_score : '-'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          row.nps_categoria === 'Promotor' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          row.nps_categoria === 'Neutro' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {row.nps_categoria}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 max-w-[240px] truncate text-slate-500 italic" title={row.abaixo_expectativas || row.sugestao_melhoria}>
                        {row.abaixo_expectativas || row.sugestao_melhoria || '-'}
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-[160px] truncate" title={row.perfil_participante}>
                        {row.perfil_participante}
                      </td>
                      <td className="py-2.5 px-3 text-slate-600">{row.municipio_macro}</td>
                      <td className="py-2.5 px-3 text-slate-600">{row.primeira_vez}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                        {row.experiencia_geral !== null ? row.experiencia_geral : '-'}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold text-slate-900">
                        {row.intencao_retorno_score !== null ? row.intencao_retorno_score : '-'}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                          row.nps_categoria === 'Promotor' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                          row.nps_categoria === 'Neutro' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-red-50 text-red-700 border-red-200'
                        }`}>
                          {row.nps_categoria}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 max-w-[240px] truncate text-slate-500 italic" title={row.abaixo_expectativas || row.sugestao_melhoria}>
                        {row.abaixo_expectativas || row.sugestao_melhoria || '-'}
                      </td>
                    </>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-700 pt-2">
        <p>
          Página <strong>{currentPage}</strong> de <strong>{totalPages}</strong> ({filteredData.length} registros)
        </p>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 rounded-lg transition-all"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Anterior</span>
          </button>
          
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 rounded-lg transition-all"
          >
            <span>Próxima</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

    </div>
  )
}

