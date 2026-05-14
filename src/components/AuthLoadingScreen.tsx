import { Loader2 } from 'lucide-react'

interface AuthLoadingScreenProps {
  message?: string
  variant?: 'default' | 'admin'
}

export function AuthLoadingScreen({ message = 'Loading...', variant = 'default' }: AuthLoadingScreenProps) {
  if (variant === 'admin') {
    return (
      <div className="min-h-screen bg-[#0d0f11] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 text-[#7170ff] animate-spin" />
          <p className="text-[#8a8f98]">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-gray-500 dark:text-gray-400 text-sm">{message}</p>
      </div>
    </div>
  )
}
