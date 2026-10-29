import React, { useState } from 'react'
import { MapPin, Navigation, Building2, Search, Check, X, Compass, Info, Phone } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { triggerHaptic } from '../../utils/telegram'
import {
  saveUserLocation,
  detectGPSLocation,
  searchLocations,
  formatCleanCityDistrict,
  CITIES_LIST,
  getDistrictsByCity,
} from '../../services/locationService'

export interface LocationPickerModalProps {
  isOpen: boolean
  onClose: () => void
  currentLocation?: string | null
  onLocationSelected: (location: string) => void
}

type PickerTab = 'gps' | 'city_district' | 'search'

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
  const [selectedCity, setSelectedCity] = useState('Toshkent')
  const [selectedLocation, setSelectedLocation] = useState(
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

  const cityDistricts = getDistrictsByCity(selectedCity)
  const filteredLocations = searchLocations(searchQuery)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#2D231E]/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FFFDF9] rounded-t-[32px] sm:rounded-[32px] border border-[#EFE9E1] p-5 shadow-[0_-12px_44px_rgba(45,35,30,0.18)] space-y-4 animate-in slide-in-from-bottom duration-250 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile handle */}
        <div className="w-10 h-1.5 rounded-full bg-[#EFE9E1] mx-auto -mt-1 mb-1 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-[#C85A32]/10 border border-[#C85A32]/30 flex items-center justify-center text-[#C85A32]">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#2D231E] font-['Manrope']">
                {t.location.selectLocation}
              </h3>
              <p className="text-[11px] text-[#7A6B63]">
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
            className="w-10 h-10 min-w-[44px] min-h-[44px] rounded-full bg-[#EFE9E1] hover:bg-[#FAF6F0] text-[#2D231E] flex items-center justify-center transition-all active:scale-95"
            aria-label={t.common.close}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Privacy & Delivery Information Notice */}
        <div className="p-3.5 rounded-[18px] bg-[#FAF0DC] border border-[#E5A118]/30 flex items-start gap-2.5">
          <Info className="w-4 h-4 text-[#C85A32] shrink-0 mt-0.5" />
          <p className="text-[11px] text-[#2D231E] leading-relaxed font-medium">
            Uşbu maʼlumotlar buyurtmangizni aniq manzilga yetkazib beriş va kuryer siz bilan boğlanişi uçun kerak.
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
            className={`flex-1 min-h-[44px] py-2 rounded-[12px] flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              activeTab === 'gps'
                ? 'bg-[#FFFDF9] text-[#2D231E] shadow-xs'
                : 'text-[#7A6B63] hover:text-[#2D231E]'
            }`}
          >
            <Navigation className="w-3.5 h-3.5 text-[#C85A32]" />
            <span>GPS</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection')
              setActiveTab('city_district')
            }}
            className={`flex-1 min-h-[44px] py-2 rounded-[12px] flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              activeTab === 'city_district'
                ? 'bg-[#FFFDF9] text-[#2D231E] shadow-xs'
                : 'text-[#7A6B63] hover:text-[#2D231E]'
            }`}
          >
            <Building2 className="w-3.5 h-3.5 text-[#2D231E]" />
            <span>Şahar / Tuman</span>
          </button>

          <button
            type="button"
            onClick={() => {
              triggerHaptic('selection')
              setActiveTab('search')
            }}
            className={`flex-1 min-h-[44px] py-2 rounded-[12px] flex items-center justify-center gap-1.5 transition-all active:scale-95 ${
              activeTab === 'search'
                ? 'bg-[#FFFDF9] text-[#2D231E] shadow-xs'
                : 'text-[#7A6B63] hover:text-[#2D231E]'
            }`}
          >
            <Search className="w-3.5 h-3.5 text-[#7A6B63]" />
            <span>Qidiruv</span>
          </button>
        </div>

        {/* Tab 1: GPS Auto-Detect */}
        {activeTab === 'gps' && (
          <div className="p-4 rounded-[24px] bg-[#FFFDF9] border border-[#EFE9E1] space-y-3.5 animate-in fade-in duration-200">
            <div className="text-center space-y-1.5 py-2">
              <div className="w-12 h-12 rounded-2xl bg-[#C85A32]/10 text-[#C85A32] mx-auto flex items-center justify-center">
                <Compass className="w-6 h-6 animate-pulse" />
              </div>
              <h4 className="text-xs font-black text-[#2D231E] font-['Manrope']">
                {t.location.detectLocation}
              </h4>
              <p className="text-[11px] text-[#7A6B63] max-w-xs mx-auto">
                Qurilmangiz GPS signali orqali tuman va shahringiz avtomatik aniqlanadi.
              </p>
            </div>

            <button
              type="button"
              disabled={isDetecting}
              onClick={handleGPSDetect}
              className="w-full min-h-[48px] py-3 px-4 rounded-[16px] bg-[#C85A32] hover:bg-[#B64F2A] text-white flex items-center justify-center gap-2 text-xs font-extrabold shadow-[0_4px_16px_rgba(200,90,50,0.22)] active:scale-95 transition-all disabled:opacity-60 font-['Manrope']"
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
                className="w-full min-h-[44px] py-2.5 px-3 rounded-[14px] bg-[#EFE9E1] hover:bg-[#FAF6F0] text-[#2D231E] flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95"
              >
                <Phone className="w-3.5 h-3.5 text-[#C85A32]" />
                <span>Telegram orqali kontakt & manzilni ulashish</span>
              </button>
            )}
          </div>
        )}

        {/* Tab 2: Clean City & District Selection */}
        {activeTab === 'city_district' && (
          <div className="space-y-3.5 animate-in fade-in duration-200">
            {/* City Selector Pills */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold text-[#7A6B63] uppercase tracking-wider px-1">
                Şaharni tanlang
              </span>
              <div className="grid grid-cols-4 gap-1.5">
                {CITIES_LIST.map((city) => {
                  const isCityActive = selectedCity === city
                  return (
                    <button
                      key={city}
                      type="button"
                      onClick={() => {
                        triggerHaptic('selection')
                        setSelectedCity(city)
                        const firstDist = getDistrictsByCity(city)[0]
                        if (firstDist) {
                          setSelectedLocation(firstDist.formatted)
                        }
                      }}
                      className={`min-h-[44px] py-2 px-1 rounded-[14px] text-xs font-extrabold transition-all text-center truncate active:scale-95 ${
                        isCityActive
                          ? 'bg-[#2D231E] text-white shadow-xs'
                          : 'bg-[#FFFDF9] text-[#2D231E] border border-[#EFE9E1] hover:border-[#C85A32]/40'
                      }`}
                    >
                      {city}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* District List for Selected City */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-extrabold text-[#7A6B63] uppercase tracking-wider px-1">
                Tumanni tanlang ({selectedCity})
              </span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar">
                {cityDistricts.map((loc) => {
                  const isSelected = selectedLocation === loc.formatted
                  return (
                    <button
                      key={loc.district}
                      type="button"
                      onClick={() => {
                        triggerHaptic('light')
                        setSelectedLocation(loc.formatted)
                      }}
                      className={`w-full min-h-[44px] flex items-center justify-between p-3 rounded-[16px] text-left transition-all active:scale-[0.98] ${
                        isSelected
                          ? 'bg-[#FFFDF9] border-2 border-[#C85A32] shadow-xs'
                          : 'bg-[#FFFDF9] border border-[#EFE9E1] hover:bg-[#FAF6F0]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                            isSelected
                              ? 'bg-[#C85A32] text-white'
                              : 'bg-[#EFE9E1] text-[#7A6B63]'
                          }`}
                        >
                          <MapPin className="w-3 h-3" />
                        </div>
                        <span className="text-xs font-bold text-[#2D231E] font-['Manrope']">
                          {loc.district}
                        </span>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-[#C85A32]" />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Selected Location Summary Badge */}
            <div className="p-2.5 rounded-[14px] bg-[#EFE9E1] border border-[#EFE9E1] flex items-center justify-between">
              <div className="flex items-center gap-2 min-w-0">
                <MapPin className="w-3.5 h-3.5 text-[#C85A32] shrink-0" />
                <span className="text-xs font-extrabold text-[#2D231E] truncate font-['Manrope']">
                  {selectedLocation}
                </span>
              </div>
              <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-md bg-[#FFFDF9] text-[#7A6B63] shrink-0">
                Tanlangan
              </span>
            </div>

            {/* Confirmation Button */}
            <button
              type="button"
              onClick={() => handleConfirmLocation(selectedLocation)}
              className="w-full min-h-[48px] py-3.5 px-4 rounded-[16px] bg-[#C85A32] hover:bg-[#B64F2A] text-white flex items-center justify-center gap-2 text-xs font-extrabold shadow-[0_4px_16px_rgba(200,90,50,0.22)] active:scale-95 transition-all font-['Manrope']"
            >
              <Check className="w-4 h-4 text-white" />
              <span>Shu manzilni tasdiqlash</span>
            </button>
          </div>
        )}

        {/* Tab 3: Search Bar with Auto-Suggestions */}
        {activeTab === 'search' && (
          <div className="space-y-3 animate-in fade-in duration-200">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#7A6B63]" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.location.manualInputPlaceholder}
                className="w-full min-h-[44px] pl-10 pr-4 py-2.5 rounded-[16px] bg-[#FFFDF9] border border-[#EFE9E1] text-xs font-medium text-[#2D231E] focus:outline-none focus:border-[#C85A32]"
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
                    className={`w-full min-h-[44px] flex items-center justify-between p-3 rounded-[16px] text-left transition-all active:scale-[0.98] ${
                      isSelected
                        ? 'bg-[#FFFDF9] border border-[#C85A32] shadow-xs'
                        : 'bg-[#FFFDF9] border border-[#EFE9E1] hover:bg-[#FAF6F0]'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-[#EFE9E1] text-[#2D231E] flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#2D231E] block font-['Manrope']">
                          {loc.formatted}
                        </span>
                        <span className="text-[10px] text-[#7A6B63]">
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
