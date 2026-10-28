import React, { useState } from 'react'
import { Product } from '../../types'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { triggerHaptic } from '../../utils/telegram'
import { useLanguage } from '../../context/LanguageContext'
import { localizeCategoryName } from '../../i18n/productData'

export interface ProductDetailModalProps {
  product: Product | null
  isOpen: boolean
  onClose: () => void
  onAddToCart: (product: Product, quantity: number) => void
  isFavorite: boolean
  onToggleFavorite: (productId: string) => void
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product: rawProduct,
  isOpen,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
}) => {
  const [quantity, setQuantity] = useState(1)
  const { t, locale, getLocalizedProduct } = useLanguage()

  if (!isOpen || !rawProduct) return null

  const product = getLocalizedProduct(rawProduct)

  const handleAdd = () => {
    triggerHaptic('medium')
    onAddToCart(product, quantity)
    onClose()
  }

  const localizedCategory = localizeCategoryName(product.categoryId, locale, product.category)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/45 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={() => {
          triggerHaptic('light')
          onClose()
        }}
      />

      {/* Modal Card Sheet */}
      <div
        className="relative w-full max-w-lg bg-[#FAF6F0] rounded-t-[28px] border-t border-[#E6DED5] shadow-2xl flex flex-col max-h-[90vh] z-10 animate-in slide-in-from-bottom duration-300 overflow-hidden"
        style={{
          paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
        }}
      >
        {/* Close & Favorite overlay buttons */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              onClose()
            }}
            className="w-10 h-10 rounded-full bg-[#FFFDF9]/90 backdrop-blur-md border border-[#E6DED5] text-[#3B2219] flex items-center justify-center shadow-xs pointer-events-auto active:scale-95 transition-transform"
            aria-label={t.common.close}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              onToggleFavorite(product.id)
            }}
            className={`w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-[#E6DED5] shadow-xs pointer-events-auto active:scale-95 transition-transform ${
              isFavorite
                ? 'bg-[#FFFDF9] text-[#C85A32]'
                : 'bg-[#FFFDF9]/90 text-[#6F574E]'
            }`}
            aria-label="Toggle favorite"
          >
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill={isFavorite ? 'currentColor' : 'none'}
              stroke="currentColor"
              strokeWidth={isFavorite ? '0' : '2'}
            >
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
            </svg>
          </button>
        </div>

        {/* Scrollable details */}
        <div className="overflow-y-auto flex-1">
          {/* Main Hero Photo */}
          <div className="relative w-full h-[260px] bg-[#EFE9E1]">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#FAF6F0] via-transparent to-black/20 pointer-events-none" />
          </div>

          <div className="px-5 pt-2 pb-6 space-y-4">
            {/* Badges & Category */}
            <div className="flex items-center gap-2">
              <Badge variant="default">{localizedCategory}</Badge>
              {product.badge && <Badge variant="dark">{product.badge}</Badge>}
              <div className="flex items-center gap-1 text-xs font-bold text-[#3B2219] ml-auto">
                <span className="text-[#E5A118]">★</span>
                <span>{product.rating.toFixed(2)}</span>
                <span className="text-[#6F574E]">({product.reviewsCount} {t.product.reviews})</span>
              </div>
            </div>

            {/* Title & Price */}
            <div>
              <h2 className="text-xl font-extrabold text-[#3B2219] font-['Manrope'] leading-tight">
                {product.title}
              </h2>
              <div className="flex items-baseline gap-1.5 mt-1.5">
                <span className="text-2xl font-extrabold text-[#C85A32] font-['Manrope']">
                  {product.price.toLocaleString()}
                </span>
                <span className="text-sm font-bold text-[#6F574E]">
                  {t.common.currency}
                </span>
                {product.unit && (
                  <span className="text-xs text-[#9B887F]">
                    / {product.unit}
                  </span>
                )}
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-[#6F574E] leading-relaxed">
              {product.description}
            </p>

            {/* Prep Time if available */}
            {product.prepTime && (
              <div className="flex items-center gap-2 px-3.5 py-2.5 rounded-[14px] bg-[#EFE9E1]/80 border border-[#E6DED5]">
                <span className="text-sm">🕒</span>
                <div className="text-xs">
                  <span className="font-bold text-[#3B2219]">{t.product.prepTime}: </span>
                  <span className="text-[#6F574E]">{product.prepTime}</span>
                </div>
              </div>
            )}

            {/* Maker Info Card */}
            <div className="p-3.5 rounded-[18px] bg-[#FFFDF9] border border-[#E6DED5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#3B2219] text-[#FFFDF9] font-extrabold flex items-center justify-center text-sm font-['Manrope']">
                  {product.seller.initials || 'AR'}
                </div>
                <div>
                  <div className="flex items-center gap-1 text-xs font-bold text-[#3B2219]">
                    <span>{product.seller.name}</span>
                    {product.seller.isVerified && (
                      <span className="text-[#C85A32]" title={t.product.verifiedArtisan}>✓</span>
                    )}
                  </div>
                  <div className="text-[10px] text-[#6F574E]">
                    📍 {product.seller.location}
                  </div>
                </div>
              </div>

              {product.seller.telegramUsername && (
                <button
                  type="button"
                  onClick={() => triggerHaptic('light')}
                  className="px-2.5 py-1.5 rounded-[10px] bg-[#EFE9E1] text-[#3B2219] text-[11px] font-bold hover:bg-[#E6DED5] transition-colors"
                >
                  @{product.seller.telegramUsername}
                </button>
              )}
            </div>

            {/* Ingredients or Tags if present */}
            {product.ingredients && product.ingredients.length > 0 && (
              <div className="space-y-1.5">
                <h4 className="text-[11px] font-extrabold uppercase tracking-wider text-[#6F574E]">
                  {t.product.ingredients}
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {product.ingredients.map((ing) => (
                    <span
                      key={ing}
                      className="px-2.5 py-1 rounded-[10px] bg-[#EFE9E1] text-[#3B2219] text-[11px] font-medium"
                    >
                      {ing}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom CTA Bar */}
        <div className="p-4 bg-[#FAF6F0] border-t border-[#E6DED5] flex items-center gap-3">
          {/* Quantity Selector */}
          <div className="flex items-center bg-[#FFFDF9] border border-[#E6DED5] rounded-[14px] p-1 shrink-0">
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light')
                setQuantity((q) => Math.max(1, q - 1))
              }}
              className="w-8 h-8 rounded-[10px] bg-[#EFE9E1] text-[#3B2219] font-bold text-sm flex items-center justify-center active:scale-90 transition-transform"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-8 text-center font-bold text-sm text-[#3B2219]">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light')
                setQuantity((q) => q + 1)
              }}
              className="w-8 h-8 rounded-[10px] bg-[#C85A32] text-white font-bold text-sm flex items-center justify-center active:scale-90 transition-transform"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>

          {/* Add Button */}
          <Button
            variant="accent"
            size="md"
            fullWidth
            onClick={handleAdd}
          >
            {t.product.addToBasket} · {(product.price * quantity).toLocaleString()} {t.common.currency}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailModal
