import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import type { 
  Organization, 
  OrganizationMember, 
  OrganizationSimulation,
  OrganizationClient,
  OrganizationAnalytics,
  OrganizationActivity,
  SimulationFilter,
  ClientFilter,
  AssignmentStatus,
  OrganizationRole,
  OrganizationBranding,
  OrganizationSettings,
  SimulationConfig,
  SimulationMetrics,
} from '../../lib/organization/types';

const defaultOrganizationSettings: OrganizationSettings = {
  allowClientInvites: true,
  requireApproval: false,
  defaultSimulationAccess: 'immediate',
  emailNotifications: true,
  weeklyReports: true,
};

const defaultSimulationMetrics: SimulationMetrics = {
  totalAssignments: 0,
  activeAssignments: 0,
  completedCount: 0,
  averageScore: 0,
  averageCompletionTime: 0,
};

function mapOrganization(row: any, role?: OrganizationRole): Organization {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    logoUrl: row.logo_url ?? row.logoUrl,
    description: row.description ?? undefined,
    website: row.website ?? undefined,
    plan: row.plan ?? 'free',
    settings: (row.settings ?? defaultOrganizationSettings) as OrganizationSettings,
    branding: row.branding as OrganizationBranding | undefined,
    currentUserRole: role,
    createdAt: row.created_at ?? row.createdAt,
    updatedAt: row.updated_at ?? row.updatedAt,
  };
}

function mapSimulation(row: any): OrganizationSimulation {
  return {
    id: row.id,
    organizationId: row.organization_id ?? row.organizationId,
    title: row.title,
    description: row.description,
    thumbnailUrl: row.thumbnail_url ?? row.thumbnailUrl,
    category: row.category,
    templateId: row.template_id ?? row.templateId,
    config: row.config as SimulationConfig,
    status: row.status,
    targetRoles: row.target_roles ?? row.targetRoles ?? [],
    difficulty: row.difficulty ?? 'intermediate',
    duration: row.duration ?? 120,
    createdBy: row.created_by ?? row.createdBy,
    createdAt: row.created_at ?? row.createdAt,
    updatedAt: row.updated_at ?? row.updatedAt,
    publishedAt: row.published_at ?? row.publishedAt,
    metrics: (row.metrics ?? defaultSimulationMetrics) as SimulationMetrics,
  };
}

function toSimulationRow(simulation: Omit<OrganizationSimulation, 'id' | 'createdAt' | 'updatedAt'>) {
  return {
    organization_id: simulation.organizationId,
    title: simulation.title,
    description: simulation.description,
    thumbnail_url: simulation.thumbnailUrl,
    category: simulation.category,
    template_id: simulation.templateId,
    config: simulation.config,
    status: simulation.status,
    target_roles: simulation.targetRoles,
    difficulty: simulation.difficulty,
    duration: simulation.duration,
    created_by: simulation.createdBy,
    published_at: simulation.publishedAt,
    metrics: simulation.metrics,
  };
}

function toSimulationUpdateRow(updates: Partial<OrganizationSimulation>) {
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (updates.title !== undefined) row.title = updates.title;
  if (updates.description !== undefined) row.description = updates.description;
  if (updates.thumbnailUrl !== undefined) row.thumbnail_url = updates.thumbnailUrl;
  if (updates.category !== undefined) row.category = updates.category;
  if (updates.templateId !== undefined) row.template_id = updates.templateId;
  if (updates.config !== undefined) row.config = updates.config;
  if (updates.status !== undefined) row.status = updates.status;
  if (updates.targetRoles !== undefined) row.target_roles = updates.targetRoles;
  if (updates.difficulty !== undefined) row.difficulty = updates.difficulty;
  if (updates.duration !== undefined) row.duration = updates.duration;
  if (updates.publishedAt !== undefined) row.published_at = updates.publishedAt;
  if (updates.metrics !== undefined) row.metrics = updates.metrics;
  return row;
}

function mapClient(row: any): OrganizationClient {
  return {
    id: row.id,
    organizationId: row.organization_id ?? row.organizationId,
    userId: row.user_id ?? row.userId,
    email: row.email,
    fullName: row.full_name ?? row.fullName,
    avatarUrl: row.avatar_url ?? row.avatarUrl,
    status: row.status,
    metadata: row.metadata ?? { tags: [] },
    invitedAt: row.invited_at ?? row.invitedAt,
    joinedAt: row.joined_at ?? row.joinedAt,
    lastActiveAt: row.last_active_at ?? row.lastActiveAt,
    assignedSimulations: row.assigned_simulations ?? row.assignedSimulations ?? 0,
    completedSimulations: row.completed_simulations ?? row.completedSimulations ?? 0,
    averageScore: row.average_score ?? row.averageScore ?? 0,
  };
}

function toClientUpdateRow(updates: Partial<OrganizationClient>) {
  const row: Record<string, unknown> = {};
  if (updates.email !== undefined) row.email = updates.email;
  if (updates.fullName !== undefined) row.full_name = updates.fullName;
  if (updates.avatarUrl !== undefined) row.avatar_url = updates.avatarUrl;
  if (updates.status !== undefined) row.status = updates.status;
  if (updates.metadata !== undefined) row.metadata = updates.metadata;
  if (updates.assignedSimulations !== undefined) row.assigned_simulations = updates.assignedSimulations;
  if (updates.completedSimulations !== undefined) row.completed_simulations = updates.completedSimulations;
  if (updates.averageScore !== undefined) row.average_score = updates.averageScore;
  return row;
}

function mapActivity(row: any): OrganizationActivity {
  return {
    id: row.id,
    organizationId: row.organization_id ?? row.organizationId,
    actorId: row.actor_id ?? row.actorId,
    actorName: row.actor_name ?? row.actorName ?? 'A team member',
    actorAvatarUrl: row.actor_avatar_url ?? row.actorAvatarUrl,
    action: row.action,
    targetType: row.target_type ?? row.targetType,
    targetId: row.target_id ?? row.targetId,
    targetName: row.target_name ?? row.targetName,
    metadata: row.metadata ?? {},
    createdAt: row.created_at ?? row.createdAt,
  };
}

function mapMember(row: any): OrganizationMember {
  return {
    id: row.id,
    organizationId: row.organization_id ?? row.organizationId,
    userId: row.user_id ?? row.userId,
    email: row.email,
    fullName: row.full_name ?? row.fullName ?? row.email,
    avatarUrl: row.avatar_url ?? row.avatarUrl,
    role: row.role,
    invitedAt: row.invited_at ?? row.invitedAt,
    joinedAt: row.joined_at ?? row.joinedAt,
    lastActiveAt: row.last_active_at ?? row.lastActiveAt,
  };
}

// Hook to manage current organization context
export function useOrganization() {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setLoading(false);
          return;
        }

        const { data: membership, error: membershipError } = await supabase
          .from('organization_members')
          .select('organization_id, role')
          .eq('user_id', user.id)
          .order('joined_at', { ascending: false })
          .limit(1)
          .maybeSingle();

        if (membershipError) throw membershipError;

        const organizationId = membership?.organization_id ?? user.user_metadata?.organization_id;
        if (!organizationId) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('organizations')
          .select('*')
          .eq('id', organizationId)
          .single();

        if (error) throw error;
        
        setOrganization(mapOrganization(data, membership?.role as OrganizationRole | undefined));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch organization'));
      } finally {
        setLoading(false);
      }
    };

    fetchOrganization();
  }, []);

  const updateOrganization = useCallback(async (updates: Partial<Organization>) => {
    if (!organization) return;
    
    try {
      const { data, error } = await supabase
        .from('organizations')
        .update(updates)
        .eq('id', organization.id)
        .select()
        .single();

      if (error) throw error;
      setOrganization(mapOrganization(data, organization.currentUserRole));
    } catch (err) {
      throw err;
    }
  }, [organization]);

  return { organization, loading, error, updateOrganization };
}

// Hook to fetch organization's simulations
export function useSimulations(organizationId: string, filter?: SimulationFilter) {
  const [simulations, setSimulations] = useState<OrganizationSimulation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchSimulations = async () => {
      try {
        let query = supabase
          .from('organization_simulations')
          .select('*')
          .eq('organization_id', organizationId);

        if (filter?.status && filter.status !== 'all') {
          query = query.eq('status', filter.status);
        }

        if (filter?.category && filter.category !== 'all') {
          query = query.eq('category', filter.category);
        }

        if (filter?.search) {
          query = query.ilike('title', `%${filter.search}%`);
        }

        const { data, error } = await query.order(
          filter?.sortBy || 'created_at', 
          { ascending: filter?.sortOrder === 'asc' }
        );

        if (error) throw error;
        setSimulations((data ?? []).map(mapSimulation));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch simulations'));
      } finally {
        setLoading(false);
      }
    };

    fetchSimulations();

    // Subscribe to real-time updates
    const subscription = supabase
      .channel(`simulations-${organizationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'organization_simulations',
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setSimulations((prev) => [mapSimulation(payload.new), ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setSimulations((prev) =>
              prev.map((sim) =>
                sim.id === payload.new.id ? mapSimulation(payload.new) : sim
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setSimulations((prev) =>
              prev.filter((sim) => sim.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [organizationId, filter]);

  const createSimulation = useCallback(async (simulation: Omit<OrganizationSimulation, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const { data, error } = await supabase
        .from('organization_simulations')
        .insert(toSimulationRow(simulation))
        .select()
        .single();

      if (error) throw error;
      return mapSimulation(data);
    } catch (err) {
      throw err;
    }
  }, []);

  const updateSimulation = useCallback(async (id: string, updates: Partial<OrganizationSimulation>) => {
    try {
      const { data, error } = await supabase
        .from('organization_simulations')
        .update(toSimulationUpdateRow(updates))
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapSimulation(data);
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteSimulation = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('organization_simulations')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      throw err;
    }
  }, []);

  const publishSimulation = useCallback(async (id: string) => {
    return updateSimulation(id, { 
      status: 'published', 
      publishedAt: new Date().toISOString() 
    });
  }, [updateSimulation]);

  return {
    simulations,
    loading,
    error,
    createSimulation,
    updateSimulation,
    deleteSimulation,
    publishSimulation,
  };
}

// Hook to fetch organization's clients
export function useClients(organizationId: string, filter?: ClientFilter) {
  const [clients, setClients] = useState<OrganizationClient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchClients = async () => {
      try {
        let query = supabase
          .from('organization_clients')
          .select('*')
          .eq('organization_id', organizationId);

        if (filter?.status && filter.status !== 'all') {
          query = query.eq('status', filter.status);
        }

        if (filter?.search) {
          query = query.or(`full_name.ilike.%${filter.search}%,email.ilike.%${filter.search}%`);
        }

        const { data, error } = await query.order(
          filter?.sortBy === 'name' ? 'full_name' : 'created_at',
          { ascending: filter?.sortOrder === 'asc' }
        );

        if (error) throw error;
        setClients((data ?? []).map(mapClient));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch clients'));
      } finally {
        setLoading(false);
      }
    };

    fetchClients();

    const subscription = supabase
      .channel(`clients-${organizationId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'organization_clients',
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setClients((prev) => [mapClient(payload.new), ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setClients((prev) =>
              prev.map((client) =>
                client.id === payload.new.id ? mapClient(payload.new) : client
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setClients((prev) =>
              prev.filter((client) => client.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [organizationId, filter]);

  const inviteClients = useCallback(async (emails: string[], simulationIds?: string[], message?: string) => {
    try {
      const { data, error } = await supabase.rpc('invite_clients', {
        p_organization_id: organizationId,
        p_emails: emails,
        p_simulation_ids: simulationIds || [],
        p_message: message,
      });

      if (error) throw error;
      return data;
    } catch (err) {
      throw err;
    }
  }, [organizationId]);

  const updateClient = useCallback(async (id: string, updates: Partial<OrganizationClient>) => {
    try {
      const { data, error } = await supabase
        .from('organization_clients')
        .update(toClientUpdateRow(updates))
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return mapClient(data);
    } catch (err) {
      throw err;
    }
  }, []);

  const deleteClient = useCallback(async (id: string) => {
    try {
      const { error } = await supabase
        .from('organization_clients')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (err) {
      throw err;
    }
  }, []);

  const assignSimulations = useCallback(async (clientId: string, simulationIds: string[], dueDate?: string, instructions?: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const assignments = simulationIds.map((simId) => ({
        client_id: clientId,
        simulation_id: simId,
        assigned_by: user?.id,
        due_date: dueDate,
        instructions,
        status: 'assigned' as AssignmentStatus,
      }));

      const { data, error } = await supabase
        .from('client_simulations')
        .insert(assignments)
        .select();

      if (error) throw error;
      return data;
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    clients,
    loading,
    error,
    inviteClients,
    updateClient,
    deleteClient,
    assignSimulations,
  };
}

// Hook to fetch organization analytics
export function useAnalytics(organizationId: string, dateRange?: { from: string; to: string }) {
  const [analytics, setAnalytics] = useState<OrganizationAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchAnalytics = async () => {
      try {
        const { data, error } = await supabase.rpc('get_organization_analytics', {
          p_organization_id: organizationId,
          p_date_from: dateRange?.from,
          p_date_to: dateRange?.to,
        });

        if (error) throw error;
        setAnalytics(data as OrganizationAnalytics);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch analytics'));
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, [organizationId, dateRange]);

  const exportAnalytics = useCallback(async (format: 'csv' | 'pdf' | 'excel') => {
    try {
      const { data, error } = await supabase.rpc('export_analytics', {
        p_organization_id: organizationId,
        p_format: format,
        p_date_from: dateRange?.from,
        p_date_to: dateRange?.to,
      });

      if (error) throw error;
      return data;
    } catch (err) {
      throw err;
    }
  }, [organizationId, dateRange]);

  return { analytics, loading, error, exportAnalytics };
}

// Hook to fetch organization activity feed
export function useActivityFeed(organizationId: string, limit: number = 50) {
  const [activities, setActivities] = useState<OrganizationActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchActivities = async () => {
      try {
        const { data, error } = await supabase
          .from('organization_activity')
          .select('*')
          .eq('organization_id', organizationId)
          .order('created_at', { ascending: false })
          .limit(limit);

        if (error) throw error;
        setActivities((data ?? []).map(mapActivity));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch activities'));
      } finally {
        setLoading(false);
      }
    };

    fetchActivities();

    const subscription = supabase
      .channel(`activity-${organizationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'organization_activity',
          filter: `organization_id=eq.${organizationId}`,
        },
        (payload) => {
          setActivities((prev) => [mapActivity(payload.new), ...prev].slice(0, limit));
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [organizationId, limit]);

  return { activities, loading, error };
}

// Hook to manage organization members
export function useTeamMembers(organizationId: string) {
  const [members, setMembers] = useState<OrganizationMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    const fetchMembers = async () => {
      try {
        const { data, error } = await supabase
          .from('organization_members')
          .select('*')
          .eq('organization_id', organizationId);

        if (error) throw error;
        setMembers((data ?? []).map(mapMember));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to fetch members'));
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [organizationId]);

  const inviteMember = useCallback(async (email: string, role: string) => {
    try {
      const { data, error } = await supabase.rpc('invite_team_member', {
        p_organization_id: organizationId,
        p_email: email,
        p_role: role,
      });

      if (error) throw error;
      return data;
    } catch (err) {
      throw err;
    }
  }, [organizationId]);

  const updateMemberRole = useCallback(async (memberId: string, role: string) => {
    try {
      const { data, error } = await supabase
        .from('organization_members')
        .update({ role })
        .eq('id', memberId)
        .select()
        .single();

      if (error) throw error;
      setMembers((prev) =>
        prev.map((m) => (m.id === memberId ? { ...m, role: role as OrganizationRole } : m))
      );
      return data;
    } catch (err) {
      throw err;
    }
  }, []);

  const removeMember = useCallback(async (memberId: string) => {
    try {
      const { error } = await supabase
        .from('organization_members')
        .delete()
        .eq('id', memberId);

      if (error) throw error;
      setMembers((prev) => prev.filter((m) => m.id !== memberId));
    } catch (err) {
      throw err;
    }
  }, []);

  return {
    members,
    loading,
    error,
    inviteMember,
    updateMemberRole,
    removeMember,
  };
}
