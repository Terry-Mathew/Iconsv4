'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

interface LenisProviderProps {
  children: React.ReactNode
}

export function LenisProvider({ children }: LenisProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    // Initialize Lenis
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })

    // Set global reference
    globalLenisRef = lenisRef.current

    // Animation frame loop
    function raf(time: number) {
      lenisRef.current?.raf(time)
      requestAnimationFrame(raf)
    }
    requestAnimationFrame(raf)

    // Expose Lenis instance globally for smooth scrolling
    if (lenisRef.current) {
      // @ts-ignore
      window.lenis = lenisRef.current
    }

    // Cleanup
    return () => {
      lenisRef.current?.destroy()
      globalLenisRef = null
    }
  }, [])

  return <>{children}</>
}

// Global ref for Lenis instance
let globalLenisRef: Lenis | null = null

// Hook to access Lenis instance
export function useLenis() {
  return globalLenisRef
}

// Utility function for smooth scrolling to elements
export function scrollToElement(selector: string, offset: number = 0) {
  const element = document.querySelector(selector)
  if (element && window.lenis) {
    // @ts-ignore
    window.lenis.scrollTo(element, { offset })
  } else if (element) {
    // Fallback to native smooth scrolling
    element.scrollIntoView({ behavior: 'smooth' })
  }
}
