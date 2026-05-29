import fs from 'node:fs';

const documentsPanel = fs.readFileSync('src/components/simulation/DocumentsPanel.tsx', 'utf8');
const simulationShell = fs.readFileSync('src/shared/simulation/SimulationShell.tsx', 'utf8');

const checks = [
  {
    name: 'PM page title',
    passed: documentsPanel.includes('PM Work Documents'),
  },
  {
    name: 'PM artifact roadmap builder',
    passed: documentsPanel.includes('pmDocumentRoadmap'),
  },
  {
    name: 'PM status language',
    passed: ['Ready to create', 'Needs revision', 'Locked', 'Completed', 'Exported'].every((marker) =>
      documentsPanel.includes(marker)
    ),
  },
  {
    name: 'Final portfolio export action',
    passed: documentsPanel.includes('Export Case Study') && documentsPanel.includes('Portfolio case study'),
  },
  {
    name: 'Module open action wiring',
    passed: documentsPanel.includes('onOpenAction') && simulationShell.includes('onOpenAction={(item) => setOpenModal'),
  },
  {
    name: 'PM documents mode from shell',
    passed:
      simulationShell.includes("simulationMode={pmMode ? 'product_management' : 'default'}") &&
      simulationShell.includes("pmMode ? 'PM Work Documents' : 'Documents'") &&
      simulationShell.includes('weeklyActions={config.weeklyActions ?? []}') &&
      simulationShell.includes('completedActionIds='),
  },
  {
    name: 'Case study export handler from shell',
    passed: simulationShell.includes('handleExportCaseStudy') && simulationShell.includes('onExportCaseStudy='),
  },
  {
    name: 'Artifact metadata links document back to source module',
    passed:
      fs.readFileSync('src/shared/simulation/useSimulationCore.ts', 'utf8').includes('actionId: action.id') &&
      fs.readFileSync('src/shared/simulation/useSimulationCore.ts', 'utf8').includes('sourceMaterials: action.workplaceMaterials'),
  },
];

const failures = checks.filter((check) => !check.passed);

if (failures.length > 0) {
  console.error('PM Documents workspace check failed:');
  for (const failure of failures) {
    console.error(`- ${failure.name}`);
  }
  process.exit(1);
}

console.log('PM Documents workspace check passed.');
