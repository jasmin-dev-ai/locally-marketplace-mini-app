import React, { useState, useEffect } from 'react'
import { MapPin, Bell, ChevronDown, ArrowLeft, CheckCheck, X, Sparkles, Tag, ShoppingBag } from 'lucide-react'
import { triggerHaptic } from '../../utils/telegram'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useLanguage } from '../../context/LanguageContext'
import { getUserLocation, saveUserLocation, formatCleanCityDistrict } from '../../services/locationService'
import { LocationPickerModal } from './LocationPickerModal'

export interface HeaderProps {
  locationText?: string
  eyebrowText?: string
  onLocationClick?: () => void
  onNotificationClick?: () => void
  unreadNotifications?: boolean
  showBack?: boolean
  onBackClick?: () => void
  title?: string
  subtitle?: string
  rightAction?: React.ReactNode
  showLanguageSwitcher?: boolean
  className?: string
}

interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  unread: boolean
  icon: 'sparkles' | 'tag' | 'bag'
}

export const Header: React.FC<HeaderProps> = ({
  locationText,
  eyebrowText,
  onLocationClick,
  onNotificationClick,
  showBack = false,
  onBackClick,
  title,
  subtitle,
  rightAction,
  showLanguageSwitcher = true,
  className = '',
}) => {
  const { t, currentLocale } = useLanguage()

  // Dynamic user location state
  const [currentLocation, setCurrentLocation] = useState<string | null>(
    () => locationText ?? getUserLocation()
  )
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const [isNotificationOpen, setIsNotificationOpen] = useState(false)

  // Notification items state
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title:
        currentLocale === 'ru'
          ? 'Добро пожаловать в Locally!'
          : currentLocale === 'uz-Cyrl'
          ? 'Locally бозорига хуш келибсиз!'
          : currentLocale === 'en'
          ? 'Welcome to Locally!'
          : "Locally bozoriga xush kelibsiz!",
      message:
        currentLocale === 'ru'
          ? 'Свежая домашняя выпечка и ремесленные изделия с быстрой доставкой.'
          : currentLocale === 'uz-Cyrl'
          ? 'Янги уй пишириқлари ва қўл меҳнати буюмлари тезкор етказиб бериш билан.'
          : currentLocale === 'en'
          ? 'Small-batch artisan delicacies and handcrafted treasures.'
          : "Yangi uy pishiriqlari va qo'l mehnati buyumlari tezkor yetkazib berish bilan.",
      time: '10:00',
      unread: true,
      icon: 'sparkles',
    },
    {
      id: 'notif-2',
      title:
        currentLocale === 'ru'
          ? 'Скидка на первый заказ'
          : currentLocale === 'uz-Cyrl'
          ? 'Биринчи буюртмага чегирма'
          : currentLocale === 'en'
          ? 'First Order Bonus'
          : "Birinchi buyurtmaga chegirma",
      message:
        currentLocale === 'ru'
          ? 'Бесплатная доставка курьером при заказе от 100 000 сум.'
          : currentLocale === 'uz-Cyrl'
          ? '100 000 сўмдан юқори буюртмаларда курьер хизмати бепул.'
          : currentLocale === 'en'
          ? 'Enjoy complimentary delivery on orders over 100,000 UZS.'
          : "100 000 so'mdan yuqori buyurtmalarda kuryer xizmati bepul.",
      time: '09:15',
      unread: true,
      icon: 'tag',
    },
    {
      id: 'notif-3',
      title:
        currentLocale === 'ru'
          ? 'Мастера на связи'
          : currentLocale === 'uz-Cyrl'
          ? 'Усталар билан тўғридан-тўғри алоқа'
          : currentLocale === 'en'
          ? 'Direct Artisan Support'
          : "Ustalar bilan to'g'ridan-to'g'ri aloqa",
      message:
        currentLocale === 'ru'
          ? 'Каждый заказ готовится индивидуально под вас.'
          : currentLocale === 'uz-Cyrl'
          ? 'Ҳар бир таом ва буюм сиз учун алоҳида тайёрланади.'
          : currentLocale === 'en'
          ? 'Every item is hand-prepared with care upon ordering.'
          : "Har bir taom va buyum siz uchun alohida tayyorlanadi.",
      time: '18:40',
      unread: false,
      icon: 'bag',
    },
  ])

  const hasUnread = notifications.some((n) => n.unread)

  const handleMarkAllRead = () => {
    triggerHaptic('light')
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })))
  }

  useEffect(() => {
    if (locationText !== undefined) {
      setCurrentLocation(locationText)
    }
  }, [locationText])

  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentLocation(getUserLocation())
    }
    window.addEventListener('locally_location_changed', handleLocationChange)
    return () => {
      window.removeEventListener('locally_location_changed', handleLocationChange)
    }
  }, [])

  const handleLocationPress = () => {
    triggerHaptic('light')
    if (onLocationClick) {
      onLocationClick()
    }
    setIsLocationModalOpen(true)
  }

  const handleNotificationPress = () => {
    triggerHaptic('light')
    setIsNotificationOpen((prev) => !prev)
    onNotificationClick?.()
  }

  const resolvedEyebrow = eyebrowText ?? t.header.deliveringTo
  const displayLocation = formatCleanCityDistrict(currentLocation || t.location.defaultPlaceholder)

  return (
    <>
      <header
        className={`sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EFE9E1] transition-colors ${className}`}
        style={{
          paddingTop: 'max(14px, env(safe-area-inset-top, 14px))',
        }}
      >
        {showBack ? (
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light')
                onBackClick?.()
              }}
              className="flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#FFFDF9] border border-[#EFE9E1] text-[#2D231E] shadow-xs active:scale-95 transition-transform"
              aria-label={t.common.back}
            >
              <ArrowLeft className="w-5 h-5 text-[#2D231E]" />
            </button>
            {title && (
              <div>
                <h1 className="text-base font-bold text-[#2D231E] font-['Manrope'] leading-tight">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-xs text-[#7A6B63]">{subtitle}</p>
                )}
              </div>
            )}
          </div>
        ) : title ? (
          <div>
            {resolvedEyebrow && (
              <span className="block text-[10px] uppercase font-bold tracking-widest text-[#7A6B63] mb-0.5">
                {resolvedEyebrow}
              </span>
            )}
            <h1 className="text-lg font-extrabold text-[#2D231E] font-['Manrope'] tracking-tight">
              {title}
            </h1>
          </div>
        ) : (
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-[#7A6B63]">
              {resolvedEyebrow}
            </span>
            <button
              type="button"
              onClick={handleLocationPress}
              className="flex items-center gap-1.5 min-h-[44px] py-1 font-bold text-sm text-[#2D231E] mt-0.5 hover:text-[#C85A32] active:scale-95 transition-all"
            >
              <MapPin className="w-4 h-4 text-[#C85A32] shrink-0" />
              <span className={`truncate max-w-[170px] ${!currentLocation ? 'text-[#C85A32] font-semibold' : ''}`}>
                {displayLocation}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7A6B63] shrink-0" />
            </button>
          </div>
        )}

        {/* Right Action: Language Switcher and Notification Bell */}
        <div className="flex items-center gap-2 relative">
          {showLanguageSwitcher && <LanguageSwitcher variant="dropdown" />}
          {rightAction ? (
            rightAction
          ) : (
            <div className="relative">
              <button
                type="button"
                onClick={handleNotificationPress}
                className="relative flex items-center justify-center w-11 h-11 min-w-[44px] min-h-[44px] rounded-full bg-[#FFFDF9] border border-[#EFE9E1] text-[#2D231E] shadow-xs active:scale-95 transition-transform"
                aria-label={t.header.notifications}
              >
                <Bell className="w-5 h-5 text-[#2D231E]" />
                {hasUnread && (
                  <span className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-[#C85A32] rounded-full ring-2 ring-[#FFFDF9]" />
                )}
              </button>

              {/* Redesigned Notification Popover with Smooth Backdrop Blur */}
              {isNotificationOpen && (
                <>
                  {/* Backdrop overlay */}
                  <div
                    className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
                    onClick={() => setIsNotificationOpen(false)}
                  />

                  {/* Popover Card */}
                  <div className="absolute right-0 top-13 z-50 w-[300px] sm:w-[320px] rounded-[24px] bg-[#FFFDF9]/98 backdrop-blur-xl border border-[#EFE9E1] shadow-[0_12px_36px_rgba(45,35,30,0.12)] p-4 space-y-3 animate-in fade-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between pb-2 border-b border-[#EFE9E1]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-[#2D231E] font-['Manrope']">
                          {t.header.notifications}
                        </span>
                        {hasUnread && (
                          <span className="px-1.5 py-0.5 rounded-full text-[9px] font-black bg-[#C85A32] text-white">
                            {notifications.filter((n) => n.unread).length}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        {hasUnread && (
                          <button
                            type="button"
                            onClick={handleMarkAllRead}
                            className="text-[10px] font-bold text-[#C85A32] hover:underline flex items-center gap-1 active:scale-95"
                            title="Mark all as read"
                          >
                            <CheckCheck className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => setIsNotificationOpen(false)}
                          className="w-7 h-7 rounded-full flex items-center justify-center text-[#7A6B63] hover:text-[#2D231E] active:scale-95 transition-transform"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Notification items */}
                    <div className="space-y-2 max-h-[260px] overflow-y-auto no-scrollbar">
                      {notifications.map((item) => (
                        <div
                          key={item.id}
                          className={`p-2.5 rounded-[16px] border transition-colors flex items-start gap-2.5 ${
                            item.unread
                              ? 'bg-[#FFFDF9] border-[#EFE9E1]'
                              : 'bg-transparent border-transparent'
                          }`}
                        >
                          <div className="w-7 h-7 rounded-xl bg-[#EFE9E1] text-[#C85A32] flex items-center justify-center shrink-0 mt-0.5">
                            {item.icon === 'sparkles' ? (
                              <Sparkles className="w-3.5 h-3.5" />
                            ) : item.icon === 'tag' ? (
                              <Tag className="w-3.5 h-3.5" />
                            ) : (
                              <ShoppingBag className="w-3.5 h-3.5" />
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <h4 className="text-xs font-bold text-[#2D231E] truncate font-['Manrope']">
                                {item.title}
                              </h4>
                              <span className="text-[9px] text-[#7A6B63] shrink-0 ml-1">
                                {item.time}
                              </span>
                            </div>
                            <p className="text-[10px] text-[#7A6B63] mt-0.5 leading-snug line-clamp-2">
                              {item.message}
                            </p>
                          </div>
                          {item.unread && (
                            <span className="w-1.5 h-1.5 rounded-full bg-[#C85A32] shrink-0 mt-1.5" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Dynamic Location Selection Modal */}
      <LocationPickerModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        currentLocation={currentLocation}
        onLocationSelected={(newLoc) => {
          saveUserLocation(newLoc)
          setCurrentLocation(newLoc)
        }}
      />
    </>
  )
}

export default Header
