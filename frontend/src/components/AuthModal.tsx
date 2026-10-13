import React, { useState } from 'react'
import { Lock, Mail, User, Phone, LogIn, UserPlus, AlertCircle } from 'lucide-react'
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#16122b] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-40 h-40 bg-purple-600/20 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-extrabold text-white flex items-center gap-1.5">
              <span>{isRegister ? 'Join SAMJAP Mart' : 'Welcome to SAMJAP Mart'}</span>
              <span className="text-rose-500 text-lg">❤️</span>
            </h3>
            <p className="text-xs text-rose-300 font-medium">
              {isRegister
                ? 'Dedicated to Shah Abdul Mazid & Jannat Farhana Popy'
                : 'Login with Mazid or Popy credentials'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition"
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

        {/* Quick Demo Fill Buttons for Mazid & Popy */}
        <div className="mb-5 p-3 rounded-2xl bg-[#0d0b18] border border-rose-500/20 text-xs flex items-center justify-between">
          <span className="text-slate-400 font-medium">Quick Lovers Presets:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setEmail('mazid@samjap.mart')
                setPassword('MazidLovesPopy2026')
                setIsRegister(false)
              }}
              className="px-2.5 py-1 bg-purple-600/30 text-purple-200 border border-purple-500/40 rounded-lg hover:bg-purple-600/50 font-bold text-[11px]"
            >
              Shah Abdul Mazid
            </button>
            <button
              type="button"
              onClick={() => {
                setEmail('popy@samjap.mart')
                setPassword('PopyLovesMazid123')
                setIsRegister(false)
              }}
              className="px-2.5 py-1 bg-rose-600/30 text-rose-200 border border-rose-500/40 rounded-lg hover:bg-rose-600/50 font-bold text-[11px]"
            >
              Jannat Farhana Popy ❤️
            </button>
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
            <label className="block text-xs font-semibold text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-3 w-4 h-4 text-slate-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#0d0b18] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 transition shadow-lg shadow-purple-600/30 flex items-center justify-center gap-2"
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
            className="text-xs text-purple-400 hover:text-purple-300 font-semibold"
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
