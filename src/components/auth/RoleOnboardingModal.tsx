import React from 'react'
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#3B2219]/75 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FAF6F0] rounded-[32px] border border-[#E6DED5] p-6 shadow-[0_20px_50px_rgba(59,34,25,0.25)] space-y-5 animate-in zoom-in-95 duration-250 max-h-[92vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Bar with Language Selector */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#C85A32] text-white flex items-center justify-center text-sm font-extrabold shadow-xs">
              L
            </div>
            <span className="text-xs font-black text-[#3B2219] font-['Manrope'] tracking-wider uppercase">
              Locally
            </span>
          </div>
          <LanguageSwitcher variant="dropdown" />
        </div>

        {/* Welcome Header */}
        <div className="text-center space-y-1.5 pt-1">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#FFFDF9] border border-[#E6DED5] flex items-center justify-center text-3xl shadow-xs">
            ✨
          </div>
          <h2 className="text-xl font-black text-[#3B2219] font-['Manrope'] tracking-tight">
            {t.onboarding.welcomeTitle}
          </h2>
          <p className="text-xs text-[#6F574E] max-w-xs mx-auto leading-relaxed">
            {t.onboarding.welcomeSubtitle}
          </p>
        </div>

        {/* Role Cards Grid */}
        <div className="space-y-3 pt-1">
          {/* 🛍️ Role 1: Buyer / Customer */}
          <button
            type="button"
            onClick={() => handleChoose('buyer')}
            className="w-full text-left p-4 rounded-[24px] bg-[#FFFDF9] border-2 border-[#E6DED5] hover:border-[#C85A32] transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.98] group space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#EFE9E1] group-hover:bg-[#C85A32]/10 text-xl flex items-center justify-center transition-colors">
                  🛍️
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#3B2219] font-['Manrope'] group-hover:text-[#C85A32] transition-colors">
                    {t.onboarding.buyerTitle}
                  </h3>
                  <span className="text-[10px] font-bold text-[#8E7C74] uppercase tracking-wider">
                    Customer / Foodie
                  </span>
                </div>
              </div>
              <span className="w-6 h-6 rounded-full bg-[#EFE9E1] group-hover:bg-[#C85A32] group-hover:text-white text-[#3B2219] text-xs font-bold flex items-center justify-center transition-colors">
                ➔
              </span>
            </div>

            <p className="text-xs text-[#6F574E] leading-relaxed">
              {t.onboarding.buyerDesc}
            </p>

            <div className="pt-2 border-t border-[#EFE9E1] space-y-1 text-[11px] text-[#6F574E]">
              <div className="flex items-center gap-1.5">
                <span className="text-[#2E7D32] font-bold">✓</span>
                <span>{t.onboarding.buyerFeature1}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#2E7D32] font-bold">✓</span>
                <span>{t.onboarding.buyerFeature2}</span>
              </div>
            </div>
          </button>

          {/* 👩‍🍳 Role 2: Seller / Artisan */}
          <button
            type="button"
            onClick={() => handleChoose('seller')}
            className="w-full text-left p-4 rounded-[24px] bg-[#FFFDF9] border-2 border-[#E6DED5] hover:border-[#3B2219] transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.98] group space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#C85A32]/10 group-hover:bg-[#3B2219]/10 text-xl flex items-center justify-center transition-colors">
                  👩‍🍳
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-[#3B2219] font-['Manrope'] group-hover:text-[#C85A32] transition-colors">
                    {t.onboarding.sellerTitle}
                  </h3>
                  <span className="text-[10px] font-bold text-[#8E7C74] uppercase tracking-wider">
                    Vendor / Local Artisan
                  </span>
                </div>
              </div>
              <span className="w-6 h-6 rounded-full bg-[#EFE9E1] group-hover:bg-[#3B2219] group-hover:text-white text-[#3B2219] text-xs font-bold flex items-center justify-center transition-colors">
                ➔
              </span>
            </div>

            <p className="text-xs text-[#6F574E] leading-relaxed">
              {t.onboarding.sellerDesc}
            </p>

            <div className="pt-2 border-t border-[#EFE9E1] space-y-1 text-[11px] text-[#6F574E]">
              <div className="flex items-center gap-1.5">
                <span className="text-[#C85A32] font-bold">✓</span>
                <span>{t.onboarding.sellerFeature1}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-[#C85A32] font-bold">✓</span>
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
