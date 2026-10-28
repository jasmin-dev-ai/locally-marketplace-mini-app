import React from 'react'
import { triggerHaptic } from '../../utils/telegram'
import { LanguageSwitcher } from './LanguageSwitcher'
import { useLanguage } from '../../context/LanguageContext'

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

export const Header: React.FC<HeaderProps> = ({
  locationText,
  eyebrowText,
  onLocationClick,
  onNotificationClick,
  unreadNotifications = true,
  showBack = false,
  onBackClick,
  title,
  subtitle,
  rightAction,
  showLanguageSwitcher = true,
  className = '',
}) => {
  const { t } = useLanguage()

  const resolvedLocation = locationText ?? t.header.defaultLocation
  const resolvedEyebrow = eyebrowText ?? t.header.deliveringTo

  return (
    <header
      className={`sticky top-0 z-30 flex items-center justify-between px-5 py-3.5 bg-[#FAF6F0]/95 backdrop-blur-md border-b border-[#E6DED5]/50 transition-colors ${className}`}
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
            className="flex items-center justify-center w-10 h-10 rounded-full bg-[#FFFDF9] border border-[#E6DED5] text-[#3B2219] shadow-xs active:scale-95 transition-transform"
            aria-label={t.common.back}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          {title && (
            <div>
              <h1 className="text-base font-bold text-[#3B2219] font-['Manrope'] leading-tight">
                {title}
              </h1>
              {subtitle && (
                <p className="text-xs text-[#6F574E]">{subtitle}</p>
              )}
            </div>
          )}
        </div>
      ) : title ? (
        <div>
          {resolvedEyebrow && (
            <span className="block text-[10px] uppercase font-bold tracking-widest text-[#6F574E] mb-0.5">
              {resolvedEyebrow}
            </span>
          )}
          <h1 className="text-lg font-extrabold text-[#3B2219] font-['Manrope'] tracking-tight">
            {title}
          </h1>
        </div>
      ) : (
        <div>
          <span className="block text-[10px] uppercase font-bold tracking-wider text-[#6F574E]">
            {resolvedEyebrow}
          </span>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              onLocationClick?.()
            }}
            className="flex items-center gap-1.5 font-bold text-sm text-[#3B2219] mt-0.5 hover:text-[#C85A32] transition-colors"
          >
            <svg
              className="w-4 h-4 text-[#C85A32] shrink-0"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            <span className="truncate max-w-[170px]">{resolvedLocation}</span>
            <span className="text-xs text-[#6F574E] font-medium">⌄</span>
          </button>
        </div>
      )}

      {/* Right Action: Language Switcher and Notification Bell */}
      <div className="flex items-center gap-2">
        {showLanguageSwitcher && <LanguageSwitcher variant="dropdown" />}
        {rightAction ? (
          rightAction
        ) : (
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              onNotificationClick?.()
            }}
            className="relative flex items-center justify-center w-10 h-10 rounded-full bg-[#FFFDF9] border border-[#E6DED5] text-[#3B2219] shadow-xs active:scale-95 transition-transform"
            aria-label={t.header.notifications}
          >
            <svg
              className="w-5 h-5 text-[#3B2219]"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            {unreadNotifications && (
              <span className="absolute top-2 right-2 w-2 h-2 bg-[#C85A32] rounded-full ring-2 ring-[#FFFDF9]" />
            )}
          </button>
        )}
      </div>
    </header>
  )
}

export default Header
