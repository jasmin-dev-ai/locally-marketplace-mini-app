import React, { useState, useRef, useEffect } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { Locale } from '../../i18n/types'
import { triggerHaptic } from '../../utils/telegram'

export interface LanguageSwitcherProps {
  variant?: 'pills' | 'dropdown'
  className?: string
}

export function getLanguageCodeDisplay(code: Locale): string {
  switch (code) {
    case 'uz-Latn':
      return 'UZ'
    case 'uz-Cyrl':
      return 'ЎЗ'
    case 'ru':
      return 'RU'
    case 'en':
      return 'EN'
    default:
      return 'EN'
  }
}

export function getLanguageFlag(code: Locale): string {
  switch (code) {
    case 'uz-Latn':
    case 'uz-Cyrl':
      return '🇺🇿'
    case 'ru':
      return '🇷🇺'
    case 'en':
      return '🇬🇧'
    default:
      return '🇺🇿'
  }
}

export const LanguageSwitcher: React.FC<LanguageSwitcherProps> = ({
  variant = 'pills',
  className = '',
}) => {
  const { locale, setLocale, locales, currentLanguage } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  const handleSelect = (code: Locale) => {
    if (code !== locale) {
      triggerHaptic('medium')
      setLocale(code)
    }
    setIsOpen(false)
  }

  // 1. Sleek Segmented Pill Grid for Profile Page & Onboarding
  if (variant === 'pills') {
    return (
      <div className={`space-y-2 ${className}`}>
        <div className="grid grid-cols-2 gap-2">
          {locales.map((lang) => {
            const isActive = lang.code === locale
            const flag = getLanguageFlag(lang.code)
            const codeDisplay = getLanguageCodeDisplay(lang.code)

            return (
              <button
                key={lang.code}
                type="button"
                onClick={() => handleSelect(lang.code)}
                className={`relative flex items-center gap-2.5 p-3 rounded-[18px] text-left transition-all duration-200 active:scale-[0.98] ${
                  isActive
                    ? 'bg-[#3B2219] text-white shadow-md ring-2 ring-[#C85A32]/50'
                    : 'bg-[#FFFDF9] text-[#3B2219] border border-[#E6DED5] hover:border-[#C85A32]/40 hover:bg-[#FAF6F0]'
                }`}
              >
                <span className="text-2xl shrink-0 leading-none" role="img" aria-label={lang.label}>
                  {flag}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold font-['Manrope'] truncate ${
                        isActive ? 'text-white' : 'text-[#3B2219]'
                      }`}
                    >
                      {lang.nativeName}
                    </span>
                    <span
                      className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md shrink-0 ml-1 ${
                        isActive
                          ? 'bg-[#C85A32] text-white'
                          : 'bg-[#EFE9E1] text-[#6F574E]'
                      }`}
                    >
                      {codeDisplay}
                    </span>
                  </div>
                  <span
                    className={`block text-[10px] mt-0.5 ${
                      isActive ? 'text-[#EFE9E1]/80' : 'text-[#8E7C74]'
                    }`}
                  >
                    {lang.label}
                  </span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  // 2. Compact Dropdown Pill for Header
  const activeFlag = getLanguageFlag(currentLanguage.code)
  const activeCodeDisplay = getLanguageCodeDisplay(currentLanguage.code)

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <button
        type="button"
        onClick={() => {
          triggerHaptic('light')
          setIsOpen(!isOpen)
        }}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFFDF9] border border-[#E6DED5] text-[#3B2219] shadow-xs active:scale-95 transition-all text-xs font-bold hover:border-[#C85A32]/40"
        aria-label="Switch Language"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none" role="img" aria-label="Country Flag">
          {activeFlag}
        </span>
        <span className="font-['Manrope'] text-[11px] font-extrabold uppercase tracking-wider text-[#3B2219]">
          {activeCodeDisplay}
        </span>
        <svg
          className={`w-3 h-3 text-[#6F574E] transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-[20px] bg-[#FFFDF9] border border-[#E6DED5] shadow-[0_12px_36px_rgba(59,34,25,0.16)] p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="px-2.5 py-1 text-[9px] uppercase font-extrabold tracking-widest text-[#8E7C74]">
            Select Language
          </div>
          <div className="space-y-0.5">
            {locales.map((lang) => {
              const isActive = lang.code === locale
              const flag = getLanguageFlag(lang.code)
              const codeDisplay = getLanguageCodeDisplay(lang.code)

              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code)}
                  className={`w-full flex items-center justify-between px-2.5 py-2 rounded-[14px] text-left transition-colors ${
                    isActive
                      ? 'bg-[#3B2219] text-white font-bold shadow-xs'
                      : 'text-[#3B2219] hover:bg-[#FAF6F0]'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg leading-none" role="img" aria-label={lang.label}>
                      {flag}
                    </span>
                    <span className="text-xs truncate font-['Manrope']">{lang.nativeName}</span>
                  </div>
                  <span
                    className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded-md ${
                      isActive
                        ? 'bg-[#C85A32] text-white'
                        : 'bg-[#EFE9E1] text-[#6F574E]'
                    }`}
                  >
                    {codeDisplay}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default LanguageSwitcher
