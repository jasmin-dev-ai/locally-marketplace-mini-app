import React, { useEffect } from 'react'
import { X, ShoppingBag, Minus, Plus } from 'lucide-react'
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
        className="fixed inset-0 bg-[#2D231E]/50 backdrop-blur-sm transition-opacity duration-300 animate-in fade-in"
        onClick={() => {
          triggerHaptic('light')
          onClose()
        }}
      />

      {/* Drawer Container */}
      <div
        className="relative w-full max-w-lg bg-[#FFFDF9] rounded-t-[28px] border-t border-[#EFE9E1] shadow-[0_-12px_40px_rgba(45,35,30,0.18)] flex flex-col max-h-[85vh] z-10 animate-in slide-in-from-bottom duration-300"
        style={{
          paddingBottom: 'max(16px, env(safe-area-inset-bottom, 16px))',
        }}
      >
        {/* Drag Pill Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1.5 bg-[#EFE9E1] rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[#EFE9E1]">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-extrabold text-[#2D231E] font-['Manrope']">
              {t.cart.drawerTitle}
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EFE9E1] text-[#7A6B63]">
              {totalCount} {t.common.itemsCount}
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              onClose()
            }}
            className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-[#EFE9E1] text-[#2D231E] flex items-center justify-center hover:bg-[#E2D8CD] active:scale-95 transition-all"
            aria-label={t.common.close}
          >
            <X className="w-4 h-4 text-[#2D231E]" />
          </button>
        </div>

        {/* Items List */}
        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-3">
          {items.length === 0 ? (
            <div className="py-12 text-center">
              <div className="w-16 h-16 mx-auto rounded-full bg-[#EFE9E1] flex items-center justify-center text-[#7A6B63] mb-3">
                <ShoppingBag className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-[#2D231E] font-['Manrope']">
                {t.cart.emptyCartTitle}
              </h3>
              <p className="text-xs text-[#7A6B63] mt-1 max-w-[220px] mx-auto">
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
                  className="flex items-center gap-3 p-3 rounded-[18px] bg-[#FFFDF9] border border-[#EFE9E1] shadow-xs"
                >
                  <img
                    src={product.imageUrl}
                    alt={product.title}
                    className="w-14 h-14 rounded-[12px] object-cover bg-[#EFE9E1] shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-[#2D231E] truncate font-['Manrope']">
                      {product.title}
                    </h4>
                    <p className="text-[10px] text-[#7A6B63] mt-0.5 truncate">
                      {product.seller.name}
                    </p>
                    <div className="flex items-baseline gap-1 mt-1">
                      <span className="text-xs font-extrabold text-[#C85A32] font-['Manrope']">
                        {(product.price * item.quantity).toLocaleString()}
                      </span>
                      <span className="text-[9px] font-bold text-[#7A6B63]">
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
                      className="w-7 h-7 rounded-[8px] bg-[#FFFDF9] text-[#2D231E] hover:bg-[#EFE9E1] text-xs font-bold flex items-center justify-center active:scale-90 transition-all shadow-xs"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-5 text-center text-xs font-bold text-[#2D231E]">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        triggerHaptic('light')
                        onUpdateQuantity(product.id, item.quantity + 1)
                      }}
                      className="w-7 h-7 rounded-[8px] bg-[#C85A32] text-white hover:bg-[#B34E29] text-xs font-bold flex items-center justify-center active:scale-90 transition-all shadow-xs"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="p-5 bg-[#FFFDF9] border-t border-[#EFE9E1] space-y-3">
            <div className="flex items-baseline justify-between text-xs">
              <span className="text-[#7A6B63] font-medium">{t.cart.totalToPay}</span>
              <div className="text-right">
                <span className="text-base font-extrabold text-[#2D231E] font-['Manrope']">
                  {total.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-[#7A6B63] ml-1">
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
