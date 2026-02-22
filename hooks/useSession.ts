'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'

interface SessionData {
  authenticated: boolean
  user?: {
    email: string
    productName: string
    lastAccess: string
  }
  session?: {
    expiresAt: string
    timeUntilExpiration?: number
    shouldWarn?: boolean
  }
}

interface UseSessionOptions {
  checkInterval?: number // milliseconds, default 5 minutes
  enableBackgroundDetection?: boolean // default true
  onSessionWarning?: () => void
  onSessionExpired?: () => void
}

export function useSession(options: UseSessionOptions = {}) {
  const {
    checkInterval = 5 * 60 * 1000, // 5 minutes
    enableBackgroundDetection = true,
    onSessionWarning,
    onSessionExpired
  } = options

  const router = useRouter()
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [showWarning, setShowWarning] = useState(false)

  const checkIntervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastCheckRef = useRef<number>(Date.now())

  const checkSession = useCallback(async (force = false) => {
    try {
      const response = await fetch('/api/auth/session', {
        cache: 'no-store'
      })

      if (!response.ok) {
        setSessionData({ authenticated: false })
        setIsLoading(false)
        onSessionExpired?.()
        router.push('/')
        return
      }

      const data: SessionData = await response.json()
      setSessionData(data)
      setIsLoading(false)

      // Check if should warn
      if (data.session?.shouldWarn && !showWarning) {
        setShowWarning(true)
        onSessionWarning?.()
      } else if (!data.session?.shouldWarn && showWarning) {
        setShowWarning(false)
      }

      lastCheckRef.current = Date.now()
    } catch (error) {
      console.error('Session check error:', error)
      setSessionData({ authenticated: false })
      setIsLoading(false)
    }
  }, [router, onSessionExpired, onSessionWarning, showWarning])

  // Initial session check
  useEffect(() => {
    checkSession()
  }, [])

  // Periodic session validation
  useEffect(() => {
    if (checkInterval > 0) {
      checkIntervalRef.current = setInterval(() => {
        checkSession()
      }, checkInterval)

      return () => {
        if (checkIntervalRef.current) {
          clearInterval(checkIntervalRef.current)
        }
      }
    }
  }, [checkInterval, checkSession])

  // Background/Foreground detection for mobile
  useEffect(() => {
    if (!enableBackgroundDetection || typeof document === 'undefined') {
      return
    }

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        // App returned to foreground
        const timeSinceLastCheck = Date.now() - lastCheckRef.current
        const oneMinute = 60 * 1000

        // If more than 1 minute has passed since last check, revalidate immediately
        if (timeSinceLastCheck > oneMinute) {
          console.log('App returned from background, revalidating session...')
          checkSession(true)
        }
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [enableBackgroundDetection, checkSession])

  // Page focus detection (fallback for older browsers)
  useEffect(() => {
    if (!enableBackgroundDetection || typeof window === 'undefined') {
      return
    }

    const handleFocus = () => {
      const timeSinceLastCheck = Date.now() - lastCheckRef.current
      const oneMinute = 60 * 1000

      if (timeSinceLastCheck > oneMinute) {
        console.log('Window focused, revalidating session...')
        checkSession(true)
      }
    }

    window.addEventListener('focus', handleFocus)

    return () => {
      window.removeEventListener('focus', handleFocus)
    }
  }, [enableBackgroundDetection, checkSession])

  const extendSession = useCallback(async () => {
    // Force a session check which will trigger the sliding window extension
    await checkSession(true)
    setShowWarning(false)
  }, [checkSession])

  return {
    sessionData,
    isLoading,
    showWarning,
    checkSession: () => checkSession(true),
    extendSession
  }
}
