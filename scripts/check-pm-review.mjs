import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import ts from 'typescript';

const source = await readFile(new URL('../src/shared/simulation/pmReview.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, {
  compilerOptions: {
    module: ts.ModuleKind.ESNext,
    target: ts.ScriptTarget.ES2022,
    verbatimModuleSyntax: true,
  },
});

const moduleUrl = `data:text/javascript;base64,${Buffer.from(compiled.outputText).toString('base64')}`;
const { evaluateWeeklyActionSubmission } = await import(moduleUrl);

const review = evaluateWeeklyActionSubmission(
  {
    id: 'm4',
    week: 4,
    title: 'Define the Main Problem Statement',
    description: 'Write a problem statement',
    category: 'document',
    actionType: 'submit_prd',
    priority: 'high',
    expectedAnswerGuide: [
      'Mentions the affected user group',
      'Uses evidence from complaints and analytics',
      'Connects the problem to activation rate',
    ],
    feedbackCriteria: [
      'Avoids jumping to solutions',
      'Uses direct evidence',
      'Explains business impact',
    ],
    scoringRubric: [
      { id: 'clarity', label: 'Problem clarity', points: 5, description: 'Clear problem statement' },
      { id: 'evidence', label: 'Evidence', points: 5, description: 'Uses evidence' },
      { id: 'business', label: 'Business impact', points: 5, description: 'Links to metric' },
    ],
  },
  {
    prd: {
      user: 'New PayLoop users',
      problem: 'They sign up but cannot complete their first transaction because BVN/KYC steps and account limits are unclear.',
      evidence: 'Support tickets mention verification confusion and analytics show KYC completion drops before activation.',
      impact: 'This lowers activation rate and first transaction completion.',
    },
  }
);

assert.equal(review.maxScore, 15);
assert.ok(review.score >= 11, `expected strong evidence-backed answer, got ${review.score}`);
assert.equal(review.requiresRevision, false);
assert.ok(review.strengths.length > 0);
assert.ok(review.stakeholderReaction.includes('Product'));

const weakReview = evaluateWeeklyActionSubmission(
  {
    id: 'm7',
    week: 7,
    title: 'Write Mini PRD',
    description: 'Write a PRD',
    category: 'document',
    actionType: 'submit_prd',
    priority: 'high',
    scoringRubric: [
      { id: 'clarity', label: 'PRD clarity', points: 10, description: 'Clear enough for engineering' },
      { id: 'metric', label: 'Metric', points: 5, description: 'Defines success metric' },
    ],
  },
  { prd: { feature: 'Checklist' } }
);

assert.equal(weakReview.maxScore, 15);
assert.ok(weakReview.requiresRevision, 'weak PRD should request revision');
assert.ok(weakReview.gaps.length > 0);

console.log('pm review checks passed');
