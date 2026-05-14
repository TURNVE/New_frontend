import type { SimulationTemplate } from '../config/simulationTemplates';

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
  createdAt: string;
  updatedAt: string;
  template: SimulationTemplate;
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

export const companySimulations = {
  listForOwner(ownerId: string) {
    return readAll()
      .filter((simulation) => simulation.ownerId === ownerId)
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  },

  listPublic() {
    return readAll()
      .filter((simulation) => simulation.isPublic && simulation.status === 'live')
      .sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
  },

  saveDraft(ownerId: string, template: SimulationTemplate) {
    const now = new Date().toISOString();
    const title = template.name.trim() || 'Untitled Simulation';
    const id = template.id.trim() || `org-${Date.now()}`;
    const route = slugify(template.route || id);
    const existing = readAll().filter((simulation) => simulation.id !== id);
    const simulation: CompanySimulation = {
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
      livePath: `/simulations?orgSimulation=${encodeURIComponent(route)}`,
      createdAt: now,
      updatedAt: now,
      template: { ...template, id, route },
    };

    writeAll([simulation, ...existing]);
    return simulation;
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

  publish(id: string, ownerId: string) {
    return this.updateVisibility(id, ownerId, true);
  },
};
