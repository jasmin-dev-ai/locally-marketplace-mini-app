import React, { useState } from 'react'
import { MapPin, Navigation, Map, Search, Check, X, Compass, Info, Phone } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { triggerHaptic } from '../../utils/telegram'
import {
  saveUserLocation,
  detectGPSLocation,
  searchLocations,
  SearchableLocation,
  KNOWN_LOCATIONS,
  formatCleanCityDistrict,
} from '../../services/locationService'

export interface LocationPickerModalProps {
  isOpen: boolean
  onClose: () => void
  currentLocation?: string | null
  onLocationSelected: (location: string) => void
}

type PickerTab = 'gps' | 'map' | 'search'

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onLocationSelected,
}) => {
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<PickerTab>('gps')
  const [searchQuery, setSearchQuery] = useState('')
  const [isDetecting, setIsDetecting] = useState(false)
  const [selectedMapDistrict, setSelectedMapDistrict] = useState(
    currentLocation || 'Toshkent, Mirobod tumani'
  )

  if (!isOpen) return null

  const handleConfirmLocation = (loc: string) => {
    triggerHaptic('impact', 'medium')
    saveUserLocation(loc)
    onLocationSelected(loc)
    onClose()
  }

  const handleGPSDetect = async () => {
    setIsDetecting(true)
    triggerHaptic('light')
    try {
      const refinedDistrict = await detectGPSLocation()
      handleConfirmLocation(refinedDistrict)
    } finally {
      setIsDetecting(false)
    }
  }

  const filteredLocations = searchLocations(searchQuery)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#3B2219]/60 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FAF6F0] rounded-t-[32px] sm:rounded-[32px] border border-[#E6DED5] p-5 shadow-[0_-12px_44px_rgba(59,34,25,0.22)] space-y-4 animate-in slide-in-from-bottom duration-250 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle */}
        <div className="w-10 h-1.5 rounded-full bg-[#E6DED5] mx-auto -mt-1 mb-1 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#C85A32]/10 border border-[#C85A32]/30 flex items-center justify-center text-[#C85A32]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#3B2219] font-['Manrope']">
                {t.location.selectLocation}
              </h3>
              <p className="text-[11px] text-[#6F574E]">
                {formatCleanCityDistrict(currentLocation)}
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

        {/* User Privacy & Delivery Information Notice */}
        <div className="p-3.5 rounded-[18px] bg-[#FAF0DC] border border-[#E5A118]/30 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#3B2219] leading-relaxed font-medium">
            Ushbu ma'lumotlar buyurtmangizni aniq manzilga yetkazib berish va kurier siz bilan bog'lanishi uchun kerak.
          </p>
        </div>

        {/* 3 Main Method Tabs */}
        <div className="flex bg-[#EFE9E1] p-1 rounded-[16px] text-xs font-bold font-['Manrope']">
          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection')
              setActiveTab('gps')
            }}
            className={`flex-1 py-2 rounded-[12px] flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'gps'
                ? 'bg-[#FFFDF9] text-[#3B2219] shadow-xs'
                : 'text-[#6F574E] hover:text-[#3B2219]'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>GPS</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection')
              setActiveTab('map')
            }}
            className={`flex-1 py-2 rounded-[12px] flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'map'
                ? 'bg-[#FFFDF9] text-[#3B2219] shadow-xs'
                : 'text-[#6F574E] hover:text-[#3B2219]'
            }`}
          >
            <Map className="w-3.5 h-3.5 text-[#3B2219]" />
            <span>Xarita</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection')
              setActiveTab('search')
            }}
            className={`flex-1 py-2 rounded-[12px] flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'search'
                ? 'bg-[#FFFDF9] text-[#3B2219] shadow-xs'
                : 'text-[#6F574E] hover:text-[#3B2219]'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#6F574E]" />
            <span>Qidiruv</span>
          </button>
        </div>

        {/* Tab 1: GPS Auto-Detect */}
        {activeTab === 'gps' && (
          <div className="p-4 rounded-[24px] bg-[#FFFDF9] border border-[#E6DED5] space-y-3.5 animate-in fade-in duration-200">
            <div className="text-center space-y-1.5 py-2">
              <div className="w-12 h-12 rounded-2xl bg-[#C85A32]/10 text-[#C85A32] mx-auto flex items-center justify-center">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="text-xs font-black text-[#3B2219] font-['Manrope']">
                {t.location.detectLocation}
              </h4>
              <p className="text-[11px] text-[#6F574E] max-w-xs mx-auto">
                Qurilmangiz GPS signali orqali tuman va shahringiz avtomatik aniqlanadi.
              </p>
            </div>

            <button
              type="button"
              disabled={isDetecting}
              onClick={handleGPSDetect}
              className="w-full py-3 px-4 rounded-[16px] bg-[#C85A32] hover:bg-[#B34E29] text-white flex items-center justify-center gap-2 text-xs font-extrabold shadow-sm active:scale-[0.98] transition-all disabled:opacity-60 font-['Manrope']"
            >
              {isDetecting ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{t.location.detecting}</span>
                </>
              ) : (
                <>
                  <Navigation className="w-4 h-4" />
                  <span>{t.location.detectLocation}</span>
                </>
              )}
            </button>

            {/* Telegram WebApp Native Contact Prompt */}
            {window.Telegram?.WebApp && (
              <button
                type="button"
                onClick={() => {
                  triggerHaptic('medium')
                  const tg = window.Telegram?.WebApp
                  if (tg?.requestContact) {
                    tg.requestContact((granted: boolean) => {
                      if (granted) {
                        handleGPSDetect()
                      }
                    })
                  } else {
                    handleGPSDetect()
                  }
                }}
                className="w-full py-2.5 px-3 rounded-[14px] bg-[#EFE9E1] hover:bg-[#E6DED5] text-[#3B2219] flex items-center justify-center gap-2 text-xs font-bold transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Telegram orqali kontakt & manzilni ulashish</span>
              </button>
            )}
          </div>
        )}

        {/* Tab 2: Pick on Visual Map */}
        {activeTab === 'map' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            {/* Visual Stylized Map Zone */}
            <div className="relative h-44 rounded-[22px] overflow-hidden border border-[#E6DED5] bg-[#EFE9E1] shadow-inner p-3 flex flex-col justify-between">
              {/* Map Canvas Background Grid */}
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#3B2219_1px,transparent_1px)] [background-size:14px_14px]" />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#FAF6F0]/80 via-transparent to-[#FAF6F0]/50" />

              {/* Center Pin Indicator */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-10">
                <div className="w-10 h-10 rounded-full bg-[#C85A32] text-white flex items-center justify-center shadow-lg border-2 border-white animate-bounce">
                  <MapPin className="w-5 h-5" />
                </div>
                <div className="w-4 h-1.5 rounded-full bg-black/20 blur-xs mt-1" />
              </div>

              {/* Map Floating District Badge */}
              <div className="relative z-20 flex justify-between items-start">
                <span className="px-2.5 py-1 rounded-full bg-[#FFFDF9]/90 backdrop-blur-md border border-[#E6DED5] text-[10px] font-extrabold text-[#3B2219] shadow-xs">
                  {selectedMapDistrict}
                </span>
                <span className="text-[10px] font-bold text-[#6F574E] bg-white/70 px-2 py-0.5 rounded-md">
                  Toshkent
                </span>
              </div>

              {/* Bottom Quick Select Pills */}
              <div className="relative z-20 flex gap-1.5 overflow-x-auto no-scrollbar pt-2">
                {KNOWN_LOCATIONS.slice(0, 5).map((loc) => (
                  <button
                    key={loc.district}
                    type="button"
                    onClick={() => {
                      triggerHaptic('light')
                      setSelectedMapDistrict(loc.formatted)
                    }}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold shrink-0 transition-all ${
                      selectedMapDistrict === loc.formatted
                        ? 'bg-[#3B2219] text-white shadow-xs'
                        : 'bg-[#FFFDF9] text-[#3B2219] border border-[#E6DED5]'
                    }`}
                  >
                    {loc.district}
                  </button>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => handleConfirmLocation(selectedMapDistrict)}
              className="w-full py-3 px-4 rounded-[16px] bg-[#3B2219] hover:bg-[#2C1810] text-[#FFFDF9] flex items-center justify-center gap-2 text-xs font-extrabold shadow-sm active:scale-[0.98] transition-all font-['Manrope']"
            >
              <Check className="w-4 h-4 text-[#C85A32]" />
              <span>Shu manzilni tasdiqlash</span>
            </button>
          </div>
        )}

        {/* Tab 3: Search Bar with Auto-Suggestions */}
        {activeTab === 'search' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9B887F]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.location.manualInputPlaceholder}
                className="w-full pl-10 pr-4 py-2.5 rounded-[16px] bg-[#FFFDF9] border border-[#E6DED5] text-xs font-medium text-[#3B2219] focus:outline-none focus:border-[#C85A32]"
              />
            </div>

            {/* Suggestions list */}
            <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
              {filteredLocations.map((loc) => {
                const isSelected = currentLocation === loc.formatted
                return (
                  <button
                    key={loc.formatted}
                    type="button"
                    onClick={() => handleConfirmLocation(loc.formatted)}
                    className={`w-full flex items-center justify-between p-3 rounded-[16px] text-left transition-colors ${
                      isSelected
                        ? 'bg-[#FFFDF9] border border-[#C85A32] shadow-xs'
                        : 'bg-[#FFFDF9] border border-[#E6DED5] hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#EFE9E1] text-[#3B2219] flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#3B2219] block font-['Manrope']">
                          {loc.formatted}
                        </span>
                        <span className="text-[10px] text-[#8E7C74]">
                          {loc.city}
                        </span>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#C85A32]" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default LocationPickerModal
