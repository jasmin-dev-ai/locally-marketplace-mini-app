import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react'
import { LanguageOption, Locale, TranslationSchema } from '../i18n/types'
import { LANGUAGE_OPTIONS, TRANSLATIONS } from '../i18n/translations'
import { Category, Product } from '../types'
import { localizeCategoryName, localizeProduct } from '../i18n/productData'
import { triggerHaptic } from '../utils/telegram'

const STORAGE_KEY = 'locally_locale'

interface LanguageContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: TranslationSchema
  locales: LanguageOption[]
  currentLanguage: LanguageOption
  getLocalizedProduct: (product: Product) => Product
  getLocalizedCategory: (category: Category) => Category
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined)

function resolveDefaultLocale(): Locale {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved && (saved === 'uz-Latn' || saved === 'uz-Cyrl' || saved === 'ru' || saved === 'en')) {
      return saved as Locale
    }

    // Check Telegram WebApp user language
    if (typeof window !== 'undefined') {
      const tgLang = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code?.toLowerCase()
      if (tgLang) {
        if (tgLang.startsWith('ru')) return 'ru'
        if (tgLang.startsWith('uz')) return 'uz-Latn'
        if (tgLang.startsWith('en')) return 'en'
      }

      // Check browser navigator language
      const navLang = navigator.language?.toLowerCase()
      if (navLang) {
        if (navLang.startsWith('ru')) return 'ru'
        if (navLang.startsWith('uz')) return 'uz-Latn'
        if (navLang.startsWith('en')) return 'en'
      }
    }
  } catch {
    // Fallback if localStorage or Telegram context is restricted
  }

  return 'uz-Latn'
}

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(resolveDefaultLocale)

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    try {
      localStorage.setItem(STORAGE_KEY, newLocale)
    } catch {
      // ignore storage errors
    }
    triggerHaptic('selection')
  }, [])

  const t = useMemo(() => {
    return TRANSLATIONS[locale] || TRANSLATIONS['uz-Latn']
  }, [locale])

  const currentLanguage = useMemo(() => {
    return LANGUAGE_OPTIONS.find((l) => l.code === locale) || LANGUAGE_OPTIONS[0]
  }, [locale])

  const getLocalizedProduct = useCallback(
    (product: Product): Product => {
      return localizeProduct(product, locale)
    },
    [locale]
  )

  const getLocalizedCategory = useCallback(
    (category: Category): Category => {
      return {
        ...category,
        name: localizeCategoryName(category.id, locale, category.name),
      }
    },
    [locale]
  )

  const value = useMemo<LanguageContextValue>(() => ({
    locale,
    setLocale,
    t,
    locales: LANGUAGE_OPTIONS,
    currentLanguage,
    getLocalizedProduct,
    getLocalizedCategory,
  }), [locale, setLocale, t, currentLanguage, getLocalizedProduct, getLocalizedCategory])

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = (): LanguageContextValue => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const useTranslation = () => {
  const { t, locale, setLocale, currentLanguage, locales } = useLanguage()
  return { t, locale, setLocale, currentLanguage, locales }
}
