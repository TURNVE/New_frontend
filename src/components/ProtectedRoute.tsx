import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, AUTH_ROUTES } from '../contexts/AuthContext'
import { AuthLoadingScreen } from './AuthLoadingScreen'

interface ProtectedRouteProps {
    children: ReactNode
    fallbackPath?: string
}

/**
 * Wraps authenticated routes — redirects to sign-in if no active session.
 * Shows a loading spinner while auth state initializes.
 */
export function ProtectedRoute({
    children,
    fallbackPath = AUTH_ROUTES.SIGN_IN,
}: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return <AuthLoadingScreen />
    }

    if (!isAuthenticated) {
        return <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />
    }

    return <>{children}</>
}
