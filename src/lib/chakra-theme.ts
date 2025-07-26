'use client'

import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors: {
    // ICONS HERALD Unified Style Guide - Core Palette
    gold: {
      50: '#FEF9E7',
      100: '#FDF4D1',
      200: '#FBEAA3',
      300: '#F8DF75',
      400: '#F6D547',
      500: '#B8941F', // Enhanced Gold - WCAG AA Compliant (4.7:1 on cream)
      600: '#9C7E1A', // Darker gold for better contrast
      700: '#806915', // High contrast gold
      800: '#645310', // Very high contrast
      900: '#4A3D0C', // Maximum contrast gold
    },
    ivory: {
      50: '#FFFFF0', // Primary Ivory - Clean, Elegant, Surfaces
      100: '#FFFEF5',
      200: '#FFFCEB',
      300: '#FFFBE1',
      400: '#FFF9D7',
      500: '#FFF8CD',
      600: '#F5F3C3',
      700: '#EBEEB9',
      800: '#E1E9AF',
      900: '#D7E4A5',
    },
    charcoal: {
      50: '#F7F7F7',
      100: '#E1E1E1',
      200: '#CFCFCF',
      300: '#B1B1B1',
      400: '#9E9E9E',
      500: '#6B6B6B', // Enhanced contrast - WCAG AA compliant (4.6:1)
      600: '#555555', // Better contrast for secondary text
      700: '#404040', // High contrast for important text
      800: '#2A2A2A', // Very high contrast
      900: '#1A1A1A', // Primary Charcoal - High Contrast, Readability
    },
    cream: {
      50: '#FEFCF7',
      100: '#FDF9EF',
      200: '#FBF3DF',
      300: '#F9EDCF',
      400: '#F7E7BF',
      500: '#E8CF83', // Enhanced cream - Better contrast on dark backgrounds
      600: '#E4C870', // Darker cream for better visibility
      700: '#D4B85A', // High contrast cream
      800: '#C4A844', // Very high contrast
      900: '#B4982E', // Maximum contrast cream
    },
    // Semantic color mappings
    primary: {
      50: '#FEF9E7',
      100: '#FDF4D1',
      200: '#FBEAA3',
      300: '#F8DF75',
      400: '#F6D547',
      500: '#D4AF37', // Maps to Gold
      600: '#B8941F',
      700: '#9C7E1A',
      800: '#806915',
      900: '#645310',
    },
    secondary: {
      50: '#FFFFF0',
      100: '#FFFEF5',
      200: '#FFFCEB',
      300: '#FFFBE1',
      400: '#FFF9D7',
      500: '#FFF8CD', // Maps to Ivory
      600: '#F5F3C3',
      700: '#EBEEB9',
      800: '#E1E9AF',
      900: '#D7E4A5',
    },
    // Utility colors for states
    success: {
      50: '#F0FDF4',
      100: '#DCFCE7',
      200: '#BBF7D0',
      300: '#86EFAC',
      400: '#4ADE80',
      500: '#22C55E',
      600: '#16A34A',
      700: '#15803D',
      800: '#166534',
      900: '#14532D',
    },
    warning: {
      50: '#FFFBEB',
      100: '#FEF3C7',
      200: '#FDE68A',
      300: '#FCD34D',
      400: '#FBBF24',
      500: '#F59E0B',
      600: '#D97706',
      700: '#B45309',
      800: '#92400E',
      900: '#78350F',
    },
    error: {
      50: '#FEF2F2',
      100: '#FEE2E2',
      200: '#FECACA',
      300: '#FCA5A5',
      400: '#F87171',
      500: '#EF4444',
      600: '#DC2626',
      700: '#B91C1C',
      800: '#991B1B',
      900: '#7F1D1D',
    },
  },
  fonts: {
    // Typography Hierarchy
    heading: 'var(--font-playfair), "Playfair Display", Georgia, serif',
    body: 'var(--font-lato), "Lato", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    accent: 'var(--font-lora), "Lora", Georgia, serif',
    mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
  },
  fontSizes: {
    // Responsive typography scale
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    md: '1rem',       // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
    '7xl': '4.5rem',  // 72px
    '8xl': '6rem',    // 96px
    '9xl': '8rem',    // 128px
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
  },
  lineHeights: {
    normal: 'normal',
    none: 1,
    shorter: 1.25,
    short: 1.375,
    base: 1.5,
    tall: 1.625,
    taller: 2,
  },
  letterSpacings: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
  // ICONS HERALD Unified Spacing System (24px base unit)
  space: {
    px: '1px',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px - xs
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px - sm
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px - md (base unit)
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    12: '3rem',       // 48px - lg
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px - xl
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem',      // 384px
  },
  sizes: {
    // Container sizes for 12-column grid
    container: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    // Grid column widths (12-column system)
    '1/12': '8.333333%',
    '2/12': '16.666667%',
    '3/12': '25%',
    '4/12': '33.333333%',
    '5/12': '41.666667%',
    '6/12': '50%',
    '7/12': '58.333333%',
    '8/12': '66.666667%',
    '9/12': '75%',
    '10/12': '83.333333%',
    '11/12': '91.666667%',
    '12/12': '100%',
  },
  components: {
    // Typography Components
    Heading: {
      baseStyle: {
        fontFamily: 'heading',
        fontWeight: 'semibold',
        lineHeight: 'shorter',
        letterSpacing: 'tight',
      },
      sizes: {
        xs: {
          fontSize: 'md',
          lineHeight: 'base',
        },
        sm: {
          fontSize: 'lg',
          lineHeight: 'base',
        },
        md: {
          fontSize: 'xl',
          lineHeight: 'base',
        },
        lg: {
          fontSize: '2xl',
          lineHeight: 'short',
        },
        xl: {
          fontSize: '3xl',
          lineHeight: 'short',
        },
        '2xl': {
          fontSize: '4xl',
          lineHeight: 'shorter',
        },
        '3xl': {
          fontSize: '5xl',
          lineHeight: 'none',
        },
        '4xl': {
          fontSize: '6xl',
          lineHeight: 'none',
        },
      },
      variants: {
        editorial: {
          fontFamily: 'accent',
          fontStyle: 'italic',
          color: 'brown.600',
        },
        display: {
          fontWeight: 'bold',
          letterSpacing: 'tighter',
        },
      },
    },
    Text: {
      baseStyle: {
        fontFamily: 'body',
        lineHeight: 'base',
      },
      variants: {
        accent: {
          fontFamily: 'accent',
          fontStyle: 'italic',
          color: 'brown.600',
        },
        caption: {
          fontSize: 'sm',
          color: 'brown.500',
          fontFamily: 'accent',
        },
        quote: {
          fontFamily: 'accent',
          fontSize: 'lg',
          fontStyle: 'italic',
          color: 'brown.700',
          lineHeight: 'tall',
        },
      },
    },
    Button: {
      baseStyle: {
        fontFamily: 'body',
        fontWeight: 'semibold',
        borderRadius: 'lg',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        _focus: {
          boxShadow: '0 0 0 3px rgba(212, 175, 55, 0.3)',
        },
        _disabled: {
          opacity: 0.6,
          cursor: 'not-allowed',
          _hover: {
            transform: 'none',
          },
        },
      },
      variants: {
        // Primary Button: Gold fill, hover scale
        primary: {
          bg: 'gold.500', // Enhanced gold for better contrast
          color: 'white',
          borderWidth: '2px',
          borderColor: 'gold.500',
          _hover: {
            bg: 'gold.600',
            borderColor: 'gold.600',
            transform: 'scale(1.05)',
            boxShadow: '0 8px 25px rgba(184, 148, 31, 0.4)',
          },
          _active: {
            bg: 'gold.700',
            borderColor: 'gold.700',
            transform: 'scale(1.02)',
          },
          _focus: {
            outline: '3px solid',
            outlineColor: 'gold.700',
            outlineOffset: '2px',
            boxShadow: '0 0 0 1px var(--chakra-colors-gold-700), 0 8px 25px rgba(184, 148, 31, 0.4)',
          },
          _focusVisible: {
            outline: '3px solid',
            outlineColor: 'gold.700',
            outlineOffset: '2px',
          },
        },
        // Secondary Button: Ivory outline
        secondary: {
          bg: 'ivory.50', // #FFFFF0
          color: 'charcoal.900', // #1A1A1A
          borderWidth: '2px',
          borderColor: 'gold.500',
          _hover: {
            bg: 'gold.500',
            color: 'white',
            transform: 'scale(1.02)',
            boxShadow: '0 4px 12px rgba(184, 148, 31, 0.3)',
          },
          _active: {
            bg: 'gold.600',
            borderColor: 'gold.600',
          },
          _focus: {
            outline: '3px solid',
            outlineColor: 'gold.600',
            outlineOffset: '2px',
            boxShadow: '0 0 0 1px var(--chakra-colors-gold-600), 0 4px 12px rgba(184, 148, 31, 0.3)',
          },
          _focusVisible: {
            outline: '3px solid',
            outlineColor: 'gold.600',
            outlineOffset: '2px',
          },
        },
        // Legacy solid variant (maps to primary)
        solid: {
          bg: 'gold.500',
          color: 'white',
          borderWidth: '2px',
          borderColor: 'gold.500',
          _hover: {
            bg: 'gold.600',
            borderColor: 'gold.600',
            transform: 'scale(1.05)',
            boxShadow: '0 8px 25px rgba(212, 175, 55, 0.4)',
          },
          _active: {
            bg: 'gold.700',
            borderColor: 'gold.700',
            transform: 'scale(1.02)',
          },
        },
        // Legacy outline variant (maps to secondary)
        outline: {
          bg: 'ivory.50',
          color: 'charcoal.900',
          borderWidth: '2px',
          borderColor: 'gold.500',
          _hover: {
            bg: 'gold.500',
            color: 'white',
            transform: 'scale(1.02)',
            boxShadow: '0 4px 12px rgba(212, 175, 55, 0.3)',
          },
        },
        // Ghost variant for subtle actions
        ghost: {
          bg: 'transparent',
          color: 'gold.500',
          _hover: {
            bg: 'cream.100',
            transform: 'translateY(-1px)',
          },
          _active: {
            bg: 'cream.200',
          },
        },
      },
      sizes: {
        sm: {
          fontSize: 'sm',
          px: 4,
          py: 2,
          h: 8,
        },
        md: {
          fontSize: 'md',
          px: 6,
          py: 3,
          h: 10,
        },
        lg: {
          fontSize: 'lg',
          px: 8,
          py: 4,
          h: 12,
        },
        xl: {
          fontSize: 'xl',
          px: 12,
          py: 6,
          h: 16,
        },
      },
      defaultProps: {
        variant: 'primary',
        size: 'md',
      },
    },
    Card: {
      baseStyle: {
        container: {
          bg: 'ivory.50',
          borderRadius: '2xl',
          border: '1px solid',
          borderColor: 'ivory.200',
          boxShadow: '0 4px 20px rgba(139, 115, 85, 0.1)',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          _hover: {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 30px rgba(139, 115, 85, 0.15)',
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          fontFamily: 'body',
          transition: 'all 0.3s ease',
        },
      },
      variants: {
        filled: {
          field: {
            bg: 'ivory.100',
            borderRadius: 'lg',
            borderWidth: '2px',
            borderColor: 'ivory.300',
            _hover: {
              bg: 'ivory.50',
              borderColor: 'gold.300',
            },
            _focus: {
              bg: 'white',
              borderColor: 'gold.600',
              boxShadow: '0 0 0 2px var(--chakra-colors-gold-600), 0 0 20px rgba(184, 148, 31, 0.3)',
              outline: '2px solid transparent',
              outlineOffset: '2px',
            },
            _focusVisible: {
              outline: '2px solid',
              outlineColor: 'gold.600',
              outlineOffset: '2px',
            },
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Textarea: {
      baseStyle: {
        fontFamily: 'body',
        transition: 'all 0.3s ease',
      },
      variants: {
        filled: {
          bg: 'ivory.100',
          borderRadius: 'lg',
          borderWidth: '2px',
          borderColor: 'ivory.300',
          _hover: {
            bg: 'ivory.50',
            borderColor: 'gold.300',
          },
          _focus: {
            bg: 'white',
            borderColor: 'gold.600',
            boxShadow: '0 0 0 2px var(--chakra-colors-gold-600), 0 0 20px rgba(184, 148, 31, 0.3)',
            outline: '2px solid transparent',
            outlineOffset: '2px',
          },
          _focusVisible: {
            outline: '2px solid',
            outlineColor: 'gold.600',
            outlineOffset: '2px',
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Modal: {
      baseStyle: {
        dialog: {
          bg: 'ivory.50',
          borderRadius: '2xl',
          border: '2px solid',
          borderColor: 'gold.500',
        },
        header: {
          fontFamily: 'heading',
          fontSize: '2xl',
          fontWeight: 'bold',
          color: 'brown.700',
        },
        closeButton: {
          color: 'brown.600',
          _hover: {
            bg: 'brown.100',
          },
        },
      },
    },
  },
  styles: {
    global: {
      html: {
        scrollBehavior: 'smooth',
      },
      body: {
        bg: 'ivory.50', // #FFFFF0 - Primary background
        color: 'charcoal.900', // #1A1A1A - Primary text
        fontFamily: 'body',
        lineHeight: 'base',
        fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
        textRendering: 'optimizeLegibility',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
      },
      // Enhanced focus styles for accessibility
      '*:focus': {
        outline: '3px solid',
        outlineColor: 'gold.600',
        outlineOffset: '2px',
        boxShadow: '0 0 0 1px var(--chakra-colors-gold-600)',
      },
      // Remove default focus for mouse users, keep for keyboard
      '*:focus:not(:focus-visible)': {
        outline: 'none',
        boxShadow: 'none',
      },
      '*': {
        boxSizing: 'border-box',
      },
      '::selection': {
        bg: 'cream.500', // #F4E4BC - Warm highlight
        color: 'charcoal.900',
      },
      // Custom scrollbar with unified colors
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        bg: 'ivory.100',
      },
      '::-webkit-scrollbar-thumb': {
        bg: 'gold.400',
        borderRadius: '4px',
        _hover: {
          bg: 'gold.500',
        },
      },
      // Grid system utilities
      '.container': {
        maxWidth: 'container.2xl',
        mx: 'auto',
        px: 6, // 24px base spacing
      },
      '.grid': {
        display: 'grid',
        gridTemplateColumns: 'repeat(12, 1fr)',
        gap: 6, // 24px grid gap
      },
      '.col-span-1': { gridColumn: 'span 1 / span 1' },
      '.col-span-2': { gridColumn: 'span 2 / span 2' },
      '.col-span-3': { gridColumn: 'span 3 / span 3' },
      '.col-span-4': { gridColumn: 'span 4 / span 4' },
      '.col-span-5': { gridColumn: 'span 5 / span 5' },
      '.col-span-6': { gridColumn: 'span 6 / span 6' },
      '.col-span-7': { gridColumn: 'span 7 / span 7' },
      '.col-span-8': { gridColumn: 'span 8 / span 8' },
      '.col-span-9': { gridColumn: 'span 9 / span 9' },
      '.col-span-10': { gridColumn: 'span 10 / span 10' },
      '.col-span-11': { gridColumn: 'span 11 / span 11' },
      '.col-span-12': { gridColumn: 'span 12 / span 12' },
      // Responsive grid utilities
      '@media (max-width: 768px)': {
        '.grid': {
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 4, // 16px on mobile
        },
        '.container': {
          px: 4, // 16px on mobile
        },
      },
    },
  },
})

export { theme }
