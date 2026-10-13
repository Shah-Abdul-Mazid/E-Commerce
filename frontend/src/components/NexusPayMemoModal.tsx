import React, { useRef } from 'react'
import { Printer, CheckCircle2, ShieldCheck, Building2, CreditCard, School } from 'lucide-react'
import type { TransactionMemo, Transaction } from '../types'

interface Props {
  memo: TransactionMemo
  transaction?: Partial<Transaction>
  onClose?: () => void
}

export const NexusPayMemoModal: React.FC<Props> = ({ memo, transaction, onClose }) => {
  const memoRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    window.print()
  }

  const isFundTransfer = memo.memo_type === 'FUND_TRANSFER'
  const amount = transaction?.amount_bdt || 599.00
  const trxId = transaction?.transaction_id || memo.raw_reference || 'LID02082191058'
  const formattedDate = memo.formatted_timestamp || '13-Oct-2026 12:45:10 PM'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-md my-8 bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Modal Top Actions */}
        <div className="p-4 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              NexusPay Transaction Receipt
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-purple-600/20 text-purple-300 border border-purple-500/30 rounded-lg hover:bg-purple-600/30 transition"
              title="Print Receipt"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / PDF</span>
            </button>
            {onClose && (
              <button
                onClick={onClose}
                className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center text-sm font-bold transition"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Printable NexusPay Memo Paper Container */}
        <div className="p-4 sm:p-6 bg-slate-950 flex justify-center">
          <div
            id="printable-memo"
            ref={memoRef}
            className="w-full max-w-[380px] bg-white text-slate-900 rounded-2xl shadow-xl overflow-hidden font-sans border border-slate-200 select-none"
          >
            {/* DBBL Header Brand Banner */}
            <div className="bg-[#0f2942] text-white pt-5 pb-4 px-5 text-center relative">
              {/* DBBL Tri-Color Top Accent Line */}
              <div className="absolute top-0 left-0 right-0 h-1.5 flex">
                <div className="w-1/3 bg-[#e51a24]"></div>
                <div className="w-1/3 bg-[#0066b2]"></div>
                <div className="w-1/3 bg-[#008738]"></div>
              </div>

              {/* NexusPay Logo Badge */}
              <div className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 mb-2">
                <span className="text-amber-400 font-extrabold text-xs">DBBL</span>
                <span className="text-white font-bold text-xs">NexusPay™</span>
              </div>
              <h3 className="text-base font-bold tracking-tight text-white">
                DUTCH-BANGLA BANK PLC
              </h3>
              <p className="text-[11px] text-slate-300 font-medium">
                {isFundTransfer ? 'Instant Fund Transfer Memo' : 'Institutional Bill Payment Memo'}
              </p>

              {/* Success Checkmark Circle */}
              <div className="mt-3 flex justify-center">
                <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 shadow-md">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600 fill-emerald-100" />
                </div>
              </div>
              <p className="text-xs font-bold text-emerald-400 mt-1 uppercase tracking-wider">
                Transaction Successful
              </p>
              <div className="text-2xl font-black text-white mt-1">
                ৳ {Number(amount).toFixed(2)}
              </div>
            </div>

            {/* Receipt Body Info */}
            <div className="p-5 space-y-4 text-[13px] bg-slate-50/50">
              {isFundTransfer ? (
                /* ================= MODE 1: FUND TRANSFER ================= */
                <>
                  {/* Receiver Information Block */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                      <Building2 className="w-3.5 h-3.5 text-purple-600" />
                      <span>Beneficiary / Receiver Details</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-500">Receiver Name:</span>
                      <span className="font-bold text-slate-900 text-right">{memo.receiver_name || 'SAMJAP MART (MAZID & POPY)'}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-500">Bank:</span>
                      <span className="font-semibold text-slate-800 text-right">{memo.receiver_bank || 'Dutch-Bangla Bank PLC'}</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-500">Account No:</span>
                      <span className="font-mono font-bold text-blue-700 text-right">{memo.receiver_account || '107.110.198425'}</span>
                    </div>
                  </div>

                  {/* Sender & Payment Info Block */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-blue-600" />
                      <span>Payment Channel & Sender</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Card / Method:</span>
                      <span className="font-semibold text-slate-800">{memo.sender_card_type || 'NEXUS DEBIT'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Card Number:</span>
                      <span className="font-mono text-slate-800">{memo.sender_card_number || '9011-XXXX-XXXX-4581'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">NexusPay ID:</span>
                      <span className="font-mono font-semibold text-slate-800">{memo.nexus_pay_id || 'NX-991204'}</span>
                    </div>
                    <div className="flex justify-between border-t border-dashed border-slate-200 pt-1.5">
                      <span className="text-slate-500">Trx ID:</span>
                      <span className="font-mono font-bold text-emerald-700">{trxId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Date & Time:</span>
                      <span className="text-xs font-medium text-slate-600">{formattedDate}</span>
                    </div>
                  </div>
                </>
              ) : (
                /* ================= MODE 2: BILL PAYMENT ================= */
                <>
                  {/* Institutional Bill Information */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                      <School className="w-3.5 h-3.5 text-red-600" />
                      <span>Biller Information</span>
                    </div>
                    <div className="flex justify-between items-start">
                      <span className="text-slate-500">Biller Name:</span>
                      <span className="font-bold text-slate-900 text-right">{memo.biller_name || 'University Tuition & Fees'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Biller Code:</span>
                      <span className="font-mono font-bold text-purple-700">{memo.biller_code || 'DBBL-EDU-8810'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Student / User ID:</span>
                      <span className="font-mono font-bold text-slate-900">{memo.student_id || '2022-1-60-019'}</span>
                    </div>
                  </div>

                  {/* Payment Details */}
                  <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 pb-1.5">
                      <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Payment Breakdown</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Paid From:</span>
                      <span className="font-semibold text-slate-800">{memo.paid_from_channel || 'Rocket / Nexus Card'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Transaction ID:</span>
                      <span className="font-mono font-bold text-emerald-700">{trxId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment Date:</span>
                      <span className="text-xs font-medium text-slate-600">{formattedDate}</span>
                    </div>
                    <div className="flex justify-between border-t border-slate-100 pt-1.5">
                      <span className="text-slate-500">Bill Amount:</span>
                      <span className="font-bold text-slate-900">BDT {Number(amount).toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Service Fee:</span>
                      <span className="font-bold text-emerald-600">BDT 0.00 (FREE)</span>
                    </div>
                  </div>
                </>
              )}

              {/* Total Settlement Box */}
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-blue-900 uppercase block">Total Debited Amount</span>
                  <span className="text-[10px] text-blue-700">All Taxes & Fees Included</span>
                </div>
                <div className="text-right">
                  <span className="text-base font-black text-blue-900">৳ {Number(amount).toFixed(2)}</span>
                </div>
              </div>

              {/* Security Seal & Footer Notice */}
              <div className="text-center pt-2 space-y-1">
                <div className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-500">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Authorized by Dutch-Bangla Bank Core Banking</span>
                </div>
                <p className="text-[10px] text-slate-400">
                  This is a computer-generated transaction memo. No physical signature is required.
                </p>
                <div className="pt-2 flex justify-center">
                  <div className="h-6 w-32 bg-slate-200 rounded flex items-center justify-center font-mono text-[9px] text-slate-500 tracking-widest uppercase">
                    |||||||||||||||||||||
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-3 bg-slate-900 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-[11px] text-slate-400">
            Keep this slip as official proof of payment for your SAMJAP Mart account.
          </p>
          {onClose && (
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white text-xs font-bold transition shadow-lg shadow-emerald-600/30 cursor-pointer whitespace-nowrap"
            >
              View in My Active Tools ➔
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
