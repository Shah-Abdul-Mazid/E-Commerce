import React, { useState } from 'react'
import {
  Clock,
  FileText,
  Key,
  ShieldCheck,
  RefreshCw,
  Sparkles,
} from 'lucide-react'
import type { User, Transaction, Subscription } from '../types'

interface Props {
  user: User
  token: string
  transactions: Transaction[]
  subscriptions: Subscription[]
  allTransactions: Transaction[]
  onRefresh: () => void
  onViewMemo: (trx: Transaction) => void
  onUpdateStatus: (trxId: string, status: string, creds?: string) => void
}

export const DashboardView: React.FC<Props> = ({
  user,
  transactions,
  subscriptions,
  allTransactions,
  onRefresh,
  onViewMemo,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'subs' | 'history' | 'admin'>(
    user.role === 'ADMIN' ? 'admin' : 'subs'
  )
  const [selectedTrxForApproval, setSelectedTrxForApproval] = useState<string | null>(null)
  const [customCreds, setCustomCreds] = useState('')

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Dashboard User Profile Banner */}
      <div className="bg-gradient-to-r from-[#16122b] via-[#211b3d] to-[#16122b] border border-purple-500/20 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div>
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                user.role === 'ADMIN'
                  ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}
            >
              {user.role} ACCESS
            </span>
            <span className="text-xs text-slate-400 font-mono">{user.email}</span>
          </div>
          <h2 className="text-2xl font-black text-white flex items-center gap-2">
            <span>Hello, {user.full_name}</span>
            <span className="text-rose-500 animate-pulse">❤️</span>
          </h2>
          <p className="text-xs text-rose-200/80 mt-1">
            Welcome to SAMJAP Mart — Shah Abdul Mazid Loves Jannat Farhana Popy. Manage your AI subscriptions and Dutch-Bangla Bank memos.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-xs font-bold text-slate-200 transition shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-4">
        <button
          onClick={() => setActiveTab('subs')}
          className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'subs'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <Key className="w-4 h-4" />
          <span>My Active Tools ({subscriptions.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
            activeTab === 'history'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Payment History & Memos ({transactions.length})</span>
        </button>
        {user.role === 'ADMIN' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 ${
              activeTab === 'admin'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Admin Control Panel ({allTransactions.length})</span>
          </button>
        )}
      </div>

      {/* Tab 1: Subscriptions */}
      {activeTab === 'subs' && (
        <div className="space-y-4">
          {subscriptions.length === 0 ? (
            <div className="p-12 text-center bg-[#16122b]/50 border border-slate-800 rounded-3xl">
              <Sparkles className="w-12 h-12 text-purple-500/40 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white">No active subscriptions found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Choose a plan from our marketplace above. As soon as payment is confirmed, your tool login details will appear here.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {subscriptions.map((sub) => (
                <div
                  key={sub.id}
                  className="bg-[#16122b] border border-purple-500/20 rounded-2xl p-6 space-y-4 shadow-lg hover:border-purple-500/40 transition"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {sub.status}
                      </span>
                      <h4 className="text-lg font-black text-white mt-1">
                        {sub.product_title || 'AI Tool Bundle'}
                      </h4>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] text-slate-400 block">Remaining</span>
                      <span className="text-sm font-bold text-amber-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {sub.days_remaining} Days
                      </span>
                    </div>
                  </div>

                  {/* Credentials / Access info */}
                  <div className="bg-[#0d0b18] border border-slate-800 rounded-xl p-3.5 text-xs font-mono text-purple-300 whitespace-pre-line leading-relaxed">
                    {sub.access_credentials ||
                      'Access Key: Pending manual verification by admin.'}
                  </div>

                  <div className="text-[11px] text-slate-500 flex justify-between">
                    <span>Valid until: {new Date(sub.end_date).toLocaleDateString()}</span>
                    <span className="text-emerald-400 font-semibold">24/7 Cookie Sync Active</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: User Transaction History & Memos */}
      {activeTab === 'history' && (
        <div className="bg-[#16122b] border border-purple-500/20 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Recorded Orders & NexusPay Memos
            </h4>
            <span className="text-xs text-slate-400">Total Orders: {transactions.length}</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0d0b18] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Item</th>
                  <th className="p-4">Method & TrxID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">NexusPay Memo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-purple-950/20 transition">
                      <td className="p-4 font-mono font-bold text-slate-300">{trx.order_id}</td>
                      <td className="p-4 font-semibold text-white">{trx.product_title || 'Marketplace Item'}</td>
                      <td className="p-4">
                        <span className="font-bold text-purple-400 block">{trx.payment_method}</span>
                        <span className="font-mono text-slate-400 text-[11px]">{trx.transaction_id}</span>
                      </td>
                      <td className="p-4 font-black text-amber-400">৳ {trx.amount_bdt}</td>
                      <td className="p-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            trx.status === 'VERIFIED'
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : trx.status === 'REJECTED'
                              ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                              : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                          }`}
                        >
                          {trx.status}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button
                          onClick={() => onViewMemo(trx)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-bold transition inline-flex items-center gap-1.5"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View DBBL Slip</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Admin Control Panel */}
      {activeTab === 'admin' && user.role === 'ADMIN' && (
        <div className="bg-[#16122b] border border-amber-500/30 rounded-3xl overflow-hidden shadow-2xl space-y-6">
          <div className="p-6 bg-gradient-to-r from-amber-950/40 to-[#16122b] border-b border-amber-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-[10px] font-bold tracking-widest text-amber-400 uppercase">
                Admin Master Control
              </span>
              <h4 className="text-xl font-extrabold text-white">
                Pending Transactions Verification & Credential Auto-Issuance
              </h4>
            </div>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-full text-xs font-bold">
              {allTransactions.filter((t) => t.status === 'PENDING').length} Pending Review
            </span>
          </div>

          <div className="overflow-x-auto px-6 pb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0d0b18] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Order / User</th>
                  <th className="p-3">Method</th>
                  <th className="p-3">Submitted TrxID</th>
                  <th className="p-3">Amount</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {allTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-amber-950/10 transition">
                    <td className="p-3">
                      <span className="font-mono font-bold text-white block">{trx.order_id}</span>
                      <span className="text-slate-400 text-[11px]">{trx.product_title || 'Item'}</span>
                    </td>
                    <td className="p-3 font-semibold text-purple-400">{trx.payment_method}</td>
                    <td className="p-3 font-mono font-bold text-emerald-400">{trx.transaction_id}</td>
                    <td className="p-3 font-black text-amber-400">৳ {trx.amount_bdt}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          trx.status === 'VERIFIED'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : trx.status === 'REJECTED'
                            ? 'bg-rose-500/20 text-rose-400'
                            : 'bg-amber-500/20 text-amber-400'
                        }`}
                      >
                        {trx.status}
                      </span>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => onViewMemo(trx)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
                        title="Inspect generated slip"
                      >
                        Slip
                      </button>

                      {trx.status === 'PENDING' && (
                        <>
                          <button
                            onClick={() => {
                              setSelectedTrxForApproval(trx.id)
                              setCustomCreds(
                                `Portal: https://cloud.softmart.it\nAccount Key: SM-${trx.order_id}\nExpires: 30 Days`
                              )
                            }}
                            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onUpdateStatus(trx.id, 'REJECTED')}
                            className="px-3 py-1 rounded bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-bold"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Quick Credential Modal for Admin Approval */}
          {selectedTrxForApproval && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="w-full max-w-md bg-[#16122b] border border-emerald-500/30 rounded-3xl p-6 space-y-4">
                <h4 className="text-base font-bold text-white">
                  Approve Transaction & Issue Credentials
                </h4>
                <p className="text-xs text-slate-400">
                  Provide custom login credentials for this customer or accept the auto-generated VIP portal token:
                </p>
                <textarea
                  rows={4}
                  value={customCreds}
                  onChange={(e) => setCustomCreds(e.target.value)}
                  className="w-full bg-[#0d0b18] border border-slate-700 rounded-xl p-3 text-xs font-mono text-purple-300 focus:outline-none focus:border-emerald-500"
                ></textarea>
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => setSelectedTrxForApproval(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      onUpdateStatus(selectedTrxForApproval, 'VERIFIED', customCreds)
                      setSelectedTrxForApproval(null)
                    }}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                  >
                    Confirm & Issue Access
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
