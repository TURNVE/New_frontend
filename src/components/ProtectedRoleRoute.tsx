import { Navigate } from 'react-router-dom'
import { useAuth, AUTH_ROUTES, type UserRole } from '../contexts/AuthContext'

interface ProtectedRoleRouteProps {
    children: React.ReactNode
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

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
                <div className="text-center">
                    <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Loading...</p>
                </div>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to={loginPath} replace />
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to={unauthorizedPath} replace />
    }

    return <>{children}</>
}