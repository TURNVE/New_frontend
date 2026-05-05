import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/contexts/AuthContext'
import { Loader2 } from 'lucide-react'

interface ProtectedAdminRouteProps {
  children: React.ReactNode
}

export function ProtectedAdminRoute({ children }: ProtectedAdminRouteProps) {
  const { isAuthenticated, isLoading, role } = useAuth()
  const location = useLocation()

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0d0f11] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#7170ff] animate-spin" />
          <p className="text-[#8a8f98]">Loading...</p>
        </div>
      </div>
    )
  }

  // Not authenticated - redirect to admin login
  if (!isAuthenticated) {
    return (
      <Navigate
        to="/admin/login"
        state={{ from: location.pathname }}
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
