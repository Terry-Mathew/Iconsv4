'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface ImpersonationData {
  originalUserId: string
  originalUserEmail: string
  impersonatedTier: 'rising' | 'elite' | 'legacy'
  startedAt: string
}

interface ImpersonationContextType {
  isImpersonating: boolean
  impersonationData: ImpersonationData | null
  startImpersonation: (tier: 'rising' | 'elite' | 'legacy', originalUser: any) => void
  stopImpersonation: () => void
  getEffectiveTier: () => string | null
}

const ImpersonationContext = createContext<ImpersonationContextType | undefined>(undefined)

export function ImpersonationProvider({ children }: { children: ReactNode }) {
  const [isImpersonating, setIsImpersonating] = useState(false)
  const [impersonationData, setImpersonationData] = useState<ImpersonationData | null>(null)

  useEffect(() => {
    // Check for existing impersonation session on mount
    const savedSession = localStorage.getItem('impersonation_session')
    if (savedSession) {
      try {
        const data = JSON.parse(savedSession)
        setImpersonationData(data)
        setIsImpersonating(true)
      } catch (error) {
        // Clear invalid session data
        localStorage.removeItem('impersonation_session')
      }
    }
  }, [])

  const startImpersonation = (tier: 'rising' | 'elite' | 'legacy', originalUser: any) => {
    const data: ImpersonationData = {
      originalUserId: originalUser.id,
      originalUserEmail: originalUser.email,
      impersonatedTier: tier,
      startedAt: new Date().toISOString()
    }

    localStorage.setItem('impersonation_session', JSON.stringify(data))
    setImpersonationData(data)
    setIsImpersonating(true)
  }

  const stopImpersonation = () => {
    localStorage.removeItem('impersonation_session')
    setImpersonationData(null)
    setIsImpersonating(false)
  }

  const getEffectiveTier = () => {
    if (isImpersonating && impersonationData) {
      return impersonationData.impersonatedTier
    }
    return null
  }

  return (
    <ImpersonationContext.Provider
      value={{
        isImpersonating,
        impersonationData,
        startImpersonation,
        stopImpersonation,
        getEffectiveTier
      }}
    >
      {children}
    </ImpersonationContext.Provider>
  )
}

export function useImpersonation() {
  const context = useContext(ImpersonationContext)
  if (context === undefined) {
    throw new Error('useImpersonation must be used within an ImpersonationProvider')
  }
  return context
}
