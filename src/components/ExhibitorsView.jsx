import React, { useState } from 'react'
import { 
  Building2, Users, Target, PhoneCall, TrendingUp, AlertCircle, 
  CheckCircle, Zap, MapPin, Award, Layers, HelpCircle, MessageSquareQuote, Info 
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
  Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis 
} from 'recharts'
import MetricCard from './MetricCard'

// Tooltip customizado rico para o Radar
function CustomRadarTooltip({ active, payload }) {
  if (active && payload && payload.length) {
    const data = payload[0].payload
    return (
      <div className="bg-slate-900 text-white p-4 rounded-xl shadow-xl border border-slate-700 max-w-xs text-xs space-y-2 z-50">
        <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5">
          <span className="font-bold text-slate-100">{data.full_name || data.subject}</span>
          <span className="font-mono font-extrabold text-emerald-400 text-sm">{data.nota}</span>
        </div>
        <div className="flex items-center justify-between text-[11px] text-slate-300">
          <span>Respostas Válidas: <strong>{data.respostas}</strong></span>
          <span className="text-amber-300 font-semibold">{data.pct_10}% nota 10</span>
        </div>
        <div className="bg-slate-800/90 p-2.5 rounded-lg border border-slate-700 text-slate-200 italic leading-relaxed">
          <div className="flex items-center gap-1 text-[10px] text-slate-400 not-italic uppercase font-semibold mb-1">
            <MessageSquareQuote className="w-3 h-3 text-amber-400" />
            <span>Relato Literal de Expositor:</span>
          </div>
          "{data.citacao}"
        </div>
      </div>
    )
  }
  return null
}

export default function ExhibitorsView({ data }) {
  const { kpis_principais, dimensoes_operacionais, radar_data, segmentos_expositores, contatos_expositores, origem_expositores, filteredExpositores } = data
  const exp = kpis_principais.expositores

  // Estado para dimensão selecionada na inspeção interativa
  const [selectedDim, setSelectedDim] = useState(dimensoes_operacionais[8] || dimensoes_operacionais[0])

  if (filteredExpositores && filteredExpositores.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
        <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Nenhum Expositor Encontrado com os Filtros Atuais</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Os critérios de filtro selecionados (ex.: público definido para Visitantes ou região sem expositores) não contêm registros de expositores. Redefina os filtros na barra superior.
        </p>
      </div>
    )
  }

  const getScoreBadge = (nota) => {
    if (nota >= 9.0) return 'text-emerald-700 bg-emerald-50 border-emerald-200'
    if (nota >= 8.5) return 'text-blue-700 bg-blue-50 border-blue-200'
    return 'text-amber-800 bg-amber-50 border-amber-300'
  }

  const getBarColor = (nota) => {
    if (nota >= 9.0) return '#059669'
    if (nota >= 8.5) return '#004B8D'
    return '#D97706'
  }

  return (
    <div className="space-y-6">
      
      {/* Indicadores Principais de Topo */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <MetricCard
          title="Empresas Expositoras"
          value="62"
          subtitle="59 marcas com estandes operacionais"
          badge="Amostra Certificada"
          badgeType="info"
          icon={Building2}
          variant="blue"
        />

        <MetricCard
          title="NPS Adaptado de Fidelização"
          value={`+${exp.nps}`}
          subtitle={`${exp.promotores_pct}% Promotores (${exp.promotores_qtd}) • ${exp.detratores_pct}% Detratores`}
          badge="Zona de Qualidade"
          badgeType="success"
          icon={Award}
          variant="green"
        />

        <MetricCard
          title="Efetividade Comercial"
          value={`${exp.negocios_efetivos_ou_potenciais_pct}%`}
          subtitle="22,6% negócios fechados + 67,7% potencial futuro"
          badge="Alto Retorno"
          badgeType="success"
          icon={TrendingUp}
          variant="gold"
        />

        <MetricCard
          title="Equipe Média por Empresa"
          value="10,9"
          subtitle="Mediana de 7 (591 representantes declarados por 54 empresas)"
          badge="Mobilização"
          badgeType="neutral"
          icon={Users}
          variant="blue"
        />

      </div>

      {/* Grid: Radar Dinâmico & Painel de Inspeção Qualitativa */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Radar Dinâmico 100% em Código Recharts */}
        <div className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Mapa de Satisfação Operacional (Radar Dinâmico)
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                  Renderizado em tempo real a partir das notas das 62 empresas
                </p>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 shrink-0">
                Toque nos eixos
              </span>
            </div>

            {/* Recharts Radar Chart */}
            <div className="h-72 sm:h-80 w-full mt-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="68%" data={radar_data}>
                  <PolarGrid stroke="#cbd5e1" strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="subject" 
                    tick={{ fill: '#334155', fontSize: 10, fontWeight: 600 }}
                  />
                  <PolarRadiusAxis 
                    angle={90} 
                    domain={[0, 10]} 
                    tick={{ fill: '#64748b', fontSize: 9 }}
                  />
                  <Radar
                    name="Média Estimada"
                    dataKey="nota"
                    stroke="#059669"
                    fill="#059669"
                    fillOpacity={0.35}
                    strokeWidth={2}
                    dot={{ r: 3.5, fill: '#004B8D', strokeWidth: 1, stroke: '#ffffff' }}
                    activeDot={{ r: 5.5, fill: '#D97706', stroke: '#ffffff', strokeWidth: 2 }}
                  />
                  <Tooltip content={<CustomRadarTooltip />} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="p-2.5 sm:p-3 bg-slate-50 border border-slate-200 rounded-xl text-[11px] sm:text-xs text-slate-700 flex items-center justify-between">
            <span>Escala: <strong>0 a 10 pts</strong> (Pontos médios)</span>
            <span className="font-semibold text-emerald-700">Média Geral: 9,05</span>
          </div>
        </div>

        {/* Inspeção Interativa com Comentários Qualitativos */}
        <div className="lg:col-span-6 bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                  Detalhamento Qualitativo por Dimensão
                </h3>
                <p className="text-[11px] sm:text-xs text-slate-600 mt-0.5">
                  Toque na dimensão para ler as avaliações dos estandes
                </p>
              </div>
              <span className="text-[9px] sm:text-[10px] font-bold text-fecomercio-blue bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full shrink-0">
                Toque para ver
              </span>
            </div>

            {/* Botões de Seleção Rápida */}
            <div className="grid grid-cols-3 gap-1.5 my-3">
              {dimensoes_operacionais.map((d, idx) => {
                const isSel = selectedDim.dimensao === d.dimensao
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedDim(d)}
                    className={`p-1.5 sm:p-2 rounded-xl text-left border transition-all cursor-pointer ${
                      isSel 
                        ? 'bg-fecomercio-navy text-white border-fecomercio-navy shadow-sm' 
                        : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    <p className="font-bold truncate text-[10px] sm:text-[11px]">{d.sigla}</p>
                    <p className={`text-[9px] sm:text-[10px] font-mono font-bold mt-0.5 ${isSel ? 'text-amber-300' : 'text-slate-500'}`}>
                      {d.nota.toFixed(2)}
                    </p>
                  </button>
                )
              })}
            </div>

            {/* Painel do Quesito Selecionado */}
            <div className="p-3 sm:p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="min-w-0 pr-2">
                  <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-slate-500">Dimensão em Foco:</span>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900 truncate">{selectedDim.dimensao}</h4>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base sm:text-lg font-extrabold text-slate-900">{selectedDim.nota.toFixed(2)}</span>
                  <span className="text-[10px] sm:text-xs text-slate-500 block">/ 10</span>
                </div>
              </div>

              {/* Distribuição das Notas */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between text-[10px] sm:text-[11px] text-slate-600">
                  <span>Distribuição ({selectedDim.respostas_validas} válidas):</span>
                  <span className="font-bold text-slate-800">{selectedDim.pct_10}% nota 10</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-1 sm:gap-1.5 text-center text-[10px] font-semibold">
                  <div className="bg-emerald-100 text-emerald-800 p-1 sm:p-1.5 rounded-lg border border-emerald-200">
                    Nota 10: <strong>{selectedDim.distribuicao.nota_10}</strong>
                  </div>
                  <div className="bg-blue-100 text-blue-800 p-1 sm:p-1.5 rounded-lg border border-blue-200">
                    8-9: <strong>{selectedDim.distribuicao.nota_8_9}</strong>
                  </div>
                  <div className="bg-amber-100 text-amber-800 p-1 sm:p-1.5 rounded-lg border border-amber-200">
                    6-7: <strong>{selectedDim.distribuicao.nota_6_7}</strong>
                  </div>
                  <div className="bg-red-100 text-red-800 p-1 sm:p-1.5 rounded-lg border border-red-200">
                    ≤5: <strong>{selectedDim.distribuicao.nota_ate_5}</strong>
                  </div>
                </div>
              </div>

              {/* Citação Literal Destaque */}
              <div className="p-2.5 sm:p-3 bg-white rounded-xl border border-slate-200 text-[11px] sm:text-xs text-slate-700 italic flex items-start gap-2">
                <MessageSquareQuote className="w-4 h-4 text-fecomercio-gold shrink-0 mt-0.5" />
                <div>
                  <p>"{selectedDim.citacao_destaque}"</p>
                  <span className="text-[10px] font-bold text-slate-500 not-italic block mt-1">
                    — {selectedDim.comentario_autor}
                  </span>
                </div>
              </div>

            </div>

          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1">
            <span>Status: <strong className="text-slate-800">{selectedDim.categoria}</strong></span>
            <span>{selectedDim.respostas_validas} respostas auditadas</span>
          </div>

        </div>

      </div>

      {/* Grid: Segmentos de Atuação & Contatos Comerciais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Segmentos de Atuação */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                Segmentos de Atuação das Empresas
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600">
                Distribuição dos expositores por cadeia de valor
              </p>
            </div>
            <Layers className="w-4 h-4 text-fecomercio-blue shrink-0" />
          </div>

          <div className="h-60 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={segmentos_expositores}
                margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 10, fill: '#334155' }} width={135} />
                <Tooltip 
                  formatter={(value) => [`${value} empresas`, 'Quantidade']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#004B8D" radius={[0, 6, 6, 0]}>
                  {segmentos_expositores.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#059669' : '#004B8D'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <strong>Destaque Setorial:</strong> A <em>Indústria de alimentos e bebidas</em> liderou com 26,2% dos estandes, acompanhada por consultorias e atacado/distribuição.
          </p>
        </div>

        {/* Volume de Contatos Comerciais Gerados */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                Volume de Contatos Comerciais Gerados
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-600">
                Prospecção e leads captados por empresa
              </p>
            </div>
            <PhoneCall className="w-4 h-4 text-fesuper-emerald shrink-0" />
          </div>

          <div className="h-60 sm:h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={contatos_expositores}
                margin={{ top: 10, right: 15, left: 0, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} interval={0} angle={-10} textAnchor="end" />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  formatter={(value) => [`${value} empresas`, 'Total']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="count" fill="#059669" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-600 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
            <strong>Oportunidade Operacional:</strong> 9,7% das marcas relataram não ter controle sistematizado de contatos, justificando a implantação de crachás com QR Code.
          </p>
        </div>

      </div>

    </div>
  )
}
