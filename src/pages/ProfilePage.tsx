import React, { useState } from 'react'
import {
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Store,
  Sparkles,
  MessageSquare,
  ArrowRight,
  Package,
  Heart,
  Award,
  Info,
  X,
  Gift,
  Truck,
  Crown,
} from 'lucide-react'
import { Header } from '../components/common/Header'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { ProductGrid } from '../components/product/ProductGrid'
import { MOCK_USER, MOCK_PRODUCTS } from '../data/mockData'
import { useTelegram } from '../context/TelegramContext'
import { useLanguage } from '../context/LanguageContext'
import { useCart } from '../context/CartContext'
import { triggerHaptic } from '../utils/telegram'
import {
  isAdminUser,
  openTelegramSupport,
  getUserVendorApplication,
  VendorApplication,
  getPublicMarketplaceProducts,
} from '../services/adminService'
import { getUserRole, saveUserRole, UserRole } from '../services/roleService'
import { VendorRegistrationModal } from '../components/vendor/VendorRegistrationModal'
import { Product } from '../types'

interface ProfilePageProps {
  onOpenAdmin?: () => void
  onProductClick?: (product: Product) => void
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  onOpenAdmin,
  onProductClick,
}) => {
  const { user: tgUser, haptic } = useTelegram()
  const { t, getLocalizedProduct, currentLocale } = useLanguage()
  const {
    favorites,
    toggleFavorite,
    addItem,
    updateQuantity,
    items,
    setActiveTab: setNavTab,
  } = useCart()

  const [userRole, setUserRole] = useState<UserRole>(() => getUserRole() || 'buyer')
  const [activeTab, setActiveTab] = useState<'orders' | 'favorites' | 'seller'>(() =>
    getUserRole() === 'seller' ? 'seller' : 'orders'
  )
  const [isLoyaltyModalOpen, setIsLoyaltyModalOpen] = useState(false)
  const [isVendorModalOpen, setIsVendorModalOpen] = useState(false)
  const [vendorApp, setVendorApp] = useState<VendorApplication | null>(() =>
    getUserVendorApplication(tgUser?.username)
  )

  const isAdmin = isAdminUser(tgUser)

  const handleToggleRole = () => {
    triggerHaptic('medium')
    const nextRole: UserRole = userRole === 'seller' ? 'buyer' : 'seller'
    saveUserRole(nextRole)
    setUserRole(nextRole)
    if (nextRole === 'seller') {
      setActiveTab('seller')
    } else {
      setActiveTab('orders')
    }
  }

  // Cart quantities map for favorites grid
  const cartQuantities = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.product.id] = item.quantity
    return acc
  }, {})

  // Filter and localize favorite products
  const favoriteProducts = getPublicMarketplaceProducts().filter((p) =>
    favorites.includes(p.id)
  ).map(getLocalizedProduct)

  // Sample order history
  const orderHistory = [
    {
      id: 'LOC-894120',
      date: 'Yesterday, 15:40',
      items: 'Golden Tandoor Samsa × 2, Medovik Honey Cake × 1',
      total: `124,000 ${t.common.currency}`,
      status: t.profile.deliveredStatus,
      statusVariant: 'fresh' as const,
    },
    {
      id: 'LOC-732109',
      date: 'Oct 18, 2026',
      items: 'Warm Sourdough Non × 3, Mountain Wildflower Honey × 1',
      total: `139,000 ${t.common.currency}`,
      status: t.profile.deliveredStatus,
      statusVariant: 'fresh' as const,
    },
    {
      id: 'LOC-610944',
      date: 'Oct 12, 2026',
      items: 'Adras Ikat Table Runner × 1',
      total: `185,000 ${t.common.currency}`,
      status: t.profile.deliveredStatus,
      statusVariant: 'fresh' as const,
    },
  ]

  return (
    <div className="min-h-screen bg-[#FAF6F0] pb-28">
      <Header
        title={t.header.yourProfile}
        subtitle={t.header.profileSubtitle}
      />

      <main className="px-5 pt-3 space-y-4">
        {/* User Profile Card */}
        <div className="p-4 rounded-[24px] bg-[#FFFDF9] border border-[#E6DED5] shadow-xs flex items-center gap-3.5">
          {tgUser?.photo_url ? (
            <img
              src={tgUser.photo_url}
              alt={tgUser.first_name}
              className="w-16 h-16 rounded-full object-cover border-2 border-[#C85A32]/20 shadow-xs"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-[#3B2219] text-[#FFFDF9] flex items-center justify-center text-xl font-extrabold font-['Manrope'] border-2 border-[#C85A32]/30 shadow-xs">
              {(tgUser?.first_name?.[0] || 'T') + (tgUser?.last_name?.[0] || 'A')}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-[#3B2219] font-['Manrope'] truncate">
                {tgUser
                  ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim()
                  : `${MOCK_USER.firstName} ${MOCK_USER.lastName}`}
              </h2>
              {tgUser?.is_premium ? (
                <Badge variant="accent" size="sm">
                  {t.profile.premiumBadge}
                </Badge>
              ) : (
                <Badge variant="gold" size="sm">
                  {t.profile.patronBadge}
                </Badge>
              )}
            </div>
            <p className="text-xs font-semibold text-[#6F574E]">
              @{tgUser?.username || MOCK_USER.telegramUsername}
            </p>
            <div className="flex items-center gap-1 text-[11px] text-[#9B887F] truncate mt-0.5">
              <MapPin className="w-3 h-3 text-[#C85A32] shrink-0" />
              <span className="truncate">{MOCK_USER.address}</span>
            </div>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium')
                onOpenAdmin?.()
              }}
              className="w-9 h-9 rounded-full bg-[#3B2219] text-[#FFFDF9] flex items-center justify-center hover:bg-[#C85A32] transition-colors shadow-xs shrink-0"
              title={t.admin.panelTitle}
            >
              <ShieldCheck className="w-4 h-4 text-[#FFFDF9]" />
            </button>
          )}
        </div>

        {/* Discreet Admin Panel Access Card (Authorized Admin Only) */}
        {isAdmin && (
          <div className="p-4 rounded-[24px] bg-[#3B2219] text-[#FFFDF9] border border-[#C85A32]/40 shadow-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#C85A32] flex items-center justify-center shadow-xs">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-black font-['Manrope'] tracking-wide">
                    {t.admin.panelTitle}
                  </h3>
                  <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-[#C85A32] text-white">
                    ADMIN
                  </span>
                </div>
                <p className="text-[10px] text-[#EFE9E1]/80">
                  {t.admin.security.authorizedAs}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium')
                onOpenAdmin?.()
              }}
              className="px-3.5 py-1.5 rounded-xl bg-[#FFFDF9] text-[#3B2219] text-xs font-black hover:bg-[#FAF6F0] transition-transform active:scale-95 shadow-xs font-['Manrope'] flex items-center gap-1"
            >
              <span>Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div
            onClick={() => {
              triggerHaptic('light')
              setActiveTab('orders')
            }}
            className="p-3 rounded-[18px] bg-[#EFE9E1] border border-[#E6DED5] cursor-pointer hover:border-[#C85A32]/40 transition-colors"
          >
            <span className="block text-base font-extrabold text-[#3B2219] font-['Manrope']">
              {MOCK_USER.ordersCount}
            </span>
            <span className="text-[10px] font-bold text-[#6F574E] uppercase">
              {t.profile.ordersStat}
            </span>
          </div>

          <div
            onClick={() => {
              triggerHaptic('light')
              setActiveTab('favorites')
            }}
            className="p-3 rounded-[18px] bg-[#EFE9E1] border border-[#E6DED5] cursor-pointer hover:border-[#C85A32]/40 transition-colors"
          >
            <span className="block text-base font-extrabold text-[#3B2219] font-['Manrope']">
              {favorites.length}
            </span>
            <span className="text-[10px] font-bold text-[#6F574E] uppercase">
              {t.profile.savedStat}
            </span>
          </div>

          <div
            onClick={() => {
              triggerHaptic('light')
              setIsLoyaltyModalOpen(true)
            }}
            className="p-3 rounded-[18px] bg-[#EFE9E1] border border-[#E6DED5] cursor-pointer hover:border-[#C85A32]/40 transition-colors"
          >
            <span className="block text-base font-extrabold text-[#3B2219] font-['Manrope']">
              {MOCK_USER.loyaltyPoints}
            </span>
            <span className="text-[10px] font-bold text-[#6F574E] uppercase">
              {t.profile.pointsStat}
            </span>
          </div>
        </div>

        {/* Enhanced Customer Loyalty Points Card */}
        <div className="p-4 rounded-[24px] bg-gradient-to-r from-[#FFFDF9] via-[#FAF4EC] to-[#F5ECE1] border border-[#E6DED5] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E5A118]/15 text-[#E5A118] flex items-center justify-center shrink-0 border border-[#E5A118]/20 shadow-xs">
              <Award className="w-5 h-5 text-[#E5A118]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-[#3B2219] font-['Manrope']">
                  {t.profile.loyaltyCardTitle}
                </h3>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full bg-[#E5A118]/20 text-[#9C6D12]">
                  {MOCK_USER.loyaltyPoints} BALL
                </span>
              </div>
              <p className="text-[10px] text-[#6F574E] mt-0.5">
                {currentLocale === 'ru'
                  ? 'Золотой статус покупателя'
                  : currentLocale === 'uz-Cyrl'
                  ? 'Олтин харидор мақоми'
                  : currentLocale === 'en'
                  ? 'Gold Patron Status'
                  : 'Oltin xaridor maqomi'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              setIsLoyaltyModalOpen(true)
            }}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#3B2219] text-[#FFFDF9] text-[11px] font-bold hover:bg-[#2C1810] active:scale-95 transition-transform shadow-xs"
          >
            <Info className="w-3.5 h-3.5" />
            <span>{t.profile.howItWorks}</span>
          </button>
        </div>

        {/* Role Switcher Card (Buyer vs Seller / Artisan) */}
        <div className="p-4 rounded-[24px] bg-[#FFFDF9] border border-[#E6DED5] shadow-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#EFE9E1] text-[#3B2219] flex items-center justify-center shadow-xs">
              {userRole === 'seller' ? (
                <Store className="w-5 h-5 text-[#C85A32]" />
              ) : (
                <ShoppingBag className="w-5 h-5 text-[#3B2219]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-black text-[#3B2219] font-['Manrope']">
                  {userRole === 'seller' ? t.onboarding.sellerTitle : t.onboarding.buyerTitle}
                </h3>
                <span className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${userRole === 'seller' ? 'bg-[#C85A32] text-white' : 'bg-[#EFE9E1] text-[#3B2219]'}`}>
                  {userRole.toUpperCase()}
                </span>
              </div>
              <p className="text-[10px] text-[#6F574E] mt-0.5">
                {userRole === 'seller' ? t.onboarding.sellerModeActive : t.onboarding.buyerModeActive}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleToggleRole}
            className="px-3 py-1.5 rounded-xl bg-[#3B2219] text-[#FFFDF9] text-xs font-bold hover:bg-[#2C1810] transition-transform active:scale-95 shadow-xs font-['Manrope']"
          >
            {t.onboarding.switchRole}
          </button>
        </div>

        {/* Navigation Tabs (Orders, Favorites, Seller) */}
        <div className="flex bg-[#EFE9E1] p-1 rounded-[16px]">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              setActiveTab('orders')
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'orders'
                ? 'bg-[#FFFDF9] text-[#3B2219] shadow-xs'
                : 'text-[#6F574E] hover:text-[#3B2219]'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>{t.profile.tabs.orders}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              setActiveTab('favorites')
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'favorites'
                ? 'bg-[#FFFDF9] text-[#3B2219] shadow-xs'
                : 'text-[#6F574E] hover:text-[#3B2219]'
            }`}
          >
            <Heart className={`w-3.5 h-3.5 ${activeTab === 'favorites' ? 'fill-red-500 text-red-500' : ''}`} />
            <span>{t.profile.tabs.favorites}</span>
            {favorites.length > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#C85A32] text-white text-[9px] font-black flex items-center justify-center">
                {favorites.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              setActiveTab('seller')
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-[12px] flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'seller'
                ? 'bg-[#FFFDF9] text-[#3B2219] shadow-xs'
                : 'text-[#6F574E] hover:text-[#3B2219]'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>{t.profile.tabs.seller}</span>
          </button>
        </div>

        {/* Tab 1: Orders History */}
        {activeTab === 'orders' && (
          <div className="space-y-2.5 animate-in fade-in duration-200">
            <h4 className="text-xs font-bold text-[#6F574E] px-1 uppercase tracking-wider">
              {t.profile.recentOrders}
            </h4>
            {orderHistory.map((order) => (
              <div
                key={order.id}
                className="p-3.5 rounded-[20px] bg-[#FFFDF9] border border-[#E6DED5] shadow-xs space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#3B2219] font-['Manrope']">
                    #{order.id}
                  </span>
                  <Badge variant="fresh" size="sm">
                    {order.status}
                  </Badge>
                </div>
                <p className="text-xs text-[#6F574E] line-clamp-1">
                  {order.items}
                </p>
                <div className="flex items-center justify-between pt-1 border-t border-[#EFE9E1] text-[11px]">
                  <span className="text-[#9B887F]">{order.date}</span>
                  <span className="font-extrabold text-[#3B2219] font-['Manrope']">
                    {order.total}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tab 2: Favorites / Saqlanganlar */}
        {activeTab === 'favorites' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-xs font-bold text-[#6F574E] uppercase tracking-wider">
                {t.profile.tabs.favorites}
              </h4>
              <span className="text-xs font-semibold text-[#6F574E]">
                {favoriteProducts.length} {t.common.itemsCount}
              </span>
            </div>

            {favoriteProducts.length === 0 ? (
              <div className="py-12 text-center rounded-[24px] bg-[#FFFDF9] border border-[#E6DED5]">
                <div className="w-12 h-12 rounded-full bg-[#EFE9E1] text-[#C85A32] flex items-center justify-center mx-auto mb-2">
                  <Heart className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#3B2219]">
                  {t.profile.noFavoritesYet}
                </h4>
                <p className="text-xs text-[#6F574E] mt-1 max-w-[220px] mx-auto">
                  {t.profile.noFavoritesDesc}
                </p>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('light')
                    setNavTab('menu')
                  }}
                  className="mt-4 px-4 py-2 rounded-[12px] bg-[#3B2219] text-[#FFFDF9] text-xs font-bold hover:bg-[#2C1810]"
                >
                  {t.cart.browseCatalog}
                </button>
              </div>
            ) : (
              <ProductGrid
                products={favoriteProducts}
                cartQuantities={cartQuantities}
                onAddToCart={addItem}
                onUpdateQuantity={updateQuantity}
                onToggleFavorite={toggleFavorite}
                favorites={favorites}
                onProductClick={onProductClick}
              />
            )}
          </div>
        )}

        {/* Tab 3: Become a Seller */}
        {activeTab === 'seller' && (
          <div className="p-5 rounded-[24px] bg-[#3B2219] text-white space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-[16px] bg-[#C85A32] flex items-center justify-center shadow-xs">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              {vendorApp && (
                <Badge
                  variant={
                    vendorApp.status === 'approved'
                      ? 'fresh'
                      : vendorApp.status === 'rejected'
                      ? 'secondary'
                      : 'accent'
                  }
                  size="sm"
                >
                  {vendorApp.status === 'approved'
                    ? 'TASDIQLANGAN DO‘KON'
                    : vendorApp.status === 'rejected'
                    ? 'RAD ETILDI'
                    : 'ARIZA KUTILMOQDA'}
                </Badge>
              )}
            </div>

            <div>
              <h4 className="text-base font-extrabold font-['Manrope']">
                {vendorApp ? vendorApp.shopName : t.profile.becomeSellerTitle}
              </h4>
              <p className="text-xs text-[#EFE9E1]/80 mt-1 leading-relaxed">
                {vendorApp
                  ? vendorApp.status === 'pending'
                    ? 'Do‘kon arizangiz ma’muriyat tomonidan ko‘rib chiqilmoqda. Tasdiqlangach, mahsulotlaringiz katalogda ko‘rinadi.'
                    : vendorApp.status === 'approved'
                    ? 'Do‘koningiz tasdiqlangan va faol! Yangi mahsulotlarni joylab sotuvni boshlashingiz mumkin.'
                    : 'Arizangiz ma’muriyat tomonidan qayta ko‘rib chiqish uchun yuborildi.'
                  : t.profile.becomeSellerDesc}
              </p>
            </div>

            <Button
              variant="accent"
              size="md"
              fullWidth
              onClick={() => {
                haptic.impact('medium')
                setIsVendorModalOpen(true)
              }}
            >
              {vendorApp ? 'Arizani ko‘rish' : t.profile.openStoreButton}
            </Button>
          </div>
        )}

        {/* Customer Care / Support */}
        <div className="p-4 rounded-[20px] bg-[#FFFDF9] border border-[#E6DED5] flex items-center justify-between shadow-xs">
          <div>
            <h4 className="text-xs font-extrabold text-[#3B2219] font-['Manrope'] flex items-center gap-1.5">
              <MessageSquare className="w-4 h-4 text-[#C85A32]" />
              <span>{t.profile.supportTitle}</span>
            </h4>
            <p className="text-[10px] text-[#6F574E] mt-0.5">
              {t.profile.supportDesc} (@murxamidinova_jasmin)
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              openTelegramSupport()
            }}
            className="px-3 py-1.5 rounded-[12px] bg-[#EFE9E1] text-[#3B2219] text-xs font-bold hover:bg-[#E6DED5] transition-colors"
          >
            {t.profile.contactSupport}
          </button>
        </div>

        {/* App Version Info */}
        <div className="text-center pt-2">
          <span className="text-[10px] text-[#9B887F] font-semibold">
            Locally Marketplace · {t.profile.appVersion} 1.2.0 (Multilingual Edition)
          </span>
        </div>
      </main>

      {/* Customer Loyalty Points Explainer Modal */}
      {isLoyaltyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity"
            onClick={() => setIsLoyaltyModalOpen(false)}
          />
          <div className="relative w-full max-w-sm rounded-[28px] bg-[#FFFDF9] border border-[#E6DED5] p-5 shadow-[0_24px_50px_rgba(59,34,25,0.22)] space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-[#EFE9E1]">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-2xl bg-[#E5A118]/15 text-[#E5A118] flex items-center justify-center">
                  <Award className="w-5 h-5 text-[#E5A118]" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#3B2219] font-['Manrope']">
                    {t.profile.loyaltyCardTitle}
                  </h3>
                  <span className="text-[10px] font-bold text-[#6F574E]">
                    {MOCK_USER.loyaltyPoints} {t.profile.pointsStat}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsLoyaltyModalOpen(false)}
                className="w-7 h-7 rounded-full bg-[#EFE9E1] text-[#6F574E] hover:text-[#3B2219] flex items-center justify-center"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Explainer Body */}
            <div className="p-3.5 rounded-[20px] bg-[#FAF6F0] border border-[#E6DED5]/80 space-y-2">
              <p className="text-xs text-[#3B2219] leading-relaxed font-medium">
                {t.profile.loyaltyPointsExplainer}
              </p>
            </div>

            {/* How points can be redeemed */}
            <div className="space-y-2">
              <div className="flex items-center gap-2.5 p-2 rounded-[14px] bg-[#FFFDF9] border border-[#E6DED5]">
                <div className="w-7 h-7 rounded-lg bg-[#FAF0DC] text-[#C85A32] flex items-center justify-center shrink-0">
                  <Gift className="w-4 h-4 text-[#C85A32]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-[11px] font-bold text-[#3B2219]">1,000 ball</h5>
                  <p className="text-[10px] text-[#6F574E]">10,000 so'mlik chegirma vaucheri</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-[14px] bg-[#FFFDF9] border border-[#E6DED5]">
                <div className="w-7 h-7 rounded-lg bg-[#FAF0DC] text-[#C85A32] flex items-center justify-center shrink-0">
                  <Truck className="w-4 h-4 text-[#C85A32]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-[11px] font-bold text-[#3B2219]">1,500 ball</h5>
                  <p className="text-[10px] text-[#6F574E]">Bepul kuryer orqali yetkazib berish</p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-2 rounded-[14px] bg-[#FFFDF9] border border-[#E6DED5]">
                <div className="w-7 h-7 rounded-lg bg-[#FAF0DC] text-[#E5A118] flex items-center justify-center shrink-0">
                  <Crown className="w-4 h-4 text-[#E5A118]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h5 className="text-[11px] font-bold text-[#3B2219]">3,000 ball</h5>
                  <p className="text-[10px] text-[#6F574E]">Doimiy 5% VIP chegirma barcha buyurtmalarga</p>
                </div>
              </div>
            </div>

            <Button
              variant="primary"
              size="md"
              fullWidth
              onClick={() => setIsLoyaltyModalOpen(false)}
            >
              {t.common.confirm}
            </Button>
          </div>
        </div>
      )}

      {/* Vendor Onboarding Modal */}
      <VendorRegistrationModal
        isOpen={isVendorModalOpen}
        onClose={() => setIsVendorModalOpen(false)}
        existingApplication={vendorApp}
        onApplicationSubmitted={(app) => {
          setVendorApp(app)
        }}
      />
    </div>
  )
}

export default ProfilePage
