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
    'relative inline-flex items-center justify-center font-bold tracking-tight select-none transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:pointer-events-none rounded-[16px] outline-none focus-visible:ring-2 focus-visible:ring-[#C85A32]/40'

  // Variant mappings using the design tokens
  const variantStyles = {
    // Deep Terracotta Primary (#C85A32)
    primary:
      'bg-[#C85A32] text-white shadow-[0_4px_16px_rgba(200,90,50,0.22)] hover:bg-[#B64F2A] active:bg-[#933D1C]',
    // Warm Terracotta Accent (#C85A32)
    accent:
      'bg-[#C85A32] text-white shadow-[0_4px_16px_rgba(200,90,50,0.22)] hover:bg-[#B64F2A] active:bg-[#933D1C]',
    // Warm Taupe / Soft Cream Secondary (#FFFDF9)
    secondary:
      'bg-[#FFFDF9] text-[#2D231E] border border-[#EFE9E1] hover:bg-[#FAF6F0] active:bg-[#EFE9E1] shadow-xs',
    // Soft Peach / Terracotta tint
    soft:
      'bg-[#FBF4EE] text-[#C85A32] border border-[#F5D6C9] hover:bg-[#F5D6C9] active:bg-[#ECC8B8]',
    // Transparent / Ghost
    ghost:
      'bg-transparent text-[#2D231E] hover:bg-[#EFE9E1]/60 active:bg-[#EFE9E1]',
    // Subtle Warm Outline
    outline:
      'bg-transparent text-[#2D231E] border border-[#EFE9E1] hover:border-[#C85A32]/40 hover:bg-[#FFFDF9] shadow-xs',
  }

  // Sizing tokens (Minimum 44px touch target height for mobile ergonomics)
  const sizeStyles = {
    sm: 'min-h-[44px] h-11 px-4 text-xs font-semibold gap-1.5 rounded-[14px]',
    md: 'min-h-[48px] h-12 px-5 text-sm font-semibold gap-2 rounded-[16px]',
    lg: 'min-h-[54px] h-14 px-6 text-base font-bold gap-2.5 rounded-[18px]',
    icon: 'min-h-[44px] min-w-[44px] h-11 w-11 p-0 rounded-[14px]',
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
