import React, { useEffect } from 'react'
import { TelegramProvider, useTelegram } from './context/TelegramContext'
import { CartProvider, useCart } from './context/CartContext'
import { LanguageProvider, useLanguage } from './context/LanguageContext'
import { BottomNav } from './components/common/BottomNav'
import { HomePage } from './pages/HomePage'
import { MenuPage } from './pages/MenuPage'
import { CartPage } from './pages/CartPage'
import { ProfilePage } from './pages/ProfilePage'
import { OrderTrackingPage } from './pages/OrderTrackingPage'
import { AdminDashboard } from './pages/AdminDashboard'
import { CartDrawer } from './components/cart/CartDrawer'
import { ProductDetailModal } from './components/product/ProductDetailModal'
import { RoleOnboardingModal } from './components/auth/RoleOnboardingModal'
import { hasCompletedOnboarding, UserRole } from './services/roleService'
import { Order, Product } from './types'
import { THEME_COLORS } from './constants/theme'

function LocallyApp() {
  const {
    activeTab,
    setActiveTab,
    totalItems,
    items,
    subtotal,
    total,
    deliveryFee,
    updateQuantity,
    removeItem,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    selectedProduct,
    setSelectedProduct,
    addItem,
    favorites,
    toggleFavorite,
    isFavorite,
  } = useCart()

  const { mainButton, backButton, haptic, setHeaderColor, setBackgroundColor } =
    useTelegram()

  const { t } = useLanguage()

  const [activeOrder, setActiveOrder] = React.useState<Order | null>(null)
  const [isAdminOpen, setIsAdminOpen] = React.useState<boolean>(false)
  const [isOnboardingOpen, setIsOnboardingOpen] = React.useState<boolean>(() => !hasCompletedOnboarding())

  // Ensure Telegram WebApp theme matches Locally palette
  useEffect(() => {
    setHeaderColor(THEME_COLORS.background)
    setBackgroundColor(THEME_COLORS.background)
  }, [setHeaderColor, setBackgroundColor])

  // Lifecycle sync for Telegram native BackButton
  useEffect(() => {
    if (isAdminOpen) {
      backButton.show(() => {
        haptic.selection()
        setIsAdminOpen(false)
      })
    } else if (activeOrder) {
      backButton.show(() => {
        haptic.selection()
        setActiveOrder(null)
      })
    } else if (selectedProduct) {
      backButton.show(() => {
        haptic.selection()
        setSelectedProduct(null)
      })
    } else if (isCartDrawerOpen) {
      backButton.show(() => {
        haptic.selection()
        setIsCartDrawerOpen(false)
      })
    } else if (activeTab !== 'home') {
      backButton.show(() => {
        haptic.selection()
        setActiveTab('home')
      })
    } else {
      backButton.hide()
    }

    return () => {
      backButton.hide()
    }
  }, [isAdminOpen, activeOrder, selectedProduct, isCartDrawerOpen, activeTab, setSelectedProduct, setIsCartDrawerOpen, setActiveTab, backButton, haptic])

  // Lifecycle sync for Telegram native MainButton
  useEffect(() => {
    // Hide main button on onboarding, admin panel or order tracking screen
    if (isOnboardingOpen || isAdminOpen || activeOrder) {
      mainButton.hide()
      return () => mainButton.hide()
    }
    if (activeTab === 'cart') {
      if (totalItems > 0) {
        mainButton.show({
          text: `${t.telegramButton.proceedToCheckout} · ${total.toLocaleString()} ${t.common.currency}`,
          onClick: () => {
            haptic.impact('heavy')
            // Main button triggers checkout action on CartPage
            const checkoutBtn = document.querySelector<HTMLButtonElement>('[data-checkout-trigger]')
            if (checkoutBtn) {
              checkoutBtn.click()
            }
          },
          color: THEME_COLORS.accent, // Terracotta #C85A32
          textColor: '#FFFFFF',
        })
      } else {
        mainButton.hide()
      }
    } else if (selectedProduct) {
      mainButton.show({
        text: `${t.telegramButton.addToBasket} · ${selectedProduct.price.toLocaleString()} ${t.common.currency}`,
        onClick: () => {
          haptic.impact('medium')
          addItem(selectedProduct, 1)
          setSelectedProduct(null)
        },
        color: THEME_COLORS.accent,
        textColor: '#FFFFFF',
      })
    } else if (isCartDrawerOpen && totalItems > 0) {
      mainButton.show({
        text: `${t.telegramButton.checkout} · ${total.toLocaleString()} ${t.common.currency}`,
        onClick: () => {
          haptic.impact('medium')
          setIsCartDrawerOpen(false)
          setActiveTab('cart')
        },
        color: THEME_COLORS.accent,
        textColor: '#FFFFFF',
      })
    } else if (totalItems > 0 && (activeTab === 'home' || activeTab === 'menu')) {
      mainButton.show({
        text: `${t.telegramButton.viewBasket} (${totalItems}) · ${total.toLocaleString()} ${t.common.currency}`,
        onClick: () => {
          haptic.impact('light')
          setActiveTab('cart')
        },
        color: THEME_COLORS.primary, // Rich Espresso #3B2219
        textColor: '#FFFFFF',
      })
    } else {
      mainButton.hide()
    }

    return () => {
      mainButton.hide()
    }
  }, [isOnboardingOpen, isAdminOpen, activeOrder, activeTab, totalItems, total, selectedProduct, isCartDrawerOpen, mainButton, haptic, addItem, setSelectedProduct, setIsCartDrawerOpen, setActiveTab, t])

  const handleProductClick = (product: Product) => {
    haptic.selection()
    setSelectedProduct(product)
  }

  return (
    <div className="telegram-mini-app-shell relative flex flex-col justify-between">
      {/* First-Time Role Onboarding Modal (Buyer vs Seller / Artisan) */}
      <RoleOnboardingModal
        isOpen={isOnboardingOpen}
        onSelectRole={(role) => {
          setIsOnboardingOpen(false)
          if (role === 'seller') {
            setActiveTab('profile')
          }
        }}
        onClose={() => setIsOnboardingOpen(false)}
      />

      {/* Admin Dashboard Fullscreen Overlay */}
      {isAdminOpen && (
        <div className="absolute inset-0 z-50">
          <AdminDashboard
            onClose={() => {
              haptic.selection()
              setIsAdminOpen(false)
            }}
          />
        </div>
      )}

      {/* Order Tracking Fullscreen Overlay */}
      {activeOrder && (
        <div className="absolute inset-0 z-50">
          <OrderTrackingPage
            order={activeOrder}
            onClose={() => {
              haptic.selection()
              setActiveOrder(null)
              setActiveTab('home')
            }}
          />
        </div>
      )}

      {/* Active Screen View */}
      <div className="flex-1 w-full">
        {activeTab === 'home' && (
          <HomePage onProductClick={handleProductClick} />
        )}
        {activeTab === 'menu' && (
          <MenuPage onProductClick={handleProductClick} />
        )}
        {activeTab === 'cart' && (
          <CartPage onOrderPlaced={(order) => {
            haptic.notification('success')
            setActiveOrder(order)
          }} />
        )}
        {activeTab === 'profile' && (
          <ProfilePage
            onOpenAdmin={() => {
              haptic.selection()
              setIsAdminOpen(true)
            }}
          />
        )}
      </div>

      {/* Sticky Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        cartCount={totalItems}
      />

      {/* Quick Review Cart Drawer */}
      <CartDrawer
        isOpen={isCartDrawerOpen}
        onClose={() => setIsCartDrawerOpen(false)}
        items={items}
        subtotal={subtotal}
        total={total}
        deliveryFee={deliveryFee}
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
        onCheckout={() => {
          setIsCartDrawerOpen(false)
          setActiveTab('cart')
        }}
        onViewFullCart={() => {
          setIsCartDrawerOpen(false)
          setActiveTab('cart')
        }}
      />

      {/* Product Detail Modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={selectedProduct !== null}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addItem}
        isFavorite={selectedProduct ? isFavorite(selectedProduct.id) : false}
        onToggleFavorite={toggleFavorite}
      />
    </div>
  )
}

export default function App() {
  return (
    <TelegramProvider>
      <LanguageProvider>
        <CartProvider>
          <LocallyApp />
        </CartProvider>
      </LanguageProvider>
    </TelegramProvider>
  )
}
