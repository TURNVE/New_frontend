import { useState, useEffect } from 'react'
import {
  BarChart3,
  TrendingUp,
  Users,
  Gamepad2,
  Clock,
  Award,
  Target,
  Activity,
  Calendar,
  Download,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface AnalyticsData {
  overview: {
    totalUsers: number
    activeUsers: number
    totalSimulations: number
    totalSessions: number
    avgCompletionRate: number
    avgSessionDuration: number
  }
  dailyStats: Array<{
    date: string
    newUsers: number
    activeUsers: number
    sessions: number
    completions: number
  }>
  topSimulations: Array<{
    id: string
    name: string
    starts: number
    completions: number
    avgScore: number
  }>
  userEngagement: {
    daily: number
    weekly: number
    monthly: number
  }
}

const TIME_RANGES = [
  { value: '7d', label: 'Last 7 Days' },
  { value: '30d', label: 'Last 30 Days' },
  { value: '90d', label: 'Last 90 Days' },
  { value: '1y', label: 'Last Year' },
]

export function AdminAnalyticsPage() {
  const [timeRange, setTimeRange] = useState('30d')
  const [isLoading, setIsLoading] = useState(true)
  const [data, setData] = useState<AnalyticsData | null>(null)

  useEffect(() => {
    const loadAnalytics = async () => {
      setIsLoading(true)
      try {
        // TODO: Replace with actual API call
        // const { data } = await adminApi.getAnalytics(timeRange)
        
        // Mock data
        const mockData: AnalyticsData = {
          overview: {
            totalUsers: 2453,
            activeUsers: 892,
            totalSimulations: 15420,
            totalSessions: 8765,
            avgCompletionRate: 68.5,
            avgSessionDuration: 28,
          },
          dailyStats: Array.from({ length: 30 }, (_, i) => {
            const date = new Date()
            date.setDate(date.getDate() - (29 - i))
            return {
              date: date.toISOString().split('T')[0],
              newUsers: Math.floor(Math.random() * 50) + 10,
              activeUsers: Math.floor(Math.random() * 300) + 500,
              sessions: Math.floor(Math.random() * 200) + 100,
              completions: Math.floor(Math.random() * 80) + 40,
            }
          }),
          topSimulations: [
            { id: '1', name: '72-Hour Launch Crisis', starts: 1245, completions: 892, avgScore: 78.5 },
            { id: '2', name: 'Checkout Performance Under Fire', starts: 987, completions: 654, avgScore: 72.3 },
            { id: '3', name: 'The Growth Bet', starts: 876, completions: 543, avgScore: 81.2 },
            { id: '4', name: 'Brand Identity Refresh', starts: 654, completions: 432, avgScore: 85.1 },
            { id: '5', name: 'The Core Rebuild', starts: 543, completions: 321, avgScore: 69.8 },
          ],
          userEngagement: {
            daily: 892,
            weekly: 1456,
            monthly: 2134,
          },
        }

        setData(mockData)
      } catch (error) {
        console.error('Failed to load analytics:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadAnalytics()
  }, [timeRange])

  const handleExport = () => {
    // TODO: Implement analytics export
    console.log('Exporting analytics...')
  }

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-[#f7f8f8]">Analytics</h1>
            <p className="text-[#8a8f98] mt-1">Platform insights and metrics</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <Card key={i} className="bg-[#111418] border-[#23252a] p-6 h-32 animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="p-8">
        <Card className="bg-[#111418] border-[#23252a] p-12 text-center">
          <Activity className="w-12 h-12 text-[#8a8f98] mx-auto mb-4" />
          <h3 className="text-lg font-medium text-[#f7f8f8] mb-2">Failed to load analytics</h3>
          <p className="text-[#8a8f98]">Please try again later</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#f7f8f8]">Analytics</h1>
          <p className="text-[#8a8f98] mt-1">
            Platform insights and performance metrics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-[160px] bg-[#111418] border-[#23252a] text-[#f7f8f8]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#111418] border-[#23252a]">
              {TIME_RANGES.map((range) => (
                <SelectItem key={range.value} value={range.value} className="text-[#f7f8f8]">
                  {range.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)]"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#111418] border-[#23252a] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#8a8f98] mb-1">Total Users</p>
              <p className="text-3xl font-semibold text-[#f7f8f8]">
                {data.overview.totalUsers.toLocaleString()}
              </p>
              <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +12% from last period
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-[#5e6ad2]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#7170ff]" />
            </div>
          </div>
        </Card>

        <Card className="bg-[#111418] border-[#23252a] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#8a8f98] mb-1">Active Users</p>
              <p className="text-3xl font-semibold text-[#f7f8f8]">
                {data.overview.activeUsers.toLocaleString()}
              </p>
              <p className="text-xs text-[#8a8f98] mt-2">
                {((data.overview.activeUsers / data.overview.totalUsers) * 100).toFixed(1)}% of total
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <Activity className="w-5 h-5 text-green-500" />
            </div>
          </div>
        </Card>

        <Card className="bg-[#111418] border-[#23252a] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#8a8f98] mb-1">Total Sessions</p>
              <p className="text-3xl font-semibold text-[#f7f8f8]">
                {data.overview.totalSessions.toLocaleString()}
              </p>
              <p className="text-xs text-green-500 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                +8% from last period
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Gamepad2 className="w-5 h-5 text-purple-500" />
            </div>
          </div>
        </Card>

        <Card className="bg-[#111418] border-[#23252a] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#8a8f98] mb-1">Total Simulations</p>
              <p className="text-3xl font-semibold text-[#f7f8f8]">
                {data.overview.totalSimulations.toLocaleString()}
              </p>
              <p className="text-xs text-[#8a8f98] mt-2">
                Across 6 scenarios
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-blue-500" />
            </div>
          </div>
        </Card>

        <Card className="bg-[#111418] border-[#23252a] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#8a8f98] mb-1">Avg. Completion Rate</p>
              <p className="text-3xl font-semibold text-[#f7f8f8]">
                {data.overview.avgCompletionRate}%
              </p>
              <p className="text-xs text-yellow-500 mt-2 flex items-center gap-1">
                <Target className="w-3 h-3" />
                Target: 70%
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <Award className="w-5 h-5 text-yellow-500" />
            </div>
          </div>
        </Card>

        <Card className="bg-[#111418] border-[#23252a] p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-[#8a8f98] mb-1">Avg. Session Duration</p>
              <p className="text-3xl font-semibold text-[#f7f8f8]">
                {data.overview.avgSessionDuration}m
              </p>
              <p className="text-xs text-[#8a8f98] mt-2">
                Per simulation
              </p>
            </div>
            <div className="w-10 h-10 rounded-lg bg-teal-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-teal-500" />
            </div>
          </div>
        </Card>
      </div>

      {/* User Engagement */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card className="bg-[#111418] border-[#23252a] p-6">
          <h3 className="text-lg font-medium text-[#f7f8f8] mb-4">User Engagement</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#1a1d21] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#5e6ad2]/10 flex items-center justify-center">
                  <Activity className="w-4 h-4 text-[#7170ff]" />
                </div>
                <span className="text-sm text-[#d0d6e0]">Daily Active</span>
              </div>
              <span className="text-lg font-medium text-[#f7f8f8]">
                {data.userEngagement.daily.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1a1d21] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-purple-500" />
                </div>
                <span className="text-sm text-[#d0d6e0]">Weekly Active</span>
              </div>
              <span className="text-lg font-medium text-[#f7f8f8]">
                {data.userEngagement.weekly.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#1a1d21] rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center">
                  <Users className="w-4 h-4 text-green-500" />
                </div>
                <span className="text-sm text-[#d0d6e0]">Monthly Active</span>
              </div>
              <span className="text-lg font-medium text-[#f7f8f8]">
                {data.userEngagement.monthly.toLocaleString()}
              </span>
            </div>
          </div>
        </Card>

        <Card className="bg-[#111418] border-[#23252a] p-6 lg:col-span-2">
          <h3 className="text-lg font-medium text-[#f7f8f8] mb-4">Daily Activity</h3>
          <div className="h-64 flex items-end gap-1">
            {data.dailyStats.map((day, index) => {
              const maxValue = Math.max(...data.dailyStats.map(d => d.activeUsers))
              const height = (day.activeUsers / maxValue) * 100
              return (
                <div
                  key={day.date}
                  className="flex-1 bg-[#5e6ad2]/20 hover:bg-[#5e6ad2]/40 transition-colors rounded-t"
                  style={{ height: `${height}%` }}
                  title={`${day.date}: ${day.activeUsers} users`}
                />
              )
            })}
          </div>
          <div className="flex justify-between mt-2 text-xs text-[#62666d]">
            <span>{data.dailyStats[0]?.date}</span>
            <span>{data.dailyStats[data.dailyStats.length - 1]?.date}</span>
          </div>
        </Card>
      </div>

      {/* Top Simulations */}
      <Card className="bg-[#111418] border-[#23252a]">
        <div className="p-6 border-b border-[#23252a]">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-[#f7f8f8]">Top Simulations</h3>
            <Badge variant="outline" className="border-[#23252a] text-[#8a8f98]">
              {data.topSimulations.length} scenarios
            </Badge>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {data.topSimulations.map((sim, index) => (
              <div
                key={sim.id}
                className="flex items-center gap-4 p-4 bg-[#1a1d21] rounded-lg"
              >
                <div className="w-8 h-8 rounded-lg bg-[#5e6ad2]/10 flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-[#7170ff]">{index + 1}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#f7f8f8] truncate">
                    {sim.name}
                  </p>
                  <p className="text-xs text-[#8a8f98]">
                    {sim.starts.toLocaleString()} starts · {sim.completions.toLocaleString()} completions
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <p className="text-xs text-[#8a8f98]">Completion Rate</p>
                    <p className="text-sm font-medium text-[#f7f8f8]">
                      {((sim.completions / sim.starts) * 100).toFixed(1)}%
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-[#8a8f98]">Avg Score</p>
                    <p className="text-sm font-medium text-[#f7f8f8]">
                      {sim.avgScore}%
                    </p>
                  </div>
                  <div className="w-24">
                    <div className="h-2 bg-[#23252a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#5e6ad2] rounded-full"
                        style={{ width: `${sim.avgScore}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  )
}

export default AdminAnalyticsPage
