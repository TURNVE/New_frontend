import type { CompanySimulation } from './companySimulations';

export type CompanyDashboardScenarioRow = {
  id?: string | null;
  key?: string | null;
  status?: string | null;
  is_public?: boolean | null;
  is_active?: boolean | null;
  visibility?: string | null;
};

export type CompanyDashboardSessionRow = {
  id?: string | null;
  user_id?: string | null;
  scenario_key?: string | null;
  status?: string | null;
  completed_at?: string | null;
};

export type CompanyDashboardScoreRow = {
  session_id?: string | null;
  overall_score?: number | null;
};

export type CompanyDashboardStats = {
  totalSimulations: number;
  draftSimulations: number;
  liveSimulations: number;
  publicSimulations: number;
  learnersReached: number;
  activeLearners: number;
  completedSessions: number;
  completionRate: number;
  averageScore: number | null;
  lastUpdatedAt: string | null;
  source: 'local' | 'supabase';

  // Backwards-compatible aliases for lightweight tests and older UI wording.
  ownedSimulations: number;
  learnerStarts: number;
  learnerCompletions: number;
  teamMembers: number;
};

const unique = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

const getLivePathScenarioKey = (livePath: string) => {
  const query = livePath.split('?')[1];
  if (!query) return null;
  return new URLSearchParams(query).get('orgSimulation');
};

export function getCompanySimulationScenarioKeys(simulations: CompanySimulation[]) {
  return unique(
    simulations.flatMap((simulation) => [
      simulation.id,
      simulation.template?.id,
      simulation.template?.route,
      getLivePathScenarioKey(simulation.livePath),
    ].filter((value): value is string => !!value))
  );
}

const scenarioRowIsPublic = (row: CompanyDashboardScenarioRow) => {
  if (typeof row.is_public === 'boolean') return row.is_public;
  return row.visibility === 'public';
};

const scenarioRowIsLive = (row: CompanyDashboardScenarioRow) => {
  if (row.status) return ['live', 'published', 'active'].includes(row.status);
  return row.is_active === true;
};

const sessionIsCompleted = (row: CompanyDashboardSessionRow) =>
  row.status === 'completed' || !!row.completed_at;

const roundPercentage = (part: number, total: number) =>
  total > 0 ? Math.round((part / total) * 100) : 0;

const averageScore = (scoreRows: CompanyDashboardScoreRow[]) => {
  const values = scoreRows
    .map((score) => score.overall_score)
    .filter((score): score is number => typeof score === 'number');

  if (values.length === 0) return null;
  return Math.round(values.reduce((total, score) => total + score, 0) / values.length);
};

export function buildCompanyDashboardStats({
  localSimulations,
  ownedScenarioRows = [],
  sessionRows = [],
  scoreRows = [],
}: {
  localSimulations: CompanySimulation[];
  ownedScenarioRows?: CompanyDashboardScenarioRow[];
  sessionRows?: CompanyDashboardSessionRow[];
  scoreRows?: CompanyDashboardScoreRow[];
}): CompanyDashboardStats {
  const aggregates = new Map<string, { isPublic: boolean; isLive: boolean; isDraft: boolean }>();
  const localKeyToAggregateKey = new Map<string, string>();

  localSimulations.forEach((simulation, index) => {
    const aggregateKey = simulation.id || `local-${index}`;
    aggregates.set(aggregateKey, {
      isPublic: simulation.isPublic,
      isLive: simulation.status === 'live',
      isDraft: simulation.status === 'draft',
    });

    getCompanySimulationScenarioKeys([simulation]).forEach((key) => {
      localKeyToAggregateKey.set(key, aggregateKey);
    });
  });

  ownedScenarioRows.forEach((row, index) => {
    const scenarioKey = row.key || row.id || `db-${index}`;
    const aggregateKey = localKeyToAggregateKey.get(scenarioKey) || `db-${scenarioKey}`;
    const existing = aggregates.get(aggregateKey);

    aggregates.set(aggregateKey, {
      isPublic: scenarioRowIsPublic(row) || existing?.isPublic || false,
      isLive: scenarioRowIsLive(row) || existing?.isLive || false,
      isDraft: existing?.isDraft ?? row.status === 'draft',
    });
  });

  const learnerIds = sessionRows
    .map((row) => row.user_id)
    .filter((userId): userId is string => !!userId);
  const activeLearnerIds = sessionRows
    .filter((row) => row.status === 'active')
    .map((row) => row.user_id)
    .filter((userId): userId is string => !!userId);
  const completedSessions = sessionRows.filter(sessionIsCompleted).length;
  const fallbackTeamMembers = localSimulations.reduce(
    (maxTeamSize, simulation) => Math.max(maxTeamSize, simulation.teamSize || 0),
    0
  );
  const totalSimulations = aggregates.size;
  const learnersReached = unique(learnerIds).length;

  return {
    totalSimulations,
    draftSimulations: Array.from(aggregates.values()).filter((simulation) => simulation.isDraft).length,
    publicSimulations: Array.from(aggregates.values()).filter((simulation) => simulation.isPublic).length,
    liveSimulations: Array.from(aggregates.values()).filter((simulation) => simulation.isLive).length,
    learnersReached,
    activeLearners: unique(activeLearnerIds).length,
    completedSessions,
    completionRate: roundPercentage(completedSessions, sessionRows.length),
    averageScore: averageScore(scoreRows),
    lastUpdatedAt: localSimulations[0]?.updatedAt ?? null,
    source: ownedScenarioRows.length > 0 || sessionRows.length > 0 || scoreRows.length > 0 ? 'supabase' : 'local',
    ownedSimulations: totalSimulations,
    learnerStarts: sessionRows.length,
    learnerCompletions: completedSessions,
    teamMembers: learnersReached || fallbackTeamMembers,
  };
}

export async function getCompanyDashboardStats(ownerId: string): Promise<CompanyDashboardStats> {
  const [{ companySimulations }, { supabase }] = await Promise.all([
    import('./companySimulations'),
    import('./supabase'),
  ]);
  const localSimulations = await companySimulations.listForOwnerAsync(ownerId);
  const scenarioKeys = getCompanySimulationScenarioKeys(localSimulations);

  if (scenarioKeys.length === 0) {
    return buildCompanyDashboardStats({ localSimulations });
  }

  const { data: sessions, error: sessionError } = await supabase
    .from('simulation_sessions')
    .select('id,user_id,scenario_key,status,completed_at')
    .in('scenario_key', scenarioKeys);

  if (sessionError || !sessions) {
    if (sessionError) {
      console.warn('Unable to load company learner statistics:', sessionError.message);
    }
    return buildCompanyDashboardStats({ localSimulations });
  }

  const sessionRows = sessions as CompanyDashboardSessionRow[];
  const sessionIds = sessionRows
    .map((session) => session.id)
    .filter((id): id is string => !!id);

  let scoreRows: CompanyDashboardScoreRow[] = [];
  if (sessionIds.length > 0) {
    const { data: scores, error: scoreError } = await supabase
      .from('simulation_scores')
      .select('session_id,overall_score')
      .in('session_id', sessionIds);

    if (!scoreError && scores) {
      scoreRows = scores as CompanyDashboardScoreRow[];
    }
  }

  return buildCompanyDashboardStats({
    localSimulations,
    sessionRows,
    scoreRows,
  });
}
