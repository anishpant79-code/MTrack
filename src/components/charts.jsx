// src/components/charts.jsx - Recharts Data Visualizations for MTrack AI

import { useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts'

const PIE_COLORS = {
  VERIFIED: '#10b981', // emerald-500
  MISLEADING: '#f59e0b', // amber-500
  DEBUNKED: '#f43f5e', // rose-500
  UNVERIFIED: '#64748b', // slate-500
}

export function StockPriceChart({ data = [], ticker, currentPrice = 0 }) {
  const [timeframe, setTimeframe] = useState('1D')

  // Generate synthetic multi-timeframe views if needed
  const chartData = data.length > 0 ? data : [
    { time: '09:30', price: 100 },
    { time: '11:30', price: 102 },
    { time: '13:30', price: 101.5 },
    { time: '16:00', price: 104 },
  ]

  const minPrice = Math.min(...chartData.map((d) => d.price)) * 0.99
  const maxPrice = Math.max(...chartData.map((d) => d.price)) * 1.01

  return (
    <div className="w-full">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <span className="text-xs font-semibold text-slate-500">
            {ticker ? `${ticker} Price Trend` : 'Price Trend'}
          </span>
          <div className="text-lg font-bold text-slate-900">
            ${currentPrice > 0 ? currentPrice.toFixed(2) : chartData[chartData.length - 1]?.price.toFixed(2)}
          </div>
        </div>

        <div className="flex gap-1 rounded-lg bg-slate-100 p-1 text-xs font-semibold text-slate-600">
          {['1D', '1W', '1M', '1Y', 'ALL'].map((tf) => (
            <button
              key={tf}
              type="button"
              onClick={() => setTimeframe(tf)}
              className={`rounded-md px-2.5 py-1 transition ${
                timeframe === tf ? 'bg-white text-blue-600 shadow-2xs font-bold' : 'hover:text-slate-900'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </div>

      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2563eb" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#2563eb" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              dataKey="time"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
            />
            <YAxis
              domain={[minPrice, maxPrice]}
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#94a3b8', fontSize: 11 }}
              tickFormatter={(v) => `$${v.toFixed(0)}`}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                      <p className="text-xs font-medium text-slate-500">{payload[0].payload.time}</p>
                      <p className="text-sm font-bold text-slate-900">
                        ${payload[0].value.toFixed(2)}
                      </p>
                    </div>
                  )
                }
                return null
              }}
            />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#2563eb"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#priceGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export function SourceAccuracyChart({ data = [] }) {
  const chartData = data.slice(0, 7).map((d) => ({
    name: d.source.replace(' Newsroom', '').replace(' Accounts', '').replace(' Data', ''),
    score: d.score,
  }))

  return (
    <div className="h-64 sm:h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
          <XAxis type="number" domain={[0, 100]} tick={{ fill: '#94a3b8', fontSize: 11 }} />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#475569', fontSize: 11 }}
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-md text-xs">
                    <p className="font-bold text-slate-800">{payload[0].payload.name}</p>
                    <p className="text-blue-600 font-semibold">{payload[0].value}% Accuracy Trust</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Bar
            dataKey="score"
            radius={[0, 6, 6, 0]}
            fill="#3b82f6"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function ClaimDistributionChart({ claims = [] }) {
  const counts = {
    VERIFIED: claims.filter((c) => c.status === 'VERIFIED').length,
    MISLEADING: claims.filter((c) => c.status === 'MISLEADING').length,
    DEBUNKED: claims.filter((c) => c.status === 'DEBUNKED').length,
    UNVERIFIED: claims.filter((c) => c.status === 'UNVERIFIED').length,
  }

  const data = [
    { name: 'Verified Facts', value: counts.VERIFIED || 3, key: 'VERIFIED' },
    { name: 'Misleading', value: counts.MISLEADING || 3, key: 'MISLEADING' },
    { name: 'Debunked Rumors', value: counts.DEBUNKED || 1, key: 'DEBUNKED' },
    { name: 'Unverified', value: counts.UNVERIFIED || 1, key: 'UNVERIFIED' },
  ]

  const total = data.reduce((acc, curr) => acc + curr.value, 0)

  return (
    <div className="flex flex-col items-center justify-center py-2">
      <div className="relative h-60 w-60">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
              dataKey="value"
            >
              {data.map((entry) => (
                <Cell key={entry.key} fill={PIE_COLORS[entry.key]} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="rounded-lg border border-slate-200 bg-white p-2 shadow text-xs">
                      <span className="font-bold">{payload[0].name}: </span>
                      <span>{payload[0].value} claims</span>
                    </div>
                  )
                }
                return null
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-xl font-bold text-slate-900">{total}</span>
          <span className="text-[10px] font-semibold text-slate-500 uppercase">Analyzed</span>
        </div>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        {data.map((entry) => (
          <div key={entry.key} className="flex items-center gap-1.5">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: PIE_COLORS[entry.key] }}
            />
            <span className="text-slate-600">{entry.name}</span>
            <span className="font-bold text-slate-800">
              ({Math.round((entry.value / total) * 100)}%)
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
