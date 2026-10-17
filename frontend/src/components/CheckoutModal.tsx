import React, { useState, useEffect } from 'react'
import { ShieldCheck, AlertCircle, ExternalLink, Zap, CheckCircle2 } from 'lucide-react'
import type { Product, PaymentMethod, MemoType, Transaction, User } from '../types'

interface Props {
  product: Product
  token: string | null
  user?: User | null
  onSuccess: (trx: Transaction) => void
  onClose: () => void
  onRequireLogin: () => void
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''

export const CheckoutModal: React.FC<Props> = ({
  product,
  token,
  user,
  onSuccess,
  onClose,
  onRequireLogin,
}) => {
  const [method, setMethod] = useState<PaymentMethod>('SSLCOMMERZ')
  const [memoType, setMemoType] = useState<MemoType>('FUND_TRANSFER')
  const [trxId, setTrxId] = useState('')
  const [senderAccount, setSenderAccount] = useState('')
  const [studentId, setStudentId] = useState('')
  const [billerName, setBillerName] = useState(product.title)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Customer info for SSLCommerz session - pre-fill from user
  const [customerName, setCustomerName] = useState(user?.full_name || '')
  const [customerEmail, setCustomerEmail] = useState(user?.email || '')
  const [customerPhone, setCustomerPhone] = useState(user?.phone_number || '')

  useEffect(() => {
    if (user) {
      if (user.full_name) setCustomerName(user.full_name)
      if (user.email) setCustomerEmail(user.email)
      if (user.phone_number) setCustomerPhone(user.phone_number)
    }
  }, [user])

  const paymentGuides = {
    SSLCOMMERZ: {
      title: 'SSLCommerz Sandbox Gateway (Auto Checkout)',
      accountNo: 'Online Gateway Redirect',
      accountName: 'Visa, Mastercard, bKash, Nagad, Rocket, DBBL Nexus',
      tag: 'SSLCommerz Authorized Merchant',
      instruction:
        'Click the button below to be redirected directly to the official SSLCommerz Sandbox payment page. You can test cards, mobile banking, and internet banking with instant return callback verification.',
    },
    NEXUSPAY_DBBL: {
      title: 'Dutch-Bangla Bank (NexusPay / DBBL Card)',
      accountNo: '107.110.198425',
      accountName: 'EZOPY MART TECH',
      tag: 'Dutch-Bangla Bank PLC, Gulshan Branch',
      instruction:
        'Open your NexusPay app or DBBL ATM/NetBanking -> Transfer Money / Bill Pay -> Account: 107.110.198425 -> Copy the Transaction ID (e.g. LID02082191058 or TrxID).',
    },
    BKASH: {
      title: 'bKash Merchant / Personal Payment',
      accountNo: '01711-009988',
      accountName: 'EZOPY MART TECH',
      tag: 'bKash Merchant Payment',
      instruction:
        'Dial *247# or open bKash app -> Make Payment / Send Money -> To 01711-009988 -> Enter Reference: EZOPY -> Submit TrxID below.',
    },
    NAGAD: {
      title: 'Nagad Merchant Payment',
      accountNo: '01844-998877',
      accountName: 'EZOPY MART TECH',
      tag: 'Nagad Payment Gateway',
      instruction:
        'Open Nagad app -> Merchant Pay -> 01844-998877 -> Amount: ৳' +
        product.price_bdt +
        ' -> Type Reference and submit TrxID.',
    },
    ROCKET: {
      title: 'DBBL Rocket Wallet Payment',
      accountNo: '01711-009988-9',
      accountName: 'EZOPY MART TECH',
      tag: 'DBBL Rocket Core',
      instruction:
        'Dial *322# or open Rocket app -> Merchant Pay / Bill Pay -> Biller ID: 8810 -> Amount ৳' +
        product.price_bdt +
        ' -> Submit TrxID.',
    },
  }

  const activeGuide = paymentGuides[method]

  // Handler for SSLCommerz Sandbox Direct Redirect Gateway
  const handleSSLCommerzRedirect = async () => {
    setLoading(true)
    setError(null)

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      }
      if (token) {
        headers['Authorization'] = `Bearer ${token}`
      }

      const response = await fetch(`${BACKEND_URL}/api/init-payment`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          amount: product.price_bdt,
          product_name: product.title,
          product_id: product.id,
          product_category: 'AI Software & Educational Tools',
          customer: {
            name: customerName.trim() || user?.full_name || 'EZOPY Customer',
            email: customerEmail.trim() || user?.email || '',
            phone: customerPhone.trim() || user?.phone_number || '01700000000',
            address: 'Gulshan-2, Dhaka',
            city: 'Dhaka',
            country: 'Bangladesh',
          },
        }),
      })

      const data = await response.json()

      if (!response.ok || data.status !== 'SUCCESS') {
        throw new Error(data.reason || data.message || 'Payment initiation failed')
      }

      const redirectUrl = data.GatewayPageURL || data.redirectGatewayURL
      if (redirectUrl) {
        // Redirect directly to SSLCommerz Sandbox payment page!
        window.location.href = redirectUrl
      } else {
        throw new Error('No gateway redirection URL returned by SSLCommerz')
      }
    } catch (err: any) {
      console.error('SSLCommerz Error:', err)
      setError(err.message || 'Failed to connect with SSLCommerz sandbox gateway')
      setLoading(false)
    }
  }

  // Handler for Manual TrxID verification
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!token) {
      onRequireLogin()
      return
    }

    if (!trxId.trim()) {
      setError('Please provide the Transaction ID (TrxID) received from the bank.')
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`${BACKEND_URL}/api/v1/checkout/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          product_id: product.id,
          product_title: product.title,
          price_bdt: product.price_bdt,
          payment_method: method,
          transaction_id: trxId.trim(),
          sender_account: senderAccount.trim() || undefined,
          memo_type: memoType,
          student_id: memoType === 'BILL_PAYMENT' ? studentId : undefined,
          biller_name: memoType === 'BILL_PAYMENT' ? billerName : undefined,
        }),
      })

      const data = await res.json()
      if (!res.ok) {
        throw new Error(data.detail || 'Checkout submission failed.')
      }

      onSuccess(data)
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-xl my-6 bg-[#16122b] border border-purple-500/20 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="p-6 bg-gradient-to-r from-[#211b3d] to-[#16122b] border-b border-purple-500/20 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold tracking-widest text-purple-400 uppercase">
              Secure Checkout
            </span>
            <h3 className="text-xl font-extrabold text-white">{product.title}</h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Due</span>
            <span className="text-2xl font-black text-amber-400">৳ {product.price_bdt}</span>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Payment Method Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Select Payment Gateway
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'SSLCOMMERZ', label: 'SSLCommerz', sub: 'Instant Sandbox' },
                { id: 'NEXUSPAY_DBBL', label: 'DBBL NexusPay', sub: 'Instant Slip' },
                { id: 'BKASH', label: 'bKash', sub: 'Auto Verify' },
                { id: 'NAGAD', label: 'Nagad', sub: 'Fast Track' },
                { id: 'ROCKET', label: 'Rocket', sub: 'DBBL Channel' },
              ].map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setMethod(m.id as PaymentMethod)}
                  className={`p-3 rounded-2xl border text-left transition flex flex-col justify-between ${
                    method === m.id
                      ? 'bg-rose-600/20 border-rose-500 text-white shadow-lg shadow-rose-600/20'
                      : 'bg-[#0d0b18]/60 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="text-xs font-bold block">{m.label}</span>
                  <span className="text-[10px] text-rose-400/80">{m.sub}</span>
                </button>
              ))}
            </div>
          </div>

          {/* SSLCommerz Option View */}
          {method === 'SSLCOMMERZ' ? (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/30 via-[#16122b] to-purple-950/30 border border-rose-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    <Zap className="w-4 h-4 text-amber-400" />
                    <span>SSLCommerz Sandbox Gateway</span>
                  </span>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                    Sandbox Active
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Redirects seamlessly to the SSLCommerz Sandbox checkout portal. Pay using test cards, bKash, Nagad, Rocket, or internet banking.
                </p>

                {/* Logged-in badge — shown only if user is authenticated */}
                {user && (
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                    <span className="text-xs text-emerald-300 font-semibold">
                      Logged in as <span className="text-white">{user.full_name}</span>{' '}
                      <span className="text-emerald-400">({user.email})</span>
                    </span>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-2">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Customer Name</label>
                    <input
                      type="text"
                      value={customerName}
                      onChange={(e) => !user && setCustomerName(e.target.value)}
                      readOnly={!!user}
                      className={`w-full bg-[#0d0b18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white ${user ? 'opacity-70 cursor-not-allowed' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Email</label>
                    <input
                      type="email"
                      value={customerEmail}
                      onChange={(e) => !user && setCustomerEmail(e.target.value)}
                      readOnly={!!user}
                      className={`w-full bg-[#0d0b18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white ${user ? 'opacity-70 cursor-not-allowed' : ''}`}
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Mobile</label>
                    <input
                      type="text"
                      value={customerPhone}
                      onChange={(e) => !user && setCustomerPhone(e.target.value)}
                      readOnly={!!user}
                      className={`w-full bg-[#0d0b18] border border-slate-700 rounded-xl px-3 py-2 text-xs text-white ${user ? 'opacity-70 cursor-not-allowed' : ''}`}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleSSLCommerzRedirect}
                  disabled={loading}
                  className="flex-1 py-3 px-6 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-rose-600 via-purple-600 to-amber-500 hover:from-rose-500 hover:to-amber-400 active:scale-95 transition shadow-lg shadow-rose-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Opening SSLCommerz Gateway...</span>
                  ) : (
                    <>
                      <span>Pay ৳{product.price_bdt} with SSLCommerz</span>
                      <ExternalLink className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            /* Manual TrxID Submission View */
            <form onSubmit={handleManualSubmit} className="space-y-5 animate-in fade-in duration-200">
              {/* NexusPay Memo Type Options */}
              {(method === 'NEXUSPAY_DBBL' || method === 'ROCKET') && (
                <div className="p-4 rounded-2xl bg-[#0d0b18]/80 border border-purple-500/20 space-y-3">
                  <span className="text-xs font-bold text-purple-300 block">
                    Choose NexusPay Slip Format
                  </span>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-800 cursor-pointer hover:border-purple-500/40 transition">
                      <input
                        type="radio"
                        name="memoType"
                        checked={memoType === 'FUND_TRANSFER'}
                        onChange={() => setMemoType('FUND_TRANSFER')}
                        className="accent-purple-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">Fund Transfer Memo</span>
                        <span className="text-[10px] text-slate-400">DBBL to DBBL Account</span>
                      </div>
                    </label>
                    <label className="flex items-center gap-2.5 p-2.5 rounded-xl border border-slate-800 cursor-pointer hover:border-purple-500/40 transition">
                      <input
                        type="radio"
                        name="memoType"
                        checked={memoType === 'BILL_PAYMENT'}
                        onChange={() => setMemoType('BILL_PAYMENT')}
                        className="accent-purple-500"
                      />
                      <div>
                        <span className="text-xs font-bold text-slate-200 block">Bill Payment Memo</span>
                        <span className="text-[10px] text-slate-400">Institutional / University</span>
                      </div>
                    </label>
                  </div>

                  {memoType === 'BILL_PAYMENT' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Biller / Institution Name</label>
                        <input
                          type="text"
                          value={billerName}
                          onChange={(e) => setBillerName(e.target.value)}
                          placeholder="e.g. East West University"
                          className="w-full bg-[#16122b] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] text-slate-400 mb-1">Student / Registration ID</label>
                        <input
                          type="text"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          placeholder="e.g. 2022-1-60-019"
                          className="w-full bg-[#16122b] border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Account Details & Instructions */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Deposit / Transfer To:</span>
                  <span className="font-bold text-amber-400 font-mono text-sm">{activeGuide.accountNo}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Account / Beneficiary:</span>
                  <span className="font-semibold text-slate-200">{activeGuide.accountName}</span>
                </div>
                <p className="text-[11px] text-slate-400 pt-2 border-t border-slate-800 leading-relaxed">
                  💡 {activeGuide.instruction}
                </p>
              </div>

              {/* TrxID Input & Sender Info */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Bank Transaction ID (TrxID) *
                  </label>
                  <input
                    type="text"
                    required
                    value={trxId}
                    onChange={(e) => setTrxId(e.target.value)}
                    placeholder="e.g. LID02082191058 or 9B8A72F6"
                    className="w-full bg-[#0d0b18] border border-slate-700 focus:border-purple-500 rounded-2xl px-4 py-3 text-sm text-white font-mono focus:outline-none transition shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                    Sender Card / Mobile Number (Optional)
                  </label>
                  <input
                    type="text"
                    value={senderAccount}
                    onChange={(e) => setSenderAccount(e.target.value)}
                    placeholder="e.g. 017xxxxxxxx or 9011-XXXX-4581"
                    className="w-full bg-[#0d0b18] border border-slate-700 focus:border-purple-500 rounded-2xl px-4 py-3 text-sm text-white font-mono focus:outline-none transition shadow-inner"
                  />
                </div>
              </div>

              {/* Submit Action */}
              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 py-3 px-6 rounded-xl font-extrabold text-sm text-white bg-gradient-to-r from-purple-600 via-indigo-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 active:scale-95 transition shadow-lg shadow-purple-600/30 disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <span>Generating Memo & Verifying...</span>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Verify Payment & Generate Memo</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
