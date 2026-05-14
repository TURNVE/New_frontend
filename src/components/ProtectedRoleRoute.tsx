import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth, AUTH_ROUTES, type UserRole } from '../contexts/AuthContext'
import { AuthLoadingScreen } from './AuthLoadingScreen'

interface ProtectedRoleRouteProps {
    children: ReactNode
    allowedRoles: UserRole[]
    loginPath?: string
    unauthorizedPath?: string
}

export function ProtectedRoleRoute({
    children,
    allowedRoles,
    loginPath = AUTH_ROUTES.SIGN_IN,
    unauthorizedPath = AUTH_ROUTES.DASHBOARD,
}: ProtectedRoleRouteProps) {
    const { isAuthenticated, isLoading, role } = useAuth()
    const location = useLocation()

    if (isLoading) {
        return <AuthLoadingScreen />
    }

    if (!isAuthenticated) {
        return <Navigate to={loginPath} state={{ from: location.pathname }} replace />
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to={unauthorizedPath} state={{ error: 'You do not have permission to access this page' }} replace />
    }

    return <>{children}</>
}
