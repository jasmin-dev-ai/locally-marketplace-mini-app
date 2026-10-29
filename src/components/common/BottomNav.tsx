import React from 'react'
import { Home, LayoutGrid, ShoppingBag, User } from 'lucide-react'
import { NavTab } from '../../types'
import { triggerHaptic } from '../../utils/telegram'
import { useLanguage } from '../../context/LanguageContext'

export interface BottomNavProps {
  activeTab: NavTab
  onTabChange: (tab: NavTab) => void
  cartCount?: number
  className?: string
}

interface NavItem {
  id: NavTab
  label: string
  badge?: number
  icon: (active: boolean) => React.ReactNode
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  cartCount = 0,
  className = '',
}) => {
  const { t } = useLanguage()

  const handleTabClick = (tab: NavTab) => {
    if (tab !== activeTab) {
      triggerHaptic('selection')
      onTabChange(tab)
    }
  }

  const items: NavItem[] = [
    {
      id: 'home',
      label: t.nav.home,
      icon: (active) => (
        <Home
          className={`w-5 h-5 transition-transform ${active ? 'scale-110' : ''}`}
          strokeWidth={active ? 2.5 : 1.9}
        />
      ),
    },
    {
      id: 'menu',
      label: t.nav.menu,
      icon: (active) => (
        <LayoutGrid
          className={`w-5 h-5 transition-transform ${active ? 'scale-110' : ''}`}
          strokeWidth={active ? 2.5 : 1.9}
        />
      ),
    },
    {
      id: 'cart',
      label: t.nav.cart,
      badge: cartCount,
      icon: (active) => (
        <ShoppingBag
          className={`w-5 h-5 transition-transform ${active ? 'scale-110' : ''}`}
          strokeWidth={active ? 2.5 : 1.9}
        />
      ),
    },
    {
      id: 'profile',
      label: t.nav.profile,
      icon: (active) => (
        <User
          className={`w-5 h-5 transition-transform ${active ? 'scale-110' : ''}`}
          strokeWidth={active ? 2.5 : 1.9}
        />
      ),
    },
  ]

  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 bg-[#FFFDF9]/95 backdrop-blur-md border-t border-[#EFE9E1] shadow-[0_-4px_24px_rgba(45,35,30,0.04)] ${className}`}
      style={{
        paddingBottom: 'max(10px, env(safe-area-inset-bottom, 10px))',
      }}
    >
      <div className="grid grid-cols-4 h-14 max-w-lg mx-auto">
        {items.map((item) => {
          const isActive = activeTab === item.id
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleTabClick(item.id)}
              className={`relative min-h-[48px] flex flex-col items-center justify-center gap-1 select-none transition-all duration-150 active:scale-95 ${
                isActive
                  ? 'text-[#C85A32]'
                  : 'text-[#7A6B63] hover:text-[#2D231E]'
              }`}
            >
              <div className="relative">
                {item.icon(isActive)}
                {Boolean(item.badge && item.badge > 0) && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[18px] h-[18px] px-1 bg-[#C85A32] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-[#FFFDF9] shadow-xs animate-in zoom-in-75 duration-200">
                    {item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] tracking-tight ${
                  isActive ? 'font-bold' : 'font-medium'
                }`}
              >
                {item.label}
              </span>
              {isActive && (
                <span className="absolute bottom-1 w-5 h-1 bg-[#C85A32] rounded-full transition-all duration-200" />
              )}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

export default BottomNav
