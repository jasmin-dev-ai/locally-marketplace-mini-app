import React, { useState, useEffect } from 'react'
import { Heart, Star, Check, Plus, Minus } from 'lucide-react'
import { Product } from '../../types'
import { triggerHaptic } from '../../utils/telegram'
import { useLanguage } from '../../context/LanguageContext'

export const FALLBACK_PRODUCT_IMAGE =
  'https://images.unsplash.com/photo-1541518763669-27fef04b14ea?auto=format&fit=crop&w=900&q=85'

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

  const [imgSrc, setImgSrc] = useState(product.imageUrl || FALLBACK_PRODUCT_IMAGE)

  useEffect(() => {
    setImgSrc(product.imageUrl || FALLBACK_PRODUCT_IMAGE)
  }, [product.imageUrl])

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
          src={imgSrc}
          alt={product.title}
          onError={() => setImgSrc(FALLBACK_PRODUCT_IMAGE)}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Gradient Overlay for subtle depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-transparent pointer-events-none" />

        {/* Favorite Heart Button */}
        <button
          type="button"
          onClick={handleFavoriteClick}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center backdrop-blur-md transition-all duration-150 active:scale-90 ${
            isFavorite
              ? 'bg-[#FFFDF9] text-red-500 shadow-sm'
              : 'bg-[#FFFDF9]/90 text-[#6F574E] hover:text-red-500'
          }`}
          aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
        >
          <Heart
            className={`w-4 h-4 transition-colors ${
              isFavorite ? 'fill-red-500 text-red-500' : 'text-[#6F574E]'
            }`}
          />
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
          <Star className="w-2.5 h-2.5 fill-[#E5A118] text-[#E5A118]" />
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
            <Check
              className="w-3 h-3 text-[#C85A32] shrink-0 stroke-[3]"
              title={t.product.verifiedArtisan}
            />
          )}
        </div>

        {/* Product Title */}
        <h3 className="font-['Manrope'] font-bold text-xs text-[#3B2219] line-clamp-2 leading-snug mb-2 group-hover:text-[#C85A32] transition-colors">
          {product.title}
        </h3>

        {/* Bottom Price & Add Action with Strict Overflow Prevention */}
        <div className="mt-auto pt-2 flex items-center justify-between border-t border-[#EFE9E1] gap-1.5 min-w-0">
          <div className="flex flex-col min-w-0 flex-1">
            <div className="flex items-baseline gap-1 whitespace-nowrap">
              <span className="text-xs sm:text-sm font-extrabold text-[#3B2219] font-['Manrope'] whitespace-nowrap">
                {product.price.toLocaleString('ru-RU').replace(/,/g, ' ')}
              </span>
              <span className="text-[10px] font-bold text-[#6F574E] shrink-0 whitespace-nowrap">
                {t.common.currency}
              </span>
            </div>
            {product.unit && (
              <span className="text-[8px] text-[#9B887F] -mt-0.5 truncate block">
                {product.unit}
              </span>
            )}
          </div>

          {/* "+Add" Square Icon Button or Quantity Controls */}
          {quantityInCart > 0 ? (
            <div
              className="flex items-center bg-[#EFE9E1] border border-[#E6DED5] rounded-[10px] p-0.5 shrink-0"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={handleDecrement}
                className="w-6 h-6 rounded-[8px] bg-[#FFFDF9] text-[#3B2219] hover:bg-[#E6DED5] text-xs font-bold flex items-center justify-center active:scale-90 transition-transform"
                aria-label="Decrease quantity"
              >
                <Minus className="w-3 h-3" />
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
                <Plus className="w-3 h-3" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleAddClick}
              className="w-8 h-8 rounded-[12px] bg-[#C85A32] hover:bg-[#B64F2A] text-white flex items-center justify-center active:scale-90 transition-all shadow-[0_2px_8px_rgba(200,90,50,0.25)] shrink-0"
              aria-label={t.product.addToBasket}
              title={t.product.addToBasket}
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export default ProductCard
