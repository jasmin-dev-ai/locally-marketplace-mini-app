/**
 * Design System & Theme Tokens for the "Locally" Marketplace.
 * Strictly adheres to the artisanal, warm tactile aesthetic.
 */

export const THEME_COLORS = {
  // Core Required Palette
  background: '#FFFDF9', // Soft Cream
  card: '#EFE9E1', // Warm Card Border / Taupe
  primary: '#2D231E', // Dark Espresso
  accent: '#C85A32', // Deep Terracotta

  // Surface & Layer Variants
  surface: {
    base: '#FFFDF9',
    paper: '#FFFDF9',
    container: '#EFE9E1',
    elevated: '#FFFFFF',
    border: '#EFE9E1',
    borderSubtle: '#F7F4EF',
    hover: '#F2ECE4',
  },

  // Typography Tones
  text: {
    primary: '#2D231E', // Dark Espresso
    secondary: '#7A6B63', // Soft Muted Tone
    tertiary: '#A89B93', // Subtle Helper Tone
    inverse: '#FFFDF9', // Warm White
    accent: '#C85A32', // Deep Terracotta
  },

  // Accent & Action Variants
  terracotta: {
    light: '#F8ECE7',
    soft: '#F3D6C9',
    DEFAULT: '#C85A32',
    hover: '#B34E29',
    dark: '#933D1C',
  },

  espresso: {
    light: '#7A6B63',
    DEFAULT: '#2D231E',
    dark: '#1C1512',
  },

  // Contextual Badges & Indicators
  badge: {
    fresh: {
      bg: '#DCE8D5',
      text: '#2D4E37',
      border: '#C7DAC0',
    },
    popular: {
      bg: '#F5D6C9',
      text: '#C85A32',
      border: '#EBBFA9',
    },
    verified: {
      bg: '#E3EAF7',
      text: '#2B4A78',
      border: '#C8D8F0',
    },
    gold: {
      bg: '#FBF0CE',
      text: '#7A5C0B',
      border: '#F2DF99',
    },
  },
} as const

export const THEME_RADIUS = {
  sm: '10px',
  md: '16px', // Standard container / input radius
  lg: '20px', // Card radius
  xl: '24px', // Tactile container & hero radius
  '2xl': '28px', // Sheets & modals
  full: '9999px', // Pills & badges
} as const

export const THEME_SHADOWS = {
  subtle: '0 2px 8px rgba(59, 34, 25, 0.04)',
  card: '0 6px 18px rgba(59, 34, 25, 0.06)',
  floating: '0 12px 32px rgba(59, 34, 25, 0.12)',
  elevated: '0 20px 48px rgba(59, 34, 25, 0.16)',
} as const

export const THEME_FONTS = {
  body: "'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  heading: "'Manrope', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
} as const

export const THEME_TRANSITIONS = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  standard: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
  bounce: '300ms cubic-bezier(0.34, 1.56, 0.64, 1)',
} as const

export default {
  colors: THEME_COLORS,
  radius: THEME_RADIUS,
  shadows: THEME_SHADOWS,
  fonts: THEME_FONTS,
  transitions: THEME_TRANSITIONS,
}
