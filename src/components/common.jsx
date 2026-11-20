// src/components/common.jsx - Reusable UI Primitives & Components

import {
  AlertTriangle,
  XCircle,
  HelpCircle,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  X,
  Loader2,
} from 'lucide-react'

export function StatusBadge({ status, size = 'md' }) {
  const norm = (status || '').toUpperCase()
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold'

  if (norm === 'VERIFIED') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 font-medium ${sizeClasses}`}>
        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
        Verified Fact
      </span>
    )
  }

  if (norm === 'DEBUNKED') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border border-rose-200 bg-rose-50 text-rose-700 font-medium ${sizeClasses}`}>
        <XCircle className="h-3.5 w-3.5 text-rose-600" />
        Debunked Rumor
      </span>
    )
  }

  if (norm === 'MISLEADING') {
    return (
      <span className={`inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 font-medium ${sizeClasses}`}>
        <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
        Misleading Claim
      </span>
    )
  }

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 text-slate-700 font-medium ${sizeClasses}`}>
      <HelpCircle className="h-3.5 w-3.5 text-slate-500" />
      Unverified / Review
    </span>
  )
}

export function RiskBadge({ level }) {
  const norm = (level || '').toLowerCase()
  if (norm === 'high') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-800">
        High Noise Risk
      </span>
    )
  }
  if (norm === 'moderate' || norm === 'medium') {
    return (
      <span className="inline-flex items-center gap-1 rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
        Moderate Risk
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 rounded-md bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-800">
      Low Risk
    </span>
  )
}

export function SentimentBadge({ sentiment }) {
  const norm = (sentiment || '').toLowerCase()
  if (norm === 'bullish') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600">
        <TrendingUp className="h-3.5 w-3.5" /> Bullish
      </span>
    )
  }
  if (norm === 'bearish') {
    return (
      <span className="inline-flex items-center gap-1 text-xs font-medium text-rose-600">
        <TrendingDown className="h-3.5 w-3.5" /> Bearish
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
      <Minus className="h-3.5 w-3.5" /> Neutral
    </span>
  )
}

export function CredibilityGauge({ score, showLabel = true, size = 'md' }) {
  const num = Math.min(100, Math.max(0, Number(score) || 0))
  let barColor = 'bg-emerald-500'
  let labelText = 'High Trust'

  if (num < 50) {
    barColor = 'bg-rose-500'
    labelText = 'Low Trust'
  } else if (num < 75) {
    barColor = 'bg-amber-500'
    labelText = 'Questionable'
  }

  if (size === 'compact') {
    return (
      <div className="flex items-center gap-2">
        <div className="h-2 w-16 overflow-hidden rounded-full bg-slate-200">
          <div className={`h-full ${barColor}`} style={{ width: `${num}%` }} />
        </div>
        <span className="text-xs font-bold text-slate-700">{num}%</span>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">Source Credibility</span>
        <span className="font-bold text-slate-900">{num}/100</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor}`}
          style={{ width: `${num}%` }}
        />
      </div>
      {showLabel && (
        <span className="text-[11px] font-semibold text-slate-500">{labelText}</span>
      )}
    </div>
  )
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  loading = false,
  disabled = false,
  onClick,
  type = 'button',
  ...props
}) {
  const base = 'inline-flex items-center justify-center font-semibold transition-all duration-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 disabled:opacity-50 disabled:cursor-not-allowed'
  
  const sizeStyles = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2 text-sm gap-2',
    lg: 'px-6 py-3 text-base gap-2.5',
  }

  const variants = {
    primary: 'bg-blue-600 text-white shadow-md shadow-blue-600/20 hover:bg-blue-700 active:scale-[0.98]',
    secondary: 'bg-slate-100 text-slate-800 hover:bg-slate-200 active:scale-[0.98]',
    outline: 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:border-slate-300',
    ghost: 'text-slate-600 hover:bg-slate-100 hover:text-slate-900',
    danger: 'bg-rose-600 text-white shadow-md shadow-rose-600/20 hover:bg-rose-700',
    success: 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20 hover:bg-emerald-700',
  }

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${base} ${sizeStyles[size]} ${variants[variant]} ${className}`}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  )
}

export function SearchInput({ value, onChange, placeholder = 'Search...', onClear, className = '' }) {
  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="pointer-events-none absolute left-3.5 h-4 w-4 text-slate-400" />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-9 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-colors focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute right-3 text-slate-400 hover:text-slate-600 transition"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}

export function StatCard({ title, value, change, positive, icon: Icon, subtitle }) {
  return (
    <div className="rounded-2xl sm:rounded-3xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-xs transition hover:shadow-md hover:border-slate-300">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">{title}</span>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-2xs">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-3.5 flex items-baseline gap-2">
        <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">{value}</span>
        {change && (
          <span
            className={`flex items-center text-xs font-bold ${
              positive ? 'text-emerald-600' : 'text-rose-600'
            }`}
          >
            {positive ? <TrendingUp className="mr-0.5 h-3.5 w-3.5" /> : <TrendingDown className="mr-0.5 h-3.5 w-3.5" />}
            {change}
          </span>
        )}
      </div>
      {subtitle && <p className="mt-1.5 text-xs text-slate-500 font-medium">{subtitle}</p>}
    </div>
  )
}

export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-2xl' }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 sm:p-6 backdrop-blur-xs">
      <div className="fixed inset-0" onClick={onClose} />
      <div className={`relative w-full ${maxWidth} rounded-3xl border border-slate-200 bg-white p-6 sm:p-8 shadow-2xl transition-all max-h-[90vh] overflow-y-auto`}>
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="mt-5">{children}</div>
      </div>
    </div>
  )
}

export function Tabs({ tabs, activeTab, onChange }) {
  return (
    <div className="flex overflow-x-auto rounded-2xl bg-slate-100/90 p-1.5 gap-1 scrollbar-none">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              isActive
                ? 'bg-white text-slate-900 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
            }`}
          >
            {tab.icon && <tab.icon className="h-3.5 w-3.5" />}
            {tab.label}
            {tab.count !== undefined && (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                  isActive ? 'bg-blue-100 text-blue-700' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

