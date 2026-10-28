import { THEME_COLORS } from '../constants/theme'
import { HapticImpactStyle, HapticNotificationType } from '../types'

/**
 * Telegram Mini App WebApp helper utility.
 * Gracefully degrades when running in regular browser preview.
 */

export const isTelegramWebApp = (): boolean => {
  return typeof window !== 'undefined' && Boolean(window.Telegram?.WebApp?.initData)
}

export const getTelegramWebApp = () => {
  if (typeof window !== 'undefined' && window.Telegram?.WebApp) {
    return window.Telegram.WebApp
  }
  return null
}

export const initTelegramApp = () => {
  const tg = getTelegramWebApp()
  if (!tg) return

  try {
    tg.ready()
    tg.expand()
    // Configure header & background to match Locally theme
    if (tg.setHeaderColor) tg.setHeaderColor(THEME_COLORS.background)
    if (tg.setBackgroundColor) tg.setBackgroundColor(THEME_COLORS.background)
  } catch (err) {
    console.debug('Telegram WebApp init suppressed:', err)
  }
}

export const triggerHaptic = (
  type: HapticImpactStyle | HapticNotificationType | 'selection' = 'light'
) => {
  const tg = getTelegramWebApp()
  if (!tg?.HapticFeedback) return

  try {
    if (type === 'selection') {
      tg.HapticFeedback.selectionChanged()
    } else if (type === 'success' || type === 'warning' || type === 'error') {
      tg.HapticFeedback.notificationOccurred(type)
    } else {
      tg.HapticFeedback.impactOccurred(type as HapticImpactStyle)
    }
  } catch {
    // Non-blocking in dev environments
  }
}
