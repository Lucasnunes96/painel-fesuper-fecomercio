import React from 'react'
import { Calendar, MapPin, Users, Printer, Download, LogOut, ShieldCheck, User } from 'lucide-react'

export default function Header({ metadata, activeTab, onExportCSV, currentUser, onLogout }) {
  const handlePrint = () => {
    window.print()
  }

  return (
    <header className="bg-gradient-to-r from-fecomercio-navy via-[#023e73] to-fesuper-darkGreen text-white shadow-md border-b border-blue-950/40 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3.5">
        
        {/* === LAYOUT MOBILE (< md) === */}
        <div className="flex flex-col gap-2.5 md:hidden">
          {/* Top Bar: Brand Logos + Quick Actions */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="bg-white p-1.5 rounded-xl shadow-sm flex items-center justify-center h-11 w-28">
                <img 
                  src="/assets/logo_fecomercio.png" 
                  alt="Fecomércio AL" 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="h-7 w-px bg-white/20"></div>
              <div className="bg-white/10 backdrop-blur-sm p-1 rounded-xl border border-white/15 flex items-center justify-center h-11 w-28 overflow-hidden">
                <img 
                  src="/assets/logo_fesuper.png" 
                  alt="FESUPER 2026" 
                  className="max-h-full max-w-full object-contain drop-shadow"
                />
              </div>
            </div>

            {/* Mobile Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <button 
                onClick={onExportCSV}
                className="p-2 bg-white/15 hover:bg-white/25 text-white rounded-lg border border-white/20 transition-all active:scale-95"
                title="Exportar CSV"
                aria-label="Exportar CSV"
              >
                <Download className="w-4 h-4 text-emerald-300" />
              </button>

              <button 
                onClick={handlePrint}
                className="p-2 bg-fecomercio-gold hover:bg-amber-600 text-white rounded-lg shadow-sm transition-all active:scale-95"
                title="Imprimir"
                aria-label="Imprimir"
              >
                <Printer className="w-4 h-4" />
              </button>

              {currentUser && (
                <div className="flex items-center gap-1 bg-slate-900/70 pl-2 pr-1 py-1 rounded-lg border border-white/20">
                  <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                    currentUser.role === 'admin' ? 'bg-amber-400 text-slate-900' : 'bg-emerald-400 text-slate-900'
                  }`}>
                    {currentUser.role === 'admin' ? 'A' : 'U'}
                  </div>
                  <button
                    onClick={onLogout}
                    className="p-1 text-slate-300 hover:text-red-300 rounded"
                    title="Sair"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Bottom Bar: Badges + Title */}
          <div>
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="bg-fesuper-emerald text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                24ª Edição • Arapiraca/AL
              </span>
              <span className="bg-fecomercio-gold text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Relatório Oficial
              </span>
            </div>
            <h1 className="text-sm font-bold tracking-tight text-white mt-1 leading-snug">
              Painel Integrado de Satisfação e Resultados
            </h1>
            <p className="text-[11px] text-slate-200">
              Sistema Fecomércio Sesc Senac AL & Associação dos Supermercados de Alagoas (ASA)
            </p>
          </div>
        </div>

        {/* === LAYOUT DESKTOP / TABLET (md+) === */}
        <div className="hidden md:flex items-center justify-between gap-4 lg:gap-6">
          
          {/* Lado Esquerdo: Logos + Identidade Institucional Completa */}
          <div className="flex items-center gap-4 lg:gap-5 min-w-0">
            {/* Logos */}
            <div className="flex items-center gap-3 shrink-0">
              <div className="bg-white p-2 rounded-xl shadow-sm flex items-center justify-center h-14 lg:h-16 w-36 lg:w-44">
                <img 
                  src="/assets/logo_fecomercio.png" 
                  alt="Fecomércio AL" 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="h-10 w-px bg-white/20"></div>
              <div className="bg-white/10 backdrop-blur-sm p-1.5 rounded-xl border border-white/15 flex items-center justify-center h-14 lg:h-16 w-36 lg:w-44 overflow-hidden">
                <img 
                  src="/assets/logo_fesuper.png" 
                  alt="FESUPER 2026" 
                  className="max-h-full max-w-full object-contain drop-shadow"
                />
              </div>
            </div>

            {/* Títulos e Badges */}
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="bg-fesuper-emerald text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  24ª Edição • Arapiraca/AL
                </span>
                <span className="bg-fecomercio-gold text-white text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Relatório Oficial
                </span>
              </div>
              <h1 className="text-lg lg:text-xl font-bold tracking-tight text-white mt-1 leading-snug">
                Painel Integrado de Satisfação e Resultados
              </h1>
              <p className="text-xs text-slate-200">
                Sistema Fecomércio Sesc Senac AL & Associação dos Supermercados de Alagoas (ASA)
              </p>
            </div>
          </div>

          {/* Lado Direito: Metadados + Ações Rápidas + Usuário */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="hidden xl:flex items-center gap-3 text-xs text-slate-200 bg-white/10 px-3 py-2 rounded-xl border border-white/10">
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
                className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-3 py-2 rounded-lg border border-white/20 transition-all active:scale-95 cursor-pointer"
                title="Exportar base completa para planilha Excel/CSV"
              >
                <Download className="w-3.5 h-3.5 text-emerald-300" />
                <span>Exportar CSV</span>
              </button>

              <button 
                onClick={handlePrint}
                className="flex items-center gap-1.5 bg-fecomercio-gold hover:bg-amber-600 text-white text-xs font-semibold px-3 py-2 rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
                title="Imprimir relatório executivo"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Imprimir</span>
              </button>

              {/* Perfil do Usuário e Logout */}
              {currentUser && (
                <div className="flex items-center gap-2 bg-slate-900/60 backdrop-blur-md pl-2.5 pr-1.5 py-1.5 rounded-lg border border-white/20 shadow-inner">
                  <div className="flex items-center gap-1.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      currentUser.role === 'admin' 
                        ? 'bg-amber-400 text-slate-900' 
                        : 'bg-emerald-400 text-slate-900'
                    }`}>
                      {currentUser.role === 'admin' ? 'A' : 'U'}
                    </div>
                    <div className="text-left leading-none pr-1">
                      <span className="block text-[11px] font-bold text-white tracking-wide">
                        {currentUser.username}
                      </span>
                      <span className="block text-[9px] text-slate-300">
                        {currentUser.role === 'admin' ? 'Admin' : 'Usuário'}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={onLogout}
                    className="p-1 text-slate-300 hover:text-red-300 hover:bg-red-500/20 rounded transition-all active:scale-90 cursor-pointer"
                    title="Encerrar sessão (Logout)"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  )
}
