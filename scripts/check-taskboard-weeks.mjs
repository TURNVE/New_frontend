import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'src/shared/simulation/SimulationShell.tsx'), 'utf8');

const requiredMarkers = [
  'weeklyTaskGroups',
  'All weeks',
  'Completed',
  'Not completed',
  'Module {weekNumber}',
  'weekStatus',
  'Locked',
  'Available',
];

const missing = requiredMarkers.filter((marker) => !source.includes(marker));

if (missing.length) {
  console.error(`Missing all-weeks taskboard support: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('taskboard week checks passed');
