'use client'

import { useState, useEffect } from 'react'

interface UseScrollSpyOptions {
  sectionIds: string[]
  offset?: number
  rootMargin?: string
}

export function useScrollSpy({ 
  sectionIds, 
  offset = 80, 
  rootMargin = '-80px 0px -80% 0px' 
}: UseScrollSpyOptions) {
  const [activeSection, setActiveSection] = useState<string>('')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // Find the section that's most visible
        let maxRatio = 0
        let mostVisibleSection = ''

        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio > maxRatio) {
            maxRatio = entry.intersectionRatio
            mostVisibleSection = entry.target.id
          }
        })

        if (mostVisibleSection) {
          setActiveSection(mostVisibleSection)
        }
      },
      {
        rootMargin,
        threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
      }
    )

    // Observe all sections
    sectionIds.forEach((id) => {
      const element = document.getElementById(id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [sectionIds, rootMargin])

  return activeSection
}
