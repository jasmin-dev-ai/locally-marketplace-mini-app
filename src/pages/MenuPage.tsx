import React, { useState } from 'react'
import { Header } from '../components/common/Header'
import { SearchBar } from '../components/common/SearchBar'
import { CategoryFilter } from '../components/product/CategoryFilter'
import { ProductGrid } from '../components/product/ProductGrid'
import { useCart } from '../context/CartContext'
import { useLanguage } from '../context/LanguageContext'
import { MOCK_CATEGORIES, MOCK_PRODUCTS } from '../data/mockData'
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

  const [sortBy, setSortBy] = useState<SortOption>('recommended')
  const [activeTag, setActiveTag] = useState<string>('all')

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

  // Localize all mock products
  const localizedProducts = MOCK_PRODUCTS.map(getLocalizedProduct)

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
    <div className="min-h-screen bg-[#FAF6F0] pb-28">
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
                  className={`text-[11px] font-bold px-2.5 py-1 rounded-[10px] capitalize transition-colors ${
                    isSelected
                      ? 'bg-[#3B2219] text-white'
                      : 'bg-[#FFFDF9] text-[#6F574E] border border-[#E6DED5]'
                  }`}
                >
                  {tag.label}
                </button>
              )
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="shrink-0">
            <select
              value={sortBy}
              onChange={(e) => {
                triggerHaptic('selection')
                setSortBy(e.target.value as SortOption)
              }}
              aria-label={t.catalog.sortBy}
              className="text-[11px] font-bold bg-[#FFFDF9] border border-[#E6DED5] rounded-[10px] px-2 py-1 text-[#3B2219] focus:outline-none"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Product Grid */}
        <div className="pt-2">
          {filteredProducts.length === 0 ? (
            <div className="py-14 text-center rounded-[24px] bg-[#FFFDF9] border border-[#E6DED5]">
              <span className="text-3xl block mb-2">🍽️</span>
              <h4 className="text-sm font-bold text-[#3B2219]">
                {t.home.noProductsFound}
              </h4>
              <p className="text-xs text-[#6F574E] mt-1 max-w-[200px] mx-auto">
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
        </div>
      </main>
    </div>
  )
}

export default MenuPage
