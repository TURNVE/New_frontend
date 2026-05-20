import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'src/shared/simulation/components/ActionModal.tsx'), 'utf8');

const requiredMarkers = [
  'activeMaterial',
  'MaterialLinkedInstruction',
  'buildInstructionSegments',
  'Open workplace material',
  'text={activeMaterial.content.join',
  'aria-label={`Open ${material.title}`',
];

const missing = requiredMarkers.filter((marker) => !source.includes(marker));

if (missing.length) {
  console.error(`Missing clickable material popup support: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('material popup checks passed');
