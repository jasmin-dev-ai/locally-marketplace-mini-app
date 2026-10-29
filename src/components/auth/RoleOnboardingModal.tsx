import React from 'react'
import { Sparkles, ShoppingBag, Store, ArrowRight, Check } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { triggerHaptic } from '../../utils/telegram'
import { LanguageSwitcher } from '../common/LanguageSwitcher'
import { UserRole, saveUserRole } from '../../services/roleService'

export interface RoleOnboardingModalProps {
  isOpen: boolean
  onSelectRole: (role: UserRole) => void
  onClose?: () => void
}

export const RoleOnboardingModal: React.FC<RoleOnboardingModalProps> = ({
  isOpen,
  onSelectRole,
  onClose,
}) => {
  const { t } = useLanguage()

  if (!isOpen) return null

  const handleChoose = (role: UserRole) => {
    triggerHaptic('impact', 'medium')
    saveUserRole(role)
    onSelectRole(role)
    onClose?.()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#2D231E]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FFFDF9] rounded-[32px] border border-[#EFE9E1] p-6 shadow-xl space-y-5 animate-in zoom-in-95 duration-200 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar with Language Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#C85A32] text-white flex items-center justify-center text-sm font-extrabold shadow-xs">
              L
            </div>
            <span className="text-xs font-black text-[#2D231E] font-['Manrope'] tracking-wider uppercase">
              Locally
            </span>
          </div>
          <LanguageSwitcher variant="dropdown" />
        </div>

        {/* Welcome Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FFFDF9] border border-[#EFE9E1] flex items-center justify-center text-[#C85A32] shadow-xs">
            <Sparkles className="w-8 h-8 text-[#C85A32]" />
          </div>
          <h2 className="text-xl font-black text-[#2D231E] font-['Manrope'] tracking-tight">
            {t.onboarding.welcomeTitle}
          </h2>
          <p className="text-xs text-[#7A6B63] max-w-xs mx-auto leading-relaxed">
            {t.onboarding.welcomeSubtitle}
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="space-y-3 pt-1">
          {/* Role 1: Buyer / Customer */}
          <button
            type="button"
            onClick={() => handleChoose('buyer')}
            className="w-full text-left p-4 rounded-[24px] bg-[#FFFDF9] border-2 border-[#EFE9E1] hover:border-[#C85A32] transition-all duration-200 shadow-sm active:scale-[0.98] group space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#EFE9E1] group-hover:bg-[#C85A32]/10 text-[#C85A32] flex items-center justify-center transition-colors">
                  <ShoppingBag className="w-5 h-5 text-[#C85A32]" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#2D231E] font-['Manrope'] group-hover:text-[#C85A32] transition-colors">
                    {t.onboarding.buyerTitle}
                  </h3>
                  <span className="text-[10px] font-bold text-[#7A6B63] uppercase tracking-wider">
                    Customer / Foodie
                  </span>
                </div>
              </div>
              <span className="w-7 h-7 rounded-full bg-[#EFE9E1] group-hover:bg-[#C85A32] group-hover:text-white text-[#2D231E] text-xs font-bold flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <p className="text-xs text-[#7A6B63] leading-relaxed">
              {t.onboarding.buyerDesc}
            </p>

            <div className="pt-2 border-t border-[#EFE9E1] space-y-1 text-[11px] text-[#7A6B63]">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#2D7A4F] stroke-[2.5]" />
                <span>{t.onboarding.buyerFeature1}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#2D7A4F] stroke-[2.5]" />
                <span>{t.onboarding.buyerFeature2}</span>
              </div>
            </div>
          </button>

          {/* Role 2: Seller / Artisan */}
          <button
            type="button"
            onClick={() => handleChoose('seller')}
            className="w-full text-left p-4 rounded-[24px] bg-[#FFFDF9] border-2 border-[#EFE9E1] hover:border-[#C85A32] transition-all duration-200 shadow-sm active:scale-[0.98] group space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#C85A32]/10 text-[#C85A32] flex items-center justify-center transition-colors">
                  <Store className="w-5 h-5 text-[#C85A32]" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#2D231E] font-['Manrope'] group-hover:text-[#C85A32] transition-colors">
                    {t.onboarding.sellerTitle}
                  </h3>
                  <span className="text-[10px] font-bold text-[#7A6B63] uppercase tracking-wider">
                    Vendor / Local Artisan
                  </span>
                </div>
              </div>
              <span className="w-7 h-7 rounded-full bg-[#EFE9E1] group-hover:bg-[#C85A32] group-hover:text-white text-[#2D231E] text-xs font-bold flex items-center justify-center transition-colors">
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>

            <p className="text-xs text-[#7A6B63] leading-relaxed">
              {t.onboarding.sellerDesc}
            </p>

            <div className="pt-2 border-t border-[#EFE9E1] space-y-1 text-[11px] text-[#7A6B63]">
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#C85A32] stroke-[2.5]" />
                <span>{t.onboarding.sellerFeature1}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-[#C85A32] stroke-[2.5]" />
                <span>{t.onboarding.sellerFeature2}</span>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}

export default RoleOnboardingModal
