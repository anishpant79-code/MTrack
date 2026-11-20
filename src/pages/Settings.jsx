// src/pages/Settings.jsx - User Profile, AI Verification Thresholds & App Settings

import { useState } from 'react'
import { AppLayout } from '../components/navigation'
import { Button } from '../components/common'
import {
  getUserSettings,
  saveUserSettings,
} from '../data'
import {
  User,
  Sliders,
  Bell,
  Save,
  CheckCircle2,
  RotateCcw,
  Download,
} from 'lucide-react'

export default function Settings() {
  const [settings, setSettings] = useState(getUserSettings)
  const [savedSuccess, setSavedSuccess] = useState(false)

  const handleSave = (e) => {
    e.preventDefault()
    saveUserSettings(settings)
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  const handleResetData = () => {
    if (window.confirm('Reset all demo watchlist and verification data back to default?')) {
      localStorage.clear()
      setSettings(getUserSettings())
      window.location.reload()
    }
  }

  const handleExportData = () => {
    const exportObj = {
      userSettings: settings,
      exportDate: new Date().toISOString(),
      platform: 'MTrack AI',
    }
    const blob = new Blob([JSON.stringify(exportObj, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `mtrack-ai-export-${Date.now()}.json`
    a.click()
  }

  return (
    <AppLayout>
      <div className="max-w-4xl space-y-8 sm:space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              Settings & Intelligence Preferences
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Configure AI model thresholds, notification alerts, and data management.
            </p>
          </div>

          {savedSuccess && (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 px-4 py-2 text-xs font-bold text-emerald-700 border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Settings Saved Successfully
            </div>
          )}
        </div>

        <form onSubmit={handleSave} className="space-y-6 sm:space-y-8">
          {/* 1. User Profile Section */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-5 sm:space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-2xs">
                <User className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Investor Profile</h2>
                <p className="text-xs text-slate-400 mt-0.5">Your analyst identity and workspace role</p>
              </div>
            </div>

            <div className="grid gap-4 sm:gap-5 sm:grid-cols-2">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Full Name
                </label>
                <input
                  type="text"
                  value={settings.fullName}
                  onChange={(e) => setSettings({ ...settings, fullName: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-xs sm:text-sm font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Email Address
                </label>
                <input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-xs sm:text-sm font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Primary Role / Desk
                </label>
                <input
                  type="text"
                  value={settings.role}
                  onChange={(e) => setSettings({ ...settings, role: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-xs sm:text-sm font-medium text-slate-800 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>
            </div>
          </div>

          {/* 2. AI Verification Sensitivity */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-5 sm:space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-2xs">
                <Sliders className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">AI Engine Thresholds</h2>
                <p className="text-xs text-slate-400 mt-0.5">Tune model strictness and evidence weights</p>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700 uppercase tracking-wider">
                  Minimum Confidence Level for "Verified" Verdict
                </label>
                <span className="font-extrabold text-blue-600 text-base">
                  {settings.confidenceThreshold}%
                </span>
              </div>
              <input
                type="range"
                min="60"
                max="98"
                value={settings.confidenceThreshold}
                onChange={(e) => setSettings({ ...settings, confidenceThreshold: Number(e.target.value) })}
                className="mt-4 w-full cursor-pointer accent-blue-600"
              />
              <div className="mt-2.5 flex justify-between text-[11px] text-slate-400 font-medium">
                <span>60% (Permissive)</span>
                <span>80% (Recommended)</span>
                <span>98% (Ultra-Strict Regulatory)</span>
              </div>
            </div>
          </div>

          {/* 3. Alerts & Notifications */}
          <div className="rounded-3xl border border-slate-200/90 bg-white p-6 sm:p-8 shadow-xs space-y-5 sm:space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5 mb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 shadow-2xs">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-bold text-slate-900">Intelligence Notifications</h2>
                <p className="text-xs text-slate-400 mt-0.5">Receive alerts when monitored tickers have active rumors</p>
              </div>
            </div>

            <div className="space-y-3.5">
              <label className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-100 hover:bg-slate-50/80 transition cursor-pointer">
                <div className="pr-4">
                  <span className="text-xs sm:text-sm font-bold text-slate-800">High-Risk Rumor Alerts</span>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">Notify immediately when unverified claims spike on your watchlist.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.rumorAlerts}
                  onChange={(e) => setSettings({ ...settings, rumorAlerts: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-100 hover:bg-slate-50/80 transition cursor-pointer">
                <div className="pr-4">
                  <span className="text-xs sm:text-sm font-bold text-slate-800">Daily Market Intelligence Digest</span>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">Summary email of debunked vs confirmed rumors each morning.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.dailyDigest}
                  onChange={(e) => setSettings({ ...settings, dailyDigest: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-4 sm:p-5 rounded-2xl border border-slate-100 hover:bg-slate-50/80 transition cursor-pointer">
                <div className="pr-4">
                  <span className="text-xs sm:text-sm font-bold text-slate-800">Live Ticker Data Streaming</span>
                  <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 leading-relaxed">Auto-refresh stock indices and volume indicators every 15 seconds.</p>
                </div>
                <input
                  type="checkbox"
                  checked={settings.marketDataAutoRefresh}
                  onChange={(e) => setSettings({ ...settings, marketDataAutoRefresh: e.target.checked })}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-3 pb-8">
            <div className="flex flex-wrap gap-3">
              <Button type="submit" variant="primary">
                <Save className="h-4 w-4" />
                Save Preferences
              </Button>

              <Button type="button" variant="outline" onClick={handleExportData}>
                <Download className="h-4 w-4" />
                Export Profile JSON
              </Button>
            </div>

            <Button type="button" variant="ghost" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={handleResetData}>
              <RotateCcw className="h-4 w-4" />
              Reset Demo Data
            </Button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
