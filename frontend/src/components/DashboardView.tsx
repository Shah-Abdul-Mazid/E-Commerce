import React, { useState, useEffect } from 'react'
import {
  Clock,
  FileText,
  Key,
  ShieldCheck,
  RefreshCw,
  Sparkles,
  Package,
  Plus,
  Edit,
  Trash2,
  Search,
  AlertCircle,
  DollarSign,
  Layers,
  BookOpen,
  Zap,
  Crown,
} from 'lucide-react'
import type { User, Transaction, Subscription, Product, ProductType } from '../types'

interface Props {
  user: User
  token: string
  transactions: Transaction[]
  subscriptions: Subscription[]
  allTransactions: Transaction[]
  products?: Product[]
  onRefresh: () => void
  onRefreshProducts?: () => void
  onViewMemo: (trx: Transaction) => void
  onUpdateStatus: (trxId: string, status: string, creds?: string) => void
}

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || ''

export const DashboardView: React.FC<Props> = ({
  user,
  token,
  transactions,
  subscriptions,
  allTransactions,
  products = [],
  onRefresh,
  onRefreshProducts,
  onViewMemo,
  onUpdateStatus,
}) => {
  const [activeTab, setActiveTab] = useState<'subs' | 'history' | 'admin' | 'products'>(
    user.role === 'ADMIN' ? 'products' : 'subs'
  )
  const [selectedTrxForApproval, setSelectedTrxForApproval] = useState<string | null>(null)
  const [customCreds, setCustomCreds] = useState('')

  // Product Management State
  const [localProducts, setLocalProducts] = useState<Product[]>(products)
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'PACKAGE' | 'SINGLE_TOOL'>('ALL')

  // Edit / Add Modal State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [formTitle, setFormTitle] = useState('')
  const [formType, setFormType] = useState<ProductType>('PACKAGE')
  const [formPrice, setFormPrice] = useState<number>(299)
  const [formBadge, setFormBadge] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formFeatures, setFormFeatures] = useState('')
  const [formIcon, setFormIcon] = useState('Zap')
  const [formIsActive, setFormIsActive] = useState(true)
  const [formLoading, setFormLoading] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  // Quick Price Edit State
  const [quickPriceProduct, setQuickPriceProduct] = useState<Product | null>(null)
  const [quickPriceValue, setQuickPriceValue] = useState<number>(0)
  const [quickPriceLoading, setQuickPriceLoading] = useState(false)

  // Delete Confirmation State
  const [deletingProduct, setDeletingProduct] = useState<Product | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // Sync when parent products change
  useEffect(() => {
    if (products && products.length > 0) {
      setLocalProducts(products)
    }
  }, [products])

  const renderProductIcon = (iconName?: string) => {
    switch (iconName) {
      case 'Crown':
        return <Crown className="w-5 h-5 text-amber-400" />
      case 'Sparkles':
        return <Sparkles className="w-5 h-5 text-purple-400" />
      case 'BookOpen':
        return <BookOpen className="w-5 h-5 text-blue-400" />
      case 'Layers':
        return <Layers className="w-5 h-5 text-indigo-400" />
      case 'Zap':
      default:
        return <Zap className="w-5 h-5 text-emerald-400" />
    }
  }

  const handleOpenCreateModal = () => {
    if (user.role !== 'ADMIN') return
    setEditingProduct(null)
    setFormTitle('')
    setFormType('PACKAGE')
    setFormPrice(299)
    setFormBadge('')
    setFormDescription('')
    setFormFeatures('')
    setFormIcon('Zap')
    setFormIsActive(true)
    setFormError(null)
    setIsEditModalOpen(true)
  }

  const handleOpenEditModal = (p: Product) => {
    if (user.role !== 'ADMIN') return
    setEditingProduct(p)
    setFormTitle(p.title)
    setFormType(p.product_type)
    setFormPrice(p.price_bdt)
    setFormBadge(p.badge || '')
    setFormDescription(p.description || '')
    setFormFeatures((p.features || []).join('\n'))
    setFormIcon(p.icon_name || 'Zap')
    setFormIsActive(p.is_active ?? true)
    setFormError(null)
    setIsEditModalOpen(true)
  }

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault()
    if (user.role !== 'ADMIN') return
    setFormLoading(true)
    setFormError(null)

    const featureList = formFeatures
      .split('\n')
      .map((f) => f.trim())
      .filter((f) => f.length > 0)

    const payload = {
      title: formTitle.trim(),
      badge: formBadge.trim() || undefined,
      description: formDescription.trim() || undefined,
      product_type: formType,
      price_bdt: Number(formPrice),
      features: featureList,
      icon_name: formIcon,
      is_active: formIsActive,
    }

    try {
      if (editingProduct) {
        let res = await fetch(`${BACKEND_URL}/api/v1/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        // If product was a static client item not yet saved in DB, auto-create it
        if (res.status === 404) {
          res = await fetch(`${BACKEND_URL}/api/v1/products`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(payload),
          })
        }

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.detail || 'Failed to update product')
        }

        const updatedData = await res.json()
        setLocalProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? { ...p, ...updatedData } : p))
        )
      } else {
        const res = await fetch(`${BACKEND_URL}/api/v1/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        })

        if (!res.ok) {
          const errData = await res.json()
          throw new Error(errData.detail || 'Failed to create product')
        }

        const newProd = await res.json()
        setLocalProducts((prev) => [newProd, ...prev])
      }

      setIsEditModalOpen(false)
      onRefreshProducts?.()
    } catch (err: any) {
      setFormError(err.message || 'Operation failed')
    } finally {
      setFormLoading(false)
    }
  }

  const handleQuickPriceUpdate = async () => {
    if (user.role !== 'ADMIN') return
    if (!quickPriceProduct) return
    setQuickPriceLoading(true)

    try {
      let res = await fetch(`${BACKEND_URL}/api/v1/products/${quickPriceProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ price_bdt: Number(quickPriceValue) }),
      })

      if (res.status === 404) {
        res = await fetch(`${BACKEND_URL}/api/v1/products`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: quickPriceProduct.title,
            badge: quickPriceProduct.badge,
            description: quickPriceProduct.description,
            product_type: quickPriceProduct.product_type,
            price_bdt: Number(quickPriceValue),
            features: quickPriceProduct.features,
            icon_name: quickPriceProduct.icon_name || 'Zap',
          }),
        })
      }

      if (!res.ok) {
        const errData = await res.json()
        throw new Error(errData.detail || 'Failed to update price')
      }

      setLocalProducts((prev) =>
        prev.map((p) =>
          p.id === quickPriceProduct.id ? { ...p, price_bdt: Number(quickPriceValue) } : p
        )
      )
      setQuickPriceProduct(null)
      onRefreshProducts?.()
    } catch (err: any) {
      alert(err.message || 'Could not update price')
    } finally {
      setQuickPriceLoading(false)
    }
  }

  const handleDeleteProduct = async () => {
    if (user.role !== 'ADMIN') return
    if (!deletingProduct) return
    setDeleteLoading(true)

    try {
      await fetch(`${BACKEND_URL}/api/v1/products/${deletingProduct.id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      setLocalProducts((prev) => prev.filter((p) => p.id !== deletingProduct.id))
      setDeletingProduct(null)
      onRefreshProducts?.()
    } catch (err: any) {
      alert(err.message || 'Could not delete product')
    } finally {
      setDeleteLoading(false)
    }
  }

  const filteredProducts = localProducts.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.badge && p.badge.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()))

    const matchesCategory =
      typeFilter === 'ALL' || p.product_type === typeFilter

    return matchesSearch && matchesCategory
  })

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
            Welcome to EZOPY MART TECH. Manage your AI subscriptions, transactions, and product catalog.
          </p>
        </div>

        <button
          onClick={onRefresh}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-purple-500 text-xs font-bold text-slate-200 transition shadow-md cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5 text-purple-400" />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-slate-800 gap-4 overflow-x-auto pb-1">
        {user.role === 'ADMIN' && (
          <button
            onClick={() => setActiveTab('products')}
            className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer flex-shrink-0 ${
              activeTab === 'products'
                ? 'border-purple-500 text-purple-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Package className="w-4 h-4 text-purple-400" />
            <span>Manage Products & Prices ({localProducts.length})</span>
          </button>
        )}

        {user.role === 'ADMIN' && (
          <button
            onClick={() => setActiveTab('admin')}
            className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer flex-shrink-0 ${
              activeTab === 'admin'
                ? 'border-amber-500 text-amber-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Transactions Review ({allTransactions.length})</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('subs')}
          className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer flex-shrink-0 ${
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
          className={`pb-3 text-xs font-bold transition flex items-center gap-2 border-b-2 cursor-pointer flex-shrink-0 ${
            activeTab === 'history'
              ? 'border-purple-500 text-purple-400'
              : 'border-transparent text-slate-400 hover:text-slate-200'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Payment History & Memos ({transactions.length})</span>
        </button>
      </div>

      {/* Tab 4: ADMIN PRODUCT MANAGEMENT */}
      {activeTab === 'products' && user.role === 'ADMIN' && (
        <div className="bg-[#16122b] border border-purple-500/30 rounded-3xl overflow-hidden shadow-2xl space-y-6">
          {/* Header & Create Button */}
          <div className="p-6 bg-gradient-to-r from-purple-950/40 via-[#16122b] to-purple-950/20 border-b border-purple-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[10px] font-bold tracking-widest text-purple-400 uppercase">
                  Catalog & Price Controller
                </span>
                <span className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 text-[10px] font-extrabold border border-purple-500/30">
                  {localProducts.length} Items
                </span>
              </div>
              <h4 className="text-xl font-extrabold text-white">
                Live Store Products, Courses & Pricing
              </h4>
              <p className="text-xs text-slate-400 mt-0.5">
                Add, edit, adjust prices, or remove products. Changes immediately take effect across the entire store.
              </p>
            </div>

            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-purple-600/30 transition cursor-pointer flex-shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Product / Course</span>
            </button>
          </div>

          {/* Search & Category Filter Bar */}
          <div className="px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by title, code or badge..."
                className="w-full bg-[#0d0b18] border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
              />
            </div>

            <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              <button
                onClick={() => setTypeFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                  typeFilter === 'ALL'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                All ({localProducts.length})
              </button>
              <button
                onClick={() => setTypeFilter('PACKAGE')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                  typeFilter === 'PACKAGE'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                AI Bundles ({localProducts.filter((p) => p.product_type === 'PACKAGE').length})
              </button>
              <button
                onClick={() => setTypeFilter('SINGLE_TOOL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer flex-shrink-0 ${
                  typeFilter === 'SINGLE_TOOL'
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                Single Tools & Courses ({localProducts.filter((p) => p.product_type === 'SINGLE_TOOL').length})
              </button>
            </div>
          </div>

          {/* Products Table */}
          <div className="overflow-x-auto px-6 pb-6">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0d0b18] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-3">Product / Course</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Price (BDT)</th>
                  <th className="p-3">Features & Highlights</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right">Admin Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filteredProducts.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-slate-500">
                      No products match your search or filter criteria.
                    </td>
                  </tr>
                ) : (
                  filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-purple-950/15 transition">
                      <td className="p-3">
                        <div className="flex items-start gap-3">
                          <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0">
                            {renderProductIcon(p.icon_name)}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-extrabold text-white text-sm">
                                {p.title}
                              </span>
                              {p.badge && (
                                <span className="px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-purple-500/20 text-purple-300 border border-purple-500/30">
                                  {p.badge}
                                </span>
                              )}
                            </div>
                            {p.description && (
                              <p className="text-slate-400 text-[11px] line-clamp-1 mt-0.5 max-w-md">
                                {p.description}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                            p.product_type === 'PACKAGE'
                              ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30'
                              : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30'
                          }`}
                        >
                          {p.product_type === 'PACKAGE' ? 'AI Bundle' : 'Single Item'}
                        </span>
                      </td>

                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-amber-400 text-sm">
                            ৳ {p.price_bdt}
                          </span>
                          <button
                            onClick={() => {
                              setQuickPriceProduct(p)
                              setQuickPriceValue(p.price_bdt)
                            }}
                            className="p-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
                            title="Quick edit price"
                          >
                            <DollarSign className="w-3 h-3 text-amber-400" />
                          </button>
                        </div>
                      </td>

                      <td className="p-3">
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {p.features && p.features.slice(0, 2).map((feat, i) => (
                            <span
                              key={i}
                              className="px-2 py-0.5 bg-slate-800/80 text-slate-300 rounded text-[10px] truncate max-w-[150px]"
                            >
                              • {feat}
                            </span>
                          ))}
                          {p.features && p.features.length > 2 && (
                            <span className="text-[10px] text-slate-500 font-bold self-center">
                              +{p.features.length - 2} more
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="p-3">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            p.is_active !== false
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          }`}
                        >
                          {p.is_active !== false ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      <td className="p-3 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditModal(p)}
                            className="px-2.5 py-1.5 rounded-lg bg-purple-600/30 hover:bg-purple-600 text-purple-200 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Edit className="w-3.5 h-3.5" />
                            <span>Edit</span>
                          </button>

                          <button
                            onClick={() => setDeletingProduct(p)}
                            className="px-2.5 py-1.5 rounded-lg bg-rose-600/20 hover:bg-rose-600 text-rose-300 hover:text-white font-bold text-xs flex items-center gap-1.5 transition cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Delete</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Tab 3: Admin Control Panel (Transactions Review) */}
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
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold cursor-pointer"
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
                                `Provider: EZOPY MART TECH\nAccount Key: EZ-${trx.order_id}\nExpires: 30 Days`
                              )
                            }}
                            className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => onUpdateStatus(trx.id, 'REJECTED')}
                            className="px-3 py-1 rounded bg-rose-600/30 hover:bg-rose-600 text-rose-300 hover:text-white font-bold cursor-pointer"
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
        </div>
      )}

      {/* Tab 1: Subscriptions */}
      {activeTab === 'subs' && (
        <div className="space-y-4">
          {subscriptions.length === 0 ? (
            <div className="p-12 text-center bg-[#16122b]/50 border border-slate-800 rounded-3xl">
              <Sparkles className="w-12 h-12 text-purple-500/40 mx-auto mb-3" />
              <h4 className="text-base font-bold text-white">No active subscriptions found</h4>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Choose a plan or course from our marketplace above. As soon as payment is confirmed, your access credentials will appear here.
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
                    <span className="text-xs font-mono text-purple-400 font-bold bg-purple-900/30 px-2.5 py-1 rounded-lg border border-purple-500/30">
                      {sub.days_remaining} Days Left
                    </span>
                  </div>

                  <div className="bg-[#0d0b18] border border-slate-800 rounded-xl p-4 space-y-2">
                    <span className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
                      <Key className="w-3 h-3 text-purple-400" />
                      Access Credentials & License
                    </span>
                    <pre className="text-xs font-mono text-emerald-300 whitespace-pre-wrap break-all">
                      {sub.access_credentials || 'Auto-Provisioning in progress...'}
                    </pre>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/60">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-500" />
                      Started: {new Date(sub.start_date).toLocaleDateString()}
                    </span>
                    <span>Expires: {new Date(sub.end_date).toLocaleDateString()}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Transaction History */}
      {activeTab === 'history' && (
        <div className="bg-[#16122b] border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
          <div className="p-6 border-b border-slate-800">
            <h4 className="text-base font-bold text-white">Your Orders & NexusPay Payment Slips</h4>
            <p className="text-xs text-slate-400 mt-0.5">
              View official transaction records, invoice receipts, and generated DBBL payment slips.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#0d0b18] text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="p-4">Order ID</th>
                  <th className="p-4">Item</th>
                  <th className="p-4">Channel</th>
                  <th className="p-4">Trx ID</th>
                  <th className="p-4">Amount</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Official Slip</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-slate-500">
                      No transactions recorded yet.
                    </td>
                  </tr>
                ) : (
                  transactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-slate-900/50 transition">
                      <td className="p-4 font-mono font-bold text-white">{trx.order_id}</td>
                      <td className="p-4">{trx.product_title || 'Subscription'}</td>
                      <td className="p-4 font-semibold text-purple-400">{trx.payment_method}</td>
                      <td className="p-4 font-mono text-emerald-400 font-bold">{trx.transaction_id}</td>
                      <td className="p-4 font-black text-white">৳ {trx.amount_bdt}</td>
                      <td className="p-4">
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
                      <td className="p-4 text-right">
                        <button
                          onClick={() => onViewMemo(trx)}
                          className="px-3 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600 text-purple-300 hover:text-white transition font-bold text-xs inline-flex items-center gap-1 cursor-pointer"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span>View Slip</span>
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

      {/* MODAL 1: ADD / EDIT PRODUCT (ADMIN ONLY) */}
      {isEditModalOpen && user.role === 'ADMIN' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="relative w-full max-w-lg bg-[#16122b] border border-purple-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-white">
                    {editingProduct ? 'Edit Product & Price' : 'Add New Product / Course'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    {editingProduct
                      ? `Updating item ID: ${editingProduct.id.slice(0, 12)}...`
                      : 'Create a new course or AI tool package'}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="w-8 h-8 rounded-lg bg-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
              >
                ✕
              </button>
            </div>

            {formError && (
              <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Product / Course Title *
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. CSE103 Structured Programming or ChatGPT Plus VIP"
                  className="w-full bg-[#0d0b18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category / Type *
                  </label>
                  <select
                    value={formType}
                    onChange={(e) => setFormType(e.target.value as ProductType)}
                    className="w-full bg-[#0d0b18] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="PACKAGE">AI Bundle / Course Pass (PACKAGE)</option>
                    <option value="SINGLE_TOOL">Single Tool / Academic Course (SINGLE_TOOL)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Price (BDT ৳) *
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    step={1}
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full bg-[#0d0b18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Badge / Tag (Optional)
                  </label>
                  <input
                    type="text"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    placeholder="e.g. MOST POPULAR, CORE, 50% OFF"
                    className="w-full bg-[#0d0b18] border border-slate-700 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Icon Style
                  </label>
                  <select
                    value={formIcon}
                    onChange={(e) => setFormIcon(e.target.value)}
                    className="w-full bg-[#0d0b18] border border-slate-700 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
                  >
                    <option value="Zap">Zap (Lightning / Speed)</option>
                    <option value="Crown">Crown (VIP / Master)</option>
                    <option value="Sparkles">Sparkles (AI & Generators)</option>
                    <option value="BookOpen">BookOpen (Curriculum / Academic)</option>
                    <option value="Layers">Layers (Bundles & Suites)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Short description of this product or course..."
                  className="w-full bg-[#0d0b18] border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Features & Highlights (One per line)
                </label>
                <textarea
                  rows={4}
                  value={formFeatures}
                  onChange={(e) => setFormFeatures(e.target.value)}
                  placeholder="ChatGPT Plus (GPT-4o Access)&#10;Turnitin Plagiarism Check&#10;24/7 Verified Support"
                  className="w-full bg-[#0d0b18] border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 font-mono"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="formIsActiveCheck"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-purple-600 focus:ring-purple-500 bg-slate-900 border-slate-700 cursor-pointer"
                />
                <label htmlFor="formIsActiveCheck" className="text-xs text-slate-300 font-semibold cursor-pointer">
                  Item is active and immediately visible to customers
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold transition shadow-lg shadow-purple-600/30 cursor-pointer disabled:opacity-50"
                >
                  {formLoading ? 'Saving...' : editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: QUICK PRICE EDIT (ADMIN ONLY) */}
      {quickPriceProduct && user.role === 'ADMIN' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#16122b] border border-amber-500/30 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Adjust Price</h4>
                  <p className="text-[11px] text-slate-400 truncate max-w-[200px]">
                    {quickPriceProduct.title}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setQuickPriceProduct(null)}
                className="text-slate-400 hover:text-white text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                New Price in BDT (৳)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-amber-400 font-bold text-sm">৳</span>
                <input
                  type="number"
                  min={0}
                  step={1}
                  value={quickPriceValue}
                  onChange={(e) => setQuickPriceValue(Number(e.target.value))}
                  className="w-full bg-[#0d0b18] border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white font-extrabold focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setQuickPriceProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleQuickPriceUpdate}
                disabled={quickPriceLoading}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold cursor-pointer disabled:opacity-50"
              >
                {quickPriceLoading ? 'Updating...' : 'Update Price'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE CONFIRMATION (ADMIN ONLY) */}
      {deletingProduct && user.role === 'ADMIN' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-sm bg-[#16122b] border border-rose-500/40 rounded-3xl p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-rose-600/20 text-rose-400 border border-rose-500/30">
                <Trash2 className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-black text-white">Delete Product?</h4>
                <p className="text-xs text-rose-300">This action cannot be undone.</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 bg-[#0d0b18] p-3 rounded-xl border border-slate-800">
              Are you sure you want to remove <span className="font-bold text-white">"{deletingProduct.title}"</span> from the store catalog?
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setDeletingProduct(null)}
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteProduct}
                disabled={deleteLoading}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold transition shadow-lg shadow-rose-600/30 cursor-pointer disabled:opacity-50"
              >
                {deleteLoading ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: TRANSACTION APPROVAL CREDENTIALS */}
      {selectedTrxForApproval && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md bg-[#16122b] border border-emerald-500/30 rounded-3xl p-6 space-y-4 shadow-2xl">
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
                className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onUpdateStatus(selectedTrxForApproval, 'VERIFIED', customCreds)
                  setSelectedTrxForApproval(null)
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold cursor-pointer"
              >
                Confirm & Issue Access
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
