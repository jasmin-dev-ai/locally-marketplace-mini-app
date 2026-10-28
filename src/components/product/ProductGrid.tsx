import React from 'react'
import { Product } from '../../types'
import { ProductCard } from './ProductCard'

export interface ProductGridProps {
  products: Product[]
  cartItemQuantities?: Record<string, number>
  favoriteIds?: string[]
  onAddToCart?: (product: Product) => void
  onUpdateQuantity?: (productId: string, quantity: number) => void
  onToggleFavorite?: (productId: string) => void
  onProductClick?: (product: Product) => void
  emptyMessage?: string
  className?: string
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  cartItemQuantities = {},
  favoriteIds = [],
  onAddToCart,
  onUpdateQuantity,
  onToggleFavorite,
  onProductClick,
  emptyMessage = 'No local artisan goods found in this section.',
  className = '',
}) => {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-[#FFFDF9] border border-[#E6DED5] rounded-[24px] my-4">
        <div className="w-14 h-14 rounded-full bg-[#EFE9E1] text-[#6F574E] flex items-center justify-center text-2xl mb-3">
          🔍
        </div>
        <h4 className="text-sm font-bold text-[#3B2219] font-['Manrope'] mb-1">
          No matches found
        </h4>
        <p className="text-xs text-[#6F574E] max-w-[240px] leading-relaxed">
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
          quantityInCart={cartItemQuantities[product.id] || 0}
          isFavorite={favoriteIds.includes(product.id)}
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
