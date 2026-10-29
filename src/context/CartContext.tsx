import React, { createContext, useContext, useState, useEffect } from 'react'
import { CartItem, Product, NavTab } from '../types'
import { triggerHaptic } from '../utils/telegram'

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  deliveryFee: number
  total: number
  isCartDrawerOpen: boolean
  setIsCartDrawerOpen: (open: boolean) => void
  favorites: string[]
  toggleFavorite: (productId: string) => void
  isFavorite: (productId: string) => boolean
  selectedCategory: string
  setSelectedCategory: (categoryId: string) => void
  searchQuery: string
  setSearchQuery: (query: string) => void
  activeTab: NavTab
  setActiveTab: (tab: NavTab) => void
  selectedProduct: Product | null
  setSelectedProduct: (product: Product | null) => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

const CART_STORAGE_KEY = 'locally_marketplace_cart_v1'
const FAVORITES_STORAGE_KEY = 'locally_marketplace_favs_v1'

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAVORITES_STORAGE_KEY)
      return saved ? JSON.parse(saved) : ['prod-1', 'prod-3']
    } catch {
      return ['prod-1', 'prod-3']
    }
  })

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<NavTab>('home')
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items))
    } catch {
      // Ignore
    }
  }, [items])

  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites))
    } catch {
      // Ignore
    }
  }, [favorites])

  useEffect(() => {
    const handleFavUpdated = (e: any) => {
      if (Array.isArray(e.detail)) {
        setFavorites(e.detail)
      }
    }
    window.addEventListener('locally_favorites_updated', handleFavUpdated)
    return () => window.removeEventListener('locally_favorites_updated', handleFavUpdated)
  }, [])

  const addItem = (product: Product, quantity = 1) => {
    triggerHaptic('medium')
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity }]
    })
  }

  const removeItem = (productId: string) => {
    triggerHaptic('light')
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    triggerHaptic('light')
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => {
    triggerHaptic('medium')
    setItems([])
  }

  const toggleFavorite = (productId: string) => {
    triggerHaptic('light')
    setFavorites((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    )
  }

  const isFavorite = (productId: string) => favorites.includes(productId)

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0)
  const subtotal = items.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  )
  const deliveryFee = totalItems > 0 ? (subtotal >= 150000 ? 0 : 18000) : 0
  const total = subtotal + deliveryFee

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryFee,
        total,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        favorites,
        toggleFavorite,
        isFavorite,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        activeTab,
        setActiveTab,
        selectedProduct,
        setSelectedProduct,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}
