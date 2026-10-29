import React, { useRef } from 'react'
import { Sparkles, UtensilsCrossed, Soup, Cake, Palette, Coffee, Layers } from 'lucide-react'
import { Category } from '../../types'
import { triggerHaptic } from '../../utils/telegram'
import { useLanguage } from '../../context/LanguageContext'

export interface CategoryFilterProps {
  categories: Category[]
  selectedId: string
  onSelect: (categoryId: string) => void
  className?: string
}

function getCategoryIcon(id: string): React.ReactNode {
  switch (id) {
    case 'all':
      return <Sparkles className="w-3.5 h-3.5" />
    case 'bakery':
      return <UtensilsCrossed className="w-3.5 h-3.5" />
    case 'national':
      return <Soup className="w-3.5 h-3.5" />
    case 'sweets':
      return <Cake className="w-3.5 h-3.5" />
    case 'crafts':
      return <Palette className="w-3.5 h-3.5" />
    case 'dairy':
      return <Coffee className="w-3.5 h-3.5" />
    default:
      return <Layers className="w-3.5 h-3.5" />
  }
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
            className={`flex items-center gap-2.5 min-h-[44px] px-3.5 py-2.5 rounded-[16px] text-xs font-bold whitespace-nowrap shrink-0 transition-all duration-150 active:scale-95 ${
              isActive
                ? 'bg-[#2D231E] text-[#FFFDF9] shadow-[0_4px_14px_rgba(45,35,30,0.16)] border border-[#2D231E]'
                : 'bg-[#FFFDF9] text-[#2D231E] border border-[#EFE9E1] hover:border-[#C85A32]/30 shadow-xs'
            }`}
          >
            <span
              className={`w-7 h-7 rounded-[11px] flex items-center justify-center transition-colors ${
                isActive ? 'bg-[#C85A32] text-white' : 'bg-[#EFE9E1] text-[#2D231E]'
              }`}
            >
              {getCategoryIcon(category.id)}
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
