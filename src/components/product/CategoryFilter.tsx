import React, { useRef } from 'react'
import { Category } from '../../types'
import { triggerHaptic } from '../../utils/telegram'
import { useLanguage } from '../../context/LanguageContext'

export interface CategoryFilterProps {
  categories: Category[]
  selectedId: string
  onSelect: (categoryId: string) => void
  className?: string
}

export const CategoryFilter: React.FC<CategoryFilterProps> = ({
  categories,
  selectedId,
  onSelect,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const { getLocalizedCategory } = useLanguage()

  const handleSelect = (id: string) => {
    if (id !== selectedId) {
      triggerHaptic('selection')
      onSelect(id)
    }
  }

  return (
    <div
      ref={containerRef}
      className={`flex items-center gap-2.5 overflow-x-auto no-scrollbar scroll-smooth py-1 px-5 -mx-5 select-none ${className}`}
      style={{
        WebkitOverflowScrolling: 'touch',
      }}
    >
      {categories.map((rawCategory) => {
        const category = getLocalizedCategory(rawCategory)
        const isActive = selectedId === category.id
        return (
          <button
            key={category.id}
            type="button"
            onClick={() => handleSelect(category.id)}
            className={`flex items-center gap-2.5 px-3 py-2 rounded-[16px] text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-200 active:scale-95 ${
              isActive
                ? 'bg-[#3B2219] text-[#FFFDF9] shadow-[0_4px_14px_rgba(59,34,25,0.16)] border border-[#3B2219]'
                : 'bg-[#FFFDF9] text-[#3B2219] border border-[#E6DED5] hover:border-[#3B2219]/30 shadow-xs'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-[11px] flex items-center justify-center text-sm transition-colors ${
                isActive ? 'bg-[#C85A32] text-white' : 'bg-[#EFE9E1] text-[#3B2219]'
              }`}
            >
              {category.icon}
            </span>
            <span className="tracking-tight">{category.name}</span>
            {category.badge && (
              <span
                className={`text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded-full ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-[#F5D6C9] text-[#C85A32]'
                }`}
              >
                {category.badge}
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

export default CategoryFilter
