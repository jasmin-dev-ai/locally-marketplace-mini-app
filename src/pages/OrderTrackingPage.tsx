import React, { useEffect, useState, useCallback } from 'react'
import {
  CheckCircle2,
  ChefHat,
  Truck,
  Sparkles,
  Clock,
  MapPin,
  CreditCard,
  ShoppingBag,
  ArrowLeft,
  Check,
} from 'lucide-react'
import { Order, OrderStatus } from '../types'
import { useLanguage } from '../context/LanguageContext'

interface OrderTrackingPageProps {
  order: Order
  onClose: () => void
}

interface StatusStepConfig {
  key: OrderStatus
  icon: (active: boolean) => React.ReactNode
  estimatedMinutes: number
}

const STATUS_CONFIGS: StatusStepConfig[] = [
  {
    key: 'confirmed',
    icon: (active) => <CheckCircle2 className={`w-4 h-4 ${active ? 'text-[#C85A32]' : 'text-[#8C746A]'}`} />,
    estimatedMinutes: 0,
  },
  {
    key: 'preparing',
    icon: (active) => <ChefHat className={`w-4 h-4 ${active ? 'text-[#C85A32]' : 'text-[#8C746A]'}`} />,
    estimatedMinutes: 15,
  },
  {
    key: 'delivering',
    icon: (active) => <Truck className={`w-4 h-4 ${active ? 'text-[#C85A32]' : 'text-[#8C746A]'}`} />,
    estimatedMinutes: 30,
  },
  {
    key: 'completed',
    icon: (active) => <Sparkles className={`w-4 h-4 ${active ? 'text-[#C85A32]' : 'text-[#8C746A]'}`} />,
    estimatedMinutes: 45,
  },
]

const STATUS_ORDER: OrderStatus[] = ['confirmed', 'preparing', 'delivering', 'completed']

function getStepIndex(status: OrderStatus): number {
  return STATUS_ORDER.indexOf(status)
}

function useCountdown(targetMinutes: number) {
  const [secondsLeft, setSecondsLeft] = useState(targetMinutes * 60)

  useEffect(() => {
    if (secondsLeft <= 0) return
    const interval = setInterval(() => {
      setSecondsLeft((s) => Math.max(0, s - 1))
    }, 1000)
    return () => clearInterval(interval)
  }, [secondsLeft])

  const minutes = Math.floor(secondsLeft / 60)
  const seconds = secondsLeft % 60
  return { minutes, seconds, done: secondsLeft === 0 }
}

// Demo: auto-advance order status every few seconds for live preview experience
function useAutoAdvance(initial: OrderStatus, onAdvance: (s: OrderStatus) => void) {
  useEffect(() => {
    const sequence: OrderStatus[] = ['confirmed', 'preparing', 'delivering', 'completed']
    const idx = sequence.indexOf(initial)
    if (idx >= sequence.length - 1) return

    const timers: ReturnType<typeof setTimeout>[] = []
    const delays = [6000, 14000, 28000]

    delays.forEach((delay, i) => {
      const nextIdx = idx + i + 1
      if (nextIdx < sequence.length) {
        timers.push(
          setTimeout(() => {
            onAdvance(sequence[nextIdx])
          }, delay)
        )
      }
    })

    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}

export const OrderTrackingPage: React.FC<OrderTrackingPageProps> = ({ order, onClose }) => {
  const { t, getLocalizedProduct } = useLanguage()
  const [currentStatus, setCurrentStatus] = useState<OrderStatus>(order.status)
  const currentStepIndex = getStepIndex(currentStatus)

  const currentStep = STATUS_CONFIGS[currentStepIndex]
  const nextStep = STATUS_CONFIGS[currentStepIndex + 1]
  const etaMinutes = nextStep ? nextStep.estimatedMinutes - currentStep.estimatedMinutes : 0
  const countdown = useCountdown(etaMinutes)

  const handleAdvance = useCallback((status: OrderStatus) => {
    setCurrentStatus(status)
    try {
      window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success')
    } catch {
      // Ignore
    }
  }, [])

  useAutoAdvance(order.status, handleAdvance)

  const isCompleted = currentStatus === 'completed'
  const isCancelled = currentStatus === 'cancelled'

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ backgroundColor: '#FFFDF9' }}
    >
      {/* Header */}
      <div
        className="sticky top-0 z-10 px-4 pt-4 pb-3 flex items-center gap-3 bg-[#FFFDF9]/95 backdrop-blur-md border-b border-[#EFE9E1]"
      >
        <button
          onClick={onClose}
          className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full flex items-center justify-center transition-all active:scale-90 bg-[#EFE9E1] text-[#2D231E]"
          aria-label={t.common.back}
        >
          <ArrowLeft className="w-4 h-4 text-[#2D231E]" />
        </button>
        <div>
          <h1 className="text-base font-bold leading-tight text-[#2D231E] font-['Manrope']">
            {t.tracking.pageTitle}
          </h1>
          <p className="text-xs text-[#7A6B63]">
            #{order.orderNumber}
          </p>
        </div>
        <div className="ml-auto">
          <span
            className="px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-[#C85A32] text-white"
          >
            #{order.orderNumber.slice(-6)}
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-24">
        {/* ETA Banner */}
        {!isCompleted && !isCancelled && (
          <div
            className="mx-4 mt-4 rounded-2xl p-4 flex items-center gap-4"
            style={{
              background: 'linear-gradient(135deg, #C85A32 0%, #9E3D1E 100%)',
              boxShadow: '0 4px 20px rgba(200, 90, 50, 0.3)',
            }}
          >
            <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center shrink-0">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <p className="text-white/80 text-xs font-medium uppercase tracking-wider mb-0.5">
                {t.tracking.estimatedDelivery}
              </p>
              {countdown.done ? (
                <p className="text-white font-bold text-xl">{t.tracking.steps.completed.label}</p>
              ) : (
                <p className="text-white font-bold text-2xl tabular-nums">
                  {String(countdown.minutes).padStart(2, '0')}:{String(countdown.seconds).padStart(2, '0')}
                  <span className="text-white/70 text-sm font-normal ml-1">
                    {t.tracking.minsRemaining}
                  </span>
                </p>
              )}
            </div>
            <div
              className="w-12 h-12 rounded-full flex items-center justify-center bg-white/15"
            >
              <div className="animate-pulse">{currentStep.icon(true)}</div>
            </div>
          </div>
        )}

        {/* Completed Banner */}
        {isCompleted && (
          <div
            className="mx-4 mt-4 rounded-2xl p-5 text-center"
            style={{
              background: 'linear-gradient(135deg, #2D7A4F 0%, #1E5A38 100%)',
              boxShadow: '0 4px 20px rgba(45,122,79,0.3)',
            }}
          >
            <div className="w-12 h-12 rounded-full bg-white/20 text-white flex items-center justify-center mx-auto mb-2">
              <Sparkles className="w-7 h-7" />
            </div>
            <p className="text-white font-bold text-xl">{t.tracking.steps.completed.label}!</p>
            <p className="text-white/75 text-sm mt-1">{t.tracking.steps.completed.description}</p>
          </div>
        )}

        {/* Status Stepper */}
        <div
          className="mx-4 mt-4 rounded-2xl p-5 bg-white border border-[#EFE9E1] shadow-sm"
        >
          <h2 className="text-sm font-bold mb-5 uppercase tracking-wider text-[#7A6B63]">
            {t.tracking.pageTitle}
          </h2>

          <div className="relative">
            {STATUS_CONFIGS.map((step, idx) => {
              const isDone = idx < currentStepIndex
              const isActive = idx === currentStepIndex
              const isPending = idx > currentStepIndex
              const stepTrans = t.tracking.steps[step.key]

              return (
                <div key={step.key} className="flex gap-4 relative">
                  {/* Connector line */}
                  {idx < STATUS_CONFIGS.length - 1 && (
                    <div
                      className="absolute left-[17px] top-9 w-0.5 transition-all duration-700"
                      style={{
                        height: '48px',
                        backgroundColor: isDone ? '#C85A32' : '#EFE9E1',
                      }}
                    />
                  )}

                  {/* Step indicator */}
                  <div className="relative z-10 shrink-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center transition-all duration-500"
                      style={{
                        backgroundColor: isDone
                          ? '#C85A32'
                          : isActive
                          ? '#FFFDF9'
                          : '#EFE9E1',
                        border: isActive ? '2.5px solid #C85A32' : 'none',
                        boxShadow: isActive ? '0 0 0 4px rgba(200,90,50,0.15)' : 'none',
                      }}
                    >
                      {isDone ? (
                        <Check className="w-4 h-4 text-white stroke-[3]" />
                      ) : (
                        step.icon(isActive)
                      )}
                    </div>
                  </div>

                  {/* Step text */}
                  <div className="flex-1 pb-10">
                    <p
                      className="text-sm font-semibold leading-tight transition-all"
                      style={{ color: isDone || isActive ? '#2D231E' : '#C4B5AC' }}
                    >
                      {stepTrans.label}
                      {isActive && (
                        <span
                          className="ml-2 text-[9px] font-bold px-2 py-0.5 rounded-full bg-[#C85A32] text-white uppercase tracking-wider"
                        >
                          Active
                        </span>
                      )}
                    </p>
                    <p
                      className="text-xs mt-0.5"
                      style={{ color: isPending ? '#C4B5AC' : '#7A6B63' }}
                    >
                      {stepTrans.description}
                    </p>
                    {isActive && !countdown.done && idx < STATUS_CONFIGS.length - 1 && (
                      <p className="text-xs mt-1 font-medium text-[#C85A32]">
                        ~{etaMinutes} {t.tracking.minsRemaining}
                      </p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Items Summary */}
        <div
          className="mx-4 mt-4 rounded-2xl overflow-hidden bg-white border border-[#EFE9E1] shadow-sm"
        >
          <div
            className="px-5 py-3 flex items-center justify-between border-b border-[#EFE9E1]"
          >
            <h2 className="text-sm font-bold uppercase tracking-wider text-[#7A6B63]">
              {t.cart.financialSummary}
            </h2>
            <span className="text-xs text-[#7A6B63]">
              {order.items.length} {t.common.itemsCount}
            </span>
          </div>

          <div>
            {order.items.map((item) => {
              const product = getLocalizedProduct(item.product)
              return (
                <div
                  key={product.id}
                  className="px-5 py-3 flex items-center gap-3 border-b border-[#EFE9E1]"
                >
                  <div
                    className="w-12 h-12 rounded-xl overflow-hidden shrink-0 flex items-center justify-center bg-[#FFFDF9] border border-[#EFE9E1]"
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <ShoppingBag className="w-5 h-5 text-[#7A6B63]" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold truncate text-[#2D231E]">
                      {product.title}
                    </p>
                    <p className="text-xs text-[#7A6B63]">
                      {product.seller.name} · ×{item.quantity}
                    </p>
                  </div>
                  <p className="text-sm font-bold shrink-0 text-[#2D231E]">
                    {(product.price * item.quantity).toLocaleString()} {t.common.currency}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Totals */}
          <div className="px-5 py-4 bg-[#FFFDF9]">
            <div className="flex justify-between text-xs mb-1 text-[#7A6B63]">
              <span>{t.cart.subtotal}</span>
              <span>{order.subtotal.toLocaleString()} {t.common.currency}</span>
            </div>
            <div className="flex justify-between text-xs mb-3 text-[#7A6B63]">
              <span>{t.cart.deliveryFee}</span>
              <span>{order.deliveryFee === 0 ? t.common.free : `${order.deliveryFee.toLocaleString()} ${t.common.currency}`}</span>
            </div>
            <div
              className="flex justify-between text-sm font-bold pt-2 border-t border-[#EFE9E1] text-[#2D231E]"
            >
              <span>{t.cart.totalToPay}</span>
              <span>{order.totalAmount.toLocaleString()} {t.common.currency}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div
          className="mx-4 mt-4 rounded-2xl p-5 bg-white border border-[#EFE9E1] shadow-sm"
        >
          <h2 className="text-sm font-bold mb-3 uppercase tracking-wider text-[#7A6B63]">
            {t.cart.deliveryAddress}
          </h2>
          <div className="flex items-start gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-[#FFFDF9] border border-[#EFE9E1] text-[#C85A32]"
            >
              <MapPin className="w-4 h-4 text-[#C85A32]" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#2D231E]">
                {order.deliveryAddress}
              </p>
              {order.deliveryTimeSlot && (
                <p className="text-xs mt-0.5 text-[#7A6B63] flex items-center gap-1">
                  <Clock className="w-3 h-3 text-[#7A6B63]" />
                  <span>{order.deliveryTimeSlot}</span>
                </p>
              )}
              <p className="text-xs mt-0.5 capitalize text-[#7A6B63] flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-[#7A6B63]" />
                <span>{order.paymentMethod}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="mx-4 mt-4">
          <button
            onClick={onClose}
            className={`w-full min-h-[48px] py-3.5 rounded-2xl font-bold text-sm transition-all duration-150 active:scale-95 ${
              isCompleted
                ? 'bg-[#C85A32] text-white shadow-md'
                : 'bg-[#EFE9E1] text-[#2D231E]'
            }`}
          >
            {isCompleted ? t.common.close : t.tracking.closeTracking}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OrderTrackingPage
