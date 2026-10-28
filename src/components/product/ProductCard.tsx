import React from 'react'
import { Product } from '../../types'
import { triggerHaptic } from '../../utils/telegram'
import { useLanguage } from '../../context/LanguageContext'

export interface ProductCardProps {
  product: Product
  quantityInCart?: number
  onAddToCart?: (product: Product) => void
  onUpdateQuantity?: (productId: string, quantity: number) => void
  onToggleFavorite?: (productId: string) => void
  isFavorite?: boolean
  onClick?: (product: Product) => void
  className?: string
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product: rawProduct,
  quantityInCart = 0,
  onAddToCart,
  onUpdateQuantity,
  onToggleFavorite,
  isFavorite = false,
  onClick,
  className = '',
}) => {
  const { t, getLocalizedProduct } = useLanguage()
  const product = getLocalizedProduct(rawProduct)

  const handleCardClick = () => {
    onClick?.(product)
  }

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    triggerHaptic('light')
    onToggleFavorite?.(product.id)
  }

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    triggerHaptic('medium')
    onAddToCart?.(product)
  }

  const handleIncrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    triggerHaptic('light')
    onUpdateQuantity?.(product.id, quantityInCart + 1)
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.stopPropagation()
    triggerHaptic('light')
    onUpdateQuantity?.(product.id, quantityInCart - 1)
  }

  return (
    <article
      onClick={handleCardClick}
      className={`group relative flex flex-col justify-between bg-[#FFFDF9] border border-[#E6DED5]/80 rounded-[20px] overflow-hidden shadow-[0_4px_16px_rgba(59,34,25,0.05)] hover:shadow-[0_8px_24px_rgba(59,34,25,0.09)] transition-all duration-200 cursor-pointer select-none active:scale-[0.985] ${className}`}
    >
      {/* Top Image Section */}
      <div className="relative w-full h-[148px] overflow-hidden bg-[#EFE9E1]">
        <img
          src={product.imageUrl}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Overlay for subtle depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-transform duration-150 active:scale-90 ${
            isFavorite
              ? 'bg-[#FFFDF9] text-[#C85A32] shadow-sm'
              : 'bg-[#FFFDF9]/90 text-[#6F574E] hover:text-[#C85A32]'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <svg
            className="w-4 h-4"
            viewBox="0 0 24 24"
            fill={isFavorite ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth={isFavorite ? '0' : '2'}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
          </svg>
        </button>

        {/* Badge / Tag on Image */}
        {product.badge && (
          <div className="absolute top-2.5 left-2.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded-[8px] text-[9px] font-extrabold uppercase tracking-wider bg-[#3B2219]/80 backdrop-blur-md text-[#FFFDF9]">
              {product.badge}
            </span>
          </div>
        )}

        {/* Rating Pill */}
        <div className="absolute bottom-2 left-2.5 flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FFFDF9]/95 backdrop-blur-md shadow-xs">
          <span className="text-[#E5A118] text-[10px]">★</span>
          <span className="text-[10px] font-bold text-[#3B2219]">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-[8px] text-[#6F574E]">
            ({product.reviewsCount})
          </span>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="flex flex-col flex-1 p-3">
        {/* Maker / Shop info */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="w-4 h-4 rounded-full bg-[#EFE9E1] text-[#3B2219] text-[8px] font-extrabold flex items-center justify-center shrink-0 border border-[#E6DED5]">
            {product.seller.initials || product.seller.name.slice(0, 1)}
          </div>
          <span className="text-[10px] font-medium text-[#6F574E] truncate">
            {product.seller.name}
          </span>
          {product.seller.isVerified && (
            <span className="text-[#C85A32] text-[10px] shrink-0" title={t.product.verifiedArtisan}>
              ✓
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-['Manrope'] font-bold text-xs text-[#3B2219] line-clamp-2 leading-snug mb-2 group-hover:text-[#C85A32] transition-colors">
          {product.title}
        </h3>

        {/* Bottom Price & Add Action */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-[#EFE9E1]">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1">
              <span className="text-sm font-extrabold text-[#3B2219] font-['Manrope']">
                {product.price.toLocaleString()}
              </span>
              <span className="text-[9px] font-bold text-[#6F574E]">
                {t.common.currency}
              </span>
            </div>
            {product.unit && (
              <span className="text-[8px] text-[#9B887F] -mt-0.5">
                {product.unit}
              </span>
            )}
          </div>

          {/* "+Add" or Quantity Controls */}
          {quantityInCart > 0 ? (
            <div
              className="flex items-center bg-[#EFE9E1] border border-[#E6DED5] rounded-[10px] p-0.5"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleDecrement}
                className="w-6 h-6 rounded-[8px] bg-[#FFFDF9] text-[#3B2219] hover:bg-[#E6DED5] text-xs font-bold flex items-center justify-center active:scale-90 transition-transform"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-5 text-center text-xs font-bold text-[#3B2219]">
                {quantityInCart}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="w-6 h-6 rounded-[8px] bg-[#C85A32] text-white hover:bg-[#B64F2A] text-xs font-bold flex items-center justify-center active:scale-90 transition-transform"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddClick}
              className="inline-flex items-center gap-1 h-7 px-2.5 rounded-[10px] bg-[#F5D6C9] hover:bg-[#F0C5B3] text-[#C85A32] active:scale-95 font-extrabold text-[11px] transition-all duration-150"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.8">
                <path d="M12 5v14M5 12h14" />
              </svg>
              <span>{t.product.addToBasket}</span>
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProductCard
