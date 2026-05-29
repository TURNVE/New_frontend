import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
  buildCompanyDashboardStats,
  getCompanySimulationScenarioKeys,
  type CompanyDashboardSessionRow,
} from './companyStats.ts';
import type { CompanySimulation } from './companySimulations';

const makeSimulation = (overrides: Partial<CompanySimulation>): CompanySimulation => ({
  id: 'sim-1',
  ownerId: 'company-1',
  title: 'Onboarding Simulation',
  companyName: 'Acme',
  industry: 'Technology',
  description: 'A simulation',
  budget: 1000,
  durationWeeks: 4,
  teamSize: 6,
  status: 'draft',
  isPublic: false,
  livePath: '/simulations?orgSimulation=acme-onboarding',
  liveSlug: 'acme-onboarding',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  template: {
    id: 'template-1',
    route: 'acme-onboarding',
  } as CompanySimulation['template'],
  ...overrides,
});

describe('company dashboard stats', () => {
  it('uses local company simulations as the fallback baseline', () => {
    const stats = buildCompanyDashboardStats({
      localSimulations: [
        makeSimulation({ id: 'sim-1', status: 'live', isPublic: true, teamSize: 5 }),
        makeSimulation({ id: 'sim-2', status: 'draft', isPublic: false, teamSize: 8 }),
      ],
    });

    assert.deepEqual(stats, {
      totalSimulations: 2,
      draftSimulations: 1,
      liveSimulations: 1,
      publicSimulations: 1,
      learnersReached: 0,
      activeLearners: 0,
      completedSessions: 0,
      completionRate: 0,
      averageScore: null,
      lastUpdatedAt: '2026-01-01T00:00:00.000Z',
      source: 'local',
      ownedSimulations: 2,
      learnerStarts: 0,
      learnerCompletions: 0,
      teamMembers: 8,
    });
  });

  it('merges readable Supabase sessions for learner starts, completions, and users', () => {
    const sessions: CompanyDashboardSessionRow[] = [
      { id: 'session-1', user_id: 'learner-1', scenario_key: 'acme-onboarding', status: 'active' },
      { id: 'session-2', user_id: 'learner-2', scenario_key: 'acme-onboarding', status: 'completed' },
      { id: 'session-3', user_id: 'learner-2', scenario_key: 'template-1', completed_at: '2026-02-01T00:00:00.000Z' },
    ];

    const stats = buildCompanyDashboardStats({
      localSimulations: [makeSimulation({ teamSize: 10 })],
      sessionRows: sessions,
    });

    assert.equal(stats.learnerStarts, 3);
    assert.equal(stats.learnerCompletions, 2);
    assert.equal(stats.teamMembers, 2);
    assert.equal(stats.source, 'supabase');
  });

  it('deduplicates Supabase-owned scenarios that match local scenario keys', () => {
    const stats = buildCompanyDashboardStats({
      localSimulations: [makeSimulation({ status: 'draft', isPublic: false })],
      ownedScenarioRows: [
        { id: 'db-1', key: 'acme-onboarding', status: 'live', is_public: true },
        { id: 'db-2', key: 'db-only', status: 'live', is_public: false },
      ],
    });

    assert.equal(stats.ownedSimulations, 2);
    assert.equal(stats.liveSimulations, 2);
    assert.equal(stats.publicSimulations, 1);
  });

  it('extracts all possible scenario keys from a local company simulation', () => {
    assert.deepEqual(
      getCompanySimulationScenarioKeys([makeSimulation({ id: 'sim-1' })]),
      ['sim-1', 'template-1', 'acme-onboarding']
    );
  });
});
