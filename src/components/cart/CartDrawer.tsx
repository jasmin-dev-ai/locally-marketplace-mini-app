import React, { useEffect } from 'react'
import { CartItem } from '../../types'
import { Button } from '../common/Button'
import { triggerHaptic } from '../../utils/telegram'
import { useLanguage } from '../../context/LanguageContext'

export interface CartDrawerProps {
  isOpen: boolean
  onClose: () => void
  items: CartItem[]
  subtotal: number
  total: number
  deliveryFee: number
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemoveItem: (productId: string) => void
  onCheckout: () => void
  onViewFullCart?: () => void
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  items,
  total,
  deliveryFee,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  onViewFullCart,
}) => {
  const { t, getLocalizedProduct } = useLanguage()

  // Prevent body scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const totalCount = items.reduce((acc, i) => acc + i.quantity, 0)

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      {/* Dimmed Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
        onClick={() => {
          triggerHaptic('light')
          onClose()
        }}
      />

      {/* Drawer Container */}
      <div
        className="relative w-full max-w-lg bg-[#FAF6F0] rounded-t-[28px] border-t border-[#E6DED5] shadow-[0_-12px_40px_rgba(59,34,25,0.18)] flex flex-col max-h-[85vh] z-10 animate-in slide-in-from-bottom duration-300"
        style={{
          paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
        }}
      >
        {/* Drag Pill Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.2 bg-[#D8CEC4] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#E6DED5]">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-[#3B2219] font-['Manrope']">
              {t.cart.drawerTitle}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EFE9E1] text-[#6F574E]">
              {totalCount} {t.common.itemsCount}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              onClose()
            }}
            className="w-8 h-8 rounded-full bg-[#EFE9E1] text-[#3B2219] flex items-center justify-center hover:bg-[#E6DED5] active:scale-95 transition-transform"
            aria-label={t.common.close}
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#EFE9E1] flex items-center justify-center text-3xl mb-3">
                🧺
              </div>
              <h3 className="text-sm font-bold text-[#3B2219] font-['Manrope']">
                {t.cart.emptyCartTitle}
              </h3>
              <p className="text-xs text-[#6F574E] mt-1 max-w-[220px] mx-auto">
                {t.cart.emptyCartDesc}
              </p>
              <div className="mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    triggerHaptic('light')
                    onClose()
                  }}
                >
                  {t.cart.browseCatalog}
                </Button>
              </div>
            </div>
          ) : (
            items.map((item) => {
              const product = getLocalizedProduct(item.product)
              return (
                <div
                  key={product.id}
                  className="flex items-center gap-3 p-3 rounded-[18px] bg-[#FFFDF9] border border-[#E6DED5] shadow-2xs"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-14 h-14 rounded-[12px] object-cover bg-[#EFE9E1] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#3B2219] truncate font-['Manrope']">
                      {product.title}
                    </h4>
                    <p className="text-[10px] text-[#6F574E] mt-0.5 truncate">
                      {product.seller.name}
                    </p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xs font-extrabold text-[#C85A32] font-['Manrope']">
                        {(product.price * item.quantity).toLocaleString()}
                      </span>
                      <span className="text-[9px] font-bold text-[#6F574E]">
                        {t.common.currency}
                      </span>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center bg-[#EFE9E1] rounded-[10px] p-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light')
                        if (item.quantity === 1) {
                          onRemoveItem(product.id)
                        } else {
                          onUpdateQuantity(product.id, item.quantity - 1)
                        }
                      }}
                      className="w-6 h-6 rounded-[8px] bg-[#FFFDF9] text-[#3B2219] hover:bg-[#E6DED5] text-xs font-bold flex items-center justify-center active:scale-90"
                    >
                      −
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-[#3B2219]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light')
                        onUpdateQuantity(product.id, item.quantity + 1)
                      }}
                      className="w-6 h-6 rounded-[8px] bg-[#C85A32] text-white hover:bg-[#B64F2A] text-xs font-bold flex items-center justify-center active:scale-90"
                    >
                      +
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-5 bg-[#FFFDF9] border-t border-[#E6DED5] space-y-3">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-[#6F574E]">{t.cart.totalToPay}</span>
              <div className="text-right">
                <span className="text-base font-extrabold text-[#3B2219] font-['Manrope']">
                  {total.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-[#6F574E] ml-1">
                  {t.common.currency}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  triggerHaptic('light')
                  onViewFullCart?.()
                }}
              >
                {t.cart.viewFullBasket}
              </Button>
              <Button
                variant="accent"
                size="md"
                onClick={() => {
                  triggerHaptic('medium')
                  onCheckout()
                }}
              >
                {t.cart.proceedToCheckout}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default CartDrawer
