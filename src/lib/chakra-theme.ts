import { extendTheme, type ThemeConfig } from '@chakra-ui/react'

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
}

const theme = extendTheme({
  config,
  colors: {
    primary: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    secondary: {
      50: '#fafafa',
      100: '#f4f4f5',
      200: '#e4e4e7',
      300: '#d4d4d8',
      400: '#a1a1aa',
      500: '#71717a',
      600: '#52525b',
      700: '#3f3f46',
      800: '#27272a',
      900: '#18181b',
    },
    accent: {
      50: '#fef7ff',
      100: '#fdeeff',
      200: '#fad5ff',
      300: '#f7b3ff',
      400: '#f280ff',
      500: '#e94dff',
      600: '#d025e8',
      700: '#b018c4',
      800: '#9016a0',
      900: '#771682',
    }
  },
  fonts: {
    heading: 'Playfair Display, serif',
    body: 'Inter, system-ui, sans-serif',
    mono: 'JetBrains Mono, monospace',
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'lg',
      },
      variants: {
        solid: {
          bg: 'primary.500',
          color: 'white',
          _hover: {
            bg: 'primary.600',
            transform: 'translateY(-1px)',
            boxShadow: 'lg',
          },
          _active: {
            bg: 'primary.700',
            transform: 'translateY(0)',
          },
        },
        outline: {
          borderColor: 'primary.500',
          color: 'primary.500',
          _hover: {
            bg: 'primary.50',
            transform: 'translateY(-1px)',
            boxShadow: 'md',
          },
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'xl',
          boxShadow: 'lg',
          overflow: 'hidden',
        },
      },
    },
    Input: {
      variants: {
        filled: {
          field: {
            bg: 'gray.50',
            borderRadius: 'lg',
            _hover: {
              bg: 'gray.100',
            },
            _focus: {
              bg: 'white',
              borderColor: 'primary.500',
              boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
            },
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
    Textarea: {
      variants: {
        filled: {
          bg: 'gray.50',
          borderRadius: 'lg',
          _hover: {
            bg: 'gray.100',
          },
          _focus: {
            bg: 'white',
            borderColor: 'primary.500',
            boxShadow: '0 0 0 1px var(--chakra-colors-primary-500)',
          },
        },
      },
      defaultProps: {
        variant: 'filled',
      },
    },
  },
  styles: {
    global: {
      body: {
        bg: 'gray.50',
        color: 'gray.800',
      },
    },
  },
})

export { theme }
