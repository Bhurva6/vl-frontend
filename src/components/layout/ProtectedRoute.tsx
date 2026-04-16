import { useEffect, useRef } from 'react'
import { Navigate } from 'react-router-dom'
import type { UserRole } from '@/types'
import PageLoader from '@/components/ui/PageLoader'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
  allow: UserRole[]
  children: React.ReactNode
}

const ProtectedRoute = ({ allow, children }: ProtectedRouteProps) => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const role = useAuthStore((state) => state.role)
  const justLoggedIn = useAuthStore((state) => state.justLoggedIn)
  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (justLoggedIn && !timeoutRef.current) {
      timeoutRef.current = window.setTimeout(() => {
        useAuthStore.getState().clearJustLoggedIn()
        timeoutRef.current = null
      }, 1000)
    }

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [justLoggedIn])

  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!role || !allow.includes(role)) return <Navigate to="/unauthorized" replace />

  if (justLoggedIn) {
    return <PageLoader />
  }

  return <>{children}</>
}

export default ProtectedRoute
