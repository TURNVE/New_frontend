import fs from 'node:fs';

const companyPanel = fs.readFileSync('src/components/company/CompanyPanel.tsx', 'utf8');
const simulationShell = fs.readFileSync('src/shared/simulation/SimulationShell.tsx', 'utf8');

const bannedMockMarkers = [
  'INITIAL_NEWS',
  'INDUSTRY_TRENDS',
  'ENHANCED_STAKEHOLDERS',
  'TEAM_MEMBERS',
  'DEFAULT_COMPANY',
  'COMPETITORS',
];

const requiredPanelMarkers = [
  'config: SimulationConfig',
  '`${config.companyName} Updates`',
  "'Product Brief'",
  '`${config.industry} Context`',
  "'Stakeholders'",
  'config.weeklySignals',
  'config.weeklyEvents',
  'config.weeklyActions',
  'config.stakeholders',
  'config.kpis',
  'config.marketContext',
  'config.currentRisks',
  'config.challengeDetails',
];

const checks = [
  {
    name: 'CompanyPanel does not import or render mock company fixtures',
    passed: bannedMockMarkers.every((marker) => !companyPanel.includes(marker)),
  },
  {
    name: 'CompanyPanel sidebar labels are simulation-specific',
    passed:
      !companyPanel.includes("label: 'News Feed'") &&
      !companyPanel.includes("label: 'About'") &&
      !companyPanel.includes("label: 'Team'") &&
      !companyPanel.includes('Team Directory') &&
      !companyPanel.includes('Meet the people behind'),
  },
  {
    name: 'CompanyPanel derives content from SimulationConfig',
    passed: requiredPanelMarkers.every((marker) => companyPanel.includes(marker)),
  },
  {
    name: 'SimulationShell passes active simulation config into CompanyPanel',
    passed: simulationShell.includes('<CompanyPanel') && simulationShell.includes('config={config}'),
  },
];

const failures = checks.filter((check) => !check.passed);

if (failures.length > 0) {
  console.error('Company panel simulation-data check failed:');
  for (const failure of failures) {
    console.error(`- ${failure.name}`);
  }
  process.exit(1);
}

console.log('Company panel simulation-data check passed.');
