import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Search,
  Filter,
  MoreHorizontal,
  Edit3,
  UserX,
  CheckCircle2,
  XCircle,
  Users,
  Mail,
  Calendar,
  Shield,
  User,
  ArrowUpDown,
  Download,
  Plus,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'

interface UserData {
  id: string
  email: string
  name: string
  role: 'admin' | 'user' | 'instructor'
  status: 'active' | 'inactive' | 'suspended'
  createdAt: string
  lastActiveAt: string | null
  simulationsCompleted: number
  totalSessions: number
  avatarUrl?: string
}

type SortField = 'name' | 'email' | 'role' | 'status' | 'createdAt' | 'lastActiveAt'
type SortDirection = 'asc' | 'desc'

const ROLE_OPTIONS = [
  { value: 'all', label: 'All Roles' },
  { value: 'admin', label: 'Admin' },
  { value: 'instructor', label: 'Instructor' },
  { value: 'user', label: 'User' },
]

const STATUS_OPTIONS = [
  { value: 'all', label: 'All Status' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
  { value: 'suspended', label: 'Suspended' },
]

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserData[]>([])
  const [filteredUsers, setFilteredUsers] = useState<UserData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterRole, setFilterRole] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null)
  const [showUserDialog, setShowUserDialog] = useState(false)
  const [showSuspendDialog, setShowSuspendDialog] = useState(false)

  // Load users (mock data for now)
  useEffect(() => {
    const loadUsers = async () => {
      setIsLoading(true)
      try {
        // TODO: Replace with actual API call
        // const { data } = await adminApi.getUsers()
        
        const mockUsers: UserData[] = [
          {
            id: '1',
            email: 'admin@turnve.com',
            name: 'Admin User',
            role: 'admin',
            status: 'active',
            createdAt: '2026-01-15T10:30:00Z',
            lastActiveAt: '2026-04-22T08:45:00Z',
            simulationsCompleted: 12,
            totalSessions: 45,
          },
          {
            id: '2',
            email: 'instructor@turnve.com',
            name: 'Jane Instructor',
            role: 'instructor',
            status: 'active',
            createdAt: '2026-02-01T14:20:00Z',
            lastActiveAt: '2026-04-21T16:30:00Z',
            simulationsCompleted: 8,
            totalSessions: 23,
          },
          {
            id: '3',
            email: 'user1@example.com',
            name: 'John Doe',
            role: 'user',
            status: 'active',
            createdAt: '2026-03-10T09:15:00Z',
            lastActiveAt: '2026-04-22T10:20:00Z',
            simulationsCompleted: 3,
            totalSessions: 8,
          },
          {
            id: '4',
            email: 'user2@example.com',
            name: 'Sarah Smith',
            role: 'user',
            status: 'active',
            createdAt: '2026-03-15T11:45:00Z',
            lastActiveAt: '2026-04-20T14:30:00Z',
            simulationsCompleted: 5,
            totalSessions: 12,
          },
          {
            id: '5',
            email: 'inactive@example.com',
            name: 'Inactive User',
            role: 'user',
            status: 'inactive',
            createdAt: '2026-01-20T16:00:00Z',
            lastActiveAt: null,
            simulationsCompleted: 0,
            totalSessions: 0,
          },
        ]

        setUsers(mockUsers)
        setFilteredUsers(mockUsers)
      } catch (error) {
        console.error('Failed to load users:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Filter and sort users
  useEffect(() => {
    let filtered = [...users]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query)
      )
    }

    // Role filter
    if (filterRole !== 'all') {
      filtered = filtered.filter((user) => user.role === filterRole)
    }

    // Status filter
    if (filterStatus !== 'all') {
      filtered = filtered.filter((user) => user.status === filterStatus)
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'email':
          comparison = a.email.localeCompare(b.email)
          break
        case 'role':
          comparison = a.role.localeCompare(b.role)
          break
        case 'status':
          comparison = a.status.localeCompare(b.status)
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'lastActiveAt':
          if (!a.lastActiveAt && !b.lastActiveAt) comparison = 0
          else if (!a.lastActiveAt) comparison = 1
          else if (!b.lastActiveAt) comparison = -1
          else comparison = new Date(a.lastActiveAt).getTime() - new Date(b.lastActiveAt).getTime()
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    setFilteredUsers(filtered)
  }, [users, searchQuery, filterRole, filterStatus, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleSuspend = async () => {
    if (!selectedUser) return
    
    try {
      // TODO: Call API to suspend user
      setUsers((prev) =>
        prev.map((user) =>
          user.id === selectedUser.id
            ? { ...user, status: 'suspended' as const }
            : user
        )
      )
      setShowSuspendDialog(false)
      setSelectedUser(null)
    } catch (error) {
      console.error('Failed to suspend user:', error)
    }
  }

  const handleActivate = async (userId: string) => {
    try {
      // TODO: Call API to activate user
      setUsers((prev) =>
        prev.map((user) =>
          user.id === userId
            ? { ...user, status: 'active' as const }
            : user
        )
      )
    } catch (error) {
      console.error('Failed to activate user:', error)
    }
  }

  const handleExport = () => {
    // TODO: Implement CSV export
    console.log('Exporting users...')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500/10 text-green-500 border-green-500/20'
      case 'inactive':
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
      case 'suspended':
        return 'bg-red-500/10 text-red-500 border-red-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/20'
      case 'instructor':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/20'
      case 'user':
        return 'bg-teal-500/10 text-teal-500 border-teal-500/20'
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/20'
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatDateTime = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) {
      return <ArrowUpDown className="w-4 h-4 text-[#8a8f98]" />
    }
    return (
      <ArrowUpDown
        className={cn(
          'w-4 h-4 text-[#7170ff]',
          sortDirection === 'desc' && 'rotate-180'
        )}
      />
    )
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-[#f7f8f8]">Users</h1>
          <p className="text-[#8a8f98] mt-1">
            Manage user accounts and permissions
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            onClick={handleExport}
            className="border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)]"
          >
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button
            className="bg-[#5e6ad2] hover:bg-[#828fff] text-white"
          >
            <Plus className="w-4 h-4 mr-2" />
            Invite User
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-[#111418] border-[#23252a] p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#5e6ad2]/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-[#7170ff]" />
            </div>
            <div>
              <p className="text-sm text-[#8a8f98]">Total Users</p>
              <p className="text-2xl font-semibold text-[#f7f8f8]">{users.length}</p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#111418] border-[#23252a] p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-500/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-green-500" />
            </div>
            <div>
              <p className="text-sm text-[#8a8f98]">Active</p>
              <p className="text-2xl font-semibold text-[#f7f8f8]">
                {users.filter(u => u.status === 'active').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#111418] border-[#23252a] p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <p className="text-sm text-[#8a8f98]">Admins</p>
              <p className="text-2xl font-semibold text-[#f7f8f8]">
                {users.filter(u => u.role === 'admin').length}
              </p>
            </div>
          </div>
        </Card>
        <Card className="bg-[#111418] border-[#23252a] p-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-blue-500" />
            </div>
            <div>
              <p className="text-sm text-[#8a8f98]">New This Month</p>
              <p className="text-2xl font-semibold text-[#f7f8f8]">
                {users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)).length}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-[#111418] border-[#23252a] mb-6">
        <div className="p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8f98]" />
              <Input
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1a1d21] border-[#23252a] text-[#f7f8f8] placeholder:text-[#8a8f98]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8a8f98]" />
            <Select value={filterRole} onValueChange={setFilterRole}>
              <SelectTrigger className="w-[140px] bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]">
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1d21] border-[#23252a]">
                {ROLE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-[#f7f8f8]">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[140px] bg-[#1a1d21] border-[#23252a] text-[#f7f8f8]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1d21] border-[#23252a]">
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value} className="text-[#f7f8f8]">
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="bg-[#111418] border-[#23252a]">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-[#1a1d21] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-16 h-16 text-[#8a8f98] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#f7f8f8] mb-2">No users found</h3>
            <p className="text-[#8a8f98] mb-6">
              {searchQuery || filterRole !== 'all' || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'No users have been registered yet'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#23252a]">
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-2 text-xs font-medium text-[#8a8f98] uppercase tracking-wider hover:text-[#d0d6e0]"
                    >
                      User
                      <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('role')}
                      className="flex items-center gap-2 text-xs font-medium text-[#8a8f98] uppercase tracking-wider hover:text-[#d0d6e0]"
                    >
                      Role
                      <SortIcon field="role" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('status')}
                      className="flex items-center gap-2 text-xs font-medium text-[#8a8f98] uppercase tracking-wider hover:text-[#d0d6e0]"
                    >
                      Status
                      <SortIcon field="status" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-medium text-[#8a8f98] uppercase tracking-wider">
                      Activity
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center gap-2 text-xs font-medium text-[#8a8f98] uppercase tracking-wider hover:text-[#d0d6e0]"
                    >
                      Joined
                      <SortIcon field="createdAt" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <span className="text-xs font-medium text-[#8a8f98] uppercase tracking-wider">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#23252a]">
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#1a1d21] flex items-center justify-center flex-shrink-0">
                          <User className="w-5 h-5 text-[#8a8f98]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#f7f8f8]">
                            {user.name}
                          </p>
                          <p className="text-xs text-[#8a8f98]">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={cn('border', getRoleColor(user.role))}
                      >
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleActivate(user.id)}
                        className={cn(
                          'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors',
                          user.status === 'active'
                            ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                            : user.status === 'inactive'
                              ? 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                              : 'bg-red-500/10 text-red-500 hover:bg-red-500/20'
                        )}
                      >
                        {user.status === 'active' ? (
                          <CheckCircle2 className="w-3 h-3" />
                        ) : (
                          <XCircle className="w-3 h-3" />
                        )}
                        {user.status}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-[#d0d6e0]">
                        {user.simulationsCompleted} simulations
                      </div>
                      <div className="text-xs text-[#8a8f98]">
                        {user.totalSessions} sessions
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#8a8f98]">
                        {formatDate(user.createdAt)}
                      </p>
                      <p className="text-xs text-[#62666d]">
                        Last active: {formatDate(user.lastActiveAt)}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 text-[#8a8f98] hover:text-[#f7f8f8]"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#1a1d21] border-[#23252a]"
                        >
                          <DropdownMenuItem
                            className="text-[#d0d6e0] focus:bg-[#23252a] focus:text-[#f7f8f8] cursor-pointer"
                            onClick={() => {
                              setSelectedUser(user)
                              setShowUserDialog(true)
                            }}
                          >
                            <User className="mr-2 h-4 w-4" />
                            View Profile
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-[#d0d6e0] focus:bg-[#23252a] focus:text-[#f7f8f8] cursor-pointer"
                          >
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit User
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-[#d0d6e0] focus:bg-[#23252a] focus:text-[#f7f8f8] cursor-pointer"
                          >
                            <Mail className="mr-2 h-4 w-4" />
                            Send Email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#23252a]" />
                          {user.status !== 'suspended' ? (
                            <DropdownMenuItem
                              className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
                              onClick={() => {
                                setSelectedUser(user)
                                setShowSuspendDialog(true)
                              }}
                            >
                              <UserX className="mr-2 h-4 w-4" />
                              Suspend User
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              className="text-green-500 focus:bg-green-500/10 focus:text-green-500 cursor-pointer"
                              onClick={() => handleActivate(user.id)}
                            >
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              Activate User
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* User Profile Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="bg-[#111418] border-[#23252a] max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-[#f7f8f8]">User Profile</DialogTitle>
            <DialogDescription className="text-[#8a8f98]">
              Detailed information about this user
            </DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-[#1a1d21] flex items-center justify-center">
                  <User className="w-8 h-8 text-[#8a8f98]" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-[#f7f8f8]">
                    {selectedUser.name}
                  </h3>
                  <p className="text-sm text-[#8a8f98]">{selectedUser.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-[#1a1d21] rounded-lg">
                  <p className="text-xs text-[#8a8f98] mb-1">Role</p>
                  <Badge
                    variant="outline"
                    className={cn('border', getRoleColor(selectedUser.role))}
                  >
                    {selectedUser.role}
                  </Badge>
                </div>
                <div className="p-3 bg-[#1a1d21] rounded-lg">
                  <p className="text-xs text-[#8a8f98] mb-1">Status</p>
                  <Badge
                    variant="outline"
                    className={cn('border', getStatusColor(selectedUser.status))}
                  >
                    {selectedUser.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#8a8f98]">Joined</span>
                  <span className="text-[#d0d6e0]">{formatDateTime(selectedUser.createdAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8a8f98]">Last Active</span>
                  <span className="text-[#d0d6e0]">{formatDateTime(selectedUser.lastActiveAt)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8a8f98]">Simulations Completed</span>
                  <span className="text-[#d0d6e0]">{selectedUser.simulationsCompleted}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#8a8f98]">Total Sessions</span>
                  <span className="text-[#d0d6e0]">{selectedUser.totalSessions}</span>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowUserDialog(false)}
              className="border-[#23252a] text-[#d0d6e0]"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Suspend Confirmation Dialog */}
      <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
        <DialogContent className="bg-[#111418] border-[#23252a]">
          <DialogHeader>
            <DialogTitle className="text-[#f7f8f8] flex items-center gap-2">
              <UserX className="w-5 h-5 text-red-500" />
              Suspend User
            </DialogTitle>
            <DialogDescription className="text-[#8a8f98]">
              Are you sure you want to suspend {selectedUser?.name}? They will no longer be able to access the platform.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => {
                setShowSuspendDialog(false)
                setSelectedUser(null)
              }}
              className="border-[#23252a] text-[#d0d6e0]"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSuspend}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Suspend User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminUsersPage
