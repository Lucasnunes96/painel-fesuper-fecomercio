import React from 'react'

export default function MetricCard({ 
  title, 
  value, 
  subtitle, 
  badge, 
  badgeType = 'neutral', // 'success', 'warning', 'danger', 'info', 'neutral'
  icon: Icon,
  variant = 'blue' // 'blue', 'green', 'gold', 'red'
}) {
  const borderColors = {
    blue: 'border-l-4 border-l-fecomercio-blue',
    green: 'border-l-4 border-l-fesuper-emerald',
    gold: 'border-l-4 border-l-fecomercio-gold',
    red: 'border-l-4 border-l-red-500'
  }

  const iconColors = {
    blue: 'text-fecomercio-blue bg-blue-50',
    green: 'text-fesuper-emerald bg-emerald-50',
    gold: 'text-fecomercio-gold bg-amber-50',
    red: 'text-red-600 bg-red-50'
  }

  const badgeStyles = {
    success: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    warning: 'bg-amber-100 text-amber-800 border-amber-200',
    danger: 'bg-red-100 text-red-800 border-red-200',
    info: 'bg-blue-100 text-blue-800 border-blue-200',
    neutral: 'bg-slate-100 text-slate-700 border-slate-200'
  }

  return (
    <div className={`bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-200 hover:shadow-md transition-shadow relative overflow-hidden ${borderColors[variant] || ''}`}>
      <div className="flex items-start justify-between gap-2.5">
        <div className="flex-1 min-w-0">
          <p className="text-[11px] sm:text-xs font-semibold text-slate-700 tracking-wide uppercase truncate" title={title}>{title}</p>
          <div className="mt-1.5 sm:mt-2 flex flex-wrap items-baseline gap-1.5 sm:gap-2">
            <span className="text-xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{value}</span>
            {badge && (
              <span className={`text-[10px] sm:text-[11px] font-bold px-1.5 sm:px-2 py-0.5 rounded-full border ${badgeStyles[badgeType]}`}>
                {badge}
              </span>
            )}
          </div>
          {subtitle && (
            <p className="mt-1 text-[11px] sm:text-xs text-slate-600 font-medium leading-relaxed">{subtitle}</p>
          )}
        </div>
        {Icon && (
          <div className={`p-2 sm:p-2.5 rounded-xl ${iconColors[variant] || 'bg-slate-100 text-slate-600'} shrink-0`}>
            <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        )}
      </div>
    </div>
  )
}

