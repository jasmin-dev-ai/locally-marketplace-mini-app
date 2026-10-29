import React, { useState } from 'react'
import { useLanguage } from '../../context/LanguageContext'
import { triggerHaptic } from '../../utils/telegram'
import {
  saveUserLocation,
  detectGPSLocation,
  POPULAR_DISTRICTS,
} from '../../services/locationService'
import { Button } from './Button'

export interface LocationPickerModalProps {
  isOpen: boolean
  onClose: () => void
  currentLocation?: string | null
  onLocationSelected: (location: string) => void
}

export const LocationPickerModal: React.FC<LocationPickerModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  onLocationSelected,
}) => {
  const { t } = useLanguage()
  const [manualInput, setManualInput] = useState(currentLocation || '')
  const [isDetecting, setIsDetecting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSelect = (loc: string) => {
    triggerHaptic('impact', 'medium')
    saveUserLocation(loc)
    onLocationSelected(loc)
    onClose()
  }

  const handleDetectGPS = async () => {
    setIsDetecting(true)
    setErrorMessage(null)
    triggerHaptic('light')

    try {
      const loc = await detectGPSLocation()
      handleSelect(loc)
    } catch (err) {
      setErrorMessage(t.location.detectError)
      triggerHaptic('notification', 'error')
    } finally {
      setIsDetecting(false)
    }
  }

  const handleSubmitManual = (e: React.FormEvent) => {
    e.preventDefault()
    if (!manualInput.trim()) return
    handleSelect(manualInput.trim())
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-[#3B2219]/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-[#FAF6F0] rounded-t-[32px] sm:rounded-[32px] border border-[#E6DED5] p-5 shadow-[0_-12px_40px_rgba(59,34,25,0.2)] space-y-4 animate-in slide-in-from-bottom duration-250 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Handle */}
        <div className="w-10 h-1.5 rounded-full bg-[#E6DED5] mx-auto -mt-1 mb-1 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between pb-1">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#C85A32]/10 border border-[#C85A32]/30 flex items-center justify-center text-lg">
              📍
            </div>
            <div>
              <h3 className="text-base font-extrabold text-[#3B2219] font-['Manrope']">
                {t.location.selectLocation}
              </h3>
              <p className="text-[11px] text-[#6F574E]">
                Locally Marketplace
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              triggerHaptic('light')
              onClose()
            }}
            className="w-8 h-8 rounded-full bg-[#EFE9E1] hover:bg-[#E6DED5] text-[#3B2219] font-bold flex items-center justify-center text-xs transition-colors"
          >
            ✕
          </button>
        </div>

        {/* GPS Instant Detect Button */}
        <button
          type="button"
          disabled={isDetecting}
          onClick={handleDetectGPS}
          className="w-full py-3 px-4 rounded-[20px] bg-[#3B2219] text-[#FFFDF9] hover:bg-[#2C1810] flex items-center justify-center gap-2.5 text-xs font-extrabold shadow-sm active:scale-[0.99] transition-all disabled:opacity-70 font-['Manrope']"
        >
          {isDetecting ? (
            <>
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>{t.location.detecting}</span>
            </>
          ) : (
            <>
              <span className="text-base">🎯</span>
              <span>{t.location.detectLocation}</span>
            </>
          )}
        </button>

        {errorMessage && (
          <p className="text-[11px] text-[#C85A32] font-semibold text-center">
            {errorMessage}
          </p>
        )}

        {/* Manual Address Input */}
        <form onSubmit={handleSubmitManual} className="space-y-2">
          <label className="text-[11px] font-bold text-[#6F574E] block">
            {t.location.manualInputPlaceholder}
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={manualInput}
              onChange={(e) => setManualInput(e.target.value)}
              placeholder="e.g. Mirobod, Afrosiyob ko‘chasi 14"
              className="flex-1 px-3.5 py-2.5 rounded-[16px] bg-[#FFFDF9] border border-[#E6DED5] text-xs font-medium text-[#3B2219] focus:outline-none focus:border-[#C85A32]"
            />
            <Button
              type="submit"
              variant="accent"
              size="sm"
              disabled={!manualInput.trim()}
            >
              {t.common.save}
            </Button>
          </div>
        </form>

        {/* Popular Neighborhoods / Districts */}
        <div className="space-y-2 pt-1">
          <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8E7C74] block">
            🏙️ {t.location.popularDistricts}
          </span>
          <div className="flex flex-wrap gap-1.5">
            {POPULAR_DISTRICTS.map((district) => {
              const isSelected = currentLocation === district
              return (
                <button
                  key={district}
                  type="button"
                  onClick={() => handleSelect(district)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${
                    isSelected
                      ? 'bg-[#C85A32] text-white shadow-xs'
                      : 'bg-[#FFFDF9] text-[#3B2219] border border-[#E6DED5] hover:border-[#C85A32]/40 hover:bg-[#FAF6F0]'
                  }`}
                >
                  {district}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default LocationPickerModal
