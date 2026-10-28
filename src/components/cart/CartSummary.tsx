import React from 'react'
import { Button } from '../common/Button'
import { triggerHaptic } from '../../utils/telegram'
import { useLanguage } from '../../context/LanguageContext'

export interface CartSummaryProps {
  subtotal: number
  deliveryFee: number
  discountAmount?: number
  total: number
  itemCount: number
  onCheckout: () => void
  isLoading?: boolean
  className?: string
}

export const CartSummary: React.FC<CartSummaryProps> = ({
  subtotal,
  deliveryFee,
  discountAmount = 0,
  total,
  itemCount,
  onCheckout,
  isLoading = false,
  className = '',
}) => {
  const { t } = useLanguage()
  const isFreeDelivery = deliveryFee === 0 && subtotal > 0

  return (
    <div
      className={`bg-[#FFFDF9] border border-[#E6DED5] rounded-[22px] p-4 shadow-[0_6px_20px_rgba(59,34,25,0.05)] ${className}`}
    >
      {isFreeDelivery && (
        <div className="mb-4 flex items-center gap-2 p-2.5 rounded-[14px] bg-[#DCE8D5] text-[#2D4E37] text-xs font-bold border border-[#C7DAC0]">
          <span>🎉</span>
          <span>{t.cart.freeCourier}</span>
        </div>
      )}

      {/* Breakdown */}
      <div className="space-y-2 text-xs">
        <div className="flex items-center justify-between text-[#6F574E]">
          <span>{t.cart.subtotal} ({itemCount})</span>
          <span className="font-bold text-[#3B2219]">
            {subtotal.toLocaleString()} {t.common.currency}
          </span>
        </div>

        <div className="flex items-center justify-between text-[#6F574E]">
          <span>{t.cart.deliveryFee}</span>
          <span className="font-bold text-[#3B2219]">
            {deliveryFee === 0 ? (
              <span className="text-[#2D4E37] font-extrabold uppercase text-[10px]">
                {t.common.free}
              </span>
            ) : (
              `${deliveryFee.toLocaleString()} ${t.common.currency}`
            )}
          </span>
        </div>

        {discountAmount > 0 && (
          <div className="flex items-center justify-between text-[#C85A32]">
            <span>Chegirma</span>
            <span className="font-bold">-{discountAmount.toLocaleString()} {t.common.currency}</span>
          </div>
        )}

        <div className="pt-2.5 mt-2.5 border-t border-[#EFE9E1] flex items-baseline justify-between">
          <span className="font-bold text-sm text-[#3B2219] font-['Manrope']">
            {t.cart.totalToPay}
          </span>
          <div className="text-right">
            <span className="text-lg font-extrabold text-[#3B2219] font-['Manrope']">
              {total.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-[#6F574E] ml-1">{t.common.currency}</span>
          </div>
        </div>
      </div>

      {/* Checkout Button */}
      <div className="mt-4">
        <Button
          data-checkout-trigger="true"
          variant="accent"
          size="lg"
          fullWidth
          isLoading={isLoading}
          disabled={itemCount === 0}
          onClick={() => {
            triggerHaptic('heavy')
            onCheckout()
          }}
          rightIcon={
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          }
        >
          {t.cart.proceedToCheckout} · {total.toLocaleString()} {t.common.currency}
        </Button>
      </div>
    </div>
  )
}

export default CartSummary
