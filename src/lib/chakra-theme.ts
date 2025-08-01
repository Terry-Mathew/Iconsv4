'use client'

import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,

  // === PREMIUM TYPOGRAPHY SYSTEM ===
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Lato', sans-serif",
  },
  fontSizes: {
    'display': '6.25rem',   // 100px - Massive hero headlines
    'hero': '5rem',         // 80px - Hero headlines
    'section': '3rem',      // 48px - Section headlines
    '7xl': '6.25rem',       // 100px - Massive display
    '6xl': '5rem',          // 80px - Large hero
    '5xl': '4rem',          // 64px - Large sections
    '4xl': '3rem',          // 48px - Section headers
    '3xl': '2.25rem',       // 36px - Subsection headers
    '2xl': '1.875rem',      // 30px - Large text
    'xl': '1.5rem',         // 24px - Medium large
    'lg': '1.25rem',        // 20px - Large body text
    'md': '1.125rem',       // 18px - Premium body text
    'sm': '0.875rem',       // 14px - Supporting text
    'xs': '0.75rem',        // 12px - Captions
  },
  fontWeights: {
    light: 300,             // Elegant headlines
    normal: 400,            // Body text
    medium: 500,            // Emphasis
    semibold: 600,          // Strong emphasis
    bold: 700,              // Heavy emphasis
  },
  lineHeights: {
    'display': 0.9,         // Ultra-tight for massive headlines
    'hero': 1.0,            // Tight for hero headlines
    'heading': 1.1,         // Section headlines
    'body': 1.7,            // Premium body text
    'relaxed': 1.8,         // Comfortable reading
    'loose': 2.0,           // Extra comfortable
  },

  // === PREMIUM SPACING SYSTEM - 8px Grid ===
  space: {
    // 8px Grid System - Pixel Perfect Alignment
    'px': '1px',
    '0.5': '2px',           // 0.5 * 4px
    '1': '4px',             // 1 * 4px
    '1.5': '6px',           // 1.5 * 4px
    '2': '8px',             // 2 * 4px - Base unit
    '2.5': '10px',          // 2.5 * 4px
    '3': '12px',            // 3 * 4px
    '3.5': '14px',          // 3.5 * 4px
    '4': '16px',            // 4 * 4px
    '5': '20px',            // 5 * 4px
    '6': '24px',            // 6 * 4px
    '7': '28px',            // 7 * 4px
    '8': '32px',            // 8 * 4px
    '9': '36px',            // 9 * 4px
    '10': '40px',           // 10 * 4px
    '11': '44px',           // 11 * 4px
    '12': '48px',           // 12 * 4px
    '14': '56px',           // 14 * 4px
    '16': '64px',           // 16 * 4px
    '20': '80px',           // 20 * 4px
    '24': '96px',           // 24 * 4px
    '28': '112px',          // 28 * 4px
    '32': '128px',          // 32 * 4px
    '36': '144px',          // 36 * 4px
    '40': '160px',          // 40 * 4px
    '44': '176px',          // 44 * 4px
    '48': '192px',          // 48 * 4px
    '52': '208px',          // 52 * 4px
    '56': '224px',          // 56 * 4px
    '60': '240px',          // 60 * 4px
    '64': '256px',          // 64 * 4px
    '72': '288px',          // 72 * 4px
    '80': '320px',          // 80 * 4px
    '96': '384px',          // 96 * 4px

    // Premium Named Spacing
    'section': '160px',     // 40 * 4px - Between sections
    'card': '48px',         // 12 * 4px - Card internal padding
    'element': '32px',      // 8 * 4px - Element spacing
    'tight': '24px',        // 6 * 4px - Tight spacing
    'base': '32px',         // 8 * 4px - Base spacing
    'generous': '64px',     // 16 * 4px - Generous spacing
  },

  // === PREMIUM CONTAINER SYSTEM ===
  breakpoints: {
    base: '0em',
    sm: '30em',
    md: '48em',
    lg: '62em',
    xl: '80em',
    '2xl': '100em',     // 1600px - Premium breathing room
  },

  // === LUXURIOUS COLOR SYSTEM ===
  colors: {
    // PRIMARY BRAND COLORS - Strategic use only
    brand: {
      50: '#EFF6FF',         // Blue light backgrounds
      100: '#DBEAFE',        // Subtle accents
      200: '#BFDBFE',        // Light borders
      300: '#93C5FD',        // Disabled states
      400: '#60A5FA',        // Secondary actions
      500: '#3B82F6',        // PRIMARY BLUE - Strategic accent
      600: '#2563EB',        // Hover states
      700: '#1D4ED8',        // Active states
      800: '#1E40AF',        // Dark mode
      900: '#1E3A8A',        // Darkest
    },

    // LUXURIOUS NEUTRALS - Sophisticated foundation
    neutral: {
      25: '#FDFDFD',         // Pure luxury white
      50: '#FAFBFC',         // Premium off-white
      100: '#F4F6F8',        // Subtle warm gray
      200: '#E8ECF0',        // Light borders with warmth
      300: '#D1D9E0',        // Refined borders
      400: '#9AA4B2',        // Sophisticated placeholder
      500: '#697586',        // Premium secondary text
      600: '#4B5768',        // Elegant tertiary
      700: '#364152',        // Rich secondary text
      800: '#1F2937',        // Deep charcoal
      900: '#0F172A',        // Luxury black
    },

    // WARM GRAYS - Premium foundation
    gray: {
      50: '#FAFBFC',         // Warm section backgrounds
      100: '#F4F6F8',        // Subtle borders
      200: '#E8ECF0',        // Light borders with warmth
      300: '#D1D9E0',        // Disabled text
      400: '#9AA4B2',        // Placeholder text
      500: '#697586',        // Secondary text
      600: '#4B5768',        // Tertiary elements
      700: '#364152',        // Secondary text
      800: '#1F2937',        // Primary text (lighter)
      900: '#0F172A',        // Primary text (darkest)
    },

    // RICH BLACK SYSTEM - Enhanced luxury
    black: {
      50: '#FAFBFC',         // Lightest warm
      100: '#F4F6F8',        // Very light warm
      200: '#E8ECF0',        // Light warm
      300: '#D1D9E0',        // Medium light
      400: '#9AA4B2',        // Medium
      500: '#697586',        // Medium dark
      600: '#4B5768',        // Dark
      700: '#364152',        // Darker
      800: '#1F2937',        // Very dark charcoal
      900: '#0A0A0A',        // PURE BLACK - Primary text
    },

    // PREMIUM ACCENT COLORS
    luxury: {
      50: '#F8FAFC',         // Platinum light
      100: '#F1F5F9',        // Silver light
      200: '#E2E8F0',        // Silver
      300: '#CBD5E1',        // Silver medium
      400: '#94A3B8',        // Silver dark
      500: '#64748B',        // Charcoal silver
      600: '#475569',        // Deep silver
      700: '#334155',        // Rich charcoal
      800: '#1E293B',        // Deep charcoal
      900: '#0F172A',        // Luxury black
    },

    // SOPHISTICATED DARK SYSTEM - Museum Quality
    dark: {
      50: '#F8F8F8',         // Warm white text
      100: '#F0F0F0',        // Light text
      200: '#E8E8E8',        // Muted text
      300: '#D0D0D0',        // Disabled text
      400: '#A0A0A0',        // Placeholder
      500: '#707070',        // Secondary text
      600: '#505050',        // Tertiary
      700: '#404040',        // Dark gray
      800: '#2A2A2A',        // Gradient end
      900: '#1A1A1A',        // Gradient start - Primary dark
    },

    // REFINED GOLD SYSTEM - Luxury Accents Only
    gold: {
      50: '#FEF9E7',         // Light gold background
      100: '#FDF4D1',        // Subtle gold
      200: '#FBEAA3',        // Light gold
      300: '#F8DF75',        // Medium gold
      400: '#F6D547',        // Bright gold
      500: '#D4AF37',        // REFINED GOLD - Primary accent
      600: '#B8941F',        // Deep gold
      700: '#9C7E1A',        // Darker gold
      800: '#806915',        // Very dark gold
      900: '#645310',        // Darkest gold
    },

    // PURE WHITE SYSTEM - Floating Cards
    white: {
      50: '#FFFFFF',         // Pure white
      100: '#FEFEFE',        // Near white
      200: '#FDFDFD',        // Subtle white
      300: '#FCFCFC',        // Light white
      400: '#FBFBFB',        // Medium white
      500: '#FAFAFA',        // Soft white
      600: '#F9F9F9',        // Warm white
      700: '#F8F8F8',        // Text white
      800: '#F7F7F7',        // Background white
      900: '#F6F6F6',        // Card white
    },

    // ULTRA-PREMIUM BLACK FOUNDATION
    ultraBlack: {
      50: '#F8F9FA',         // Gallery gray
      100: '#F1F3F4',        // Minimal contrast
      200: '#E8EAED',        // Light separator
      300: '#DADCE0',        // Medium separator
      400: '#BDC1C6',        // Subtle text
      500: '#9AA0A6',        // Secondary text
      600: '#5F6368',        // Primary text on light
      700: '#3C4043',        // Dark text
      800: '#1C1C1E',        // Apple charcoal
      900: '#0A0A0A',        // Rich black
      950: '#000000',        // Pure black - maximum sophistication
    },

    // MUSEUM WHITE SYSTEM
    museumWhite: {
      50: '#FFFFFF',         // Pure white - crisp gallery white
      100: '#FEFEFE',        // Warm white - subtle warmth for text
      200: '#FDFDFD',        // Card white
      300: '#FCFCFC',        // Background white
      400: '#FAFAFA',        // Soft white
      500: '#F8F9FA',        // Gallery gray
      600: '#F1F3F4',        // Minimal contrast backgrounds
      700: '#E8EAED',        // Light borders
      800: '#DADCE0',        // Medium borders
      900: '#BDC1C6',        // Strong borders
    },

    // SUPPORTING PLATINUM
    platinum: {
      50: '#FFFFFF',         // Pure platinum
      100: '#F8F9FA',        // Light platinum
      200: '#F1F3F4',        // Soft platinum
      300: '#E8EAED',        // Medium platinum
      400: '#DADCE0',        // Strong platinum
      500: '#E5E4E2',        // Ultra-subtle accents
      600: '#BDC1C6',        // Platinum text
      700: '#9AA0A6',        // Dark platinum
      800: '#5F6368',        // Deep platinum
      900: '#3C4043',        // Darkest platinum
    },

    // SEMANTIC COLORS - Minimal usage
    success: {
      50: '#ECFDF5',
      500: '#10B981',        // Success states only
      600: '#059669',
    },
    warning: {
      50: '#FFFBEB',
      500: '#F59E0B',        // Warning states only
      600: '#D97706',
    },
    error: {
      50: '#FEF2F2',
      500: '#EF4444',        // Error states only
      600: '#DC2626',
    },

    // LEGACY MAPPINGS (for compatibility)
    primary: {
      50: '#EFF6FF',
      500: '#3B82F6',        // Maps to brand.500
      600: '#2563EB',
    },
    secondary: {
      50: '#F8F9FA',
      500: '#64748B',        // Maps to gray.500
      600: '#475569',
    },
  },


  // === PREMIUM COMPONENT SYSTEM ===
  components: {
    // Typography Components
    Heading: {
      baseStyle: {
        fontFamily: 'heading',
        fontWeight: 'semibold',
        lineHeight: 'heading',
        letterSpacing: '-0.025em',
        color: 'black.900',
      },
      sizes: {
        xs: {
          fontSize: 'md',
          lineHeight: 'body',
        },
        sm: {
          fontSize: 'lg',
          lineHeight: 'body',
        },
        md: {
          fontSize: 'xl',
          lineHeight: 'body',
        },
        lg: {
          fontSize: '2xl',
          lineHeight: 'heading',
        },
        xl: {
          fontSize: '3xl',
          lineHeight: 'heading',
        },
        '2xl': {
          fontSize: '4xl',
          lineHeight: 'heading',
        },
        '3xl': {
          fontSize: 'display',
          lineHeight: 'display',
          fontWeight: 'light',
        },
      },
      variants: {
        display: {
          fontSize: 'display',
          lineHeight: 'display',
          fontWeight: 'light',
          letterSpacing: '-0.02em',
        },
        section: {
          fontSize: '3xl',
          fontWeight: 'light',
          color: 'black.900',
        },

        // DARK BACKGROUND VARIANTS - WCAG AA Compliant
        'dark-display': {
          fontSize: 'display',
          lineHeight: 'display',
          fontWeight: 'light',
          letterSpacing: '-0.02em',
          color: 'white.50',  // #F8F8F8 - 15.3:1 contrast ratio on #1A1A1A
        },

        'dark-hero': {
          fontSize: { base: '5xl', md: '6xl', lg: 'display' },
          lineHeight: { base: 'hero', lg: 'display' },
          fontWeight: '300',
          letterSpacing: '-0.02em',
          color: 'white.50',  // Ensures 7:1+ contrast ratio
        },

        'dark-section': {
          fontSize: { base: '4xl', lg: 'section' },
          lineHeight: 'heading',
          fontWeight: 'light',
          color: 'white.50',
          letterSpacing: '-0.02em',
        },
      },
    },
    Text: {
      baseStyle: {
        fontFamily: 'body',
        lineHeight: 'body',
        color: 'gray.700',
      },
      variants: {
        body: {
          fontSize: 'md',
          lineHeight: 'body',
          color: 'gray.700',
        },
        large: {
          fontSize: 'lg',
          lineHeight: 'relaxed',
          color: 'gray.600',
        },
        caption: {
          fontSize: 'sm',
          color: 'gray.500',
        },

        // DARK BACKGROUND TEXT VARIANTS - WCAG AA Compliant
        'dark-body': {
          fontSize: 'md',
          lineHeight: 'body',
          color: 'white.700',  // #F8F8F8 - 15.3:1 contrast ratio
          fontWeight: '400',
        },

        'dark-large': {
          fontSize: { base: 'lg', lg: 'xl' },
          lineHeight: 'relaxed',
          color: 'white.700',  // Warm white for readability
          fontWeight: '400',
        },

        'dark-caption': {
          fontSize: 'sm',
          color: 'white.200',  // #E8E8E8 - 9.7:1 contrast ratio
          fontWeight: '400',
        },

        'dark-muted': {
          fontSize: 'sm',
          color: 'white.300',  // #D0D0D0 - 7.4:1 contrast ratio
          fontWeight: '400',
        },
      },
    },
    Button: {
      baseStyle: {
        fontFamily: 'body',
        fontWeight: 'medium',
        borderRadius: '12px',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        overflow: 'hidden',
        _focus: {
          boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.3)',
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
        // Primary Button: Champagne Gold Luxury System
        primary: {
          bg: 'gold.500',
          color: 'ultraBlack.950',
          border: '1px solid',
          borderColor: 'gold.600',
          boxShadow: '0 8px 24px rgba(212, 175, 55, 0.25)',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          _hover: {
            transform: 'scale(1.05) translateY(-4px)',
            boxShadow: '0 16px 48px rgba(212, 175, 55, 0.4), 0 4px 12px rgba(212, 175, 55, 0.2), 0 0 32px rgba(212, 175, 55, 0.3)',
            bg: 'gold.400',
          },
          _active: {
            transform: 'scale(1.02) translateY(-2px)',
          },
          _focus: {
            outline: '3px solid',
            outlineColor: 'gold.400',
            outlineOffset: '2px',
          },
        },
        // Secondary Button: Transparent with champagne gold border
        secondary: {
          bg: 'transparent',
          color: 'gold.500',
          border: '2px solid',
          borderColor: 'gold.500',
          transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          _hover: {
            bg: 'gold.500',
            color: 'ultraBlack.950',
            borderColor: 'gold.400',
            transform: 'scale(1.05) translateY(-4px)',
            boxShadow: '0 12px 40px rgba(212, 175, 55, 0.4), 0 0 24px rgba(212, 175, 55, 0.3)',
          },
          _active: {
            transform: 'scale(1.02) translateY(-2px)',
          },
        },
        // Ghost Button: Transparent with subtle hover
        ghost: {
          bg: 'transparent',
          color: 'white.50',
          _hover: {
            bg: 'rgba(255, 255, 255, 0.1)',
            transform: 'translateY(-1px)',
          },
          _active: {
            bg: 'rgba(255, 255, 255, 0.05)',
          },
        },
        // Solid variant (maps to primary for compatibility)
        solid: {
          bg: 'white.50',
          color: 'black.900',
          border: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
          _hover: {
            transform: 'scale(1.05) translateY(-2px)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15), 0 0 20px rgba(255, 255, 255, 0.1)',
            bg: 'white.100',
          },
        },
        // Outline variant (maps to secondary for compatibility)
        outline: {
          bg: 'transparent',
          color: 'white.50',
          border: '2px solid',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          _hover: {
            bg: 'white.50',
            color: 'black.900',
            borderColor: 'white.50',
            transform: 'translateY(-2px)',
          },
        },

        // DARK BACKGROUND OPTIMIZED VARIANTS
        'dark-primary': {
          bg: 'white.50',
          color: 'black.900',
          border: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1)',
          fontWeight: '600',
          _hover: {
            transform: 'scale(1.05) translateY(-2px)',
            boxShadow: '0 12px 40px rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.15)',
            bg: 'white.100',
          },
          _active: {
            transform: 'scale(1.02) translateY(-1px)',
          },
          _focus: {
            outline: '3px solid',
            outlineColor: 'rgba(255, 255, 255, 0.5)',
            outlineOffset: '2px',
          },
        },

        'dark-secondary': {
          bg: 'transparent',
          color: 'white.50',
          border: '2px solid',
          borderColor: 'rgba(255, 255, 255, 0.3)',
          fontWeight: '600',
          _hover: {
            bg: 'white.50',
            color: 'black.900',
            borderColor: 'white.50',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)',
          },
          _active: {
            transform: 'translateY(0px)',
          },
          _focus: {
            outline: '3px solid',
            outlineColor: 'rgba(255, 255, 255, 0.5)',
            outlineOffset: '2px',
          },
        },

        'dark-accent': {
          bg: 'linear-gradient(135deg, rgba(212, 175, 55, 0.2) 0%, rgba(212, 175, 55, 0.1) 100%)',
          color: 'gold.500',
          border: '1px solid',
          borderColor: 'rgba(212, 175, 55, 0.3)',
          fontWeight: '600',
          _hover: {
            bg: 'linear-gradient(135deg, rgba(212, 175, 55, 0.3) 0%, rgba(212, 175, 55, 0.2) 100%)',
            color: 'gold.400',
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 32px rgba(212, 175, 55, 0.2)',
            filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.3))',
          },
          _active: {
            transform: 'translateY(0px)',
          },
          _focus: {
            outline: '3px solid',
            outlineColor: 'rgba(212, 175, 55, 0.5)',
            outlineOffset: '2px',
          },
        },
      },
      sizes: {
        sm: {
          fontSize: 'sm',
          px: 4,
          py: 2,
          h: 9,
        },
        md: {
          fontSize: 'md',
          px: 6,
          py: 3,
          h: 11,
        },
        lg: {
          fontSize: 'lg',
          px: 8,
          py: 4,
          h: 12,
          minH: '44px', // Touch target
        },
        xl: {
          fontSize: 'xl',
          px: 12,
          py: 6,
          h: 16,
          minH: '44px', // Touch target
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
          bg: 'white',
          borderRadius: '16px',
          border: '1px solid',
          borderColor: 'gray.100',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)',
          overflow: 'hidden',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          _hover: {
            transform: 'translateY(-4px)',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
          },
        },
      },
    },
    Input: {
      baseStyle: {
        field: {
          fontFamily: 'body',
          transition: 'all 0.3s ease',
          borderRadius: '8px',
        },
      },
      variants: {
        filled: {
          field: {
            bg: 'gray.50',
            border: '1px solid',
            borderColor: 'gray.200',
            _hover: {
              bg: 'white',
              borderColor: 'gray.300',
            },
            _focus: {
              bg: 'white',
              borderColor: 'brand.500',
              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
            },
          },
        },
        outline: {
          field: {
            border: '1px solid',
            borderColor: 'gray.200',
            _hover: {
              borderColor: 'gray.300',
            },
            _focus: {
              borderColor: 'brand.500',
              boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)',
            },
          },
        },
      },
      defaultProps: {
        variant: 'outline',
      },
    },
  },

  // === GLOBAL STYLES ===
  styles: {
    global: {
      html: {
        scrollBehavior: 'smooth',
      },
      body: {
        bg: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
        color: 'white',
        fontFamily: 'body',
        lineHeight: 'body',
        fontFeatureSettings: '"kern" 1, "liga" 1, "calt" 1',
        textRendering: 'optimizeLegibility',
        WebkitFontSmoothing: 'antialiased',
        MozOsxFontSmoothing: 'grayscale',
        minH: '100vh',
        position: 'relative',
        _before: {
          content: '""',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: 'radial-gradient(circle at 20% 80%, rgba(212, 175, 55, 0.02) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(212, 175, 55, 0.01) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: -1,
        },
      },
      '*': {
        borderColor: 'neutral.200',
        boxSizing: 'border-box',
      },
      '*:focus': {
        outline: '3px solid',
        outlineColor: 'brand.500',
        outlineOffset: '2px',
      },
      '*:focus:not(:focus-visible)': {
        outline: 'none',
      },
      '::selection': {
        bg: 'brand.100',
        color: 'brand.900',
      },
      // Premium section backgrounds
      '.luxury-section': {
        bg: 'linear-gradient(135deg, #FAFBFC 0%, #F4F6F8 100%)',
        position: 'relative',
        _before: {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.02) 0%, transparent 70%)',
          pointerEvents: 'none',
        },
      },
      '.premium-card': {
        bg: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(20px)',
        border: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.02)',
      },
      '.glass-effect': {
        bg: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.3)',
      },

      // SOPHISTICATED DARK SECTIONS - Museum Quality
      '.dark-section': {
        bg: 'linear-gradient(135deg, #1A1A1A 0%, #2A2A2A 100%)',
        color: 'white.50',
        position: 'relative',
        _before: {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bg: 'radial-gradient(circle at 30% 70%, rgba(212, 175, 55, 0.03) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(212, 175, 55, 0.02) 0%, transparent 50%)',
          pointerEvents: 'none',
        },
      },

      // FLOATING WHITE CARDS - Premium Elevation with Gold Glow
      '.floating-card': {
        bg: 'museumWhite.50',
        color: 'ultraBlack.900',
        borderRadius: '24px',
        p: 'card',  // 48px premium internal padding
        boxShadow: '0 32px 64px rgba(0, 0, 0, 0.25), 0 8px 16px rgba(0, 0, 0, 0.1), 0 0 40px rgba(255, 255, 255, 0.08)',
        border: '1px solid',
        borderColor: 'rgba(212, 175, 55, 0.1)',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        _hover: {
          transform: 'translateY(-12px)',
          boxShadow: '0 40px 80px rgba(0, 0, 0, 0.3), 0 12px 24px rgba(0, 0, 0, 0.15), 0 0 60px rgba(212, 175, 55, 0.3)',
          borderColor: 'rgba(212, 175, 55, 0.2)',
        },
      },

      // DARK OPTIMIZED BUTTONS
      '.btn-dark-primary': {
        bg: 'white.50',
        color: 'black.900',
        border: '1px solid',
        borderColor: 'rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1), 0 2px 8px rgba(0, 0, 0, 0.1)',
        _hover: {
          transform: 'scale(1.05) translateY(-2px)',
          boxShadow: '0 12px 40px rgba(255, 255, 255, 0.15), 0 4px 12px rgba(0, 0, 0, 0.15)',
          bg: 'white.100',
        },
        _active: {
          transform: 'scale(1.02) translateY(-1px)',
        },
      },

      '.btn-dark-secondary': {
        bg: 'transparent',
        color: 'white.50',
        border: '2px solid',
        borderColor: 'rgba(255, 255, 255, 0.3)',
        _hover: {
          bg: 'white.50',
          color: 'black.900',
          borderColor: 'white.50',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 32px rgba(255, 255, 255, 0.2)',
        },
        _active: {
          transform: 'translateY(0px)',
        },
      },

      // GOLD ACCENT ELEMENTS
      '.gold-accent': {
        color: 'gold.500',
        _hover: {
          color: 'gold.400',
          filter: 'drop-shadow(0 0 8px rgba(212, 175, 55, 0.3))',
        },
      },
    },
  },
})

export { theme }
