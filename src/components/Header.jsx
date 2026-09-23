import React from 'react'
import { Calendar, MapPin, Users, Printer, Download, LogOut, ShieldCheck, User } from 'lucide-react'

export default function Header({ metadata, activeTab, onExportCSV, currentUser, onLogout, onOpenReportModal }) {
  const handlePrint = () => {
    if (onOpenReportModal) {
      onOpenReportModal()
    } else {
      window.print()
    }
  }

  return (
    <header className="bg-gradient-to-r from-fecomercio-navy via-[#023e73] to-fesuper-darkGreen text-white shadow-md border-b border-blue-950/40 sticky top-0 z-40 print:static print:bg-none print:bg-white print:text-slate-900 print:shadow-none print:border-b-2 print:border-[#002B55] print:mb-4">
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-2.5 sm:py-3 print:px-0 print:py-2">
        
        {/* === LAYOUT MOBILE (< lg) === */}
        <div className="flex flex-col gap-2.5 lg:hidden">
          {/* Top Bar: Brand Logos + Quick Actions */}
          <div className="flex items-center justify-between gap-2">
            {/* Logos Sequência: Fecomércio -> Instituto Fecomércio -> FESUPER */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="bg-white p-1 rounded-lg shadow-sm flex items-center justify-center h-9 sm:h-10 w-20 sm:w-24 print:border print:border-slate-300">
                <img 
                  src="/assets/logo_fecomercio.png" 
                  alt="Fecomércio AL" 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="h-5 w-px bg-white/20 print:bg-slate-300"></div>
              <div className="bg-white p-1 rounded-lg shadow-sm flex items-center justify-center h-9 sm:h-10 w-20 sm:w-24 print:border print:border-slate-300">
                <img 
                  src="/assets/logo_instituto_fecomercio.png" 
                  alt="Instituto Fecomércio AL" 
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="h-5 w-px bg-white/20 print:bg-slate-300"></div>
              <div className="bg-white/10 print:bg-slate-900 backdrop-blur-sm p-0.5 rounded-lg border border-white/15 print:border-slate-700 flex items-center justify-center h-9 sm:h-10 w-20 sm:w-24 overflow-hidden">
                <img 
                  src="/assets/logo_fesuper.png" 
                  alt="FESUPER 2026" 
                  className="max-h-full max-w-full object-contain drop-shadow"
                />
              </div>
            </div>

            {/* Mobile Actions (ocultos na impressão) */}
            <div className="flex items-center gap-1.5 shrink-0 no-print">
              <button 
                onClick={onExportCSV}
                className="p-2 bg-white/15 hover:bg-white/25 text-white rounded-lg border border-white/20 transition-all active:scale-95 cursor-pointer"
                title="Exportar CSV"
                aria-label="Exportar CSV"
              >
                <Download className="w-4 h-4 text-emerald-300" />
              </button>

              <button 
                onClick={handlePrint}
                className="p-2 bg-fecomercio-gold hover:bg-amber-600 text-white rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer"
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
                    className="p-1 text-slate-300 hover:text-red-300 rounded cursor-pointer"
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
            <div className="flex flex-wrap items-center gap-1.5 print:gap-2">
              <span className="bg-fesuper-emerald text-white print:bg-emerald-700 print:text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                24ª Edição • Arapiraca/AL
              </span>
              <span className="bg-fecomercio-gold text-white print:bg-amber-700 print:text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                Relatório Oficial
              </span>
              <span className="text-[10px] text-slate-200 print:text-slate-700 print:bg-slate-100 print:px-2 print:py-0.5 print:rounded-full print:border print:border-slate-300 font-medium print:font-semibold">
                09 a 11 Set 2026 • 185 Entrevistas
              </span>
            </div>
            <h1 className="text-sm font-bold tracking-tight text-white print:text-[#002B55] print:text-base print:font-extrabold mt-1 leading-snug">
              Painel Integrado de Satisfação e Resultados
            </h1>
            <p className="text-[11px] text-slate-200 print:text-slate-700 print:text-xs">
              Sistema Fecomércio Sesc Senac AL & Associação dos Supermercados de Alagoas (ASA)
            </p>
          </div>
        </div>

        {/* === LAYOUT DESKTOP / TABLET (lg+) === */}
        <div className="hidden lg:flex items-center justify-between gap-4 xl:gap-6">
          
          {/* Lado Esquerdo: Logos Institucionais na ordem solicitada */}
          <div className="flex items-center gap-2 xl:gap-2.5 shrink-0">
            {/* 1. Fecomércio */}
            <div className="bg-white p-1.5 rounded-xl shadow-sm flex items-center justify-center h-11 xl:h-12 w-24 xl:w-28 border border-white/20 print:border-slate-300">
              <img 
                src="/assets/logo_fecomercio.png" 
                alt="Fecomércio AL" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="h-7 w-px bg-white/20 print:bg-slate-300"></div>

            {/* 2. Instituto Fecomércio */}
            <div className="bg-white p-1.5 rounded-xl shadow-sm flex items-center justify-center h-11 xl:h-12 w-24 xl:w-28 border border-white/20 print:border-slate-300">
              <img 
                src="/assets/logo_instituto_fecomercio.png" 
                alt="Instituto Fecomércio AL" 
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <div className="h-7 w-px bg-white/20 print:bg-slate-300"></div>

            {/* 3. FESUPER */}
            <div className="bg-white/10 print:bg-slate-900 backdrop-blur-sm p-1 rounded-xl border border-white/15 print:border-slate-700 flex items-center justify-center h-11 xl:h-12 w-24 xl:w-28 overflow-hidden">
              <img 
                src="/assets/logo_fesuper.png" 
                alt="FESUPER 2026" 
                className="max-h-full max-w-full object-contain drop-shadow"
              />
            </div>
          </div>

          {/* Centro: Título, Badges e Metadados (totalmente fluido, sem sobreposição) */}
          <div className="flex-1 min-w-0 px-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-fesuper-emerald text-white print:bg-emerald-700 print:text-white text-[10px] xl:text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-sm">
                24ª Edição • Arapiraca/AL
              </span>
              <span className="bg-fecomercio-gold text-white print:bg-amber-700 print:text-white text-[10px] xl:text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shrink-0 shadow-sm">
                Relatório Oficial
              </span>
              <div className="flex items-center gap-3 text-xs text-slate-200 print:text-slate-700 bg-white/10 print:bg-slate-100 px-2.5 py-0.5 rounded-full border border-white/10 print:border-slate-300">
                <span className="flex items-center gap-1 text-[11px] print:text-slate-700">
                  <Calendar className="w-3 h-3 text-fecomercio-gold print:text-amber-700" />
                  09 a 11 Set 2026
                </span>
                <span className="text-white/40 print:text-slate-400">•</span>
                <span className="flex items-center gap-1 text-[11px] print:text-slate-700">
                  <Users className="w-3 h-3 text-sky-300 print:text-sky-700" />
                  <strong className="text-white print:text-slate-900 font-semibold">185 Entrevistas</strong>
                </span>
              </div>
            </div>

            <h1 className="text-base xl:text-lg font-bold tracking-tight text-white print:text-[#002B55] print:text-lg print:font-extrabold mt-1 leading-snug">
              Painel Integrado de Satisfação e Resultados
            </h1>
            <p className="text-[11px] xl:text-xs text-slate-200 print:text-slate-700 leading-tight">
              Sistema Fecomércio Sesc Senac AL & Associação dos Supermercados de Alagoas (ASA)
            </p>
          </div>

          {/* Lado Direito: Ações Rápidas + Usuário (com no-print para não poluir papel A4) */}
          <div className="flex items-center gap-2 xl:gap-2.5 shrink-0 no-print">
            <button 
              onClick={onExportCSV}
              className="flex items-center gap-1.5 bg-white/15 hover:bg-white/25 text-white text-xs font-semibold px-2.5 xl:px-3 py-1.5 xl:py-2 rounded-lg border border-white/20 transition-all active:scale-95 cursor-pointer shrink-0"
              title="Exportar base completa para planilha Excel/CSV"
            >
              <Download className="w-3.5 h-3.5 text-emerald-300" />
              <span>Exportar CSV</span>
            </button>

            <button 
              onClick={handlePrint}
              className="flex items-center gap-1.5 bg-fecomercio-gold hover:bg-amber-600 text-white text-xs font-semibold px-2.5 xl:px-3.5 py-1.5 xl:py-2 rounded-lg shadow-sm transition-all active:scale-95 cursor-pointer shrink-0"
              title="Personalizar seções e gerar relatório oficial (PDF / Impressão A4)"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Gerar Relatório</span>
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
    </header>
  )
}
