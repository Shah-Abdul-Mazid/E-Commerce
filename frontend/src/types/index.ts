export type UserRole = 'ADMIN' | 'CUSTOMER'
export type ProductType = 'PACKAGE' | 'SINGLE_TOOL'
export type SubscriptionStatus = 'ACTIVE' | 'EXPIRED' | 'PENDING'
export type PaymentMethod = 'SSLCOMMERZ' | 'BKASH' | 'NAGAD' | 'ROCKET' | 'NEXUSPAY_DBBL'
export type MemoType = 'FUND_TRANSFER' | 'BILL_PAYMENT'
export type TransactionStatus = 'PENDING' | 'VERIFIED' | 'REJECTED'

export interface User {
  id: string
  email: string
  full_name: string
  phone_number?: string
  role: UserRole
  is_active: boolean
}

export interface Product {
  id: string
  title: string
  badge?: string
  description?: string
  product_type: ProductType
  price_bdt: number
  features: string[]
  icon_name?: string
  is_active: boolean
}

export interface TransactionMemo {
  id: string
  transaction_id: string
  memo_type: MemoType
  receiver_name?: string
  receiver_bank?: string
  receiver_account?: string
  sender_card_type?: string
  sender_card_number?: string
  nexus_pay_id?: string
  biller_name?: string
  biller_code?: string
  student_id?: string
  paid_from_channel?: string
  fee_bdt: number
  formatted_timestamp?: string
  raw_reference?: string
}

export interface Transaction {
  id: string
  order_id: string
  user_id: string
  product_id?: string
  product_title?: string
  amount_bdt: number
  payment_method: PaymentMethod
  transaction_id: string
  sender_account?: string
  memo_type: MemoType
  status: TransactionStatus
  created_at: string
  memo?: TransactionMemo
}

export interface Subscription {
  id: string
  product_id: string
  product_title?: string
  start_date: string
  end_date: string
  status: SubscriptionStatus
  access_credentials?: string
  days_remaining?: number
}
