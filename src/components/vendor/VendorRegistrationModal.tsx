import React, { useState } from 'react'
import {
  X,
  Store,
  CheckCircle2,
  AlertCircle,
  FileText,
  Tag,
  Phone,
  User,
  ShieldCheck,
  Clock,
  Sparkles,
} from 'lucide-react'
import { Button } from '../common/Button'
import { Badge } from '../common/Badge'
import { triggerHaptic } from '../../utils/telegram'
import { useLanguage } from '../../context/LanguageContext'
import { useTelegram } from '../../context/TelegramContext'
import {
  submitVendorApplication,
  VendorLegalStatus,
  VendorApplication,
} from '../../services/adminService'

export interface VendorRegistrationModalProps {
  isOpen: boolean
  onClose: () => void
  existingApplication?: VendorApplication | null
  onApplicationSubmitted?: (app: VendorApplication) => void
}

export const VendorRegistrationModal: React.FC<VendorRegistrationModalProps> = ({
  isOpen,
  onClose,
  existingApplication,
  onApplicationSubmitted,
}) => {
  const { t, currentLocale } = useLanguage()
  const { user: tgUser, haptic } = useTelegram()

  const [shopName, setShopName] = useState('')
  const [category, setCategory] = useState('bakery')
  const [legalStatus, setLegalStatus] = useState<VendorLegalStatus>('craft_certificate')
  const [description, setDescription] = useState('')
  const [phone, setPhone] = useState('+998 ')
  const [ownerName, setOwnerName] = useState(
    tgUser ? `${tgUser.first_name} ${tgUser.last_name || ''}`.trim() : ''
  )
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submittedApp, setSubmittedApp] = useState<VendorApplication | null>(null)

  if (!isOpen) return null

  const legalStatusOptions: { value: VendorLegalStatus; label: string; desc: string }[] = [
    {
      value: 'craft_certificate',
      label: currentLocale === 'ru' ? 'Свидетельство ремесленника ("Hunarmand")' : 'Hunarmand guvohnomasi bor',
      desc: currentLocale === 'ru' ? 'Официальный статус члена ассоциации ремесленников' : 'Hunarmandlar uyushmasi rasmiy a’zosi',
    },
    {
      value: 'individual_entrepreneur',
      label: currentLocale === 'ru' ? 'ИП / Самозанятый' : 'YTT / O‘zini o‘zi band qilgan',
      desc: currentLocale === 'ru' ? 'Индивидуальный предприниматель или самозанятый гражданин' : 'Rasmiy soliq to‘lovchi yoki ro‘yxatdan o‘tgan tadbirkor',
    },
    {
      value: 'home_artisan',
      label: currentLocale === 'ru' ? 'Домашний кулинар / Мастер' : 'Uy sharoitida tayyorlovchi',
      desc: currentLocale === 'ru' ? 'Приготовление свежих блюд и ремесел на дому' : 'Oila davrasida toza va halol mahsulotlar tayyorlovchi usta',
    },
  ]

  const categories = [
    { id: 'bakery', label: t.categories.bakery },
    { id: 'national', label: t.categories.national },
    { id: 'sweets', label: t.categories.sweets },
    { id: 'crafts', label: t.categories.crafts },
    { id: 'dairy', label: t.categories.dairy },
  ]

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!shopName.trim() || !description.trim()) return

    const selectedLegal = legalStatusOptions.find((o) => o.value === legalStatus)

    const app = submitVendorApplication({
      shopName: shopName.trim(),
      ownerName: ownerName.trim() || 'Hurmatli Usta',
      telegramUsername: tgUser?.username || undefined,
      phone: phone.trim() || '+998 90 000 00 00',
      category,
      legalStatus,
      legalStatusLabel: selectedLegal ? selectedLegal.label : 'Hunarmand',
      description: description.trim(),
    })

    haptic.notification('success')
    setSubmittedApp(app)
    setIsSubmitted(true)
    onApplicationSubmitted?.(app)
  }

  // Active or previously submitted application preview
  const displayApp = submittedApp || existingApplication

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#3B2219]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-lg bg-[#FAF6F0] rounded-t-[32px] sm:rounded-[32px] border border-[#E6DED5] p-5 sm:p-6 shadow-[0_-12px_44px_rgba(59,34,25,0.22)] space-y-4 animate-in slide-in-from-bottom duration-250 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile grab handle */}
        <div className="w-10 h-1.5 rounded-full bg-[#E6DED5] mx-auto -mt-1 mb-1 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[#EFE9E1]">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#C85A32]/10 border border-[#C85A32]/30 flex items-center justify-center text-[#C85A32] shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#3B2219] font-['Manrope']">
                {displayApp ? 'Do‘kon arizasi holati' : 'Ustaxona / Do‘kon ochish'}
              </h3>
              <p className="text-[11px] text-[#6F574E]">
                {displayApp
                  ? 'Administrator tekshiruvi jarayoni'
                  : 'Mahalliy hunarmandlar bozorida o‘z vitrinangizni yarating'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              onClose()
            }}
            className="w-8 h-8 rounded-full bg-[#EFE9E1] hover:bg-[#E6DED5] text-[#3B2219] flex items-center justify-center transition-colors"
            aria-label={t.common.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Existing Application / Submission Success Screen */}
        {displayApp ? (
          <div className="space-y-4 py-2 animate-in fade-in duration-200">
            <div className="p-4 rounded-[22px] bg-[#FFFDF9] border border-[#E6DED5] shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#3B2219] font-['Manrope']">
                    #{displayApp.id}
                  </span>
                  <span className="text-sm font-extrabold text-[#3B2219]">
                    {displayApp.shopName}
                  </span>
                </div>
                <Badge
                  variant={
                    displayApp.status === 'approved'
                      ? 'fresh'
                      : displayApp.status === 'rejected'
                      ? 'secondary'
                      : 'accent'
                  }
                  size="sm"
                >
                  {displayApp.status === 'approved'
                    ? 'TASDIQLANDI (FAOL)'
                    : displayApp.status === 'rejected'
                    ? 'RAD ETILDI'
                    : 'KUTILMOQDA (PENDING)'}
                </Badge>
              </div>

              <div className="p-3 rounded-[16px] bg-[#FAF6F0] border border-[#E6DED5] text-xs space-y-1.5">
                <div className="flex justify-between text-[#6F574E]">
                  <span>Egasi:</span>
                  <span className="font-bold text-[#3B2219]">{displayApp.ownerName}</span>
                </div>
                <div className="flex justify-between text-[#6F574E]">
                  <span>Toifasi:</span>
                  <span className="font-bold text-[#3B2219] capitalize">
                    {displayApp.category}
                  </span>
                </div>
                <div className="flex justify-between text-[#6F574E]">
                  <span>Huquqiy maqomi:</span>
                  <span className="font-bold text-[#3B2219] text-right truncate max-w-[200px]">
                    {displayApp.legalStatusLabel}
                  </span>
                </div>
                <div className="flex justify-between text-[#6F574E]">
                  <span>Telefon:</span>
                  <span className="font-mono font-bold text-[#3B2219]">{displayApp.phone}</span>
                </div>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase text-[#9B887F] block mb-1">
                  Ustaxona ta’rifi
                </span>
                <p className="text-xs text-[#3B2219] leading-relaxed italic bg-[#FAF6F0] p-2.5 rounded-[12px]">
                  "{displayApp.description}"
                </p>
              </div>

              {displayApp.status === 'pending' && (
                <div className="p-3 rounded-[16px] bg-[#FAF0DC] border border-[#E5A118]/40 flex items-start gap-2.5">
                  <Clock className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#3B2219] leading-relaxed">
                    Arizangiz 24 soat ichida administratorlar tomonidan ko‘rib chiqiladi. Tasdiqlangach, do‘koningiz va mahsulotlaringiz bozorda e’lon qilinadi!
                  </p>
                </div>
              )}

              {displayApp.status === 'approved' && (
                <div className="p-3 rounded-[16px] bg-[#E8F5E9] border border-[#2E7D32]/40 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#2E7D32] shrink-0 mt-0.5" />
                  <p className="text-[11px] text-[#1B5E20] leading-relaxed font-medium">
                    Tabriklaymiz! Do‘koningiz muvaffaqiyatli tasdiqlandi. Endi mahsulotlaringiz barcha xaridorlarga ko‘rinadi.
                  </p>
                </div>
              )}
            </div>

            <Button variant="primary" size="lg" fullWidth onClick={onClose}>
              {t.common.close}
            </Button>
          </div>
        ) : (
          /* Application Registration Form */
          <form onSubmit={handleSubmit} className="space-y-3.5 animate-in fade-in duration-200">
            {/* Informational Header Notice */}
            <div className="p-3 rounded-[18px] bg-[#FAF0DC] border border-[#E5A118]/30 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
              <p className="text-[11px] text-[#3B2219] leading-relaxed font-medium">
                Locally bozorida har bir usta va sotuvchi ma’muriyat tomonidan tekshirilib tasdiqlanadi. Bu xaridorlar ishonchini 100% kafolatlaydi.
              </p>
            </div>

            {/* Shop Name */}
            <div>
              <label className="text-[11px] font-bold text-[#3B2219] flex items-center gap-1.5 mb-1">
                <Store className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Do‘kon yoki ustaxona nomi *</span>
              </label>
              <input
                type="text"
                required
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                placeholder="Masalan: Buxoro Shirinliklar Uyi"
                className="w-full px-3.5 py-2.5 rounded-[16px] bg-[#FFFDF9] border border-[#E6DED5] text-xs font-semibold text-[#3B2219] placeholder:text-[#9B887F] focus:outline-none focus:border-[#C85A32]"
              />
            </div>

            {/* Category Selection */}
            <div>
              <label className="text-[11px] font-bold text-[#3B2219] flex items-center gap-1.5 mb-1.5">
                <Tag className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Asosiy yo‘nalish (Toifa) *</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light')
                      setCategory(c.id)
                    }}
                    className={`py-2 px-3 rounded-[14px] text-xs font-bold text-left transition-all ${
                      category === c.id
                        ? 'bg-[#3B2219] text-white shadow-xs'
                        : 'bg-[#FFFDF9] text-[#6F574E] border border-[#E6DED5] hover:border-[#3B2219]/30'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Legal Status (YTT / Hunarmand / Uy sharoiti) */}
            <div>
              <label className="text-[11px] font-bold text-[#3B2219] flex items-center gap-1.5 mb-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Huquqiy faoliyat maqomi *</span>
              </label>
              <div className="space-y-1.5">
                {legalStatusOptions.map((opt) => (
                  <div
                    key={opt.value}
                    onClick={() => {
                      triggerHaptic('light')
                      setLegalStatus(opt.value)
                    }}
                    className={`p-2.5 rounded-[16px] cursor-pointer transition-all border flex items-start gap-2.5 ${
                      legalStatus === opt.value
                        ? 'bg-[#FFFDF9] border-[#C85A32] shadow-xs ring-1 ring-[#C85A32]'
                        : 'bg-[#FFFDF9] border-[#E6DED5] hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-full border flex items-center justify-center mt-0.5 shrink-0 ${
                        legalStatus === opt.value
                          ? 'border-[#C85A32] bg-[#C85A32]'
                          : 'border-[#9B887F]'
                      }`}
                    >
                      {legalStatus === opt.value && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <div>
                      <h5 className="text-xs font-extrabold text-[#3B2219]">
                        {opt.label}
                      </h5>
                      <p className="text-[10px] text-[#6F574E] mt-0.5 leading-snug">
                        {opt.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Owner & Phone Row */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[10px] font-bold text-[#3B2219] flex items-center gap-1 mb-1">
                  <User className="w-3 h-3 text-[#C85A32]" />
                  <span>Ism sharifingiz *</span>
                </label>
                <input
                  type="text"
                  required
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="Ismingiz"
                  className="w-full px-3 py-2 rounded-[14px] bg-[#FFFDF9] border border-[#E6DED5] text-xs font-semibold text-[#3B2219] focus:outline-none focus:border-[#C85A32]"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-[#3B2219] flex items-center gap-1 mb-1">
                  <Phone className="w-3 h-3 text-[#C85A32]" />
                  <span>Telefon raqamingiz *</span>
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+998 90 123 45 67"
                  className="w-full px-3 py-2 rounded-[14px] bg-[#FFFDF9] border border-[#E6DED5] text-xs font-semibold text-[#3B2219] focus:outline-none focus:border-[#C85A32]"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="text-[11px] font-bold text-[#3B2219] flex items-center gap-1.5 mb-1">
                <FileText className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Mahsulotlaringiz va tajribangiz haqida *</span>
              </label>
              <textarea
                required
                rows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Qanday mahsulotlar tayyorlaysiz? Masalan: 5 yildan beri tandirda tabiiy xamirdan issiq non va somsalar yopaman..."
                className="w-full px-3.5 py-2.5 rounded-[16px] bg-[#FFFDF9] border border-[#E6DED5] text-xs font-medium text-[#3B2219] placeholder:text-[#9B887F] focus:outline-none focus:border-[#C85A32] resize-none"
              />
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              variant="accent"
              size="lg"
              fullWidth
            >
              Arizani yuborish
            </Button>
          </form>
        )}
      </div>
    </div>
  )
}

export default VendorRegistrationModal
