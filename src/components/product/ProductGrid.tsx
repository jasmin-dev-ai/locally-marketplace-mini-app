import React from 'react'
import { Search } from 'lucide-react'
import { Product } from '../../types'
import { ProductCard } from './ProductCard'

export interface ProductGridProps {
  products: Product[]
  cartItemQuantities?: Record<string, number>
  cartQuantities?: Record<string, number>
  favoriteIds?: string[]
  favorites?: string[]
  onAddToCart?: (product: Product) => void
  onUpdateQuantity?: (productId: string, quantity: number) => void
  onToggleFavorite?: (productId: string) => void
  onProductClick?: (product: Product) => void
  emptyMessage?: string
  className?: string
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  cartItemQuantities,
  cartQuantities,
  favoriteIds,
  favorites,
  onAddToCart,
  onUpdateQuantity,
  onToggleFavorite,
  onProductClick,
  emptyMessage = 'No local artisan goods found in this section.',
  className = '',
}) => {
  const activeFavorites = favorites || favoriteIds || []
  const activeCartQuantities = cartQuantities || cartItemQuantities || {}

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-[#FFFDF9] border border-[#EFE9E1] rounded-[24px] my-4 shadow-sm">
        <div className="w-14 h-14 rounded-full bg-[#EFE9E1] text-[#7A6B63] flex items-center justify-center mb-3">
          <Search className="w-6 h-6 text-[#7A6B63]" />
        </div>
        <h4 className="text-sm font-bold text-[#2D231E] font-['Manrope'] mb-1">
          No matches found
        </h4>
        <p className="text-xs text-[#7A6B63] max-w-[240px] leading-relaxed">
          {emptyMessage}
        </p>
      </div>
    )
  }

  return (
    <div className={`grid grid-cols-2 gap-3 ${className}`}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          quantityInCart={activeCartQuantities[product.id] || 0}
          isFavorite={activeFavorites.includes(product.id)}
          onAddToCart={onAddToCart}
          onUpdateQuantity={onUpdateQuantity}
          onToggleFavorite={onToggleFavorite}
          onClick={onProductClick}
        />
      ))}
    </div>
  )
}

export default ProductGrid
