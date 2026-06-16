// Organization Types
export interface Organization {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string;
  description?: string;
  website?: string;
  plan: 'free' | 'pro' | 'enterprise';
  settings: OrganizationSettings;
  branding?: OrganizationBranding;
  currentUserRole?: OrganizationRole;
  createdAt: string;
  updatedAt: string;
}

export interface OrganizationSettings {
  allowClientInvites: boolean;
  requireApproval: boolean;
  defaultSimulationAccess: 'immediate' | 'scheduled';
  emailNotifications: boolean;
  weeklyReports: boolean;
}

export interface OrganizationBranding {
  primaryColor: string;
  secondaryColor: string;
  logoUrl?: string;
  faviconUrl?: string;
  customDomain?: string;
}

export interface OrganizationMember {
  id: string;
  organizationId: string;
  userId: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: OrganizationRole;
  invitedAt: string;
  joinedAt?: string;
  lastActiveAt?: string;
}

export type OrganizationRole = 'owner' | 'admin' | 'editor' | 'viewer';

export const ROLE_PERMISSIONS: Record<OrganizationRole, string[]> = {
  owner: ['*'],
  admin: ['read:*', 'write:*', 'delete:clients', 'manage:team'],
  editor: ['read:*', 'write:simulations', 'write:clients', 'invite:clients'],
  viewer: ['read:dashboard', 'read:simulations', 'read:clients', 'read:analytics'],
};

// Simulation Types
export interface OrganizationSimulation {
  id: string;
  organizationId: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  category: SimulationCategory;
  templateId?: string;
  config: SimulationConfig;
  status: SimulationStatus;
  targetRoles: OrganizationRole[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration: number;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  metrics: SimulationMetrics;
}

export type SimulationCategory = 
  | 'project-management'
  | 'crisis-management'
  | 'team-building'
  | 'strategic-planning'
  | 'stakeholder-management'
  | 'product-launch'
  | 'custom';

export type SimulationStatus = 'draft' | 'published' | 'archived';

export interface SimulationConfig {
  phases: SimulationPhase[];
  stakeholders: SimulationStakeholder[];
  metrics: SimulationMetricConfig[];
  timeLimit?: number;
  passingScore?: number;
  branding?: SimulationBrandingConfig;
  environment?: SimulationEnvironmentConfig;
  collaboration?: SimulationCollaborationConfig;
}

export interface SimulationPhase {
  id: string;
  name: string;
  description: string;
  order: number;
  scenarios: SimulationScenario[];
  requiredArtifacts: string[];
  unlockConditions: UnlockCondition[];
}

export interface SimulationScenario {
  id: string;
  title: string;
  description: string;
  type: 'decision' | 'event' | 'task';
  prompt?: string;
  timeLimit?: number;
  points?: number;
  choices?: SimulationChoice[];
  outcomes?: SimulationOutcome[];
}

export interface SimulationChoice {
  id: string;
  label: string;
  description: string;
  risk: number;
  timeCost: number;
  stakeholderImpact: Record<string, number>;
  metricImpact: Record<string, number>;
}

export interface SimulationOutcome {
  id: string;
  condition: string;
  result: string;
  scoreImpact: number;
}

export interface SimulationStakeholder {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
  initialTrust: number;
  initialInfluence: number;
  description: string;
}

export interface SimulationMetricConfig {
  id: string;
  name: string;
  key: string;
  initialValue: number;
  targetValue: number;
  unit: string;
  minThreshold: number;
  maxThreshold: number;
}

export interface UnlockCondition {
  type: 'phase_complete' | 'metric_threshold' | 'stakeholder_trust' | 'time_elapsed';
  targetId?: string;
  threshold?: number;
}

export interface SimulationBrandingConfig {
  companyName: string;
  primaryColor: string;
  accentColor: string;
  logoUrl?: string;
  coverImageUrl?: string;
  tone: 'professional' | 'startup' | 'enterprise' | 'playful';
}

export interface SimulationEnvironmentConfig {
  workspaceMode: 'solo' | 'team';
  allowTeamChat: boolean;
  allowArtifacts: boolean;
  allowPeerReview: boolean;
  defaultQuestionTimeLimit: number;
  totalTimeLimit: number;
}

export interface SimulationCollaboratorConfig {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'reviewer';
}

export interface SimulationCollaborationConfig {
  collaborators: SimulationCollaboratorConfig[];
  instructions: string;
}

export interface SimulationMetrics {
  totalAssignments: number;
  activeAssignments: number;
  completedCount: number;
  averageScore: number;
  averageCompletionTime: number;
}

// Client Types
export interface OrganizationClient {
  id: string;
  organizationId: string;
  userId?: string;
  email: string;
  fullName?: string;
  avatarUrl?: string;
  status: ClientStatus;
  metadata: ClientMetadata;
  invitedAt: string;
  joinedAt?: string;
  lastActiveAt?: string;
  assignedSimulations: number;
  completedSimulations: number;
  averageScore: number;
}

export type ClientStatus = 'invited' | 'active' | 'inactive';

export interface ClientMetadata {
  department?: string;
  role?: string;
  manager?: string;
  notes?: string;
  tags: string[];
}

export interface ClientSimulationAssignment {
  id: string;
  clientId: string;
  simulationId: string;
  assignedBy: string;
  assignedAt: string;
  dueDate?: string;
  instructions?: string;
  status: AssignmentStatus;
  startedAt?: string;
  completedAt?: string;
  score?: number;
  feedback?: string;
  progress: number;
  currentPhase: number;
  timeSpent: number;
}

export type AssignmentStatus = 'assigned' | 'in_progress' | 'completed' | 'overdue';

// Analytics Types
export interface OrganizationAnalytics {
  overview: AnalyticsOverview;
  simulations: SimulationAnalytics[];
  clients: ClientAnalytics[];
  trends: AnalyticsTrend[];
}

export interface AnalyticsOverview {
  totalClients: number;
  activeClients: number;
  totalSimulations: number;
  publishedSimulations: number;
  totalAssignments: number;
  activeAssignments: number;
  completedAssignments: number;
  completionRate: number;
  averageScore: number;
  averageCompletionTime: number;
}

export interface SimulationAnalytics {
  simulationId: string;
  title: string;
  assignments: number;
  completions: number;
  completionRate: number;
  averageScore: number;
  averageTime: number;
  trend: 'up' | 'down' | 'stable';
}

export interface ClientAnalytics {
  clientId: string;
  fullName: string;
  email: string;
  simulationsAssigned: number;
  simulationsCompleted: number;
  completionRate: number;
  averageScore: number;
  totalTimeSpent: number;
  lastActive: string;
}

export interface AnalyticsTrend {
  date: string;
  newAssignments: number;
  completions: number;
  activeUsers: number;
  averageScore: number;
}

// Activity Types
export interface OrganizationActivity {
  id: string;
  organizationId: string;
  actorId: string;
  actorName: string;
  actorAvatarUrl?: string;
  action: ActivityAction;
  targetType: ActivityTargetType;
  targetId: string;
  targetName: string;
  metadata: Record<string, unknown>;
  createdAt: string;
}

export type ActivityAction = 
  | 'created'
  | 'updated'
  | 'deleted'
  | 'published'
  | 'archived'
  | 'invited'
  | 'assigned'
  | 'completed'
  | 'joined'
  | 'commented'
  | 'exported';

export type ActivityTargetType = 
  | 'simulation'
  | 'client'
  | 'assignment'
  | 'team_member'
  | 'organization'
  | 'template';

// Filter Types
export interface SimulationFilter {
  search?: string;
  status?: SimulationStatus | 'all';
  category?: SimulationCategory | 'all';
  dateFrom?: string;
  dateTo?: string;
  sortBy: 'createdAt' | 'updatedAt' | 'title' | 'metrics';
  sortOrder: 'asc' | 'desc';
}

export interface ClientFilter {
  search?: string;
  status?: ClientStatus | 'all';
  tags?: string[];
  dateFrom?: string;
  dateTo?: string;
  sortBy: 'createdAt' | 'updatedAt' | 'name' | 'progress';
  sortOrder: 'asc' | 'desc';
}

// Template Types
export interface SimulationTemplate {
  id: string;
  name: string;
  description: string;
  thumbnailUrl?: string;
  category: SimulationCategory;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedDuration: number;
  config: SimulationConfig;
  isSystemTemplate: boolean;
  organizationId?: string;
  createdAt: string;
}
