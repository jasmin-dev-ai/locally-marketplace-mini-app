import React, { useState, useEffect } from 'react'
import { useTelegram } from '../context/TelegramContext'
import { useLanguage } from '../context/LanguageContext'
import { Badge } from '../components/common/Badge'
import { Button } from '../components/common/Button'
import {
  isAdminUser,
  isDevAdminOverride,
  setDevAdminOverride,
  getAdminOrders,
  updateOrderStatus,
  getAdminProducts,
  toggleProductStock,
  addAdminProduct,
  computeAdminMetrics,
  AdminMetrics,
  getVendorApplications,
  updateVendorApplicationStatus,
  VendorApplication,
} from '../services/adminService'
import { Order, OrderStatus, Product } from '../types'
import { triggerHaptic } from '../utils/telegram'
import {
  Package,
  Tag,
  Store,
  BarChart3,
  CheckCircle2,
  XCircle,
  Clock,
  ShieldCheck,
  User,
  Phone,
  Truck,
  TrendingUp,
  Plus,
  X,
} from 'lucide-react'

interface AdminDashboardProps {
  onClose: () => void
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onClose }) => {
  const { user: tgUser, haptic } = useTelegram()
  const { t, getLocalizedProduct } = useLanguage()

  // State
  const [isAdmin, setIsAdmin] = useState<boolean>(() => isAdminUser(tgUser))
  const [devOverride, setDevOverride] = useState<boolean>(() => isDevAdminOverride())
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'applications' | 'analytics'>('orders')
  const [orderFilter, setOrderFilter] = useState<'all' | 'active' | 'completed'>('all')
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all')

  const [orders, setOrders] = useState<Order[]>(() => getAdminOrders())
  const [products, setProducts] = useState<Product[]>(() => getAdminProducts())
  const [applications, setApplications] = useState<VendorApplication[]>(() => getVendorApplications())
  const [metrics, setMetrics] = useState<AdminMetrics>(() => computeAdminMetrics())
  const [toastMessage, setToastMessage] = useState<string | null>(null)

  // New product form modal state
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newPrice, setNewPrice] = useState('')
  const [newCategory, setNewCategory] = useState<'bakery' | 'national' | 'sweets' | 'crafts' | 'dairy'>('bakery')
  const [newSellerName, setNewSellerName] = useState('Samarkand Bakery Hub')

  // Re-verify authorization when user changes
  useEffect(() => {
    setIsAdmin(isAdminUser(tgUser))
  }, [tgUser, devOverride])

  const showToast = (msg: string) => {
    setToastMessage(msg)
    setTimeout(() => setToastMessage(null), 3000)
  }

  const handleStatusChange = (orderId: string, nextStatus: OrderStatus) => {
    haptic.impact('medium')
    const updated = updateOrderStatus(orderId, nextStatus)
    setOrders(updated)
    setMetrics(computeAdminMetrics())
    const statusText = t.admin.orderStatuses[nextStatus] || nextStatus
    showToast(`${t.admin.orders.statusUpdated}: #${orderId} ➔ ${statusText}`)
  }

  const handleToggleStock = (productId: string) => {
    haptic.selection()
    const updated = toggleProductStock(productId)
    setProducts(updated)
    setMetrics(computeAdminMetrics())
  }

  const handleApproveApplication = (appId: string) => {
    haptic.notification('success')
    const updated = updateVendorApplicationStatus(appId, 'approved')
    setApplications(updated)
    setProducts(getAdminProducts())
    setMetrics(computeAdminMetrics())
    showToast(t.admin.applications.approvedSuccess)
  }

  const handleRejectApplication = (appId: string) => {
    haptic.impact('medium')
    const updated = updateVendorApplicationStatus(appId, 'rejected', 'Hujjatlar to‘liq emas')
    setApplications(updated)
    setMetrics(computeAdminMetrics())
    showToast(t.admin.applications.rejectedNotice)
  }

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newPrice.trim()) return

    const parsedPrice = parseInt(newPrice.replace(/\D/g, ''), 10) || 35000

    const newProd: Omit<Product, 'id'> = {
      title: newTitle.trim(),
      description: 'Artisanal local delicacy crafted with natural ingredients.',
      price: parsedPrice,
      category: newCategory,
      categoryId: newCategory,
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      rating: 5.0,
      reviewsCount: 1,
      seller: {
        id: 'seller-new',
        name: newSellerName,
        rating: 5.0,
        reviewsCount: 1,
        location: 'Tashkent',
        isVerified: true,
      },
      prepTime: '30 mins',
      inStock: true,
      tags: ['halal', 'freshDaily'],
    }

    const updated = addAdminProduct(newProd)
    setProducts(updated)
    setMetrics(computeAdminMetrics())
    setIsAddProductOpen(false)
    setNewTitle('')
    setNewPrice('')
    haptic.notification('success')
    showToast(t.admin.products.productAdded)
  }

  const handleDevOverrideToggle = () => {
    const next = !devOverride
    setDevAdminOverride(next)
    setDevOverride(next)
    setIsAdmin(next || isAdminUser(tgUser))
    triggerHaptic('medium')
  }

  // ───────────────────────────────────────────────────────────────────────────
  // ORDER STATUS BADGE STYLING
  // ───────────────────────────────────────────────────────────────────────────
  const getOrderStatusBadge = (s: OrderStatus) => {
    switch (s) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#FAF0DC] text-[#B87A00] border border-[#E5A118]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5A118]" />
            <span>{t.admin.orderStatuses.confirmed}</span>
          </span>
        )
      case 'preparing':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#FDF0EB] text-[#C85A32] border border-[#C85A32]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32] animate-pulse" />
            <span>{t.admin.orderStatuses.preparing}</span>
          </span>
        )
      case 'delivering':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#EBF3FB] text-[#2B6CB0] border border-[#3182CE]/30">
            <Truck className="w-3 h-3 text-[#2B6CB0]" />
            <span>{t.admin.orderStatuses.delivering}</span>
          </span>
        )
      case 'completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#EDF7ED] text-[#2E7D32] border border-[#4CAF50]/30">
            <CheckCircle2 className="w-3 h-3 text-[#2E7D32]" />
            <span>{t.admin.orderStatuses.completed}</span>
          </span>
        )
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#EFE9E1] text-[#9B887F] border border-[#E6DED5]">
            <XCircle className="w-3 h-3 text-[#9B887F]" />
            <span>{t.admin.orderStatuses.cancelled}</span>
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold bg-[#EFE9E1] text-[#6F574E]">
            {s}
          </span>
        )
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // APPLICATION STATUS BADGE STYLING
  // ───────────────────────────────────────────────────────────────────────────
  const getAppStatusBadge = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#FAF0DC] text-[#B87A00] border border-[#E5A118]/30">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E5A118] animate-pulse" />
            <span>{t.admin.applicationStatuses.pending}</span>
          </span>
        )
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#EDF7ED] text-[#2E7D32] border border-[#4CAF50]/30">
            <CheckCircle2 className="w-3 h-3 text-[#2E7D32]" />
            <span>{t.admin.applicationStatuses.approved}</span>
          </span>
        )
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-[#EFE9E1] text-[#9B887F] border border-[#E6DED5]">
            <XCircle className="w-3 h-3 text-[#9B887F]" />
            <span>{t.admin.applicationStatuses.rejected}</span>
          </span>
        )
    }
  }

  // ───────────────────────────────────────────────────────────────────────────
  // ACCESS DENIED VIEW
  // ───────────────────────────────────────────────────────────────────────────
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-[#FAF6F0] flex flex-col justify-between p-6">
        <div className="pt-12 text-center space-y-4">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-[#C85A32]/10 border-2 border-[#C85A32]/30 flex items-center justify-center text-4xl shadow-sm">
            <ShieldCheck className="w-10 h-10 text-[#C85A32]" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-black text-[#3B2219] font-['Manrope']">
              {t.admin.accessDeniedTitle}
            </h1>
            <p className="text-xs text-[#6F574E] max-w-xs mx-auto leading-relaxed">
              {t.admin.accessDeniedDesc}
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-[#FFFDF9] border border-[#E6DED5] text-left text-xs space-y-2 max-w-sm mx-auto shadow-xs">
            <div className="flex items-center justify-between text-[#6F574E]">
              <span>{t.admin.security.telegramUser}:</span>
              <span className="font-bold text-[#3B2219]">
                {tgUser?.username ? `@${tgUser.username}` : (tgUser?.first_name || 'Anonymous')}
              </span>
            </div>
            <div className="flex items-center justify-between text-[#6F574E]">
              <span>{t.admin.security.telegramId}:</span>
              <span className="font-mono font-bold text-[#3B2219]">
                {tgUser?.id || t.admin.security.browserPreview}
              </span>
            </div>
            <div className="pt-2 border-t border-[#EFE9E1] text-[11px] text-[#9B887F] flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
              <span>{t.admin.security.whitelistNotice}</span>
            </div>
          </div>
        </div>

        <div className="space-y-3 pb-8">
          <Button variant="accent" size="lg" fullWidth onClick={onClose}>
            {t.admin.backToApp}
          </Button>

          {/* Dev Test Switch for Browser Testing */}
          <button
            type="button"
            onClick={handleDevOverrideToggle}
            className="w-full py-2.5 text-center text-[11px] font-bold text-[#9B887F] hover:text-[#C85A32] transition-colors"
          >
            {t.admin.security.developerMode}: {devOverride ? t.admin.security.devOverrideActive : t.admin.security.toggleDevMode}
          </button>
        </div>
      </div>
    )
  }

  // ───────────────────────────────────────────────────────────────────────────
  // AUTHORIZED ADMIN DASHBOARD
  // ───────────────────────────────────────────────────────────────────────────

  const filteredOrders = orders.filter((o) => {
    if (orderFilter === 'active') {
      return o.status === 'confirmed' || o.status === 'preparing' || o.status === 'delivering'
    }
    if (orderFilter === 'completed') {
      return o.status === 'completed' || o.status === 'cancelled'
    }
    return true
  })

  return (
    <div className="min-h-screen bg-[#FAF6F0] text-[#3B2219] pb-24 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 left-4 right-4 z-50 p-3 rounded-2xl bg-[#3B2219] text-[#FFFDF9] text-xs font-bold text-center shadow-lg border border-[#C85A32]/40 animate-in slide-in-from-top-2">
          {toastMessage}
        </div>
      )}

      {/* Admin Top Header */}
      <header className="sticky top-0 z-30 bg-[#FAF6F0]/95 backdrop-blur-md px-5 py-4 border-b border-[#E6DED5] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-[#C85A32] text-white flex items-center justify-center text-lg font-bold shadow-xs">
            <ShieldCheck className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-extrabold font-['Manrope'] leading-tight">
                {t.admin.panelTitle}
              </h1>
              <Badge variant="accent" size="sm">
                Admin
              </Badge>
            </div>
            <p className="text-[11px] font-medium text-[#6F574E]">
              {tgUser?.username ? `@${tgUser.username}` : (tgUser?.first_name || 'Admin')} · {t.admin.security.authorizedAs}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => {
            haptic.selection()
            onClose()
          }}
          className="w-9 h-9 rounded-full bg-[#EFE9E1] hover:bg-[#E6DED5] text-[#3B2219] flex items-center justify-center transition-colors"
          aria-label={t.common.close}
        >
          <X className="w-4 h-4" />
        </button>
      </header>

      {/* Main Admin Content */}
      <main className="px-5 pt-4 space-y-4">
        {/* Analytics Highlights Row */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-3.5 rounded-[22px] bg-[#FFFDF9] border border-[#E6DED5] shadow-xs">
            <span className="text-[10px] font-bold uppercase text-[#6F574E] flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>{t.admin.metrics.totalRevenue}</span>
            </span>
            <span className="text-base font-black text-[#3B2219] font-['Manrope'] mt-1 block">
              {metrics.totalRevenue.toLocaleString()} {t.common.currency}
            </span>
          </div>

          <div className="p-3.5 rounded-[22px] bg-[#FFFDF9] border border-[#E6DED5] shadow-xs">
            <span className="text-[10px] font-bold uppercase text-[#6F574E] flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#C85A32]" />
              <span>{t.admin.metrics.activeOrders}</span>
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-base font-black text-[#C85A32] font-['Manrope']">
                {metrics.activeOrdersCount}
              </span>
              <span className="text-[11px] text-[#6F574E]">
                / {metrics.completedOrdersCount} {t.admin.metrics.completedCountSuffix}
              </span>
            </div>
          </div>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="flex bg-[#EFE9E1] p-1 rounded-[18px] text-[11px] font-extrabold font-['Manrope']">
          <button
            type="button"
            onClick={() => {
              haptic.selection()
              setActiveTab('orders')
            }}
            className={`flex-1 py-2 rounded-[14px] flex items-center justify-center gap-1 transition-all ${
              activeTab === 'orders'
                ? 'bg-[#FFFDF9] text-[#3B2219] shadow-xs'
                : 'text-[#6F574E] hover:text-[#3B2219]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>{t.admin.tabs.orders} ({orders.length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              haptic.selection()
              setActiveTab('products')
            }}
            className={`flex-1 py-2 rounded-[14px] flex items-center justify-center gap-1 transition-all ${
              activeTab === 'products'
                ? 'bg-[#FFFDF9] text-[#3B2219] shadow-xs'
                : 'text-[#6F574E] hover:text-[#3B2219]'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{t.admin.tabs.products} ({products.length})</span>
          </button>
          <button
            type="button"
            onClick={() => {
              haptic.selection()
              setActiveTab('applications')
            }}
            className={`flex-1 py-2 rounded-[14px] flex items-center justify-center gap-1 transition-all ${
              activeTab === 'applications'
                ? 'bg-[#FFFDF9] text-[#3B2219] shadow-xs'
                : 'text-[#6F574E] hover:text-[#3B2219]'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{t.admin.tabs.applications} ({applications.length})</span>
            {metrics.pendingApplicationsCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#C85A32] text-white text-[9px] font-black flex items-center justify-center shrink-0">
                {metrics.pendingApplicationsCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              haptic.selection()
              setActiveTab('analytics')
            }}
            className={`flex-1 py-2 rounded-[14px] flex items-center justify-center gap-1 transition-all ${
              activeTab === 'analytics'
                ? 'bg-[#FFFDF9] text-[#3B2219] shadow-xs'
                : 'text-[#6F574E] hover:text-[#3B2219]'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t.admin.tabs.analytics}</span>
          </button>
        </div>

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* TAB 1: ORDERS MANAGEMENT */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {activeTab === 'orders' && (
          <section className="space-y-3 animate-in fade-in duration-200">
            {/* Filter Pills */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setOrderFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  orderFilter === 'all'
                    ? 'bg-[#3B2219] text-white shadow-xs'
                    : 'bg-[#FFFDF9] text-[#6F574E] border border-[#E6DED5]'
                }`}
              >
                {t.admin.orders.filterAll} ({orders.length})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('active')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  orderFilter === 'active'
                    ? 'bg-[#C85A32] text-white shadow-xs'
                    : 'bg-[#FFFDF9] text-[#6F574E] border border-[#E6DED5]'
                }`}
              >
                {t.admin.orders.filterActive} ({metrics.activeOrdersCount})
              </button>
              <button
                type="button"
                onClick={() => setOrderFilter('completed')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  orderFilter === 'completed'
                    ? 'bg-[#2E7D32] text-white shadow-xs'
                    : 'bg-[#FFFDF9] text-[#6F574E] border border-[#E6DED5]'
                }`}
              >
                {t.admin.orders.filterCompleted} ({metrics.completedOrdersCount})
              </button>
            </div>

            {/* Orders List */}
            <div className="space-y-3">
              {filteredOrders.map((order) => {
                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-[22px] bg-[#FFFDF9] border border-[#E6DED5] shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-xs font-black text-[#3B2219] font-['Manrope']">
                          #{order.orderNumber || order.id}
                        </span>
                        <span className="text-[10px] text-[#9B887F] block">
                          {order.deliveryTimeSlot || t.admin.orders.standardDelivery}
                        </span>
                      </div>
                      {getOrderStatusBadge(order.status)}
                    </div>

                    {/* Order Items */}
                    <div className="bg-[#FAF6F0] p-2.5 rounded-[14px] text-xs space-y-1">
                      {order.items.map((it, idx) => {
                        const loc = getLocalizedProduct(it.product)
                        return (
                          <div key={idx} className="flex justify-between text-[#6F574E]">
                            <span className="font-semibold truncate max-w-[200px]">
                              {it.quantity}× {loc.name}
                            </span>
                            <span className="font-mono text-[#3B2219]">
                              {(it.product.price * it.quantity).toLocaleString()} {t.common.currency}
                            </span>
                          </div>
                        )
                      })}
                    </div>

                    {/* Order Details & Address */}
                    <div className="text-[11px] text-[#6F574E] space-y-0.5">
                      <p>
                        📍 <span className="font-medium">{order.deliveryAddress}</span>
                      </p>
                      {order.customerNotes && (
                        <p className="text-[#C85A32]">
                          💬 <i>"{order.customerNotes}"</i>
                        </p>
                      )}
                    </div>

                    {/* Total & Action Bar */}
                    <div className="pt-2 border-t border-[#EFE9E1] flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-[#9B887F] block">
                          {t.admin.orders.total}
                        </span>
                        <span className="text-sm font-black text-[#3B2219] font-['Manrope']">
                          {order.totalAmount.toLocaleString()} {t.common.currency}
                        </span>
                      </div>

                      {/* Status Action Workflow Buttons */}
                      <div className="flex items-center gap-1.5">
                        {order.status === 'confirmed' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(order.id, 'preparing')}
                            className="px-3 py-1.5 rounded-full bg-[#C85A32] hover:bg-[#B34E29] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{t.admin.orders.markPreparing}</span>
                          </button>
                        )}
                        {order.status === 'preparing' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(order.id, 'delivering')}
                            className="px-3 py-1.5 rounded-full bg-[#8C4A28] hover:bg-[#723B1E] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                          >
                            <Truck className="w-3.5 h-3.5" />
                            <span>{t.admin.orders.markDelivering}</span>
                          </button>
                        )}
                        {order.status === 'delivering' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(order.id, 'completed')}
                            className="px-3.5 py-1.5 rounded-full bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>{t.admin.orders.markDelivered}</span>
                          </button>
                        )}
                        {order.status !== 'completed' && order.status !== 'cancelled' && (
                          <button
                            type="button"
                            onClick={() => handleStatusChange(order.id, 'cancelled')}
                            className="w-7 h-7 rounded-full bg-[#EFE9E1] hover:bg-[#E6DED5] text-[#9B887F] hover:text-[#C85A32] flex items-center justify-center transition-colors"
                            title={t.admin.orders.cancelOrder}
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* TAB 2: PRODUCTS & CATALOG MANAGEMENT */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {activeTab === 'products' && (
          <section className="space-y-3 animate-in fade-in duration-200">
            {/* Top Action */}
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-[#6F574E]">
                {t.admin.products.title} ({products.length})
              </h3>
              <button
                type="button"
                onClick={() => {
                  haptic.selection()
                  setIsAddProductOpen(!isAddProductOpen)
                }}
                className="px-3 py-1.5 rounded-full bg-[#C85A32] text-white text-xs font-bold hover:bg-[#B34E29] transition-colors flex items-center gap-1 shadow-xs"
              >
                <span>{isAddProductOpen ? '✕' : '+'}</span>
                <span>{t.admin.products.addNew}</span>
              </button>
            </div>

            {/* Add New Product Form */}
            {isAddProductOpen && (
              <form
                onSubmit={handleAddProductSubmit}
                className="p-4 rounded-[22px] bg-[#FFFDF9] border border-[#C85A32]/40 shadow-sm space-y-3 animate-in fade-in"
              >
                <h4 className="text-xs font-extrabold text-[#3B2219] font-['Manrope'] flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5 text-[#C85A32]" />
                  <span>{t.admin.products.addNew}</span>
                </h4>

                <div>
                  <label className="text-[10px] font-bold text-[#6F574E] block mb-1">
                    {t.admin.products.formTitle}
                  </label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder={t.admin.products.formTitlePlaceholder}
                    className="w-full px-3 py-2 rounded-[12px] bg-[#FAF6F0] border border-[#E6DED5] text-xs font-medium focus:outline-none focus:border-[#C85A32]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] font-bold text-[#6F574E] block mb-1">
                      {t.admin.products.formPrice}
                    </label>
                    <input
                      type="number"
                      required
                      value={newPrice}
                      onChange={(e) => setNewPrice(e.target.value)}
                      placeholder="45000"
                      className="w-full px-3 py-2 rounded-[12px] bg-[#FAF6F0] border border-[#E6DED5] text-xs font-medium focus:outline-none focus:border-[#C85A32]"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-[#6F574E] block mb-1">
                      {t.admin.products.formCategory}
                    </label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-2 py-2 rounded-[12px] bg-[#FAF6F0] border border-[#E6DED5] text-xs font-medium focus:outline-none focus:border-[#C85A32]"
                    >
                      <option value="bakery">{t.admin.categories.bakery}</option>
                      <option value="national">{t.admin.categories.national}</option>
                      <option value="sweets">{t.admin.categories.sweets}</option>
                      <option value="crafts">{t.admin.categories.crafts}</option>
                      <option value="dairy">{t.admin.categories.dairy}</option>
                    </select>
                  </div>
                </div>

                <Button type="submit" variant="accent" size="sm" fullWidth>
                  {t.common.save}
                </Button>
              </form>
            )}

            {/* Products List */}
            <div className="space-y-2.5">
              {products.map((p) => {
                const loc = getLocalizedProduct(p)
                const categoryLabel = (t.admin.categories as any)[p.category] || p.category
                return (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-[20px] bg-[#FFFDF9] border border-[#E6DED5] shadow-xs flex items-center justify-between gap-3"
                  >
                    <img
                      src={p.imageUrl}
                      alt={loc.title}
                      className="w-12 h-12 rounded-[14px] object-cover border border-[#E6DED5]"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="text-xs font-extrabold text-[#3B2219] font-['Manrope'] truncate">
                          {loc.title}
                        </h4>
                      </div>
                      <p className="text-[10px] text-[#6F574E] truncate">
                        {p.seller.name} · {categoryLabel}
                      </p>
                      <span className="text-xs font-extrabold text-[#3B2219] font-['Manrope']">
                        {p.price.toLocaleString()} {t.common.currency}
                      </span>
                    </div>

                    {/* Stock Availability Toggle Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleStock(p.id)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-extrabold transition-all ${
                        p.inStock
                          ? 'bg-[#2E7D32]/10 text-[#2E7D32] border border-[#2E7D32]/30'
                          : 'bg-[#9B887F]/10 text-[#9B887F] border border-[#9B887F]/30'
                      }`}
                    >
                      {p.inStock ? `● ${t.admin.products.inStock}` : `○ ${t.admin.products.outOfStock}`}
                    </button>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* TAB 3: VENDOR APPLICATIONS & STORE ONBOARDING */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {activeTab === 'applications' && (
          <section className="space-y-3 animate-in fade-in duration-200">
            {/* Filter Pills */}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAppFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  appFilter === 'all'
                    ? 'bg-[#3B2219] text-white shadow-xs'
                    : 'bg-[#FFFDF9] text-[#6F574E] border border-[#E6DED5]'
                }`}
              >
                {t.admin.applications.filterAll} ({applications.length})
              </button>
              <button
                type="button"
                onClick={() => setAppFilter('pending')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  appFilter === 'pending'
                    ? 'bg-[#C85A32] text-white shadow-xs'
                    : 'bg-[#FFFDF9] text-[#6F574E] border border-[#E6DED5]'
                }`}
              >
                {t.admin.applications.filterPending} ({metrics.pendingApplicationsCount})
              </button>
              <button
                type="button"
                onClick={() => setAppFilter('approved')}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all ${
                  appFilter === 'approved'
                    ? 'bg-[#2E7D32] text-white shadow-xs'
                    : 'bg-[#FFFDF9] text-[#6F574E] border border-[#E6DED5]'
                }`}
              >
                {t.admin.applications.filterApproved}
              </button>
            </div>

            {/* Applications List */}
            <div className="space-y-3">
              {applications
                .filter((app) => (appFilter === 'all' ? true : app.status === appFilter))
                .map((app) => (
                  <div
                    key={app.id}
                    className="p-4 rounded-[22px] bg-[#FFFDF9] border border-[#E6DED5] shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-black text-[#3B2219] font-['Manrope']">
                          #{app.id}
                        </span>
                        <h4 className="text-sm font-extrabold text-[#3B2219]">
                          {app.shopName}
                        </h4>
                      </div>
                      {getAppStatusBadge(app.status)}
                    </div>

                    <div className="bg-[#FAF6F0] p-2.5 rounded-[14px] text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[#6F574E]">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-[#C85A32]" />
                          <span>{t.admin.applications.artisan}:</span>
                        </span>
                        <span className="font-bold text-[#3B2219]">
                          {app.ownerName} {app.telegramUsername ? `(@${app.telegramUsername})` : ''}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-[#6F574E]">
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-[#C85A32]" />
                          <span>{t.admin.applications.contact}:</span>
                        </span>
                        <span className="font-mono font-bold text-[#3B2219]">{app.phone}</span>
                      </div>
                      <div className="flex items-center justify-between text-[#6F574E]">
                        <span className="flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-[#C85A32]" />
                          <span>{t.admin.applications.status}:</span>
                        </span>
                        <span className="font-bold text-[#3B2219]">{app.legalStatusLabel}</span>
                      </div>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold uppercase text-[#9B887F] block mb-0.5">
                        {t.admin.applications.description}
                      </span>
                      <p className="text-xs text-[#3B2219] leading-relaxed italic">
                        "{app.description}"
                      </p>
                    </div>

                    {/* Action Bar */}
                    <div className="pt-2 border-t border-[#EFE9E1] flex items-center justify-between">
                      <span className="text-[10px] text-[#9B887F]">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </span>

                      <div className="flex items-center gap-2">
                        {app.status === 'pending' && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleRejectApplication(app.id)}
                              className="px-3 py-1.5 rounded-[12px] bg-[#EFE9E1] hover:bg-[#E6DED5] text-[#6F574E] text-xs font-bold transition-colors"
                            >
                              {t.admin.applications.reject}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleApproveApplication(app.id)}
                              className="px-3.5 py-1.5 rounded-[12px] bg-[#2E7D32] hover:bg-[#256628] text-white text-xs font-bold transition-colors shadow-xs"
                            >
                              {t.admin.applications.approve}
                            </button>
                          </>
                        )}
                        {app.status === 'approved' && (
                          <span className="text-xs font-bold text-[#2E7D32] flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-[#2E7D32]" />
                            <span>{t.admin.applications.activeInMarket}</span>
                          </span>
                        )}
                        {app.status === 'rejected' && (
                          <span className="text-xs font-bold text-[#9B887F] flex items-center gap-1">
                            <XCircle className="w-4 h-4 text-[#9B887F]" />
                            <span>{t.admin.applications.rejectedStatus}</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* ─────────────────────────────────────────────────────────────────── */}
        {/* TAB 4: ANALYTICS & SECURITY CONFIG */}
        {/* ─────────────────────────────────────────────────────────────────── */}
        {activeTab === 'analytics' && (
          <section className="space-y-4 animate-in fade-in duration-200">
            {/* Extended Analytics Cards */}
            <div className="p-4 rounded-[24px] bg-[#FFFDF9] border border-[#E6DED5] shadow-xs space-y-3">
              <h3 className="text-xs font-extrabold text-[#3B2219] font-['Manrope'] flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-[#C85A32]" />
                <span>{t.admin.metrics.overviewTitle}</span>
              </h3>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between py-1.5 border-b border-[#EFE9E1]">
                  <span className="text-[#6F574E]">{t.admin.metrics.grossMerchandiseValue}:</span>
                  <span className="font-extrabold text-[#3B2219]">
                    {metrics.totalRevenue.toLocaleString()} {t.common.currency}
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EFE9E1]">
                  <span className="text-[#6F574E]">{t.admin.metrics.totalProcessedOrders}:</span>
                  <span className="font-extrabold text-[#3B2219]">{orders.length} ta</span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EFE9E1]">
                  <span className="text-[#6F574E]">{t.admin.metrics.activeDeliveryQueue}:</span>
                  <span className="font-extrabold text-[#C85A32]">
                    {metrics.activeOrdersCount} ta
                  </span>
                </div>
                <div className="flex justify-between py-1.5 border-b border-[#EFE9E1]">
                  <span className="text-[#6F574E]">{t.admin.metrics.verifiedLocalArtisans}:</span>
                  <span className="font-extrabold text-[#3B2219]">
                    {metrics.registeredMakersCount} ta
                  </span>
                </div>
              </div>
            </div>

            {/* Access & Security Whitelist Box */}
            <div className="p-4 rounded-[24px] bg-[#FFFDF9] border border-[#E6DED5] shadow-xs space-y-3">
              <h3 className="text-xs font-extrabold text-[#3B2219] font-['Manrope'] flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#2E7D32]" />
                <span>{t.admin.security.accessControlTitle}</span>
              </h3>
              <p className="text-[11px] text-[#6F574E] leading-relaxed">
                {t.admin.security.whitelistNotice}
              </p>

              <div className="p-3.5 rounded-2xl bg-[#FAF6F0] border border-[#E6DED5] text-xs space-y-2 text-[#6F574E]">
                <div className="flex items-center justify-between">
                  <span>{t.admin.security.currentAdmin}:</span>
                  <span className="font-bold text-[#3B2219]">
                    @{tgUser?.username || 'admin'}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{t.admin.security.telegramId}:</span>
                  <span className="font-mono font-bold text-[#3B2219]">
                    {tgUser?.id || '8850768299'}
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#EFE9E1]">
                  <span>{t.admin.security.authMode}:</span>
                  <span className="font-bold text-[#2E7D32]">
                    {devOverride ? t.admin.security.authModeDev : t.admin.security.authModeProduction}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDevOverrideToggle}
                className="w-full mt-2 py-2.5 rounded-xl bg-[#EFE9E1] hover:bg-[#E6DED5] text-[#3B2219] text-xs font-bold transition-colors"
              >
                {t.admin.security.toggleDevMode} ({devOverride ? t.admin.security.devOverrideActive : t.admin.security.devOverrideOff})
              </button>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}

export default AdminDashboard
