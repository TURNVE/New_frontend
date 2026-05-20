import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const source = fs.readFileSync(path.join(root, 'src/shared/simulation/components/ActionModal.tsx'), 'utf8');

const requiredMarkers = [
  'FeedbackBoard',
  'activeFeedbackMaterial',
  'isUserFeedbackMaterial',
  'View more user feedback',
  'Live feedback updates',
  'New feedback received',
  'setVisibleFeedbackCount',
];

const missing = requiredMarkers.filter((marker) => !source.includes(marker));

if (missing.length) {
  console.error(`Missing user feedback board support: ${missing.join(', ')}`);
  process.exit(1);
}

console.log('feedback board checks passed');
