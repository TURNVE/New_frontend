import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Edit3,
  Eye,
  Trash2,
  Copy,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Gamepad2,
  ArrowUpDown,
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
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { cn } from '@/lib/utils'
import { adminSimulations, type AdminSimulation } from '@/lib/admin'

type SortField = 'name' | 'companyName' | 'difficulty' | 'createdAt' | 'isActive'
type SortDirection = 'asc' | 'desc'

export function AdminSimulationsPage() {
  const navigate = useNavigate()
  const [simulations, setSimulations] = useState<AdminSimulation[]>([])
  const [filteredSimulations, setFilteredSimulations] = useState<AdminSimulation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [filterArchetype, setFilterArchetype] = useState<string>('all')
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all')
  const [sortField, setSortField] = useState<SortField>('createdAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [simulationToDelete, setSimulationToDelete] = useState<AdminSimulation | null>(null)

  // Load simulations (mock data for now)
  useEffect(() => {
    const loadSimulations = async () => {
      setIsLoading(true)
      try {
        setLoadError(null)
        const { simulations: adminSimulationList, error } = await adminSimulations.list()
        if (error) throw error
        setSimulations(adminSimulationList)
        setFilteredSimulations(adminSimulationList)
      } catch (error) {
        console.error('Failed to load simulations:', error)
        setLoadError('Unable to load simulations. Confirm you are signed in with an ADMIN profile.')
      } finally {
        setIsLoading(false)
      }
    }

    loadSimulations()
  }, [])

  // Filter and sort simulations
  useEffect(() => {
    let filtered = [...simulations]

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (sim) =>
          sim.name.toLowerCase().includes(query) ||
          sim.companyName.toLowerCase().includes(query) ||
          sim.industry.toLowerCase().includes(query) ||
          sim.key.toLowerCase().includes(query)
      )
    }

    // Archetype filter
    if (filterArchetype !== 'all') {
      filtered = filtered.filter((sim) => sim.archetype === filterArchetype)
    }

    // Difficulty filter
    if (filterDifficulty !== 'all') {
      filtered = filtered.filter((sim) => sim.difficulty === filterDifficulty)
    }

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0
      switch (sortField) {
        case 'name':
          comparison = a.name.localeCompare(b.name)
          break
        case 'companyName':
          comparison = a.companyName.localeCompare(b.companyName)
          break
        case 'difficulty':
          const difficultyOrder = { intro: 0, intermediate: 1, advanced: 2 }
          comparison = difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty]
          break
        case 'createdAt':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          break
        case 'isActive':
          comparison = Number(a.isActive) - Number(b.isActive)
          break
      }
      return sortDirection === 'asc' ? comparison : -comparison
    })

    setFilteredSimulations(filtered)
  }, [simulations, searchQuery, filterArchetype, filterDifficulty, sortField, sortDirection])

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('asc')
    }
  }

  const handleDelete = async (simulation: AdminSimulation) => {
    setSimulationToDelete(simulation)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!simulationToDelete) return

    try {
      const { error } = await adminSimulations.delete(simulationToDelete.id)
      if (error) throw error

      setSimulations((prev) => prev.filter((s) => s.id !== simulationToDelete.id))
    } catch (error) {
      console.error('Failed to delete simulation:', error)
    } finally {
      setDeleteDialogOpen(false)
      setSimulationToDelete(null)
    }
  }

  const handleDuplicate = async (simulation: AdminSimulation) => {
    try {
      const { simulation: duplicated, error } = await adminSimulations.duplicate(simulation.id)
      if (error) throw error
      if (duplicated) {
        setSimulations((prev) => [duplicated, ...prev])
      }
    } catch (error) {
      console.error('Failed to duplicate simulation:', error)
    }
  }

  const handleToggleActive = async (simulation: AdminSimulation) => {
    try {
      const { simulation: updated, error } = await adminSimulations.updateActive(
        simulation.id,
        !simulation.isActive
      )
      if (error) throw error
      if (updated) {
        setSimulations((prev) =>
          prev.map((s) => (s.id === simulation.id ? updated : s))
        )
      }
    } catch (error) {
      console.error('Failed to toggle active status:', error)
    }
  }

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

  const getArchetypeColor = (archetype: string) => {
    switch (archetype) {
      case 'crisis':
        return 'bg-red-500/10 text-red-500'
      case 'growth':
        return 'bg-purple-500/10 text-purple-500'
      case 'platform':
        return 'bg-blue-500/10 text-blue-500'
      case 'zero_to_one':
        return 'bg-teal-500/10 text-teal-500'
      case 'creative':
        return 'bg-pink-500/10 text-pink-500'
      default:
        return 'bg-gray-500/10 text-gray-500'
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
          <h1 className="text-2xl font-semibold text-[#f7f8f8]">Simulations</h1>
          <p className="text-[#8a8f98] mt-1">
            Manage training simulations and scenarios
          </p>
        </div>
        <Button
          className="bg-[#5e6ad2] hover:bg-[#828fff] text-white"
          onClick={() => navigate('/admin/simulations/new')}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create Simulation
        </Button>
      </div>

      {/* Filters */}
      <Card className="bg-[#111418] border-[#23252a] mb-6">
        <div className="p-4 flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8a8f98]" />
              <Input
                placeholder="Search simulations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-[#1a1d21] border-[#23252a] text-[#f7f8f8] placeholder:text-[#8a8f98]"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8a8f98]" />
            <select
              value={filterArchetype}
              onChange={(e) => setFilterArchetype(e.target.value)}
              className="bg-[#1a1d21] border border-[#23252a] rounded-md px-3 py-2 text-sm text-[#d0d6e0] focus:outline-none focus:ring-2 focus:ring-[#7170ff]"
            >
              <option value="all">All Archetypes</option>
              <option value="crisis">Crisis</option>
              <option value="growth">Growth</option>
              <option value="platform">Platform</option>
              <option value="zero_to_one">Zero to One</option>
              <option value="creative">Creative</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={filterDifficulty}
              onChange={(e) => setFilterDifficulty(e.target.value)}
              className="bg-[#1a1d21] border border-[#23252a] rounded-md px-3 py-2 text-sm text-[#d0d6e0] focus:outline-none focus:ring-2 focus:ring-[#7170ff]"
            >
              <option value="all">All Difficulties</option>
              <option value="intro">Intro</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
            </select>
          </div>
        </div>
      </Card>

      {/* Simulations Table */}
      <Card className="bg-[#111418] border-[#23252a]">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-[#1a1d21] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : loadError ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#f7f8f8] mb-2">Could not load simulations</h3>
            <p className="text-[#8a8f98] mb-6">{loadError}</p>
            <Button
              className="bg-[#5e6ad2] hover:bg-[#828fff] text-white"
              onClick={() => window.location.reload()}
            >
              Retry
            </Button>
          </div>
        ) : filteredSimulations.length === 0 ? (
          <div className="p-12 text-center">
            <Gamepad2 className="w-16 h-16 text-[#8a8f98] mx-auto mb-4" />
            <h3 className="text-lg font-medium text-[#f7f8f8] mb-2">No simulations found</h3>
            <p className="text-[#8a8f98] mb-6">
              {searchQuery || filterArchetype !== 'all' || filterDifficulty !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first simulation'}
            </p>
            <Button
              className="bg-[#5e6ad2] hover:bg-[#828fff] text-white"
              onClick={() => navigate('/admin/simulations/new')}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create Simulation
            </Button>
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
                      Simulation
                      <SortIcon field="name" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('companyName')}
                      className="flex items-center gap-2 text-xs font-medium text-[#8a8f98] uppercase tracking-wider hover:text-[#d0d6e0]"
                    >
                      Company
                      <SortIcon field="companyName" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs font-medium text-[#8a8f98] uppercase tracking-wider">
                      Archetype
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('difficulty')}
                      className="flex items-center gap-2 text-xs font-medium text-[#8a8f98] uppercase tracking-wider hover:text-[#d0d6e0]"
                    >
                      Difficulty
                      <SortIcon field="difficulty" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('isActive')}
                      className="flex items-center gap-2 text-xs font-medium text-[#8a8f98] uppercase tracking-wider hover:text-[#d0d6e0]"
                    >
                      Status
                      <SortIcon field="isActive" />
                    </button>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <button
                      onClick={() => handleSort('createdAt')}
                      className="flex items-center gap-2 text-xs font-medium text-[#8a8f98] uppercase tracking-wider hover:text-[#d0d6e0]"
                    >
                      Created
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
                {filteredSimulations.map((simulation) => (
                  <tr
                    key={simulation.id}
                    className="hover:bg-[rgba(255,255,255,0.02)] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[#1a1d21] flex items-center justify-center flex-shrink-0">
                          <Gamepad2 className="w-5 h-5 text-[#8a8f98]" />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-[#f7f8f8]">
                            {simulation.name}
                          </p>
                          <p className="text-xs text-[#8a8f98]">{simulation.key}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="text-sm text-[#d0d6e0]">
                          {simulation.companyName}
                        </p>
                        <p className="text-xs text-[#8a8f98]">{simulation.industry}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="secondary"
                        className={getArchetypeColor(simulation.archetype)}
                      >
                        {simulation.archetype}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <Badge
                        variant="outline"
                        className={getDifficultyColor(simulation.difficulty)}
                      >
                        {simulation.difficulty}
                      </Badge>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(simulation)}
                        className={cn(
                          'flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium transition-colors',
                          simulation.isActive
                            ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20'
                            : 'bg-gray-500/10 text-gray-500 hover:bg-gray-500/20'
                        )}
                      >
                        {simulation.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-[#8a8f98]">
                        {formatDate(simulation.createdAt)}
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
                            onClick={() => navigate(`/simulation/${simulation.key}`)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Preview
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-[#d0d6e0] focus:bg-[#23252a] focus:text-[#f7f8f8] cursor-pointer"
                            onClick={() => navigate(`/admin/simulations/${simulation.id}/edit`)}
                          >
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-[#d0d6e0] focus:bg-[#23252a] focus:text-[#f7f8f8] cursor-pointer"
                            onClick={() => handleDuplicate(simulation)}
                          >
                            <Copy className="mr-2 h-4 w-4" />
                            Duplicate
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-[#23252a]" />
                          <DropdownMenuItem
                            className="text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer"
                            onClick={() => handleDelete(simulation)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
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

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#111418] border-[#23252a]">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-[#f7f8f8] flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-red-500" />
              Delete Simulation
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#8a8f98]">
              Are you sure you want to delete{' '}
              <span className="text-[#d0d6e0] font-medium">
                {simulationToDelete?.name}
              </span>
              ? This action cannot be undone and will remove all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              className="bg-transparent border-[#23252a] text-[#d0d6e0] hover:bg-[rgba(255,255,255,0.04)]"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-red-500 hover:bg-red-600 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default AdminSimulationsPage
