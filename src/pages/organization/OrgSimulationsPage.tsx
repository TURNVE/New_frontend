import React, { useState, useMemo } from 'react';
import { OrgLayout } from '../../components/organization/layout/OrgLayout';
import { OrgSidebar } from '../../components/organization/layout/OrgSidebar';
import { OrgHeader } from '../../components/organization/layout/OrgHeader';
import { Link } from 'react-router-dom';
import {
  Search,
  Plus,
  Grid3X3,
  List,
  MoreHorizontal,
  Edit,
  Copy,
  Archive,
  Trash2,
  Play,
  Eye,
  Link2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '../../lib/organization/utils';
import { useOrganization, useSimulations } from '../../hooks/organization';
import type { OrganizationSimulation, SimulationStatus } from '../../lib/organization/types';

const categories = [
  { value: 'all', label: 'All Categories' },
  { value: 'project-management', label: 'Project Management' },
  { value: 'crisis-management', label: 'Crisis Management' },
  { value: 'team-building', label: 'Team Building' },
  { value: 'strategic-planning', label: 'Strategic Planning' },
  { value: 'stakeholder-management', label: 'Stakeholder Management' },
  { value: 'product-launch', label: 'Product Launch' },
  { value: 'custom', label: 'Custom' },
];

const statuses = [
  { value: 'all', label: 'All Statuses' },
  { value: 'draft', label: 'Draft' },
  { value: 'published', label: 'Published' },
  { value: 'archived', label: 'Archived' },
];

interface SimulationDisplay {
  id: string;
  title: string;
  description: string;
  category: string;
  status: SimulationStatus;
  completions: number;
  avgScore: number;
  assignments: number;
  createdAt: string;
  updatedAt: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
}

function mapSimulationToDisplay(sim: OrganizationSimulation): SimulationDisplay {
  return {
    id: sim.id,
    title: sim.title,
    description: sim.description,
    category: sim.category,
    status: sim.status,
    completions: sim.metrics?.completedCount ?? 0,
    avgScore: sim.metrics?.averageScore ?? 0,
    assignments: sim.metrics?.totalAssignments ?? 0,
    createdAt: sim.createdAt,
    updatedAt: sim.updatedAt,
    difficulty: sim.difficulty,
    estimatedDuration: sim.duration ?? sim.config?.timeLimit ?? 0,
  };
}

function StatusBadge({ status }: { status: SimulationStatus }) {
  const styles = {
    draft: 'bg-yellow-100 text-yellow-700',
    published: 'bg-green-100 text-green-700',
    archived: 'bg-gray-100 text-gray-700',
  };

  return (
    <span className={cn(
      'px-2.5 py-0.5 rounded-full text-xs font-medium',
      styles[status]
    )}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: SimulationDisplay['difficulty'] }) {
  const styles = {
    beginner: 'bg-green-100 text-green-700',
    intermediate: 'bg-blue-100 text-blue-700',
    advanced: 'bg-purple-100 text-purple-700',
  };

  return (
    <span className={cn(
      'px-2 py-0.5 rounded text-xs font-medium',
      styles[difficulty]
    )}>
      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
    </span>
  );
}

function SimulationCard({
  simulation,
  onDelete,
  onArchive,
  onPublish,
  onDuplicate,
  onCopyAccessLink,
}: {
  simulation: SimulationDisplay;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onPublish: (id: string) => void;
  onDuplicate: (id: string) => void;
  onCopyAccessLink: (id: string) => void;
}) {
  const [showMenu, setShowMenu] = useState(false);

  return (
    <div className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-all">
      <div className="h-40 bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl font-bold text-blue-600">{simulation.title.charAt(0)}</span>
          </div>
          <DifficultyBadge difficulty={simulation.difficulty} />
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-1">{simulation.title}</h3>
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {showMenu && (
              <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-10">
                <button className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                  <Eye className="w-4 h-4" />
                  Preview
                </button>
                <Link
                  to={`/org/simulations/${simulation.id}/edit`}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Edit className="w-4 h-4" />
                  Edit
                </Link>
                <button
                  onClick={() => { onDuplicate(simulation.id); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                >
                  <Copy className="w-4 h-4" />
                  Duplicate
                </button>
                {simulation.status === 'published' && (
                  <button
                    onClick={() => { onCopyAccessLink(simulation.id); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Link2 className="w-4 h-4" />
                    Copy access link
                  </button>
                )}
                <div className="border-t border-gray-100" />
                {simulation.status === 'draft' && (
                  <button
                    onClick={() => { onPublish(simulation.id); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Play className="w-4 h-4" />
                    Publish
                  </button>
                )}
                {simulation.status !== 'archived' && (
                  <button
                    onClick={() => { onArchive(simulation.id); setShowMenu(false); }}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    <Archive className="w-4 h-4" />
                    Archive
                  </button>
                )}
                <button
                  onClick={() => { onDelete(simulation.id); setShowMenu(false); }}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600 line-clamp-2 mb-3">{simulation.description}</p>
        <div className="flex items-center justify-between mb-4">
          <StatusBadge status={simulation.status} />
          <span className="text-xs text-gray-500">{simulation.estimatedDuration} min</span>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 pt-3">
          <span>{simulation.completions} completions</span>
          <span>{simulation.avgScore > 0 ? `${simulation.avgScore}% avg` : '—'}</span>
        </div>
      </div>
    </div>
  );
}

function SimulationRow({ simulation }: { simulation: SimulationDisplay }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-purple-100 rounded-lg flex items-center justify-center font-bold text-blue-600">
        {simulation.title.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-900">{simulation.title}</h3>
        <p className="text-sm text-gray-500 line-clamp-1">{simulation.description}</p>
      </div>
      <div className="flex items-center gap-6">
        <DifficultyBadge difficulty={simulation.difficulty} />
        <StatusBadge status={simulation.status} />
        <span className="text-sm text-gray-500 w-24">{simulation.completions} completions</span>
        <span className="text-sm text-gray-500 w-16">{simulation.avgScore > 0 ? `${simulation.avgScore}%` : '—'}</span>
        <span className="text-sm text-gray-500">{new Date(simulation.updatedAt).toLocaleDateString()}</span>
        <div className="flex items-center gap-1">
          <Link
            to={`/org/simulations/${simulation.id}/edit`}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <Edit className="w-4 h-4" />
          </Link>
          <button className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

function FilterBar({
  search,
  setSearch,
  category,
  setCategory,
  status,
  setStatus,
  view,
  setView,
}: {
  search: string;
  setSearch: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  status: string;
  setStatus: (value: string) => void;
  view: 'grid' | 'list';
  setView: (value: 'grid' | 'list') => void;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search simulations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          >
            {categories.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
          >
            {statuses.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center border border-gray-200 rounded-lg p-1">
            <button
              onClick={() => setView('grid')}
              className={cn(
                'p-2 rounded-md transition-colors',
                view === 'grid' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setView('list')}
              className={cn(
                'p-2 rounded-md transition-colors',
                view === 'list' ? 'bg-gray-100 text-gray-900' : 'text-gray-400 hover:text-gray-600'
              )}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SkeletonCard() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
      <div className="h-40 bg-gray-100" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-100 rounded w-full" />
        <div className="h-4 bg-gray-100 rounded w-2/3" />
        <div className="flex justify-between">
          <div className="h-6 bg-gray-100 rounded w-16" />
          <div className="h-4 bg-gray-100 rounded w-12" />
        </div>
        <div className="border-t border-gray-100 pt-3 flex gap-4">
          <div className="h-4 bg-gray-100 rounded w-24" />
          <div className="h-4 bg-gray-100 rounded w-16" />
        </div>
      </div>
    </div>
  );
}

export default function OrgSimulationsPage() {
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [currentPage] = useState(1);

  const { organization } = useOrganization();
  const {
    simulations,
    loading,
    error,
    deleteSimulation,
    updateSimulation,
    publishSimulation,
  } = useSimulations(organization?.id ?? '');

  const displaySimulations = useMemo(
    () => simulations.map(mapSimulationToDisplay),
    [simulations]
  );

  const filteredSimulations = useMemo(() => {
    return displaySimulations.filter((sim) => {
      const matchesSearch = sim.title.toLowerCase().includes(search.toLowerCase()) ||
        sim.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === 'all' || sim.category === category;
      const matchesStatus = status === 'all' || sim.status === status;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [displaySimulations, search, category, status]);

  const handleDelete = async (id: string) => {
    try {
      await deleteSimulation(id);
    } catch (err) {
      console.error('Failed to delete simulation', err);
    }
  };

  const handleArchive = async (id: string) => {
    try {
      await updateSimulation(id, { status: 'archived' as SimulationStatus });
    } catch (err) {
      console.error('Failed to archive simulation', err);
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishSimulation(id);
    } catch (err) {
      console.error('Failed to publish simulation', err);
    }
  };

  const handleDuplicate = async (id: string) => {
    try {
      const source = simulations.find((sim) => sim.id === id);
      if (!source) return;

      const { supabase } = await import('../../lib/supabase');
      await supabase
        .from('organization_simulations')
        .insert({
          organization_id: source.organizationId,
          title: `${source.title} (Copy)`,
          description: source.description,
          category: source.category,
          status: 'draft',
          created_by: source.createdBy,
          config: source.config,
          metrics: {
            totalAssignments: 0,
            activeAssignments: 0,
            completedCount: 0,
            averageScore: 0,
            averageCompletionTime: 0,
          },
        });
    } catch (err) {
      console.error('Failed to duplicate simulation', err);
    }
  };

  const handleCopyAccessLink = async (id: string) => {
    try {
      const source = simulations.find((sim) => sim.id === id);
      if (!source || !organization?.id) return;

      const { supabase } = await import('../../lib/supabase');
      const { data: existing, error: lookupError } = await supabase
        .from('organization_access_links')
        .select('token')
        .eq('organization_id', organization.id)
        .eq('simulation_id', id)
        .eq('is_active', true)
        .maybeSingle();

      if (lookupError) throw lookupError;

      let token = existing?.token as string | undefined;
      if (!token) {
        token = crypto.randomUUID();
        const { error: insertError } = await supabase
          .from('organization_access_links')
          .insert({
            organization_id: organization.id,
            simulation_id: id,
            token,
            label: `${source.title} direct access`,
            is_active: true,
          });

        if (insertError) throw insertError;
      }

      await navigator.clipboard.writeText(`${window.location.origin}/access/${token}`);
    } catch (err) {
      console.error('Failed to copy access link', err);
    }
  };

  const stats = useMemo(() => ({
    total: displaySimulations.length,
    published: displaySimulations.filter((s) => s.status === 'published').length,
    drafts: displaySimulations.filter((s) => s.status === 'draft').length,
    completions: displaySimulations.reduce((acc, s) => acc + s.completions, 0),
  }), [displaySimulations]);

  const sidebar = <OrgSidebar />;
  const header = <OrgHeader />;

  if (loading) {
    return (
      <OrgLayout sidebar={sidebar} header={header}>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-8 w-40 bg-gray-200 rounded animate-pulse" />
              <div className="h-5 w-64 bg-gray-100 rounded mt-2 animate-pulse" />
            </div>
            <div className="h-10 w-36 bg-gray-200 rounded-lg animate-pulse" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-8 w-16 bg-gray-100 rounded mt-2" />
              </div>
            ))}
          </div>
          <div className="h-16 bg-white rounded-xl border border-gray-200 animate-pulse" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </div>
      </OrgLayout>
    );
  }

  if (error) {
    return (
      <OrgLayout sidebar={sidebar} header={header}>
        <div className="flex flex-col items-center justify-center py-24">
          <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mb-4">
            <Search className="w-8 h-8 text-red-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Failed to load simulations</h3>
          <p className="text-gray-500 mb-4">{error.message}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </OrgLayout>
    );
  }

  return (
    <OrgLayout sidebar={sidebar} header={header}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Simulations</h1>
            <p className="text-gray-600 mt-1">
              Create and manage simulations for your clients
            </p>
          </div>
          <Link
            to="/org/simulations/new"
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Simulation
          </Link>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Simulations</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Published</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.published}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Drafts</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.drafts}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Completions</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.completions}</p>
          </div>
        </div>

        <FilterBar
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          status={status}
          setStatus={setStatus}
          view={view}
          setView={setView}
        />

        {view === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredSimulations.map((simulation) => (
              <SimulationCard
                key={simulation.id}
                simulation={simulation}
                onDelete={handleDelete}
                onArchive={handleArchive}
                onPublish={handlePublish}
                onDuplicate={handleDuplicate}
                onCopyAccessLink={handleCopyAccessLink}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            {filteredSimulations.map((simulation) => (
              <SimulationRow
                key={simulation.id}
                simulation={simulation}
              />
            ))}
          </div>
        )}

        {filteredSimulations.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No simulations found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <Link
              to="/org/simulations/new"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Create your first simulation
            </Link>
          </div>
        )}

        {filteredSimulations.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {filteredSimulations.length} of {displaySimulations.length} simulations
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">Page {currentPage} of 1</span>
              <button
                disabled={true}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </OrgLayout>
  );
}
