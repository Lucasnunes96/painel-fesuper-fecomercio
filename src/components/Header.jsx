import React from 'react'
import { Calendar, MapPin, Users, Printer, Download, Building2, TrendingUp } from 'lucide-react'

export default function Header({ metadata, activeTab, onExportCSV }) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <header className="bg-gradient-to-r from-fecomercio-navy via-[#023e73] to-fesuper-darkGreen text-white shadow-md border-b border-blue-950/40 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Brand Marks */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="bg-white p-2 rounded-xl shadow-sm flex items-center justify-center h-14 sm:h-16 w-36 sm:w-44">
              <img 
                src="/assets/logo_fecomercio.png" 
                alt="Fecomércio AL" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            
            <div className="h-10 w-px bg-white/20 hidden sm:block"></div>

            <div className="bg-white/10 backdrop-blur-sm p-1.5 rounded-xl border border-white/15 flex items-center justify-center h-14 sm:h-16 w-40 sm:w-48 overflow-hidden">
              <img 
                src="/assets/logo_fesuper.png" 
                alt="FESUPER 2026" 
                className="max-h-full max-w-full object-contain drop-shadow"
              />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="bg-fesuper-emerald text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  24ª Edição • Arapiraca/AL
                </span>
                <span className="bg-fecomercio-gold text-white text-[11px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider hidden sm:inline-block">
                  Relatório Analítico
                </span>
              </div>
              <h1 className="text-lg sm:text-xl font-bold tracking-tight text-white mt-0.5">
                Painel Integrado de Satisfação e Resultados
              </h1>
              <p className="text-xs text-slate-200">
                Sistema Fecomércio Sesc Senac AL & Associação dos Supermercados de Alagoas (ASA)
              </p>
            </div>
          </div>

          {/* Quick Actions & Meta */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <div className="hidden lg:flex items-center gap-4 text-xs text-slate-200 bg-white/10 px-3.5 py-2 rounded-xl border border-white/10">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-fesuper-emerald" />
                <span>Arapiraca - AL</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-fecomercio-gold" />
                <span>09 a 11 Set 2026</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold text-white">185 Entrevistas</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={onExportCSV}
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-white/20 transition-all active:scale-95"
                title="Exportar base completa para planilha Excel/CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-300" />
                <span>Exportar CSV</span>
              </button>

              <button 
                onClick={handlePrint}
                className="flex items-center gap-1.5 bg-fecomercio-gold hover:bg-amber-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition-all active:scale-95"
                title="Imprimir relatório executivo"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir</span>
              </button>
            </div>

          </div>

        </div>
      </div>
    </header>
  )
}
