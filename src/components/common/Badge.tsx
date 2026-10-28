import React from 'react'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'accent' | 'fresh' | 'gold' | 'neutral' | 'dark'
  size?: 'sm' | 'md'
  dot?: boolean
  icon?: React.ReactNode
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  size = 'sm',
  dot = false,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center gap-1.5 font-bold uppercase tracking-wider rounded-full select-none'

  const variantStyles = {
    // Warm Terracotta / Burnt Orange
    accent: 'bg-[#C85A32] text-white',
    // Soft terracotta / peach
    default: 'bg-[#F5D6C9] text-[#C85A32]',
    // Fresh Artisan Mint
    fresh: 'bg-[#DCE8D5] text-[#2D4E37] border border-[#C7DAC0]',
    // Artisanal Gold
    gold: 'bg-[#FBF0CE] text-[#7A5C0B] border border-[#F2DF99]',
    // Soft Taupe / Neutral
    neutral: 'bg-[#EFE9E1] text-[#6F574E] border border-[#E6DED5]',
    // Espresso Dark
    dark: 'bg-[#3B2219] text-[#FFFDF9]',
  }

  const sizeStyles = {
    sm: 'text-[9px] px-2 py-0.5 leading-tight',
    md: 'text-[11px] px-2.5 py-1 leading-normal',
  }

  const dotColors = {
    accent: 'bg-white',
    default: 'bg-[#C85A32]',
    fresh: 'bg-[#2D4E37]',
    gold: 'bg-[#7A5C0B]',
    neutral: 'bg-[#6F574E]',
    dark: 'bg-[#FAF6F0]',
  }

  return (
    <span
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...props}
    >
      {dot && (
        <span
          className={`w-1.5 h-1.5 rounded-full ${dotColors[variant]} shrink-0`}
        />
      )}
      {icon && <span className="shrink-0">{icon}</span>}
      <span>{children}</span>
    </span>
  )
}

export default Badge
