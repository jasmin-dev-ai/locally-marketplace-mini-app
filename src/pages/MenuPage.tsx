import React, { useState, useEffect } from 'react'
import { ArrowUpDown, Check, ChevronDown, PackageSearch } from 'lucide-react'
import { Header } from '../components/common/Header'
import { SearchBar } from '../components/common/SearchBar'
import { CategoryFilter } from '../components/product/CategoryFilter'
import { ProductGrid } from '../components/product/ProductGrid'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { MOCK_CATEGORIES } from '../data/mockData'
import { getPublicMarketplaceProducts } from '../services/adminService'
import { Product } from '../types'
import { triggerHaptic } from '../utils/telegram'

export interface MenuPageProps {
  onProductClick?: (product: Product) => void
}

type SortOption = 'recommended' | 'rating' | 'price_asc' | 'price_desc'

export const MenuPage: React.FC<MenuPageProps> = ({ onProductClick }) => {
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

  const [sortBy, setSortBy] = useState<SortOption>('recommended')
  const [activeTag, setActiveTag] = useState<string>('all')
  const [isSortOpen, setIsSortOpen] = useState(false)

  const tags = [
    { key: 'all', label: t.catalog.tags.all },
    { key: 'halal', label: t.catalog.tags.halal },
    { key: 'fresh daily', label: t.catalog.tags.freshDaily },
    { key: 'tandoor', label: t.catalog.tags.tandoor },
    { key: 'raw honey', label: t.catalog.tags.rawHoney },
    { key: 'heritage', label: t.catalog.tags.heritage },
  ]

  const sortOptions: { value: SortOption; label: string }[] = [
    { value: 'recommended', label: t.catalog.sortRecommended },
    { value: 'rating', label: t.catalog.sortRating },
    { value: 'price_asc', label: t.catalog.sortPriceAsc },
    { value: 'price_desc', label: t.catalog.sortPriceDesc },
  ]

  const cartQuantities = items.reduce<Record<string, number>>((acc, item) => {
    acc[item.product.id] = item.quantity
    return acc
  }, {})

  // Localize all marketplace products
  const localizedProducts = productsList.map(getLocalizedProduct)

  // Filter & sort products
  const filteredProducts = localizedProducts.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.categoryId === selectedCategory

    const matchesSearch =
      !searchQuery.trim() ||
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.seller.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesTag =
      activeTag === 'all' ||
      product.tags?.some((tagString) => tagString.toLowerCase().includes(activeTag.toLowerCase()))

    return matchesCategory && matchesSearch && matchesTag
  }).sort((a, b) => {
    if (sortBy === 'rating') return b.rating - a.rating
    if (sortBy === 'price_asc') return a.price - b.price
    if (sortBy === 'price_desc') return b.price - a.price
    return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0)
  })

  return (
    <div className="min-h-screen bg-[#FFFDF9] pb-28">
      <Header
        title={t.header.artisanCatalog}
        subtitle={t.header.catalogSubtitle}
        eyebrowText={t.header.locallyMarketplace}
      />

      <main className="px-5 pt-3 space-y-4">
        {/* Search */}
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder={t.catalog.searchPlaceholder}
        />

        {/* Categories Bar */}
        <CategoryFilter
          categories={MOCK_CATEGORIES}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
        />

        {/* Tag Filters & Sort Row */}
        <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar py-1">
          <div className="flex items-center gap-1.5 shrink-0">
            {tags.map((tag) => {
              const isSelected = activeTag === tag.key
              return (
                <button
                  key={tag.key}
                  type="button"
                  onClick={() => {
                    triggerHaptic('light')
                    setActiveTag(tag.key)
                  }}
                  className={`min-h-[40px] px-3.5 py-2 text-xs font-bold rounded-[12px] capitalize transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#2D231E] text-white shadow-xs'
                      : 'bg-[#FFFDF9] text-[#7A6B63] border border-[#EFE9E1] hover:bg-[#EFE9E1]/50'
                  }`}
                >
                  {tag.label}
                </button>
              )
            })}
          </div>

          {/* Refined Sort Popover */}
          <div className="relative shrink-0">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light')
                setIsSortOpen((prev) => !prev)
              }}
              className="flex items-center gap-1.5 min-h-[40px] px-3 py-2 text-xs font-bold bg-[#FFFDF9] border border-[#EFE9E1] rounded-[12px] text-[#2D231E] shadow-xs hover:border-[#C85A32]/40 active:scale-95 transition-all"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#C85A32]" />
              <span className="truncate max-w-[100px]">
                {sortOptions.find((o) => o.value === sortBy)?.label}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-[#7A6B63]" />
            </button>

            {isSortOpen && (
              <>
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsSortOpen(false)}
                />
                <div className="absolute right-0 top-11 z-40 w-48 rounded-[18px] bg-[#FFFDF9]/95 backdrop-blur-md border border-[#EFE9E1] shadow-[0_8px_24px_rgba(45,35,30,0.12)] p-1.5 space-y-1 animate-in fade-in zoom-in-95 duration-100">
                  {sortOptions.map((opt) => {
                    const isSelected = opt.value === sortBy
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          triggerHaptic('selection')
                          setSortBy(opt.value)
                          setIsSortOpen(false)
                        }}
                        className={`w-full min-h-[44px] flex items-center justify-between px-3 py-2 rounded-[12px] text-xs font-bold transition-all active:scale-95 ${
                          isSelected
                            ? 'bg-[#EFE9E1] text-[#2D231E]'
                            : 'text-[#7A6B63] hover:bg-[#EFE9E1]/50 hover:text-[#2D231E]'
                        }`}
                      >
                        <span>{opt.label}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#C85A32]" />}
                      </button>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Product Grid */}
        <div className="pt-2">
          {filteredProducts.length === 0 ? (
            <div className="py-14 text-center rounded-[24px] bg-[#FFFDF9] border border-[#EFE9E1]">
              <div className="w-12 h-12 rounded-full bg-[#EFE9E1] text-[#7A6B63] flex items-center justify-center mx-auto mb-2">
                <PackageSearch className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-[#2D231E]">
                {t.home.noProductsFound}
              </h4>
              <p className="text-xs text-[#7A6B63] mt-1 max-w-[200px] mx-auto">
                {t.catalog.filterCatalog}
              </p>
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('light')
                  setSearchQuery('')
                  setActiveTag('all')
                  setSelectedCategory('all')
                }}
                className="mt-4 px-4 py-2.5 min-h-[44px] rounded-[14px] bg-[#EFE9E1] text-[#2D231E] text-xs font-bold hover:bg-[#E2D8CD] active:scale-95 transition-all"
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
        </div>
      </main>
    </div>
  )
}

export default MenuPage
