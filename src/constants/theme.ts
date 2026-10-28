/**
 * Design System & Theme Tokens for the "Locally" Marketplace.
 * Strictly adheres to the artisanal, warm tactile aesthetic.
 */

export const THEME_COLORS = {
  // Core Required Palette
  background: '#FAF6F0', // Soft Cream / Off-White
  card: '#EFE9E1', // Warm Taupe / Light Beige
  primary: '#3B2219', // Rich Espresso Brown (Typography & Primary Elements)
  accent: '#C85A32', // Warm Terracotta / Burnt Orange (Accents & CTA Buttons)

  // Surface & Layer Variants
  surface: {
    base: '#FAF6F0',
    paper: '#FFFDF9',
    container: '#EFE9E1',
    elevated: '#FFFFFF',
    border: '#E6DED5',
    borderSubtle: '#F0E9DF',
    hover: '#E8E0D5',
  },

  // Typography Tones
  text: {
    primary: '#3B2219', // Rich Espresso Brown
    secondary: '#6F574E', // Warm Muted Brown
    tertiary: '#9B887F', // Soft Taupe Stone
    inverse: '#FFFDF9', // Warm White
    accent: '#C85A32', // Terracotta
  },

  // Accent & Action Variants
  terracotta: {
    light: '#F8ECE7',
    soft: '#F3D6C9',
    DEFAULT: '#C85A32',
    hover: '#B64F2A',
    dark: '#933D1C',
  },

  espresso: {
    light: '#6F574E',
    DEFAULT: '#3B2219',
    dark: '#24140E',
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
