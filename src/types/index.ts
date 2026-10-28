/**
 * Core TypeScript definitions for the Locally Marketplace Telegram Mini App.
 */

export interface Seller {
  id: string
  name: string
  avatarUrl?: string
  initials?: string
  rating: number
  reviewsCount: number
  location: string
  isVerified: boolean
  telegramUsername?: string
  bio?: string
}

export interface Product {
  id: string
  title: string
  description: string
  price: number
  currency?: string // default: 'UZS'
  category: string
  categoryId: string
  rating: number
  reviewsCount: number
  imageUrl: string
  seller: Seller
  prepTime?: string
  inStock?: boolean
  stockCount?: number
  unit?: string // e.g., 'per piece', '500g', 'set'
  tags?: string[]
  badge?: string // e.g., 'Fresh Batch', 'Bestseller', 'Handmade'
  isFeatured?: boolean
  ingredients?: string[]
}

export interface Category {
  id: string
  name: string
  slug: string
  icon: string
  badge?: string
  itemCount?: number
}

export interface CartItem {
  product: Product
  quantity: number
  notes?: string
  selectedOptions?: Record<string, string>
}

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'preparing'
  | 'delivering'
  | 'completed'
  | 'cancelled'

export type PaymentMethod =
  | 'telegram_pay'
  | 'click'
  | 'payme'
  | 'cash_on_delivery'

export interface Order {
  id: string
  orderNumber: string
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  discountAmount?: number
  totalAmount: number
  status: OrderStatus
  createdAt: string
  deliveryAddress: string
  deliveryTimeSlot?: string
  paymentMethod: PaymentMethod
  customerNotes?: string
}

export type NavTab = 'home' | 'menu' | 'cart' | 'profile'

export interface UserProfile {
  id: string
  firstName: string
  lastName?: string
  telegramUsername?: string
  avatarUrl?: string
  phone?: string
  address: string
  favoriteCount: number
  ordersCount: number
  loyaltyPoints: number
}

// Telegram Mini App Specific Interfaces
export interface TelegramUser {
  id: number
  is_bot?: boolean
  first_name: string
  last_name?: string
  username?: string
  language_code?: string
  is_premium?: boolean
  photo_url?: string
}

export interface TelegramThemeParams {
  bg_color?: string
  text_color?: string
  hint_color?: string
  link_color?: string
  button_color?: string
  button_text_color?: string
  secondary_bg_color?: string
  header_bg_color?: string
  accent_text_color?: string
  section_bg_color?: string
  section_header_text_color?: string
  subtitle_text_color?: string
  destructive_text_color?: string
}

export interface TelegramPopupButton {
  id?: string
  type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive'
  text?: string
}

export interface TelegramPopupParams {
  title?: string
  message: string
  buttons?: TelegramPopupButton[]
}

export type HapticImpactStyle = 'light' | 'medium' | 'heavy' | 'rigid' | 'soft'
export type HapticNotificationType = 'error' | 'success' | 'warning'

// Telegram WebApp window type augmentation
declare global {
  interface Window {
    Telegram?: {
      WebApp?: {
        initData: string
        initDataUnsafe?: {
          query_id?: string
          user?: TelegramUser
          receiver?: TelegramUser
          start_param?: string
          auth_date?: number
          hash?: string
        }
        version: string
        platform: string
        colorScheme: 'light' | 'dark'
        themeParams: TelegramThemeParams
        isExpanded: boolean
        viewportHeight: number
        viewportStableHeight: number
        headerColor?: string
        backgroundColor?: string

        // Lifecycle & Navigation
        ready: () => void
        expand: () => void
        close: () => void
        isVersionAtLeast: (version: string) => boolean
        setHeaderColor: (color: string) => void
        setBackgroundColor: (color: string) => void
        enableClosingConfirmation?: () => void
        disableClosingConfirmation?: () => void

        // UI Controls
        MainButton: {
          text: string
          color: string
          textColor: string
          isVisible: boolean
          isActive: boolean
          isProgressVisible: boolean
          setText: (text: string) => void
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
          show: () => void
          hide: () => void
          enable: () => void
          disable: () => void
          showProgress: (leaveActive?: boolean) => void
          hideProgress: () => void
          setParams: (params: {
            text?: string
            color?: string
            text_color?: string
            is_active?: boolean
            is_visible?: boolean
          }) => void
        }
        BackButton: {
          isVisible: boolean
          onClick: (callback: () => void) => void
          offClick: (callback: () => void) => void
          show: () => void
          hide: () => void
        }

        // Haptic Feedback
        HapticFeedback: {
          impactOccurred: (style: HapticImpactStyle) => void
          notificationOccurred: (type: HapticNotificationType) => void
          selectionChanged: () => void
        }

        // Popups & Dialogs
        showPopup: (
          params: TelegramPopupParams,
          callback?: (buttonId: string) => void
        ) => void
        showAlert: (message: string, callback?: () => void) => void
        showConfirm: (
          message: string,
          callback?: (confirmed: boolean) => void
        ) => void

        // External navigation
        openTelegramLink: (url: string) => void
        openLink: (url: string, options?: { try_instant_view?: boolean }) => void
        sendData: (data: string) => void
      }
    }
  }
}
