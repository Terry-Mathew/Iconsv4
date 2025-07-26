'use client'

import { ReactNode, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'

interface SmoothScrollProviderProps {
  children: ReactNode
  parallax?: boolean
  luxury?: boolean
}

export function SmoothScrollProvider({
  children,
  parallax = true,
  luxury = true
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<any>(null)
  const pathname = usePathname()

  useEffect(() => {
    // Dynamic import to avoid SSR issues
    const initLenis = async () => {
      const Lenis = (await import('@studio-freight/lenis')).default
      
      // Initialize Lenis with luxury settings and performance optimizations
      const lenis = new Lenis({
        duration: luxury ? 1.6 : 1.2,
        easing: luxury
          ? (t: number) => 1 - Math.pow(1 - t, 4) // Luxury quartic easing
          : (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        direction: 'vertical',
        gestureDirection: 'vertical',
        smooth: true,
        mouseMultiplier: luxury ? 0.7 : 1,
        smoothTouch: false, // Disabled for better mobile performance
        touchMultiplier: 1.5,
        infinite: false,
        syncTouch: true,
        syncTouchLerp: 0.075,
        normalizeWheel: true, // Better cross-browser wheel handling
        wheelMultiplier: 1,
        touchInertiaMultiplier: 35,
      })

      lenisRef.current = lenis

      // Animation frame loop
      function raf(time: number) {
        lenis.raf(time)
        requestAnimationFrame(raf)
      }
      requestAnimationFrame(raf)

      // Handle anchor links for smooth scrolling
      const handleAnchorClick = (e: Event) => {
        const target = e.target as HTMLAnchorElement
        if (target.tagName === 'A' && target.href.includes('#')) {
          const url = new URL(target.href)
          const hash = url.hash

          if (hash && url.pathname === window.location.pathname) {
            e.preventDefault()
            const element = document.querySelector(hash)
            if (element) {
              lenis.scrollTo(element, {
                offset: -80, // Account for fixed navbar
                duration: luxury ? 1.6 : 1.2,
                easing: luxury
                  ? (t: number) => 1 - Math.pow(1 - t, 4)
                  : (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
              })
            }
          }
        }
      }

      // Add parallax effects if enabled
      if (parallax) {
        const parallaxElements = document.querySelectorAll('[data-parallax]')

        lenis.on('scroll', ({ scroll }: { scroll: number }) => {
          parallaxElements.forEach((element) => {
            const speed = parseFloat(element.getAttribute('data-parallax') || '0.5')
            const yPos = -(scroll * speed)
            ;(element as HTMLElement).style.transform = `translateY(${yPos}px)`
          })
        })
      }

      // Add event listeners
      document.addEventListener('click', handleAnchorClick)

      // Cleanup function
      return () => {
        document.removeEventListener('click', handleAnchorClick)
        lenis.destroy()
      }
    }

    // Only initialize on client side
    if (typeof window !== 'undefined') {
      const cleanup = initLenis()
      return () => {
        cleanup.then(cleanupFn => cleanupFn?.())
      }
    }
  }, [])

  // Reset scroll position on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    }
  }, [pathname])

  // Expose lenis instance globally for programmatic scrolling
  useEffect(() => {
    if (lenisRef.current && typeof window !== 'undefined') {
      ;(window as any).lenis = lenisRef.current
    }
  }, [])

  return <>{children}</>
}

// Utility hook for programmatic scrolling
export function useSmoothScroll() {
  const scrollTo = (target: string | number, options?: any) => {
    if (typeof window !== 'undefined' && (window as any).lenis) {
      ;(window as any).lenis.scrollTo(target, options)
    }
  }

  const scrollToTop = (options?: any) => {
    scrollTo(0, { duration: 1.5, ...options })
  }

  const scrollToElement = (selector: string, options?: any) => {
    scrollTo(selector, { offset: -100, duration: 1.2, ...options })
  }

  return {
    scrollTo,
    scrollToTop,
    scrollToElement,
  }
}
