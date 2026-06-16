import React, { useState } from 'react';
import { OrgLayout } from '../../components/organization/layout/OrgLayout';
import { OrgSidebar } from '../../components/organization/layout/OrgSidebar';
import { OrgHeader } from '../../components/organization/layout/OrgHeader';
import { Link, useParams } from 'react-router-dom';
import {
  Search,
  Filter,
  Plus,
  Mail,
  MoreHorizontal,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
  UserCheck,
  Gamepad2,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  Download,
  Upload,
} from 'lucide-react';
import { cn } from '../../lib/organization/utils';
import { useClients, useOrganization } from '../../hooks/organization';
import type { OrganizationClient } from '../../lib/organization/types';

// Mock data
const mockClients = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@example.com',
    status: 'active',
    joinedAt: '2026-04-15',
    lastActiveAt: '2026-05-04',
    simulationsAssigned: 4,
    simulationsCompleted: 3,
    averageScore: 92,
    department: 'Product',
    role: 'Product Manager',
    tags: ['high-performer', 'senior'],
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus.johnson@example.com',
    status: 'active',
    joinedAt: '2026-04-20',
    lastActiveAt: '2026-05-03',
    simulationsAssigned: 3,
    simulationsCompleted: 2,
    averageScore: 87,
    department: 'Engineering',
    role: 'Engineering Manager',
    tags: ['new'],
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    status: 'invited',
    joinedAt: null,
    lastActiveAt: null,
    simulationsAssigned: 2,
    simulationsCompleted: 0,
    averageScore: 0,
    department: 'Marketing',
    role: 'Marketing Lead',
    tags: [],
  },
  {
    id: '4',
    name: 'David Park',
    email: 'david.park@example.com',
    status: 'inactive',
    joinedAt: '2026-03-10',
    lastActiveAt: '2026-04-01',
    simulationsAssigned: 5,
    simulationsCompleted: 4,
    averageScore: 78,
    department: 'Sales',
    role: 'Sales Director',
    tags: ['on-leave'],
  },
];

const statusOptions = [
  { value: 'all', label: 'All Statuses' },
  { value: 'active', label: 'Active' },
  { value: 'invited', label: 'Invited' },
  { value: 'inactive', label: 'Inactive' },
];

// Status Badge
function StatusBadge({ status }: { status: string }) {
  const styles = {
    active: 'bg-green-100 text-green-700',
    invited: 'bg-yellow-100 text-yellow-700',
    inactive: 'bg-gray-100 text-gray-700',
  };

  const icons = {
    active: <CheckCircle className="w-3 h-3" />,
    invited: <Mail className="w-3 h-3" />,
    inactive: <XCircle className="w-3 h-3" />,
  };

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
      styles[status as keyof typeof styles]
    )}>
      {icons[status as keyof typeof icons]}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}

interface ClientDisplay {
  id: string;
  name: string;
  email: string;
  status: string;
  joinedAt?: string | null;
  lastActiveAt?: string | null;
  simulationsAssigned: number;
  simulationsCompleted: number;
  averageScore: number;
  department: string;
  role: string;
  tags: string[];
}

// Client Card
function ClientCard({ client }: { client: ClientDisplay }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold">
            {client.name.charAt(0)}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{client.name}</h3>
            <p className="text-sm text-gray-500">{client.email}</p>
          </div>
        </div>
        <StatusBadge status={client.status} />
      </div>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-xs text-gray-500">Department</p>
          <p className="text-sm font-medium text-gray-900">{client.department}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Role</p>
          <p className="text-sm font-medium text-gray-900">{client.role}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Simulations</p>
          <p className="text-sm font-medium text-gray-900">
            {client.simulationsCompleted}/{client.simulationsAssigned} completed
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500">Avg Score</p>
          <p className="text-sm font-medium text-gray-900">
            {client.averageScore > 0 ? `${client.averageScore}%` : '—'}
          </p>
        </div>
      </div>

      {client.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {client.tags.map((tag) => (
            <span
              key={tag}
              className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <Link
          to={`/org/clients/${client.id}`}
          className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
        >
          View Details
          <ArrowRight className="w-4 h-4" />
        </Link>
        <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

// Invite Dialog
function InviteDialog({ isOpen, onClose, onInvite }: { isOpen: boolean; onClose: () => void; onInvite: (emails: string[], message?: string) => Promise<void> }) {
  const [emails, setEmails] = useState('');
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    try {
      await onInvite(
        emails.split(/[,\n]/).map((email) => email.trim()).filter(Boolean),
        message.trim() || undefined
      );
      setEmails('');
      setMessage('');
      onClose();
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Invite Clients</h2>
        <p className="text-gray-600 mb-6">Send invitations to new clients via email</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Addresses
            </label>
            <textarea
              value={emails}
              onChange={(e) => setEmails(e.target.value)}
              placeholder="Enter email addresses separated by commas..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              You can also upload a CSV file
            </p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Personal Message (Optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Add a personal message to your invitation..."
              rows={3}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={sending || !emails.trim()}
              className={cn(
                'px-4 py-2 font-medium rounded-lg transition-colors flex items-center gap-2',
                sending || !emails.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              {sending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Invitations
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function OrgClientsPage() {
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const { organization } = useOrganization();
  const { clients, inviteClients } = useClients(organization?.id ?? '');

  const displayClients = clients.map((client: OrganizationClient) => ({
    id: client.id,
    name: client.fullName || client.email,
    email: client.email,
    status: client.status,
    joinedAt: client.joinedAt,
    lastActiveAt: client.lastActiveAt,
    simulationsAssigned: client.assignedSimulations,
    simulationsCompleted: client.completedSimulations,
    averageScore: Math.round(client.averageScore),
    department: client.metadata?.department || 'Unassigned',
    role: client.metadata?.role || 'Client',
    tags: client.metadata?.tags || [],
  }));

  const filteredClients = displayClients.filter((client) => {
    const matchesSearch = client.name.toLowerCase().includes(search.toLowerCase()) ||
                         client.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = status === 'all' || client.status === status;
    return matchesSearch && matchesStatus;
  });

  const toggleSelectAll = () => {
    if (selectedClients.length === filteredClients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(filteredClients.map((c) => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    if (selectedClients.includes(id)) {
      setSelectedClients(selectedClients.filter((c) => c !== id));
    } else {
      setSelectedClients([...selectedClients, id]);
    }
  };

  const sidebar = <OrgSidebar />;
  const header = <OrgHeader />;

  return (
    <OrgLayout sidebar={sidebar} header={header}>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Clients</h1>
            <p className="text-gray-600 mt-1">
              Manage your clients and their simulation assignments
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => {}}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
            <button
              onClick={() => setShowInviteDialog(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Invite Clients
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Clients</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{displayClients.length}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600 mt-1">
              {displayClients.filter((c) => c.status === 'active').length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Pending Invites</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">
              {displayClients.filter((c) => c.status === 'invited').length}
            </p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Avg Completion Rate</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">
              {displayClients.length
                ? Math.round((displayClients.reduce((sum, client) => sum + client.simulationsCompleted, 0) / Math.max(1, displayClients.reduce((sum, client) => sum + client.simulationsAssigned, 0))) * 100)
                : 0}%
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search clients..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
                />
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="px-3 py-2 rounded-lg border border-gray-200 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              >
                {statusOptions.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
            {selectedClients.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{selectedClients.length} selected</span>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg">
                  <Gamepad2 className="w-4 h-4" />
                  Assign Simulation
                </button>
                <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Clients Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <ClientCard key={client.id} client={client} />
          ))}
        </div>

        {filteredClients.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Search className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No clients found</h3>
            <p className="text-gray-500 mb-4">Try adjusting your search or filters</p>
            <button
              onClick={() => setShowInviteDialog(true)}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              Invite your first client
            </button>
          </div>
        )}

        {/* Pagination */}
        {filteredClients.length > 0 && (
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              Showing {filteredClients.length} of {displayClients.length} clients
            </p>
            <div className="flex items-center gap-2">
              <button
                disabled={true}
                className="p-2 rounded-lg border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-sm text-gray-600">Page 1 of 1</span>
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

      <InviteDialog
        isOpen={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        onInvite={async (emails, message) => {
          await inviteClients(emails, undefined, message);
        }}
      />
    </OrgLayout>
  );
}
