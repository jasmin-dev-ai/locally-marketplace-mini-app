import React from 'react'
import { triggerHaptic } from '../../utils/telegram'

export interface SearchBarProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  onFilterClick?: () => void
  hasActiveFilters?: boolean
  className?: string
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChange,
  placeholder = 'Search artisan breads, samsa, crafts…',
  onFilterClick,
  hasActiveFilters = false,
  className = '',
}) => {
  const handleClear = () => {
    triggerHaptic('light')
    onChange('')
  }

  return (
    <div
      className={`relative flex items-center h-[52px] bg-[#FFFDF9] border border-[#E6DED5] rounded-[16px] px-3.5 transition-all duration-200 focus-within:border-[#C85A32] focus-within:ring-2 focus-within:ring-[#C85A32]/15 shadow-xs ${className}`}
    >
      {/* Search Icon */}
      <svg
        className="w-5 h-5 text-[#6F574E] shrink-0 mr-2.5 transition-colors group-focus-within:text-[#C85A32]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
      </svg>

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-full bg-transparent border-0 outline-none text-sm text-[#3B2219] placeholder:text-[#9B887F] font-medium"
      />

      {/* Clear Button */}
      {value && (
        <button
          type="button"
          onClick={handleClear}
          className="p-1 rounded-full text-[#9B887F] hover:text-[#3B2219] hover:bg-[#EFE9E1] mr-1 transition-colors"
          aria-label="Clear search"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      )}

      {/* Filter Button */}
      {onFilterClick && (
        <button
          type="button"
          onClick={() => {
            triggerHaptic('light')
            onFilterClick()
          }}
          className={`relative flex items-center justify-center w-8 h-8 rounded-[10px] transition-colors shrink-0 ml-1 ${
            hasActiveFilters
              ? 'bg-[#C85A32] text-white shadow-xs'
              : 'bg-[#EFE9E1] text-[#3B2219] hover:bg-[#E6DED5]'
          }`}
          aria-label="Filter products"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M4 6h16M6 12h12m-8 6h4" />
          </svg>
          {hasActiveFilters && (
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#FAF6F0] rounded-full flex items-center justify-center">
              <span className="w-1.5 h-1.5 bg-[#C85A32] rounded-full" />
            </span>
          )}
        </button>
      )}
    </div>
  )
}

export default SearchBar
