import React, { useState, useEffect } from 'react'
import { ArrowRight, Check, Star, Search, ShoppingBag } from 'lucide-react'
import { Header } from '../components/common/Header'
import { SearchBar } from '../components/common/SearchBar'
import { CategoryFilter } from '../components/product/CategoryFilter'
import { ProductGrid } from '../components/product/ProductGrid'
import { Button } from '../components/common/Button'
import { useCart } from '../context/CartContext'
import { useTelegram } from '../context/TelegramContext'
import { useLanguage } from '../context/LanguageContext'
import { MOCK_CATEGORIES } from '../data/mockData'
import { getPublicMarketplaceProducts } from '../services/adminService'
import { Product } from '../types'
import { triggerHaptic } from '../utils/telegram'

export interface HomePageProps {
  onProductClick?: (product: Product) => void
  onExploreCollection?: () => void
}

export const HomePage: React.FC<HomePageProps> = ({
  onProductClick,
  onExploreCollection,
}) => {
  const { user } = useTelegram()
  const { t, getLocalizedProduct } = useLanguage()
  const {
    items,
    addItem,
    updateQuantity,
    favorites,
    toggleFavorite,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    setSearchQuery,
    setIsCartDrawerOpen,
    setActiveTab,
    subtotal,
    totalItems,
  } = useCart()

  const [productsList, setProductsList] = useState<Product[]>(() => getPublicMarketplaceProducts())

  useEffect(() => {
    const handleUpdate = () => {
      setProductsList(getPublicMarketplaceProducts())
    }
    window.addEventListener('locally_products_updated', handleUpdate)
    window.addEventListener('locally_vendor_apps_updated', handleUpdate)
    return () => {
      window.removeEventListener('locally_products_updated', handleUpdate)
      window.removeEventListener('locally_vendor_apps_updated', handleUpdate)
    }
  }, [])

  // Build quantity map for quick lookup
  const cartQuantities = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.product.id] = item.quantity
    return acc
  }, {})

  // Localize all marketplace products
  const localizedProducts = productsList.map(getLocalizedProduct)

  // Filter products by selected category and search term
  const filteredProducts = localizedProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.categoryId === selectedCategory

    const matchesSearch =
      !searchQuery.trim() ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCategory && matchesSearch
  })

  return (
    <div className="min-h-screen bg-[#FAF6F0] pb-28">
      {/* Safe Area Sticky Header */}
      <Header
        onLocationClick={() => triggerHaptic('light')}
        onNotificationClick={() => triggerHaptic('light')}
      />

      <main className="px-5 pt-3 space-y-5">
        {/* Clean Modern Headline */}
        <div>
          <h2 className="text-2xl font-extrabold text-[#3B2219] font-['Manrope'] tracking-tight">
            {t.home.heroHeadline}
          </h2>
        </div>

        {/* Search Bar */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t.home.searchPlaceholder}
        />

        {/* Hero Editorial Card */}
        {!searchQuery && (
          <section className="relative h-[210px] rounded-[24px] overflow-hidden shadow-[0_10px_28px_rgba(59,34,25,0.08)] bg-[#3B2219]">
            <img
              src="https://images.unsplash.com/photo-1790498879720-1faecf186f33?auto=format&fit=crop&w=900&q=85"
              alt="Artisan feast table"
              className="w-full h-full object-cover opacity-85"
            />
            {/* Rich gradient overlay for high contrast text */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#24140E]/90 via-[#24140E]/60 to-transparent pointer-events-none" />

            <div className="absolute inset-0 p-5 flex flex-col justify-between text-white z-10">
              <div className="space-y-1.5 max-w-[220px]">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-widest bg-[#C85A32] text-white">
                  {t.home.heroBadge}
                </span>
                <h3 className="text-lg font-extrabold font-['Manrope'] leading-snug">
                  {t.home.heroTitle}
                </h3>
                <p className="text-[11px] text-[#EFE9E1]/85 line-clamp-2">
                  {t.home.heroSubtitle}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => {
                    triggerHaptic('medium')
                    setActiveTab('menu')
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[16px] bg-[#FFFDF9] text-[#933D1C] hover:bg-[#FAF6F0] active:scale-95 transition-all shadow-[0_4px_16px_rgba(0,0,0,0.22)] font-['Manrope'] font-black text-xs cursor-pointer border border-[#FFFDF9]/80"
                >
                  <ShoppingBag className="w-4 h-4 text-[#C85A32] stroke-[2.4]" />
                  <span className="tracking-wide">{t.home.orderNow}</span>
                </button>
              </div>
            </div>
          </section>
        )}

        {/* Categories Bar */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6F574E]">
              {t.catalog.allCategories}
            </span>
            {selectedCategory !== 'all' && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light')
                  setSelectedCategory('all')
                }}
                className="text-xs font-bold text-[#C85A32] hover:underline"
              >
                {t.home.resetFilters}
              </button>
            )}
          </div>
          <CategoryFilter
            categories={MOCK_CATEGORIES}
            selectedId={selectedCategory}
            onSelect={setSelectedCategory}
          />
        </div>

        {/* Featured Local Artisans Avatars Strip */}
        {!searchQuery && selectedCategory === 'all' && (
          <section className="space-y-2.5">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-extrabold text-[#3B2219] font-['Manrope']">
                {t.home.featuredArtisans}
              </h3>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light')
                  setActiveTab('menu')
                }}
                className="text-xs font-bold text-[#C85A32] hover:underline flex items-center gap-1"
              >
                <span>{t.home.viewAll}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
              {[
                { name: 'Malika’s Kitchen', role: 'Samsa Baker', rating: '4.95', initials: 'MK', verified: true },
                { name: 'Margilan Weaver', role: 'Silk Artisan', rating: '4.98', initials: 'MW', verified: true },
                { name: 'Aziza Bakes', role: 'Pastry Chef', rating: '4.88', initials: 'AB', verified: true },
                { name: 'Chatkal Apiary', role: 'Wild Honey', rating: '4.96', initials: 'CA', verified: true },
                { name: 'Old City Bread', role: 'Sourdough Non', rating: '4.82', initials: 'OC', verified: false },
              ].map((artisan) => (
                <div
                  key={artisan.name}
                  onClick={() => {
                    triggerHaptic('light')
                    setSearchQuery(artisan.name.split(' ')[0])
                  }}
                  className="flex flex-col items-center gap-1.5 p-3 rounded-[20px] bg-[#FFFDF9] border border-[#E6DED5] min-w-[108px] text-center shadow-xs cursor-pointer active:scale-95 transition-transform"
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-[#3B2219] text-[#FFFDF9] flex items-center justify-center font-extrabold text-sm font-['Manrope'] shadow-xs border-2 border-[#FAF6F0]">
                      {artisan.initials}
                    </div>
                    {artisan.verified && (
                      <span className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-[#C85A32] text-white flex items-center justify-center ring-2 ring-white">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-[#3B2219] truncate max-w-[90px] leading-tight">
                    {artisan.name}
                  </span>
                  <div className="flex items-center gap-0.5 text-[9px] font-bold text-[#6F574E]">
                    <Star className="w-2.5 h-2.5 fill-[#E5A118] text-[#E5A118]" />
                    <span>{artisan.rating}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Curated Product Grid */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-[#3B2219] font-['Manrope']">
              {searchQuery ? `"${searchQuery}"` : t.home.popularPicks}
            </h3>
            <span className="text-xs font-semibold text-[#6F574E]">
              {filteredProducts.length} {t.common.itemsCount}
            </span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="py-12 text-center rounded-[24px] bg-[#FFFDF9] border border-[#E6DED5]">
              <div className="w-12 h-12 rounded-full bg-[#EFE9E1] text-[#6F574E] flex items-center justify-center mx-auto mb-2">
                <Search className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#3B2219]">
                {t.home.noProductsFound}
              </h4>
              <p className="text-xs text-[#6F574E] mt-1 max-w-[200px] mx-auto">
                {t.home.searchPlaceholder}
              </p>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light')
                  setSearchQuery('')
                  setSelectedCategory('all')
                }}
                className="mt-4 px-4 py-2 rounded-[12px] bg-[#EFE9E1] text-[#3B2219] text-xs font-bold hover:bg-[#E6DED5]"
              >
                {t.home.resetFilters}
              </button>
            </div>
          ) : (
            <ProductGrid
              products={filteredProducts}
              cartQuantities={cartQuantities}
              onAddToCart={addItem}
              onUpdateQuantity={updateQuantity}
              onToggleFavorite={toggleFavorite}
              favorites={favorites}
              onProductClick={onProductClick}
            />
          )}
        </section>
      </main>

      {/* Floating Bottom Quick Cart Peek Pill (if user has items) */}
      {totalItems > 0 && (
        <div className="fixed bottom-20 left-5 right-5 z-30 max-w-md mx-auto animate-in slide-in-from-bottom-4 duration-200">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('medium')
              setIsCartDrawerOpen(true)
            }}
            className="w-full flex items-center justify-between px-4 py-3 rounded-[20px] bg-[#3B2219] text-white shadow-[0_12px_32px_rgba(59,34,25,0.32)] border border-[#C85A32]/30 active:scale-98 transition-transform"
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-[#C85A32] text-white text-xs font-extrabold flex items-center justify-center">
                {totalItems}
              </span>
              <span className="text-xs font-bold font-['Manrope']">
                {t.cart.drawerTitle}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-extrabold font-['Manrope']">
                {subtotal.toLocaleString()} {t.common.currency}
              </span>
              <ArrowRight className="w-3.5 h-3.5 text-white/70" />
            </div>
          </button>
        </div>
      )}
    </div>
  )
}

export default HomePage
