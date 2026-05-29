import type { SimulationTemplate } from '../config/simulationTemplates';
import { supabase } from './supabase';

const STORAGE_KEY = 'turnve_company_simulations';

export type CompanySimulation = {
  id: string;
  ownerId: string;
  title: string;
  companyName: string;
  industry: string;
  description: string;
  budget: number;
  durationWeeks: number;
  teamSize: number;
  status: 'draft' | 'live';
  isPublic: boolean;
  livePath: string;
  liveSlug: string;
  createdAt: string;
  updatedAt: string;
  template: SimulationTemplate;
};

type CompanySimulationRow = {
  id: string;
  owner_id: string;
  title: string;
  company_name: string;
  industry: string;
  description: string;
  budget: number;
  duration_weeks: number;
  team_size: number;
  status: 'draft' | 'live';
  is_public: boolean;
  live_slug: string;
  template: SimulationTemplate;
  created_at: string;
  updated_at: string;
};

const readAll = (): CompanySimulation[] => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? (JSON.parse(stored) as CompanySimulation[]) : [];
  } catch {
    return [];
  }
};

const writeAll = (simulations: CompanySimulation[]) => {
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(simulations));
};

const slugify = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

const toPublicSimulationPath = (id: string) => `/simulation/company/${encodeURIComponent(id)}`;

const normalizeTemplateForStorage = (template: SimulationTemplate): SimulationTemplate =>
  JSON.parse(JSON.stringify(template)) as SimulationTemplate;

const toCompanySimulation = (
  ownerId: string,
  template: SimulationTemplate,
  now = new Date().toISOString()
): CompanySimulation => {
  const title = template.name.trim() || 'Untitled Simulation';
  const id = template.id.trim() || `org-${Date.now()}`;
  const route = slugify(template.route || id);

  return {
    id,
    ownerId,
    title,
    companyName: template.companyName.trim() || 'Organization',
    industry: template.industry.trim() || 'General',
    description: template.description.trim() || template.challengeDetails.trim() || 'Organization-created simulation.',
    budget: template.budget || template.briefing.budget || 0,
    durationWeeks: template.briefing.totalWeeks || 12,
    teamSize: template.briefing.teamSize || 1,
    status: 'draft',
    isPublic: false,
    livePath: toPublicSimulationPath(id),
    liveSlug: route || id,
    createdAt: now,
    updatedAt: now,
    template: { ...normalizeTemplateForStorage(template), id, route },
  };
};

const fromDatabase = (row: CompanySimulationRow): CompanySimulation => ({
  id: row.id,
  ownerId: row.owner_id,
  title: row.title,
  companyName: row.company_name,
  industry: row.industry,
  description: row.description,
  budget: Number(row.budget) || 0,
  durationWeeks: row.duration_weeks,
  teamSize: row.team_size,
  status: row.status,
  isPublic: row.is_public,
  livePath: toPublicSimulationPath(row.id),
  liveSlug: row.live_slug,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
  template: row.template,
});

const toDatabasePayload = (simulation: CompanySimulation) => ({
  id: simulation.id,
  owner_id: simulation.ownerId,
  title: simulation.title,
  company_name: simulation.companyName,
  industry: simulation.industry,
  description: simulation.description,
  budget: simulation.budget,
  duration_weeks: simulation.durationWeeks,
  team_size: simulation.teamSize,
  status: simulation.status,
  is_public: simulation.isPublic,
  live_slug: simulation.liveSlug,
  template: normalizeTemplateForStorage(simulation.template),
});

const mergeById = (primary: CompanySimulation[], fallback: CompanySimulation[]) => {
  const seen = new Set(primary.map((simulation) => simulation.id));
  return [...primary, ...fallback.filter((simulation) => !seen.has(simulation.id))]
    .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
};

const isMissingTableError = (error: unknown) =>
  !!error &&
  typeof error === 'object' &&
  'message' in error &&
  String((error as { message?: string }).message).toLowerCase().includes('company_simulations');

export const companySimulations = {
  listForOwner(ownerId: string) {
    return readAll()
      .filter((simulation) => simulation.ownerId === ownerId)
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  },

  async listForOwnerAsync(ownerId: string) {
    const local = this.listForOwner(ownerId);

    const { data, error } = await supabase
      .from('company_simulations')
      .select('*')
      .eq('owner_id', ownerId)
      .order('updated_at', { ascending: false });

    if (error) {
      if (!isMissingTableError(error)) {
        console.warn('Unable to load company simulations from Supabase:', error.message);
      }
      return local;
    }

    return mergeById((data ?? []).map((row) => fromDatabase(row as CompanySimulationRow)), local);
  },

  listPublic() {
    return readAll()
      .filter((simulation) => simulation.isPublic && simulation.status === 'live')
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  },

  async listPublicAsync() {
    const local = this.listPublic();

    const { data, error } = await supabase
      .from('company_simulations')
      .select('*')
      .eq('is_public', true)
      .eq('status', 'live')
      .order('updated_at', { ascending: false });

    if (error) {
      if (!isMissingTableError(error)) {
        console.warn('Unable to load public company simulations from Supabase:', error.message);
      }
      return local;
    }

    return mergeById((data ?? []).map((row) => fromDatabase(row as CompanySimulationRow)), local);
  },

  async getPublicById(id: string) {
    const local = readAll().find(
      (simulation) => simulation.id === id && simulation.status === 'live' && simulation.isPublic
    ) || null;

    const { data, error } = await supabase
      .from('company_simulations')
      .select('*')
      .eq('id', id)
      .eq('is_public', true)
      .eq('status', 'live')
      .maybeSingle();

    if (error) {
      if (!isMissingTableError(error)) {
        console.warn('Unable to load public company simulation from Supabase:', error.message);
      }
      return local;
    }

    return data ? fromDatabase(data as CompanySimulationRow) : local;
  },

  saveDraft(ownerId: string, template: SimulationTemplate) {
    const now = new Date().toISOString();
    const simulation = toCompanySimulation(ownerId, template, now);
    const existing = readAll().filter((item) => item.id !== simulation.id);

    writeAll([simulation, ...existing]);
    return simulation;
  },

  async saveDraftAsync(ownerId: string, template: SimulationTemplate) {
    const localSimulation = this.saveDraft(ownerId, template);

    const { data, error } = await supabase
      .from('company_simulations')
      .upsert(toDatabasePayload(localSimulation), { onConflict: 'id' })
      .select()
      .single();

    if (error) {
      if (!isMissingTableError(error)) {
        console.warn('Unable to save company simulation to Supabase:', error.message);
      }
      return localSimulation;
    }

    return data ? fromDatabase(data as CompanySimulationRow) : localSimulation;
  },

  updateVisibility(id: string, ownerId: string, isPublic: boolean) {
    const simulations = readAll();
    const updated = simulations.map((simulation) =>
      simulation.id === id && simulation.ownerId === ownerId
        ? {
            ...simulation,
            isPublic,
            status: isPublic ? 'live' as const : simulation.status,
            updatedAt: new Date().toISOString(),
          }
        : simulation
    );
    writeAll(updated);
    return updated.find((simulation) => simulation.id === id) || null;
  },

  async updateVisibilityAsync(id: string, ownerId: string, isPublic: boolean) {
    const localSimulation = this.updateVisibility(id, ownerId, isPublic);

    const { data, error } = await supabase
      .from('company_simulations')
      .update({
        is_public: isPublic,
        status: isPublic ? 'live' : localSimulation?.status ?? 'draft',
      })
      .eq('id', id)
      .eq('owner_id', ownerId)
      .select()
      .single();

    if (error) {
      if (!isMissingTableError(error)) {
        console.warn('Unable to update company simulation visibility in Supabase:', error.message);
      }
      return localSimulation;
    }

    return data ? fromDatabase(data as CompanySimulationRow) : localSimulation;
  },

  publish(id: string, ownerId: string) {
    return this.updateVisibility(id, ownerId, true);
  },

  async publishAsync(id: string, ownerId: string) {
    return this.updateVisibilityAsync(id, ownerId, true);
  },
};
