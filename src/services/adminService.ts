import { TelegramUser, Order, Product, OrderStatus } from '../types'
import { MOCK_PRODUCTS } from '../data/mockData'

// Storage keys
const STORAGE_ADMIN_OVERRIDE = 'locally_admin_dev_override'
const STORAGE_ADMIN_ORDERS = 'locally_admin_orders'
const STORAGE_ADMIN_PRODUCTS = 'locally_admin_products'

// Authorized Telegram Admin Whitelist
// Users can configure via .env or customize here
const ENV_ADMIN_CHAT_ID = import.meta.env.VITE_TELEGRAM_ADMIN_CHAT_ID as string | undefined
const ENV_ADMIN_USERNAME = import.meta.env.VITE_TELEGRAM_ADMIN_USERNAME as string | undefined

export const TELEGRAM_SUPPORT_USERNAME = 'murxamidinova_jasmin'
export const TELEGRAM_SUPPORT_URL = 'https://t.me/murxamidinova_jasmin'

export function openTelegramSupport(): void {
  const url = TELEGRAM_SUPPORT_URL
  if (window.Telegram?.WebApp?.openTelegramLink) {
    window.Telegram.WebApp.openTelegramLink(url)
  } else {
    window.open(url, '_blank', 'noopener,noreferrer')
  }
}

const DEFAULT_WHITELIST_USERNAMES = [
  'murxamidinova_jasmin',
  'jasmin_dev',
  'jasminamurxamidinova08',
  'asadbekorolov',
  'temur_alimov',
  'admin',
  'locally_admin',
]

const DEFAULT_WHITELIST_IDS = [
  '8850768299',
  '123456789',
]

export interface AdminMetrics {
  totalRevenue: number
  activeOrdersCount: number
  completedOrdersCount: number
  totalProductsCount: number
  registeredMakersCount: number
  pendingApplicationsCount: number
}

/**
 * Checks if the current Telegram user has administrative privileges.
 */
export function isAdminUser(user: TelegramUser | null): boolean {
  // 1. Check local development preview override
  if (isDevAdminOverride()) {
    return true
  }

  // 2. If no Telegram user is available (e.g. running in standard browser)
  if (!user) {
    // In dev mode or standalone preview, check if override is enabled
    return isDevAdminOverride()
  }

  // 3. Match by numeric Telegram ID
  const userIdStr = String(user.id)
  if (ENV_ADMIN_CHAT_ID && String(ENV_ADMIN_CHAT_ID).trim() === userIdStr) {
    return true
  }
  if (DEFAULT_WHITELIST_IDS.includes(userIdStr)) {
    return true
  }

  // 4. Match by Telegram Username (case-insensitive)
  if (user.username) {
    const cleanUsername = user.username.toLowerCase().replace(/^@/, '')
    if (ENV_ADMIN_USERNAME && ENV_ADMIN_USERNAME.toLowerCase().replace(/^@/, '') === cleanUsername) {
      return true
    }
    if (DEFAULT_WHITELIST_USERNAMES.map((u) => u.toLowerCase()).includes(cleanUsername)) {
      return true
    }
  }

  return false
}

/**
 * Returns developer admin preview override state from localStorage.
 */
export function isDevAdminOverride(): boolean {
  try {
    return localStorage.getItem(STORAGE_ADMIN_OVERRIDE) === 'true'
  } catch {
    return false
  }
}

/**
 * Toggles developer admin preview override.
 */
export function setDevAdminOverride(enabled: boolean): void {
  try {
    if (enabled) {
      localStorage.setItem(STORAGE_ADMIN_OVERRIDE, 'true')
    } else {
      localStorage.removeItem(STORAGE_ADMIN_OVERRIDE)
    }
  } catch {
    // Ignore storage errors
  }
}

// ─── Initial Mock Orders for Admin Management ─────────────────────────────────

const INITIAL_ADMIN_ORDERS: Order[] = [
  {
    id: 'LOC-894120',
    orderNumber: 'LOC-894120',
    items: [
      {
        product: MOCK_PRODUCTS[0], // Golden Tandoor Samsa
        quantity: 2,
      },
      {
        product: MOCK_PRODUCTS[1], // Medovik
        quantity: 1,
      },
    ],
    subtotal: 124000,
    deliveryFee: 0,
    totalAmount: 124000,
    status: 'preparing',
    createdAt: new Date(Date.now() - 1000 * 60 * 25).toISOString(),
    deliveryAddress: 'Mirabad Avenue, Block 4, Apt 42, Tashkent',
    deliveryTimeSlot: 'Today, 17:00 – 18:30',
    paymentMethod: 'telegram_pay',
    customerNotes: 'Please ring the doorbell twice',
  },
  {
    id: 'LOC-912405',
    orderNumber: 'LOC-912405',
    items: [
      {
        product: MOCK_PRODUCTS[4], // Mountain Wildflower Honey
        quantity: 2,
      },
    ],
    subtotal: 170000,
    deliveryFee: 0,
    totalAmount: 170000,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    deliveryAddress: 'Yunusabad, 11-Mavze, House 18, Tashkent',
    deliveryTimeSlot: 'Today, 18:00 – 19:30',
    paymentMethod: 'click',
  },
  {
    id: 'LOC-732109',
    orderNumber: 'LOC-732109',
    items: [
      {
        product: MOCK_PRODUCTS[3], // Sourdough Non
        quantity: 3,
      },
      {
        product: MOCK_PRODUCTS[4], // Honey
        quantity: 1,
      },
    ],
    subtotal: 139000,
    deliveryFee: 15000,
    totalAmount: 154000,
    status: 'delivering',
    createdAt: new Date(Date.now() - 1000 * 60 * 55).toISOString(),
    deliveryAddress: 'Buyuk Ipak Yoli, 45, Tashkent',
    deliveryTimeSlot: 'Today, 16:00 – 17:30',
    paymentMethod: 'payme',
  },
  {
    id: 'LOC-610944',
    orderNumber: 'LOC-610944',
    items: [
      {
        product: MOCK_PRODUCTS[2], // Adras Table Runner
        quantity: 1,
      },
    ],
    subtotal: 185000,
    deliveryFee: 0,
    totalAmount: 185000,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString(),
    deliveryAddress: 'Chorsu Square, Craft Hub, Tashkent',
    deliveryTimeSlot: 'Yesterday, 15:00',
    paymentMethod: 'cash_on_delivery',
  },
]

// ─── Reactive Admin Data Helpers ──────────────────────────────────────────────

export function getAdminOrders(): Order[] {
  try {
    const raw = localStorage.getItem(STORAGE_ADMIN_ORDERS)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch {
    // fallback
  }
  return INITIAL_ADMIN_ORDERS
}

export function saveAdminOrders(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_ADMIN_ORDERS, JSON.stringify(orders))
  } catch {
    // Ignore
  }
}

export function updateOrderStatus(orderId: string, status: OrderStatus): Order[] {
  const currentOrders = getAdminOrders()
  const updated = currentOrders.map((o) => (o.id === orderId ? { ...o, status } : o))
  saveAdminOrders(updated)
  return updated
}

export function getAdminProducts(): Product[] {
  try {
    const raw = localStorage.getItem(STORAGE_ADMIN_PRODUCTS)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch {
    // fallback
  }
  return MOCK_PRODUCTS
}

export function saveAdminProducts(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_ADMIN_PRODUCTS, JSON.stringify(products))
    window.dispatchEvent(new CustomEvent('locally_products_updated', { detail: products }))
  } catch {
    // Ignore
  }
}

export function getPublicMarketplaceProducts(): Product[] {
  return getAdminProducts()
}

export function toggleProductStock(productId: string): Product[] {
  const products = getAdminProducts()
  const updated = products.map((p) =>
    p.id === productId ? { ...p, inStock: !p.inStock } : p
  )
  saveAdminProducts(updated)
  return updated
}

export function updateProductPrice(productId: string, newPrice: number): Product[] {
  const products = getAdminProducts()
  const updated = products.map((p) =>
    p.id === productId ? { ...p, price: newPrice } : p
  )
  saveAdminProducts(updated)
  return updated
}

export function addAdminProduct(newProduct: Omit<Product, 'id'>): Product[] {
  const products = getAdminProducts()
  const generatedId = `prod-${Date.now().toString().slice(-4)}`
  const item: Product = {
    ...newProduct,
    id: generatedId,
  }
  const updated = [item, ...products]
  saveAdminProducts(updated)
  return updated
}

export function computeAdminMetrics(): AdminMetrics {
  const orders = getAdminOrders()
  const products = getAdminProducts()
  const apps = getVendorApplications()

  const totalRevenue = orders.reduce((sum, o) => {
    if (o.status !== 'cancelled') {
      return sum + o.totalAmount
    }
    return sum
  }, 0)

  const activeOrdersCount = orders.filter(
    (o) => o.status === 'confirmed' || o.status === 'preparing' || o.status === 'delivering'
  ).length

  const completedOrdersCount = orders.filter((o) => o.status === 'completed').length

  const makersSet = new Set(products.map((p) => p.seller.id))

  const pendingApplicationsCount = apps.filter((a) => a.status === 'pending').length

  return {
    totalRevenue,
    activeOrdersCount,
    completedOrdersCount,
    totalProductsCount: products.length,
    registeredMakersCount: makersSet.size,
    pendingApplicationsCount,
  }
}

// ─── Vendor Onboarding & Store Applications ──────────────────────────────────

export type VendorLegalStatus =
  | 'craft_certificate'
  | 'individual_entrepreneur'
  | 'home_artisan'

export type VendorApplicationStatus = 'pending' | 'approved' | 'rejected'

export interface VendorApplication {
  id: string
  shopName: string
  ownerName: string
  telegramUsername?: string
  phone: string
  category: string
  legalStatus: VendorLegalStatus
  legalStatusLabel: string
  description: string
  status: VendorApplicationStatus
  createdAt: string
  reviewedAt?: string
  rejectionReason?: string
}

const STORAGE_ADMIN_VENDOR_APPS = 'locally_admin_vendor_apps'

const INITIAL_VENDOR_APPS: VendorApplication[] = [
  {
    id: 'VAPP-401',
    shopName: 'Samarqand Halva Artel',
    ownerName: 'Akmal Razzoqov',
    telegramUsername: 'akmal_halva',
    phone: '+998 90 123 45 67',
    category: 'sweets',
    legalStatus: 'craft_certificate',
    legalStatusLabel: 'Hunarmand guvohnomasi bor',
    description: 'Qadimiy Samarqand yong‘oqli holvalari va pashmaklarini 3-avlod retsepti bo‘yicha tayyorlaymiz.',
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
  },
  {
    id: 'VAPP-392',
    shopName: 'Margilan Silk & Woodcraft',
    ownerName: 'Nodira To‘rayeva',
    telegramUsername: 'nodira_craft',
    phone: '+998 93 987 65 43',
    category: 'crafts',
    legalStatus: 'individual_entrepreneur',
    legalStatusLabel: 'YTT / O‘zini o‘zi band qilgan',
    description: 'Marg‘ilon tabiiy ipak ro‘mollari va qo‘lda o‘yilgan yog‘och sandiqchalar.',
    status: 'approved',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString(),
    reviewedAt: new Date(Date.now() - 1000 * 60 * 60 * 20).toISOString(),
  },
]

export function getVendorApplications(): VendorApplication[] {
  try {
    const raw = localStorage.getItem(STORAGE_ADMIN_VENDOR_APPS)
    if (raw) {
      return JSON.parse(raw)
    }
  } catch {
    // fallback
  }
  return INITIAL_VENDOR_APPS
}

export function saveVendorApplications(apps: VendorApplication[]): void {
  try {
    localStorage.setItem(STORAGE_ADMIN_VENDOR_APPS, JSON.stringify(apps))
    window.dispatchEvent(new CustomEvent('locally_vendor_apps_updated', { detail: apps }))
  } catch {
    // ignore
  }
}

export function submitVendorApplication(
  data: Omit<VendorApplication, 'id' | 'status' | 'createdAt'>
): VendorApplication {
  const current = getVendorApplications()
  const newApp: VendorApplication = {
    ...data,
    id: `VAPP-${Date.now().toString().slice(-4)}`,
    status: 'pending',
    createdAt: new Date().toISOString(),
  }

  const updated = [newApp, ...current]
  saveVendorApplications(updated)
  return newApp
}

export function updateVendorApplicationStatus(
  appId: string,
  status: VendorApplicationStatus,
  reason?: string
): VendorApplication[] {
  const current = getVendorApplications()
  let newlyApprovedApp: VendorApplication | undefined

  const updated = current.map((app) => {
    if (app.id === appId) {
      if (status === 'approved') newlyApprovedApp = app
      return {
        ...app,
        status,
        reviewedAt: new Date().toISOString(),
        rejectionReason: reason || app.rejectionReason,
      }
    }
    return app
  })

  saveVendorApplications(updated)

  // When approved by Admin, publish vendor's shop to marketplace products!
  if (newlyApprovedApp && status === 'approved') {
    const app = newlyApprovedApp
    const products = getAdminProducts()
    const alreadyExists = products.some((p) => p.seller.name.toLowerCase() === app.shopName.toLowerCase())

    if (!alreadyExists) {
      addAdminProduct({
        title: `${app.shopName} Saralangan Toʻplami`,
        description: app.description || 'Hunarmand tomonidan mehr bilan tayyorlangan tabiiy mahsulot.',
        price: 45000,
        category: (app.category as any) || 'crafts',
        categoryId: (app.category as any) || 'crafts',
        imageUrl:
          app.category === 'bakery'
            ? 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80'
            : app.category === 'sweets'
            ? 'https://images.unsplash.com/photo-1587314168485-3236d6710814?w=600&auto=format&fit=crop&q=80'
            : 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80',
        rating: 5.0,
        reviewsCount: 1,
        inStock: true,
        seller: {
          id: `seller-${app.id.toLowerCase()}`,
          name: app.shopName,
          initials: app.shopName.slice(0, 2).toUpperCase(),
          rating: 5.0,
          isVerified: true,
          productsCount: 1,
        },
      })
    }
  }

  return updated
}

export function getUserVendorApplication(
  telegramUsername?: string
): VendorApplication | null {
  if (!telegramUsername) return null
  const cleanUsername = telegramUsername.toLowerCase().replace(/^@/, '')
  const apps = getVendorApplications()
  return (
    apps.find(
      (a) => a.telegramUsername?.toLowerCase().replace(/^@/, '') === cleanUsername
    ) || null
  )
}

