import React, { useState } from 'react'
import {
  Lock,
  Mail,
  User,
  Phone,
  LogIn,
  UserPlus,
  AlertCircle,
  Eye,
  EyeOff,
  ShieldCheck,
  Users,
} from 'lucide-react'
import type { User as UserType } from '../types'

interface Props {
  onSuccess: (token: string, user: UserType) => void
  onClose: () => void
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

export const AuthModal: React.FC<Props> = ({ onSuccess, onClose }) => {
  const [isRegister, setIsRegister] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const endpoint = isRegister ? '/api/v1/auth/register' : '/api/v1/auth/login'
    const payload = isRegister
      ? { email, password, full_name: fullName, phone_number: phone }
      : { email, password }

    try {
      const res = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || 'Authentication failed')
      }
      onSuccess(data.access_token, data.user)
    } catch (err: any) {
      setError(err.message || 'Network error')
    } finally {
      setLoading(false)
    }
  }

  const selectPreset = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail)
    setPassword(presetPass)
    setIsRegister(false)
    setError(null)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-[#16122b] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-1.5 uppercase">
              <span>{isRegister ? 'Join EZOPY MART TECH' : 'Welcome to EZOPY MART TECH'}</span>
            </h3>
            <p className="text-xs text-rose-300 font-medium">
              {isRegister
                ? 'Create a student or customer account'
                : 'Sign in to access courses, tools & admin panel'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white flex items-center justify-center transition"
          >
            ✕
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Quick Demo Credentials Presets */}
        <div className="mb-5 p-3 rounded-2xl bg-[#0d0b18] border border-purple-500/20 text-xs space-y-2.5">
          {/* Admin Accounts */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold border-b border-slate-800 pb-2">
            <span className="flex items-center gap-1.5 text-purple-300">
              <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
              Admins:
            </span>
            <div className="flex gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => selectPreset('admin@samjap.mart', 'Admin@123')}
                className="px-2 py-0.5 bg-purple-600/25 hover:bg-purple-600/45 text-purple-200 border border-purple-500/40 rounded-md font-bold text-[10px] transition"
                title="admin@samjap.mart (Pass: Admin@123)"
              >
                admin
              </button>
              <button
                type="button"
                onClick={() => selectPreset('mazid@samjap.mart', 'Mazid@123')}
                className="px-2 py-0.5 bg-purple-600/25 hover:bg-purple-600/45 text-purple-200 border border-purple-500/40 rounded-md font-bold text-[10px] transition"
                title="mazid@samjap.mart (Pass: Mazid@123)"
              >
                mazid
              </button>
              <button
                type="button"
                onClick={() => selectPreset('popy@samjap.mart', 'Popy@123')}
                className="px-2 py-0.5 bg-rose-600/25 hover:bg-rose-600/45 text-rose-200 border border-rose-500/40 rounded-md font-bold text-[10px] transition"
                title="popy@samjap.mart (Pass: Popy@123)"
              >
                popy ❤️
              </button>
            </div>
          </div>

          {/* Customer Accounts */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-300">
              <Users className="w-3.5 h-3.5 text-emerald-400" />
              Customers:
            </span>
            <div className="flex gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={() => selectPreset('customer1@gmail.com', 'Customer@123')}
                className="px-2 py-0.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/30 rounded-md font-medium text-[10px] transition"
                title="customer1@gmail.com (Pass: Customer@123)"
              >
                customer1
              </button>
              <button
                type="button"
                onClick={() => selectPreset('customer2@yahoo.com', 'Customer@123')}
                className="px-2 py-0.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/30 rounded-md font-medium text-[10px] transition"
                title="customer2@yahoo.com (Pass: Customer@123)"
              >
                customer2
              </button>
              <button
                type="button"
                onClick={() => selectPreset('customer3@outlook.com', 'Customer@123')}
                className="px-2 py-0.5 bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-200 border border-emerald-500/30 rounded-md font-medium text-[10px] transition"
                title="customer3@outlook.com (Pass: Customer@123)"
              >
                customer3
              </button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Tanvir Rahman"
                    className="w-full bg-[#0d0b18] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="017xxxxxxxx"
                    className="w-full bg-[#0d0b18] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@domain.com"
                className="w-full bg-[#0d0b18] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs font-semibold text-slate-300">Password</label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-purple-400 hover:text-purple-300 font-medium flex items-center gap-1 transition"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3 h-3" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3 h-3" />
                    <span>Show</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0d0b18] border border-slate-700 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 p-1 text-slate-400 hover:text-slate-200 focus:outline-none transition"
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {isRegister ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{loading ? 'Processing...' : isRegister ? 'Create Account' : 'Sign In'}</span>
          </button>
        </form>

        <div className="mt-5 text-center">
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister)
              setError(null)
            }}
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold cursor-pointer"
          >
            {isRegister
              ? 'Already registered? Sign in here'
              : "Don't have an account? Sign up now"}
          </button>
        </div>
      </div>
    </div>
  )
}
