import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Gamepad2,
  Users,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  ChevronRight,
  Plus,
  List,
  BookOpen,
  PenLine,
  CreditCard,
  SlidersHorizontal,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  children?: { label: string; href: string; icon?: React.ElementType }[]
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    label: 'Simulations',
    href: '/admin/simulations',
    icon: Gamepad2,
    children: [
      { label: 'All Simulations', href: '/admin/simulations', icon: List },
      { label: 'Create New', href: '/admin/simulations/new', icon: Plus },
    ],
  },
  {
    label: 'Blog',
    href: '/admin/blogs',
    icon: BookOpen,
    children: [
      { label: 'All Posts', href: '/admin/blogs', icon: List },
      { label: 'Create New', href: '/admin/blogs/new', icon: PenLine },
    ],
  },
  {
    label: 'Users',
    href: '/admin/users',
    icon: Users,
  },
  {
    label: 'Analytics',
    href: '/admin/analytics',
    icon: BarChart3,
  },
  {
    label: 'Settings',
    href: '/admin/settings',
    icon: Settings,
    children: [
      { label: 'Security & Access', href: '/admin/settings', icon: Shield },
      { label: 'Payments', href: '/admin/settings?tab=payments', icon: CreditCard },
      { label: 'Operations', href: '/admin/settings?tab=operations', icon: SlidersHorizontal },
    ],
  },
]

export function AdminLayout() {
  const { user, signOut } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/admin/login', { replace: true })
  }

  const getRoutePath = (href: string) => href.split('?')[0]

  return (
    <div className="min-h-screen bg-[#0d0f11] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111418] border-r border-[#23252a] flex flex-col fixed h-full">
        {/* Logo */}
        <div className="p-6 border-b border-[#23252a]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[#5e6ad2] to-[#7170ff] flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-[#f7f8f8]">TURNVE</h1>
              <p className="text-xs text-[#8a8f98]">Admin Panel</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const itemPath = getRoutePath(item.href)
              const isActive = location.pathname === itemPath ||
                (item.children?.some(child => location.pathname === getRoutePath(child.href)) ?? false)

              return (
                <li key={item.href}>
                  <NavLink
                    to={item.href}
                    className={cn(
                      'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-[#5e6ad2]/10 text-[#7170ff] border border-[#5e6ad2]/20'
                        : 'text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#f7f8f8]'
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1">{item.label}</span>
                    {item.children && (
                      <ChevronRight className={cn(
                        'w-4 h-4 transition-transform',
                        isActive && 'rotate-90'
                      )} />
                    )}
                  </NavLink>

                  {/* Child items */}
                  {item.children && isActive && (
                    <ul className="mt-1 ml-6 space-y-1">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <NavLink
                            to={child.href}
                            className={cn(
                              'flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200',
                              location.pathname === getRoutePath(child.href) && location.search === (child.href.includes('?') ? `?${child.href.split('?')[1]}` : '')
                                ? 'text-[#7170ff] bg-[#5e6ad2]/5'
                                : 'text-[#8a8f98] hover:text-[#d0d6e0]'
                            )}
                          >
                            {child.icon && <child.icon className="w-4 h-4" />}
                            <span>{child.label}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              )
            })}
          </ul>
        </nav>

        {/* User section */}
        <div className="p-4 border-t border-[#23252a]">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-[#23252a] flex items-center justify-center">
              <span className="text-sm font-medium text-[#d0d6e0]">
                {user?.email?.charAt(0).toUpperCase() || 'A'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#f7f8f8] truncate">
                {user?.email || 'Admin User'}
              </p>
              <p className="text-xs text-[#8a8f98]">Administrator</p>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full justify-center gap-2 border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)]"
            onClick={handleSignOut}
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64">
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
