import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { AuthLoadingScreen } from '@/components/AuthLoadingScreen'

interface ProtectedAdminRouteProps {
  children: ReactNode
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth()
  const location = useLocation()

  // Show loading state
  if (isLoading) {
    return <AuthLoadingScreen variant="admin" />
  }

  // Not authenticated - redirect to admin login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: `${location.pathname}${location.search}` }}
        replace
      />
    )
  }

  // Check if user is admin using the role from profile
  const isAdmin = role === 'ADMIN'

  // Not an admin - redirect to dashboard with error
  if (!isAdmin) {
    return (
      <Navigate
        to="/dashboard"
        state={{ error: 'You do not have permission to access the admin panel' }}
        replace
      />
    )
  }

  // User is authenticated and is an admin
  return <>{children}</>
}

export default ProtectedAdminRoute
