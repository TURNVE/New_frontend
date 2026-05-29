import { useEffect, useState } from 'react'
import {
  Gamepad2,
  Users,
  TrendingUp,
  Activity,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Link } from 'react-router-dom'
import {
  getAdminDashboardStats,
  getEmptyAdminDashboardStats,
  type AdminDashboardStats,
  type AdminRecentActivity,
  type AdminRecentSimulation,
} from '@/lib/adminStats'

export function AdminDashboardPage() {
  const [stats, setStats] = useState<AdminDashboardStats>(
    () => getEmptyAdminDashboardStats().stats
  )
  const [recentSimulations, setRecentSimulations] = useState<AdminRecentSimulation[]>([])
  const [recentActivity, setRecentActivity] = useState<AdminRecentActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        const { data, error } = await getAdminDashboardStats()
        if (error) console.error('Failed to load dashboard data:', error)
        if (!isMounted) return

        setStats(data.stats)
        setRecentSimulations(data.recentSimulations)
        setRecentActivity(data.recentActivity)
      } catch (error) {
        console.error('Failed to load dashboard data:', error)
        if (!isMounted) return
        const fallback = getEmptyAdminDashboardStats()
        setStats(fallback.stats)
        setRecentSimulations(fallback.recentSimulations)
        setRecentActivity(fallback.recentActivity)
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchDashboardData()

    return () => {
      isMounted = false
    }
  }, [])

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'intro':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'intermediate':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
      case 'advanced':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    if (diffInHours < 48) return 'Yesterday'
    return formatDate(dateString)
  }

  const getActivityIcon = (type: AdminRecentActivity['type']) => {
    switch (type) {
      case 'simulation_created':
        return <Plus className="w-4 h-4 text-green-500" />
      case 'simulation_updated':
        return <Activity className="w-4 h-4 text-blue-500" />
      case 'user_registered':
        return <Users className="w-4 h-4 text-purple-500" />
      case 'session_completed':
        return <CheckCircle2 className="w-4 h-4 text-teal-500" />
      default:
        return <Activity className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#f7f8f8]">Dashboard</h1>
          <p className="text-[#8a8f98] mt-1">Welcome back to the admin panel</p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)]"
            asChild
          >
            <Link to="/admin/simulations">View All Simulations</Link>
          </Button>
          <Button
            className="bg-[#5e6ad2] hover:bg-[#828fff] text-white"
            asChild
          >
            <Link to="/admin/simulations/new">
              <Plus className="w-4 h-4 mr-2" />
              Create Simulation
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#111418] border-[#23252a] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#8a8f98] mb-1">Total Simulations</p>
              <p className="text-3xl font-semibold text-[#f7f8f8]">
                {isLoading ? '-' : stats.totalSimulations}
              </p>
              <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stats.activeSimulations} active
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#5e6ad2]/10 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-[#7170ff]" />
            </div>
          </div>
        </Card>

        <Card className="bg-[#111418] border-[#23252a] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#8a8f98] mb-1">Total Users</p>
              <p className="text-3xl font-semibold text-[#f7f8f8]">
                {isLoading ? '-' : stats.totalUsers.toLocaleString()}
              </p>
              <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {stats.activeUsers} active profiles
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="bg-[#111418] border-[#23252a] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#8a8f98] mb-1">Total Sessions</p>
              <p className="text-3xl font-semibold text-[#f7f8f8]">
                {isLoading ? '-' : stats.totalSessions.toLocaleString()}
              </p>
              <p className="text-xs text-[#8a8f98] mt-2 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                {stats.completionRate}% completion rate
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-teal-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Simulations */}
        <Card className="bg-[#111418] border-[#23252a]">
          <div className="p-6 border-b border-[#23252a]">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-[#f7f8f8]">Recent Simulations</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-[#7170ff] hover:text-[#828fff]"
                asChild
              >
                <Link to="/admin/simulations">
                  View All
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </Button>
            </div>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 bg-[#1a1d21] rounded-lg animate-pulse" />
                ))}
              </div>
            ) : recentSimulations.length === 0 ? (
              <div className="text-center py-8">
                <Gamepad2 className="w-12 h-12 text-[#8a8f98] mx-auto mb-3" />
                <p className="text-[#8a8f98]">No simulations yet</p>
                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3 border-[#23252a]"
                  asChild
                >
                  <Link to="/admin/simulations/new">Create your first simulation</Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {recentSimulations.map((sim) => (
                  <Link
                    key={sim.id}
                    to={`/admin/simulations/${sim.id}/edit`}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors group"
                  >
                    <div className="w-10 h-10 rounded-lg bg-[#1a1d21] flex items-center justify-center flex-shrink-0">
                      <Gamepad2 className="w-5 h-5 text-[#8a8f98] group-hover:text-[#7170ff] transition-colors" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[#f7f8f8] truncate">
                        {sim.name}
                      </p>
                      <p className="text-xs text-[#8a8f98] truncate">
                        {sim.companyName} • {sim.industry}
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={getDifficultyColor(sim.difficulty)}
                    >
                      {sim.difficulty}
                    </Badge>
                    <ArrowRight className="w-4 h-4 text-[#8a8f98] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                ))}
              </div>
            )}
          </div>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-[#111418] border-[#23252a]">
          <div className="p-6 border-b border-[#23252a]">
            <h2 className="text-lg font-medium text-[#f7f8f8]">Recent Activity</h2>
          </div>
          <div className="p-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-14 bg-[#1a1d21] rounded-lg animate-pulse" />
                ))}
              </div>
            ) : recentActivity.length === 0 ? (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-[#8a8f98] mx-auto mb-3" />
                <p className="text-[#8a8f98]">No recent activity</p>
              </div>
            ) : (
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#1a1d21] flex items-center justify-center flex-shrink-0 mt-0.5">
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-[#d0d6e0]">
                        {activity.description}
                      </p>
                      <p className="text-xs text-[#8a8f98] mt-1">
                        {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="bg-[#111418] border-[#23252a] mt-8">
        <div className="p-6">
          <h2 className="text-lg font-medium text-[#f7f8f8] mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/admin/simulations/new"
              className="flex items-center gap-3 p-4 rounded-lg bg-[#1a1d21] hover:bg-[#23252a] transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-[#5e6ad2]/10 flex items-center justify-center">
                <Plus className="w-5 h-5 text-[#7170ff]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#f7f8f8]">Create Simulation</p>
                <p className="text-xs text-[#8a8f98]">Add new training scenario</p>
              </div>
            </Link>

            <Link
              to="/admin/simulations"
              className="flex items-center gap-3 p-4 rounded-lg bg-[#1a1d21] hover:bg-[#23252a] transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#f7f8f8]">Manage Simulations</p>
                <p className="text-xs text-[#8a8f98]">Edit existing scenarios</p>
              </div>
            </Link>

            <Link
              to="/admin/users"
              className="flex items-center gap-3 p-4 rounded-lg bg-[#1a1d21] hover:bg-[#23252a] transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
                <Users className="w-5 h-5 text-teal-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#f7f8f8]">View Users</p>
                <p className="text-xs text-[#8a8f98]">Manage user accounts</p>
              </div>
            </Link>

            <Link
              to="/admin/analytics"
              className="flex items-center gap-3 p-4 rounded-lg bg-[#1a1d21] hover:bg-[#23252a] transition-colors group"
            >
              <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-500" />
              </div>
              <div>
                <p className="text-sm font-medium text-[#f7f8f8]">View Analytics</p>
                <p className="text-xs text-[#8a8f98]">Platform insights</p>
              </div>
            </Link>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AdminDashboardPage
