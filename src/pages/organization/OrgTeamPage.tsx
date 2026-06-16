import React, { useState } from 'react';
import { OrgLayout } from '../../components/organization/layout/OrgLayout';
import { OrgSidebar } from '../../components/organization/layout/OrgSidebar';
import { OrgHeader } from '../../components/organization/layout/OrgHeader';
import {
  Users,
  Plus,
  Mail,
  Shield,
  MoreHorizontal,
  Crown,
  Edit2,
  Trash2,
  AlertCircle,
  Loader2,
  X,
  Check,
} from 'lucide-react';
import { cn } from '../../lib/organization/utils';
import { useOrganization, useTeamMembers } from '../../hooks/organization';
import { useAuth } from '../../hooks/useAuth';
import type { OrganizationRole } from '../../lib/organization/types';

const roleConfig = {
  owner: { label: 'Owner', color: 'bg-purple-100 text-purple-700', icon: Crown },
  admin: { label: 'Admin', color: 'bg-blue-100 text-blue-700', icon: Shield },
  editor: { label: 'Editor', color: 'bg-green-100 text-green-700', icon: Edit2 },
  viewer: { label: 'Viewer', color: 'bg-gray-100 text-gray-700', icon: Users },
};

function RoleBadge({ role }: { role: OrganizationRole }) {
  const config = roleConfig[role];
  const Icon = config.icon;

  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium',
      config.color
    )}>
      <Icon className="w-3 h-3" />
      {config.label}
    </span>
  );
}

function InviteDialog({
  isOpen,
  onClose,
  onInvite,
  inviting,
  error,
}: {
  isOpen: boolean;
  onClose: () => void;
  onInvite: (_email: string, _role: string) => Promise<void>;
  inviting: boolean;
  error: string | null;
}) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<OrganizationRole>('editor');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onInvite(email, role);
    setEmail('');
    setRole('editor');
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Invite Team Member</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-6">Add a new member to your organization</p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="colleague@company.com"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as OrganizationRole)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="admin">Admin - Full access</option>
              <option value="editor">Editor - Create & edit content</option>
              <option value="viewer">Viewer - View only</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={inviting || !email.trim()}
              className={cn(
                'px-4 py-2 font-medium rounded-lg transition-colors flex items-center gap-2',
                inviting || !email.trim()
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              {inviting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Mail className="w-4 h-4" />
                  Send Invite
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ChangeRoleDialog({
  isOpen,
  onClose,
  member,
  onUpdateRole,
  updating,
  error,
}: {
  isOpen: boolean;
  onClose: () => void;
  member: { id: string; name: string; email: string; role: OrganizationRole } | null;
  onUpdateRole: (_memberId: string, _role: OrganizationRole) => Promise<void>;
  updating: boolean;
  error: string | null;
}) {
  const [role, setRole] = useState<OrganizationRole>('editor');

  if (!isOpen || !member) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdateRole(member.id, role);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xl font-semibold text-gray-900">Change Role</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Update role for <span className="font-medium text-gray-900">{member.name}</span> ({member.email})
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              New Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as OrganizationRole)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none"
            >
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="viewer">Viewer</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={updating || role === member.role}
              className={cn(
                'px-4 py-2 font-medium rounded-lg transition-colors flex items-center gap-2',
                updating || role === member.role
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              )}
            >
              {updating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4" />
                  Update Role
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function RemoveMemberDialog({
  isOpen,
  onClose,
  member,
  onRemove,
  removing,
  error,
}: {
  isOpen: boolean;
  onClose: () => void;
  member: { id: string; name: string; email: string } | null;
  onRemove: (_memberId: string) => Promise<void>;
  removing: boolean;
  error: string | null;
}) {
  if (!isOpen || !member) return null;

  const handleRemove = async () => {
    await onRemove(member.id);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Remove Member</h2>
            <p className="text-sm text-gray-500">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-gray-600 mb-4">
          Are you sure you want to remove <span className="font-medium text-gray-900">{member.name}</span> ({member.email}) from the organization?
        </p>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 font-medium hover:bg-gray-100 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleRemove}
            disabled={removing}
            className={cn(
              'px-4 py-2 font-medium rounded-lg transition-colors flex items-center gap-2',
              removing
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            )}
          >
            {removing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Removing...
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                Remove Member
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function MemberSkeleton() {
  return (
    <div className="flex items-center justify-between p-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-full bg-gray-200" />
        <div>
          <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
          <div className="h-3 w-48 bg-gray-200 rounded" />
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="h-6 w-20 bg-gray-200 rounded-full" />
        <div className="w-9 h-9 bg-gray-200 rounded-lg" />
      </div>
    </div>
  );
}

function ActionMenu({
  isOpen,
  onClose,
  onEditRole,
  onRemove,
  isOwner,
}: {
  isOpen: boolean;
  onClose: () => void;
  onEditRole: () => void;
  onRemove: () => void;
  isOwner: boolean;
}) {
  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-lg border border-gray-200 shadow-lg z-50 py-1">
        <button
          onClick={() => {
            onEditRole();
            onClose();
          }}
          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
        >
          <Edit2 className="w-4 h-4" />
          Change Role
        </button>
        {!isOwner && (
          <button
            onClick={() => {
              onRemove();
              onClose();
            }}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
            Remove Member
          </button>
        )}
      </div>
    </>
  );
}

export default function OrgTeamPage() {
  const { organization, loading: orgLoading, error: orgError } = useOrganization();
  useAuth();
  const {
    members,
    loading: membersLoading,
    error: membersError,
    inviteMember,
    updateMemberRole,
    removeMember,
  } = useTeamMembers(organization?.id ?? '');

  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [inviteError, setInviteError] = useState<string | null>(null);
  const [inviting, setInviting] = useState(false);

  const [showChangeRoleDialog, setShowChangeRoleDialog] = useState(false);
  const [selectedMemberForRole, setSelectedMemberForRole] = useState<{
    id: string;
    name: string;
    email: string;
    role: OrganizationRole;
  } | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const [showRemoveDialog, setShowRemoveDialog] = useState(false);
  const [selectedMemberForRemove, setSelectedMemberForRemove] = useState<{
    id: string;
    name: string;
    email: string;
  } | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [removing, setRemoving] = useState(false);

  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const handleInvite = async (email: string, role: string) => {
    setInviteError(null);
    setInviting(true);
    try {
      await inviteMember(email, role);
      setShowInviteDialog(false);
    } catch (err) {
      setInviteError(err instanceof Error ? err.message : 'Failed to send invite');
    } finally {
      setInviting(false);
    }
  };

  const handleUpdateRole = async (memberId: string, role: OrganizationRole) => {
    setUpdateError(null);
    setUpdating(true);
    try {
      await updateMemberRole(memberId, role);
      setShowChangeRoleDialog(false);
      setSelectedMemberForRole(null);
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Failed to update role');
    } finally {
      setUpdating(false);
    }
  };

  const handleRemove = async (memberId: string) => {
    setRemoveError(null);
    setRemoving(true);
    try {
      await removeMember(memberId);
      setShowRemoveDialog(false);
      setSelectedMemberForRemove(null);
    } catch (err) {
      setRemoveError(err instanceof Error ? err.message : 'Failed to remove member');
    } finally {
      setRemoving(false);
    }
  };

  const stats = {
    total: members.length,
    admins: members.filter((m) => ['owner', 'admin'].includes(m.role)).length,
    editors: members.filter((m) => m.role === 'editor').length,
    viewers: members.filter((m) => m.role === 'viewer').length,
  };

  if (orgLoading || membersLoading) {
    return (
      <OrgLayout sidebar={<OrgSidebar />} header={<OrgHeader />}>
        <div className="space-y-6">
          <div className="animate-pulse">
            <div className="h-8 w-32 bg-gray-200 rounded mb-2" />
            <div className="h-4 w-96 bg-gray-200 rounded" />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 animate-pulse">
                <div className="h-4 w-24 bg-gray-200 rounded mb-2" />
                <div className="h-8 w-16 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
          <div className="bg-white rounded-xl border border-gray-200">
            <div className="p-6 border-b border-gray-100">
              <div className="h-5 w-40 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-56 bg-gray-200 rounded" />
            </div>
            {[...Array(3)].map((_, i) => (
              <MemberSkeleton key={i} />
            ))}
          </div>
        </div>
      </OrgLayout>
    );
  }

  if (orgError || membersError) {
    return (
      <OrgLayout sidebar={<OrgSidebar />} header={<OrgHeader />}>
        <div className="flex items-center justify-center min-h-96">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Failed to load team data</h2>
            <p className="text-gray-600 mb-4">{orgError?.message || membersError?.message}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        </div>
      </OrgLayout>
    );
  }

  const sidebar = <OrgSidebar />;
  const header = <OrgHeader />;

  return (
    <OrgLayout sidebar={sidebar} header={header}>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Team</h1>
            <p className="text-gray-600 mt-1">
              Manage your team members and their permissions
            </p>
          </div>
          <button
            onClick={() => {
              setInviteError(null);
              setShowInviteDialog(true);
            }}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Invite Member
          </button>
        </div>

        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Total Members</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Admins</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.admins}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Editors</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.editors}</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <p className="text-sm text-gray-500">Viewers</p>
            <p className="text-2xl font-bold text-gray-600 mt-1">{stats.viewers}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Team Members</h2>
            <p className="text-sm text-gray-500">Manage roles and permissions</p>
          </div>
          {members.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No team members yet</h3>
              <p className="text-gray-500 mb-4">
                Invite your first team member to get started
              </p>
              <button
                onClick={() => setShowInviteDialog(true)}
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Invite Member
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {members.map((member) => {
                const displayName = member.fullName || member.email.split('@')[0];
                const initials = displayName
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .toUpperCase()
                  .slice(0, 2);
                const isOwner = member.role === 'owner';

                return (
                  <div key={member.id} className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors relative">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold text-sm">
                        {initials}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{displayName}</h3>
                          {isOwner && (
                            <Crown className="w-4 h-4 text-purple-600" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500">{member.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <RoleBadge role={member.role} />
                        {member.joinedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Joined {new Date(member.joinedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {!isOwner && (
                        <div className="relative">
                          <button
                            onClick={() => setOpenMenuId(openMenuId === member.id ? null : member.id)}
                            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                          >
                            <MoreHorizontal className="w-5 h-5" />
                          </button>
                          <ActionMenu
                            isOpen={openMenuId === member.id}
                            onClose={() => setOpenMenuId(null)}
                            onEditRole={() => {
                              setSelectedMemberForRole({
                                id: member.id,
                                name: displayName,
                                email: member.email,
                                role: member.role,
                              });
                              setShowChangeRoleDialog(true);
                            }}
                            onRemove={() => {
                              setSelectedMemberForRemove({
                                id: member.id,
                                name: displayName,
                                email: member.email,
                              });
                              setShowRemoveDialog(true);
                            }}
                            isOwner={false}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-semibold text-gray-900">Role Permissions</h2>
            <p className="text-sm text-gray-500">Understand what each role can do</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">Owner</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Full organization access</li>
                  <li>• Manage billing</li>
                  <li>• Delete organization</li>
                  <li>• All admin permissions</li>
                </ul>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">Admin</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Manage team members</li>
                  <li>• Manage clients</li>
                  <li>• View analytics</li>
                  <li>• All editor permissions</li>
                </ul>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Edit2 className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Editor</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Create simulations</li>
                  <li>• Edit content</li>
                  <li>• Invite clients</li>
                  <li>• View dashboard</li>
                </ul>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-2 mb-3">
                  <Users className="w-5 h-5 text-gray-600" />
                  <h3 className="font-semibold text-gray-900">Viewer</h3>
                </div>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• View simulations</li>
                  <li>• View clients</li>
                  <li>• View analytics</li>
                  <li>• Cannot edit content</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <InviteDialog
        isOpen={showInviteDialog}
        onClose={() => setShowInviteDialog(false)}
        onInvite={handleInvite}
        inviting={inviting}
        error={inviteError}
      />

      <ChangeRoleDialog
        isOpen={showChangeRoleDialog}
        onClose={() => {
          setShowChangeRoleDialog(false);
          setSelectedMemberForRole(null);
          setUpdateError(null);
        }}
        member={selectedMemberForRole}
        onUpdateRole={handleUpdateRole}
        updating={updating}
        error={updateError}
      />

      <RemoveMemberDialog
        isOpen={showRemoveDialog}
        onClose={() => {
          setShowRemoveDialog(false);
          setSelectedMemberForRemove(null);
          setRemoveError(null);
        }}
        member={selectedMemberForRemove}
        onRemove={handleRemove}
        removing={removing}
        error={removeError}
      />
    </OrgLayout>
  );
}
