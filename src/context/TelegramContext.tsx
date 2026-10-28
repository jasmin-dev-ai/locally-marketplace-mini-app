import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react'
import {
  TelegramUser,
  TelegramThemeParams,
  HapticImpactStyle,
  HapticNotificationType,
} from '../types'
import { THEME_COLORS } from '../constants/theme'

export interface MainButtonConfig {
  text: string
  onClick: () => void
  color?: string
  textColor?: string
  isVisible?: boolean
  isActive?: boolean
  isLoading?: boolean
}

interface TelegramContextValue {
  isAvailable: boolean
  isReady: boolean
  user: TelegramUser | null
  themeParams: TelegramThemeParams
  colorScheme: 'light' | 'dark'
  viewportHeight: number
  isExpanded: boolean
  
  // Haptic feedback methods
  haptic: {
    impact: (style?: HapticImpactStyle) => void
    notification: (type: HapticNotificationType) => void
    selection: () => void
  }

  // Telegram native button controls
  mainButton: {
    show: (config: MainButtonConfig) => void
    hide: () => void
    setText: (text: string) => void
    setLoading: (loading: boolean) => void
  }

  backButton: {
    show: (onClick: () => void) => void
    hide: () => void
  }

  // Dialog helpers
  showAlert: (message: string) => Promise<void>
  showConfirm: (message: string) => Promise<boolean>
  closeApp: () => void
  setHeaderColor: (color: string) => void
  setBackgroundColor: (color: string) => void
}

const TelegramContext = createContext<TelegramContextValue | undefined>(undefined)

export const TelegramProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAvailable, setIsAvailable] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const [user, setUser] = useState<TelegramUser | null>(null)
  const [themeParams, setThemeParams] = useState<TelegramThemeParams>({})
  const [colorScheme, setColorScheme] = useState<'light' | 'dark'>('light')
  const [viewportHeight, setViewportHeight] = useState(window.innerHeight)
  const [isExpanded, setIsExpanded] = useState(false)

  // Track active handlers for MainButton and BackButton to avoid memory leaks
  const mainButtonCallbackRef = useRef<(() => void) | null>(null)
  const backButtonCallbackRef = useRef<(() => void) | null>(null)

  useEffect(() => {
    const tg = typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined

    if (tg) {
      setIsAvailable(true)
      try {
        tg.ready()
        tg.expand()
        setIsReady(true)

        // Sync initial state
        if (tg.initDataUnsafe?.user) {
          setUser(tg.initDataUnsafe.user)
        }
        if (tg.themeParams) {
          setThemeParams(tg.themeParams)
        }
        if (tg.colorScheme) {
          setColorScheme(tg.colorScheme)
        }
        setViewportHeight(tg.viewportHeight || window.innerHeight)
        setIsExpanded(tg.isExpanded || false)

        // Configure header & background with signature Locally theme fallback
        if (tg.setHeaderColor) {
          tg.setHeaderColor(THEME_COLORS.background)
        }
        if (tg.setBackgroundColor) {
          tg.setBackgroundColor(THEME_COLORS.background)
        }
      } catch (err) {
        console.debug('Telegram WebApp setup notice:', err)
      }
    } else {
      // Browser preview mode fallback
      setIsAvailable(false)
      setIsReady(true)
      setUser({
        id: 999124,
        first_name: 'Temur',
        last_name: 'Alimov',
        username: 'temur_alimov',
        language_code: 'en',
      })
    }
  }, [])

  // Haptic feedback methods with safety checks
  const haptic = {
    impact: useCallback((style: HapticImpactStyle = 'light') => {
      try {
        window.Telegram?.WebApp?.HapticFeedback?.impactOccurred(style)
      } catch {
        // Fallback for desktop browser
      }
    }, []),

    notification: useCallback((type: HapticNotificationType) => {
      try {
        window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred(type)
      } catch {
        // Fallback for desktop browser
      }
    }, []),

    selection: useCallback(() => {
      try {
        window.Telegram?.WebApp?.HapticFeedback?.selectionChanged()
      } catch {
        // Fallback for desktop browser
      }
    }, []),
  }

  // Native MainButton Management
  const mainButton = {
    show: useCallback(({ text, onClick, color, textColor }: MainButtonConfig) => {
      const tg = window.Telegram?.WebApp
      if (!tg?.MainButton) return

      try {
        // Clean up previous listener
        if (mainButtonCallbackRef.current) {
          tg.MainButton.offClick(mainButtonCallbackRef.current)
        }

        mainButtonCallbackRef.current = onClick
        tg.MainButton.onClick(onClick)

        tg.MainButton.setParams({
          text,
          color: color || THEME_COLORS.accent, // Terracotta #C85A32
          text_color: textColor || '#FFFFFF',
          is_active: true,
          is_visible: true,
        })
        tg.MainButton.show()
      } catch (e) {
        console.debug('MainButton show suppressed:', e)
      }
    }, []),

    hide: useCallback(() => {
      const tg = window.Telegram?.WebApp
      if (!tg?.MainButton) return

      try {
        if (mainButtonCallbackRef.current) {
          tg.MainButton.offClick(mainButtonCallbackRef.current)
          mainButtonCallbackRef.current = null
        }
        tg.MainButton.hide()
      } catch {
        // Suppress
      }
    }, []),

    setText: useCallback((text: string) => {
      window.Telegram?.WebApp?.MainButton?.setText(text)
    }, []),

    setLoading: useCallback((loading: boolean) => {
      const mb = window.Telegram?.WebApp?.MainButton
      if (!mb) return
      if (loading) {
        mb.showProgress(false)
        mb.disable()
      } else {
        mb.hideProgress()
        mb.enable()
      }
    }, []),
  }

  // Native BackButton Management
  const backButton = {
    show: useCallback((onClick: () => void) => {
      const tg = window.Telegram?.WebApp
      if (!tg?.BackButton) return

      try {
        if (backButtonCallbackRef.current) {
          tg.BackButton.offClick(backButtonCallbackRef.current)
        }

        backButtonCallbackRef.current = onClick
        tg.BackButton.onClick(onClick)
        tg.BackButton.show()
      } catch {
        // Suppress
      }
    }, []),

    hide: useCallback(() => {
      const tg = window.Telegram?.WebApp
      if (!tg?.BackButton) return

      try {
        if (backButtonCallbackRef.current) {
          tg.BackButton.offClick(backButtonCallbackRef.current)
          backButtonCallbackRef.current = null
        }
        tg.BackButton.hide()
      } catch {
        // Suppress
      }
    }, []),
  }

  // Native Alert / Confirm dialogs
  const showAlert = useCallback((message: string): Promise<void> => {
    return new Promise((resolve) => {
      const tg = window.Telegram?.WebApp
      if (tg?.showAlert) {
        tg.showAlert(message, () => resolve())
      } else {
        window.alert(message)
        resolve()
      }
    })
  }, [])

  const showConfirm = useCallback((message: string): Promise<boolean> => {
    return new Promise((resolve) => {
      const tg = window.Telegram?.WebApp
      if (tg?.showConfirm) {
        tg.showConfirm(message, (confirmed) => resolve(confirmed))
      } else {
        resolve(window.confirm(message))
      }
    })
  }, [])

  const closeApp = useCallback(() => {
    window.Telegram?.WebApp?.close()
  }, [])

  const setHeaderColor = useCallback((color: string) => {
    try {
      window.Telegram?.WebApp?.setHeaderColor?.(color)
    } catch {
      // Suppress
    }
  }, [])

  const setBackgroundColor = useCallback((color: string) => {
    try {
      window.Telegram?.WebApp?.setBackgroundColor?.(color)
    } catch {
      // Suppress
    }
  }, [])

  return (
    <TelegramContext.Provider
      value={{
        isAvailable,
        isReady,
        user,
        themeParams,
        colorScheme,
        viewportHeight,
        isExpanded,
        haptic,
        mainButton,
        backButton,
        showAlert,
        showConfirm,
        closeApp,
        setHeaderColor,
        setBackgroundColor,
      }}
    >
      {children}
    </TelegramContext.Provider>
  )
}

export const useTelegram = () => {
  const context = useContext(TelegramContext)
  if (!context) {
    throw new Error('useTelegram must be used within a TelegramProvider')
  }
  return context
}

export default TelegramContext
