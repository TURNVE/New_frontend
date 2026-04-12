import { Navigate } from 'react-router-dom'
import { useAuth, AUTH_ROUTES } from '../contexts/AuthContext'

interface ProtectedRouteProps {
    children: React.ReactNode
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
        return <Navigate to={fallbackPath} replace />
    }

    return <>{children}</>
}
