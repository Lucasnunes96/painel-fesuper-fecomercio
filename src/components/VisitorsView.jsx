import React from 'react'
import { 
  Users, UserCheck, HeartHandshake, MapPin, Compass, 
  Share2, ShoppingCart, Award, Megaphone, UserPlus 
} from 'lucide-react'
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts'
import MetricCard from './MetricCard'

export default function VisitorsView({ data }) {
  const { kpis_principais, perfil_visitantes, origem_visitantes, motivos_visitantes, canais_visitantes, filteredVisitantes } = data
  const vis = kpis_principais.visitantes

  const COLORS = ['#059669', '#004B8D', '#D97706', '#0284C7', '#64748B', '#475569']

  if (filteredVisitantes && filteredVisitantes.length === 0) {
    return (
      <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center space-y-3">
        <Users className="w-10 h-10 text-slate-300 mx-auto" />
        <h3 className="text-base font-bold text-slate-800">Nenhum Visitante Encontrado com os Filtros Atuais</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto leading-relaxed">
          Os critérios de filtro selecionados (ex.: público definido para Expositores) não contêm registros de visitantes. Redefina os filtros na barra superior.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      {/* Metric Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        <MetricCard
          title="Visitantes Entrevistados"
          value="123"
          subtitle="Amostra presencial nos dias 10 e 11 de setembro"
          badge="Amostra Primária"
          badgeType="info"
          icon={Users}
          variant="blue"
        />

        <MetricCard
          title="NPS Adaptado de Retorno"
          value={`+${vis.nps}`}
          subtitle={`${vis.promotores_pct}% Promotores (${vis.promotores_qtd}) • Apenas 2 detratores`}
          badge="Zona de Excelência"
          badgeType="success"
          icon={Award}
          variant="green"
        />

        <MetricCard
          title="Taxa de Renovação de Público"
          value={`${vis.primeira_vez_pct}%`}
          subtitle="Participando da FESUPER pela primeira vez"
          badge="Novos Compradores"
          badgeType="success"
          icon={UserPlus}
          variant="gold"
        />

        <MetricCard
          title="Geração de Compras / Parcerias"
          value={`${vis.negocio_realizado_ou_pretendido_pct}%`}
          subtitle="32,0% já fecharam compras + 27,0% pretendem"
          badge="Poder de Compra"
          badgeType="success"
          icon={ShoppingCart}
          variant="green"
        />

      </div>

      {/* Grid: Perfil & Origem Geográfica */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Perfil dos Participantes */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                Perfil Declarado dos Visitantes
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-700">
                Segmentação funcional no mercado
              </p>
            </div>
            <UserCheck className="w-4 h-4 text-fecomercio-blue shrink-0" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={perfil_visitantes}
                margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  tick={{ fontSize: 10, fill: '#334155' }} 
                  width={140} 
                />
                <Tooltip 
                  formatter={(value) => [`${value} participantes`, 'Quantidade']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#059669" radius={[0, 6, 6, 0]}>
                  {perfil_visitantes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
            <strong>Leitura Gerencial:</strong> Representantes e fornecedores somam 40,7%, seguidos pelo público geral consumidor (28,5%) e empresários (9,8%).
          </div>
        </div>

        {/* Origem Territorial */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                Origem Territorial dos Visitantes
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-700">
                Distribuição por município de procedência
              </p>
            </div>
            <MapPin className="w-4 h-4 text-fesuper-emerald shrink-0" />
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={origem_visitantes}
                margin={{ top: 10, right: 15, left: 0, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} />
                <Tooltip 
                  formatter={(value) => [`${value} visitantes`, 'Total']}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#004B8D" radius={[6, 6, 0, 0]}>
                  {origem_visitantes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? '#059669' : '#004B8D'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700">
            <strong>Polo Regional:</strong> Arapiraca representou 55,7% dos visitantes, acompanhada por Maceió (19,7%) e municípios do Agreste/Sertão (Penedo, Santana do Ipanema, etc., com 19,7%).
          </div>
        </div>

      </div>

      {/* Grid: Motivos de Participação & Canais de Divulgação */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Motivo Principal */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                Motivos de Participação
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-700">
                Fatores determinantes para presença no evento
              </p>
            </div>
            <HeartHandshake className="w-4 h-4 text-fecomercio-gold shrink-0" />
          </div>

          <div className="space-y-2">
            {motivos_visitantes.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs">
                <span className="font-semibold text-slate-700 truncate pr-2">{item.name}</span>
                <span className="font-bold text-fecomercio-blue shrink-0">{item.count} ({item.percent}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Canais de Divulgação */}
        <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 uppercase tracking-wider">
                Canais de Conhecimento do Evento
              </h3>
              <p className="text-[11px] sm:text-xs text-slate-700">
                Fontes que mobilizaram os participantes
              </p>
            </div>
            <Megaphone className="w-4 h-4 text-fesuper-coral shrink-0" />
          </div>

          <div className="space-y-2">
            {canais_visitantes.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 bg-slate-50 rounded-lg text-xs">
                <span className="font-semibold text-slate-700 truncate pr-2">{item.name}</span>
                <span className="font-bold text-fesuper-emerald shrink-0">{item.count} ({item.percent}%)</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-700 italic">
            * 46,7% vieram por convite direto de empresas/expositores, reforçando o poder de atração do ecossistema de fornecedores.
          </p>
        </div>

      </div>

    </div>
  )
}
