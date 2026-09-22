import React, { useState } from 'react'
import { Lock, User, Eye, EyeOff, AlertCircle, ArrowRight, ShieldCheck } from 'lucide-react'

// Credenciais configuradas
const USERS = {
  admin: {
    password: 'datamacro2026',
    role: 'admin',
    label: 'Administrador Geral',
    canExport: true,
  },
  usuario: {
    password: 'fesuper2026',
    role: 'usuario',
    label: 'Usuário Analista',
    canExport: true,
  }
}

export default function LoginPage({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError('')

    const cleanUser = username.trim().toLowerCase()
    const cleanPass = password.trim()

    if (!cleanUser || !cleanPass) {
      setError('Por favor, informe o usuário e a senha.')
      return
    }

    setLoading(true)

    setTimeout(() => {
      const userRecord = USERS[cleanUser]
      if (userRecord && userRecord.password === cleanPass) {
        onLogin({
          username: cleanUser,
          role: userRecord.role,
          label: userRecord.label,
          canExport: userRecord.canExport
        })
      } else {
        setError('Usuário ou senha inválidos. Verifique os dados digitados.')
        setLoading(false)
      }
    }, 300)
  }

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Decorativo Institucional */}
      <div className="absolute inset-0 bg-gradient-to-br from-fecomercio-navy via-[#023e73] to-fesuper-darkGreen opacity-95"></div>
      
      {/* Círculos de luz sutil para profundidade corporativa */}
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-fesuper-emerald/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-fecomercio-gold/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Card Principal */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 p-8 sm:p-10 relative z-10 backdrop-blur-sm animate-fadeIn">
        
        {/* Logos Institucionais */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200/80 shadow-sm flex items-center justify-center h-14 w-36">
            <img 
              src="/assets/logo_fecomercio.png" 
              alt="Fecomércio AL" 
              className="max-h-full max-w-full object-contain"
            />
          </div>

          <div className="h-8 w-px bg-slate-200"></div>

          <div className="bg-slate-900 p-2 rounded-xl border border-slate-700 shadow-sm flex items-center justify-center h-14 w-36 overflow-hidden">
            <img 
              src="/assets/logo_fesuper.png" 
              alt="FESUPER 2026" 
              className="max-h-full max-w-full object-contain drop-shadow"
            />
          </div>
        </div>

        {/* Títulos do Painel */}
        <div className="text-center mb-7">
          <span className="inline-block bg-fesuper-emerald/10 text-fesuper-darkGreen text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-2 border border-fesuper-emerald/20">
            Acesso Restrito • FESUPER 2026
          </span>
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">
            Painel de Indicadores e Resultados
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Sistema Fecomércio Sesc Senac AL & ASA Supermercados
          </p>
        </div>

        {/* Mensagem de Erro */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-xs animate-shake">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-600" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Formulário de Login */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Campo Usuário */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Usuário de Acesso
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: admin ou usuario"
                className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fecomercio-blue focus:border-transparent transition-all"
                autoComplete="username"
                required
              />
            </div>
          </div>

          {/* Campo Senha */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Senha
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-fecomercio-blue focus:border-transparent transition-all"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                title={showPassword ? 'Ocultar senha' : 'Exibir senha'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Botão de Envio */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-gradient-to-r from-fecomercio-navy to-fecomercio-blue hover:from-[#002244] hover:to-[#003b70] text-white text-xs font-bold py-3 px-4 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
          >
            {loading ? (
              <span className="inline-flex items-center gap-2">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Validando Acesso...
              </span>
            ) : (
              <>
                <span>Entrar no Painel</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

        </form>

        {/* Rodapé Informativo */}
        <div className="mt-8 pt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-fesuper-emerald" />
            <span>Ambiente Seguro • ASA / Fecomércio</span>
          </div>
          <span>Versão 2.4</span>
        </div>

      </div>

      {/* Nota de rodapé da página */}
      <div className="mt-6 text-center text-xs text-white/60 relative z-10">
        © 2026 Fecomércio Alagoas & Associação dos Supermercados de Alagoas. Todos os direitos reservados.
      </div>

    </div>
  )
}
