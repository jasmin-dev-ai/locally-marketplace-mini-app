import React, { useState } from 'react'
import {
  ShoppingBag,
  Minus,
  Plus,
  MapPin,
  Clock,
  CreditCard,
  Zap,
  Wallet,
  Banknote,
} from 'lucide-react'
import { Header } from '../components/common/Header'
import { Button } from '../components/common/Button'
import { CartSummary } from '../components/cart/CartSummary'
import { useCart } from '../context/CartContext'
import { useTelegram } from '../context/TelegramContext'
import { useLanguage } from '../context/LanguageContext'
import { submitOrder } from '../services/orderService'
import { Order, PaymentMethod } from '../types'
import { triggerHaptic } from '../utils/telegram'

interface CartPageProps {
  onOrderPlaced?: (order: Order) => void
}

export const CartPage: React.FC<CartPageProps> = ({ onOrderPlaced }) => {
  const {
    items,
    updateQuantity,
    removeItem,
    clearCart,
    subtotal,
    deliveryFee,
    total,
    totalItems,
    setActiveTab,
  } = useCart()

  const { user: tgUser, haptic, showAlert, mainButton } = useTelegram()
  const { t, getLocalizedProduct } = useLanguage()

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('telegram_pay')
  const [deliverySlot, setDeliverySlot] = useState<string>(t.cart.slots.todayAfternoon)
  const [deliveryAddress, setDeliveryAddress] = useState<string>(t.cart.deliveryAddressValue)
  const [orderNote, setOrderNote] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const paymentOptions: { id: PaymentMethod; label: string; icon: React.ReactNode; badge?: string }[] = [
    {
      id: 'telegram_pay',
      label: t.cart.payments.telegramPay,
      icon: <Zap className="w-4 h-4 text-[#C85A32]" />,
      badge: 'Fastest',
    },
    {
      id: 'click',
      label: t.cart.payments.click,
      icon: <CreditCard className="w-4 h-4 text-[#2E78B7]" />,
    },
    {
      id: 'payme',
      label: t.cart.payments.payme,
      icon: <Wallet className="w-4 h-4 text-[#10B981]" />,
    },
    {
      id: 'cash_on_delivery',
      label: t.cart.payments.cashOnDelivery,
      icon: <Banknote className="w-4 h-4 text-[#8C746A]" />,
    },
  ]

  const deliverySlotOptions = [
    t.cart.slots.todayAfternoon,
    t.cart.slots.todayEvening,
    t.cart.slots.tomorrowMorning,
  ]

  const handleCheckout = async () => {
    if (isSubmitting || items.length === 0) return

    setIsSubmitting(true)
    mainButton.setLoading(true)
    haptic.impact('heavy')

    const generatedOrderNum = `LOC-${Math.floor(100000 + Math.random() * 900000)}`
    const resolvedPaymentLabel =
      paymentMethod === 'telegram_pay'
        ? t.cart.payments.telegramPay
        : paymentMethod === 'click'
        ? t.cart.payments.click
        : paymentMethod === 'payme'
        ? t.cart.payments.payme
        : t.cart.payments.cashOnDelivery

    try {
      await submitOrder({
        orderNumber: generatedOrderNum,
        items,
        subtotal,
        deliveryFee,
        total,
        user: tgUser,
        deliveryAddress,
        deliverySlot,
        paymentMethod: resolvedPaymentLabel,
        notes: orderNote,
        targetChatId: tgUser?.id,
      })

      haptic.notification('success')

      const completedOrder: Order = {
        id: generatedOrderNum,
        orderNumber: generatedOrderNum,
        items,
        subtotal,
        deliveryFee,
        totalAmount: total,
        status: 'confirmed',
        createdAt: new Date().toISOString(),
        deliveryAddress,
        deliveryTimeSlot: deliverySlot,
        paymentMethod,
        customerNotes: orderNote,
      }

      clearCart()

      await showAlert(
        `#${generatedOrderNum} · ${t.cart.checkoutSuccessAlert}\n\n${t.cart.checkoutSuccessSubtitle}`
      )

      // Navigate to order tracking screen
      if (onOrderPlaced) {
        onOrderPlaced(completedOrder)
      } else {
        setActiveTab('home')
      }
    } catch (err) {
      console.error('Checkout execution error:', err)
      haptic.notification('error')
    } finally {
      setIsSubmitting(false)
      mainButton.setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF6F0] pb-28">
      <Header
        title={t.header.yourCart}
        subtitle={`${totalItems} ${t.common.itemsCount}`}
        rightAction={
          items.length > 0 ? (
            <button
              type="button"
              onClick={() => {
                triggerHaptic('light')
                clearCart()
              }}
              className="text-xs font-bold text-[#C85A32] hover:underline px-2 py-1"
            >
              {t.cart.clearAll}
            </button>
          ) : undefined
        }
      />

      <main className="px-5 pt-3 space-y-4">
        {items.length === 0 ? (
          <div className="py-20 text-center rounded-[28px] bg-[#FFFDF9] border border-[#E6DED5] p-6 shadow-xs">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#EFE9E1] flex items-center justify-center text-[#8C746A] mb-4">
              <ShoppingBag className="w-10 h-10" />
            </div>
            <h2 className="text-base font-extrabold text-[#3B2219] font-['Manrope']">
              {t.cart.emptyCartTitle}
            </h2>
            <p className="text-xs text-[#6F574E] mt-1.5 max-w-[240px] mx-auto leading-relaxed">
              {t.cart.emptyCartDesc}
            </p>
            <div className="mt-5">
              <Button
                variant="accent"
                size="md"
                onClick={() => {
                  triggerHaptic('medium')
                  setActiveTab('menu')
                }}
              >
                {t.cart.browseCatalog}
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Basket Items List */}
            <section className="space-y-2.5">
              {items.map((item) => {
                const product = getLocalizedProduct(item.product)
                return (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 p-3.5 rounded-[20px] bg-[#FFFDF9] border border-[#E6DED5] shadow-xs"
                  >
                    <img
                      src={product.imageUrl}
                      alt={product.title}
                      className="w-16 h-16 rounded-[14px] object-cover bg-[#EFE9E1] shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-[#3B2219] truncate font-['Manrope']">
                        {product.title}
                      </h4>
                      <p className="text-[11px] text-[#6F574E] mt-0.5 truncate">
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
                    <div className="flex items-center bg-[#EFE9E1] border border-[#E6DED5] rounded-[12px] p-0.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('light')
                          if (item.quantity === 1) {
                            removeItem(product.id)
                          } else {
                            updateQuantity(product.id, item.quantity - 1)
                          }
                        }}
                        className="w-7 h-7 rounded-[10px] bg-[#FFFDF9] text-[#3B2219] hover:bg-[#E6DED5] text-xs font-bold flex items-center justify-center active:scale-90"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-xs font-bold text-[#3B2219]">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          triggerHaptic('light')
                          updateQuantity(product.id, item.quantity + 1)
                        }}
                        className="w-7 h-7 rounded-[10px] bg-[#C85A32] text-white hover:bg-[#B64F2A] text-xs font-bold flex items-center justify-center active:scale-90"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )
              })}
            </section>

            {/* Delivery Address & Time Slot Card */}
            <section className="p-4 rounded-[22px] bg-[#FFFDF9] border border-[#E6DED5] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold font-['Manrope'] text-[#3B2219] flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#C85A32]" />
                  <span>{t.cart.deliveryAddress}</span>
                </span>
                <span className="text-[10px] text-[#C85A32] font-bold">Tashkent</span>
              </div>
              <input
                type="text"
                value={deliveryAddress}
                onChange={(e) => setDeliveryAddress(e.target.value)}
                placeholder={t.cart.deliveryAddress}
                aria-label={t.cart.deliveryAddress}
                className="w-full text-xs font-medium bg-[#EFE9E1]/60 border border-[#E6DED5] rounded-[14px] px-3.5 py-2.5 text-[#3B2219] focus:outline-none focus:ring-1 focus:ring-[#C85A32]"
              />

              <div className="pt-2 border-t border-[#EFE9E1]">
                <span className="block text-[11px] font-bold text-[#6F574E] mb-1.5 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-[#C85A32]" />
                  <span>{t.cart.deliverySlot}</span>
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  {deliverySlotOptions.map((slot) => {
                    const isSelected = deliverySlot === slot
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => {
                          triggerHaptic('selection')
                          setDeliverySlot(slot)
                        }}
                        className={`px-3 py-2 rounded-[12px] text-xs text-left font-medium transition-all ${
                          isSelected
                            ? 'bg-[#3B2219] text-white font-bold'
                            : 'bg-[#EFE9E1] text-[#3B2219] hover:bg-[#E6DED5]'
                        }`}
                      >
                        {slot}
                      </button>
                    )
                  })}
                </div>
              </div>
            </section>

            {/* Payment Methods */}
            <section className="p-4 rounded-[22px] bg-[#FFFDF9] border border-[#E6DED5] shadow-xs space-y-2.5">
              <span className="block text-xs font-extrabold font-['Manrope'] text-[#3B2219] flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>{t.cart.paymentMethod}</span>
              </span>
              <div className="grid grid-cols-2 gap-2">
                {paymentOptions.map((opt) => {
                  const isSelected = paymentMethod === opt.id
                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        triggerHaptic('selection')
                        setPaymentMethod(opt.id)
                      }}
                      className={`flex items-center gap-2 p-3 rounded-[14px] border text-left transition-all ${
                        isSelected
                          ? 'border-[#C85A32] bg-[#FAF6F0] ring-1 ring-[#C85A32]'
                          : 'border-[#E6DED5] bg-[#FFFDF9] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <div className="shrink-0">{opt.icon}</div>
                      <div className="min-w-0">
                        <span className="block text-xs font-bold text-[#3B2219] truncate">
                          {opt.label}
                        </span>
                        {opt.badge && (
                          <span className="text-[9px] text-[#C85A32] font-extrabold uppercase">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </section>

            {/* Order Note */}
            <section className="p-4 rounded-[22px] bg-[#FFFDF9] border border-[#E6DED5] shadow-xs">
              <textarea
                value={orderNote}
                onChange={(e) => setOrderNote(e.target.value)}
                placeholder={t.cart.orderNotePlaceholder}
                rows={2}
                className="w-full text-xs font-medium bg-[#EFE9E1]/50 border border-[#E6DED5] rounded-[14px] p-3 text-[#3B2219] focus:outline-none focus:ring-1 focus:ring-[#C85A32]"
              />
            </section>

            {/* Financial Summary & Checkout Action */}
            <CartSummary
              subtotal={subtotal}
              deliveryFee={deliveryFee}
              total={total}
              itemCount={totalItems}
              onCheckout={handleCheckout}
              isLoading={isSubmitting}
            />
          </>
        )}
      </main>
    </div>
  )
}

export default CartPage
