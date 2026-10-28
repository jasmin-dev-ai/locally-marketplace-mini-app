import React from 'react'
import { triggerHaptic } from '../../utils/telegram'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'accent' | 'soft' | 'ghost' | 'outline'
  size?: 'sm' | 'md' | 'lg' | 'icon'
  fullWidth?: boolean
  haptic?: 'light' | 'medium' | 'heavy' | 'selection' | 'none'
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  isLoading?: boolean
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  haptic = 'light',
  leftIcon,
  rightIcon,
  isLoading = false,
  className = '',
  onClick,
  disabled,
  ...props
}) => {
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (disabled || isLoading) return
    if (haptic !== 'none') {
      triggerHaptic(haptic)
    }
    onClick?.(e)
  }

  // Base styles: soft tactile container, smooth transition, active micro-press
  const baseStyles =
    'relative inline-flex items-center justify-center font-bold tracking-tight select-none transition-all duration-200 active:scale-[0.97] disabled:opacity-50 disabled:pointer-events-none rounded-[16px] outline-none focus-visible:ring-2 focus-visible:ring-[#C85A32]/40'

  // Variant mappings using the design tokens
  const variantStyles = {
    // Rich Espresso Brown (#3B2219)
    primary:
      'bg-[#3B2219] text-[#FFFDF9] shadow-[0_6px_18px_rgba(59,34,25,0.18)] hover:bg-[#2A1811] active:bg-[#1E100B]',
    // Warm Terracotta / Burnt Orange (#C85A32)
    accent:
      'bg-[#C85A32] text-white shadow-[0_6px_18px_rgba(200,90,50,0.25)] hover:bg-[#B64F2A] active:bg-[#933D1C]',
    // Warm Taupe / Light Beige (#EFE9E1)
    secondary:
      'bg-[#EFE9E1] text-[#3B2219] border border-[#E6DED5] hover:bg-[#E6DED5] active:bg-[#DFD6CB]',
    // Soft Peach / Terracotta tint
    soft:
      'bg-[#F5D6C9] text-[#C85A32] hover:bg-[#ECC8B8] active:bg-[#E2B9A6]',
    // Transparent / Ghost
    ghost:
      'bg-transparent text-[#3B2219] hover:bg-[#EFE9E1] active:bg-[#E6DED5]',
    // Subtle Outline
    outline:
      'bg-[#FFFDF9] text-[#3B2219] border border-[#E6DED5] hover:border-[#3B2219]/30 shadow-xs',
  }

  // Sizing tokens
  const sizeStyles = {
    sm: 'h-9 px-3.5 text-xs gap-1.5 rounded-[12px]',
    md: 'h-12 px-5 text-sm gap-2 rounded-[16px]',
    lg: 'h-14 px-6 text-base gap-2.5 rounded-[18px]',
    icon: 'h-10 w-10 p-0 rounded-[14px]',
  }

  const widthStyle = fullWidth ? 'w-full' : ''

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${widthStyle} ${className}`}
      onClick={handleClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>}
          {children && <span>{children}</span>}
          {rightIcon && <span className="inline-flex shrink-0">{rightIcon}</span>}
        </>
      )}
    </button>
  )
}
export default Button
