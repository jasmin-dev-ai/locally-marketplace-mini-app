import React, { useState } from 'react'
import { Header } from '../components/common/Header'
import { Button } from '../components/common/Button'
import { Badge } from '../components/common/Badge'
import { LanguageSwitcher } from '../components/common/LanguageSwitcher'
import { MOCK_USER } from '../data/mockData'
import { useTelegram } from '../context/TelegramContext'
import { useLanguage } from '../context/LanguageContext'
import { triggerHaptic } from '../utils/telegram'
import { isAdminUser } from '../services/adminService'

interface ProfilePageProps {
  onOpenAdmin?: () => void
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ onOpenAdmin }) => {
  const { user: tgUser, haptic } = useTelegram()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<'orders' | 'seller'>('orders')
  const isAdmin = isAdminUser(tgUser)

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
                {tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : `${MOCK_USER.firstName} ${MOCK_USER.lastName}`}
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
            <p className="text-[11px] text-[#9B887F] truncate mt-0.5">
              📍 {MOCK_USER.address}
            </p>
          </div>
          {isAdmin && (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('medium')
                onOpenAdmin?.()
              }}
              className="w-9 h-9 rounded-full bg-[#3B2219] text-[#FFFDF9] flex items-center justify-center text-sm hover:bg-[#C85A32] transition-colors shadow-xs shrink-0"
              title={t.admin.panelTitle}
            >
              🛡️
            </button>
          )}
        </div>

        {/* Discreet Admin Panel Access Card (Authorized Admin Only) */}
        {isAdmin && (
          <div className="p-4 rounded-[24px] bg-[#3B2219] text-[#FFFDF9] border border-[#C85A32]/40 shadow-xs flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#C85A32] flex items-center justify-center text-lg shadow-xs">
                🛡️
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
              className="px-3.5 py-1.5 rounded-xl bg-[#FFFDF9] text-[#3B2219] text-xs font-black hover:bg-[#FAF6F0] transition-transform active:scale-95 shadow-xs font-['Manrope']"
            >
              Dashboard ➔
            </button>
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-3 rounded-[18px] bg-[#EFE9E1] border border-[#E6DED5]">
            <span className="block text-base font-extrabold text-[#3B2219] font-['Manrope']">
              {MOCK_USER.ordersCount}
            </span>
            <span className="text-[10px] font-bold text-[#6F574E] uppercase">
              {t.profile.ordersStat}
            </span>
          </div>
          <div className="p-3 rounded-[18px] bg-[#EFE9E1] border border-[#E6DED5]">
            <span className="block text-base font-extrabold text-[#3B2219] font-['Manrope']">
              {MOCK_USER.favoriteCount}
            </span>
            <span className="text-[10px] font-bold text-[#6F574E] uppercase">
              {t.profile.savedStat}
            </span>
          </div>
          <div className="p-3 rounded-[18px] bg-[#EFE9E1] border border-[#E6DED5]">
            <span className="block text-base font-extrabold text-[#3B2219] font-['Manrope']">
              {MOCK_USER.loyaltyPoints}
            </span>
            <span className="text-[10px] font-bold text-[#6F574E] uppercase">
              {t.profile.pointsStat}
            </span>
          </div>
        </div>

        {/* Sleek Language Switcher Card */}
        <div className="p-4 rounded-[24px] bg-[#FFFDF9] border border-[#E6DED5] shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-extrabold text-[#3B2219] font-['Manrope'] flex items-center gap-1.5">
                <span>🌐</span> {t.profile.languageSectionTitle}
              </h3>
              <p className="text-[11px] text-[#6F574E] mt-0.5">
                {t.profile.languageSectionSubtitle}
              </p>
            </div>
            <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-[#EFE9E1] text-[#3B2219]">
              4 Locales
            </span>
          </div>

          {/* 4-Language Segmented Pill Switcher */}
          <LanguageSwitcher variant="pills" />
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-[#EFE9E1] p-1 rounded-[16px]">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              setActiveTab('orders')
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-[12px] transition-all ${
              activeTab === 'orders'
                ? 'bg-[#FFFDF9] text-[#3B2219] shadow-xs'
                : 'text-[#6F574E] hover:text-[#3B2219]'
            }`}
          >
            📦 {t.profile.tabs.orders}
          </button>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              setActiveTab('seller')
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-[12px] transition-all ${
              activeTab === 'seller'
                ? 'bg-[#FFFDF9] text-[#3B2219] shadow-xs'
                : 'text-[#6F574E] hover:text-[#3B2219]'
            }`}
          >
            👨‍🍳 {t.profile.tabs.seller}
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

        {/* Tab 2: Become a Seller */}
        {activeTab === 'seller' && (
          <div className="p-5 rounded-[24px] bg-[#3B2219] text-white space-y-4 animate-in fade-in duration-200">
            <div className="w-12 h-12 rounded-[16px] bg-[#C85A32] flex items-center justify-center text-2xl">
              🍯
            </div>
            <div>
              <h4 className="text-base font-extrabold font-['Manrope']">
                {t.profile.becomeSellerTitle}
              </h4>
              <p className="text-xs text-[#EFE9E1]/80 mt-1 leading-relaxed">
                {t.profile.becomeSellerDesc}
              </p>
            </div>
            <Button
              variant="accent"
              size="md"
              fullWidth
              onClick={() => {
                haptic.impact('medium')
                window.Telegram?.WebApp?.openTelegramLink?.('https://t.me/locally_support_bot')
              }}
            >
              {t.profile.openStoreButton}
            </Button>
          </div>
        )}

        {/* Customer Care / Support */}
        <div className="p-4 rounded-[20px] bg-[#FFFDF9] border border-[#E6DED5] flex items-center justify-between shadow-xs">
          <div>
            <h4 className="text-xs font-extrabold text-[#3B2219] font-['Manrope']">
              💬 {t.profile.supportTitle}
            </h4>
            <p className="text-[10px] text-[#6F574E] mt-0.5">
              {t.profile.supportDesc}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              window.Telegram?.WebApp?.openTelegramLink?.('https://t.me/locally_support_bot')
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
    </div>
  )
}

export default ProfilePage
