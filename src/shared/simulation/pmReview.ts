import type { ActionReviewResult, WeeklyActionItem } from './types';

function stringifySubmission(result: Record<string, unknown>): string {
    return JSON.stringify(result)
        .replace(/[{}[\]",:]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim()
        .toLowerCase();
}

function hasAny(text: string, terms: string[]) {
    return terms.some((term) => text.includes(term));
}

function criterionScore(text: string, criterionLabel: string, points: number) {
    const label = criterionLabel.toLowerCase();
    const evidenceTerms = ['evidence', 'user', 'complaint', 'ticket', 'analytics', 'data', 'feedback', 'quote'];
    const businessTerms = ['business', 'metric', 'activation', 'completion', 'conversion', 'revenue', 'trust', 'support', 'retention'];
    const clarityTerms = ['because', 'so that', 'goal', 'problem', 'statement', 'requirement', 'criteria'];
    const scopeTerms = ['mvp', 'effort', 'constraint', 'risk', 'assumption', 'out of scope', 'priority'];

    let scoreRatio = 0.45;

    if (text.length > 160) scoreRatio += 0.2;
    if (label.includes('evidence') || label.includes('feedback')) {
        scoreRatio += hasAny(text, evidenceTerms) ? 0.3 : -0.15;
    }
    if (label.includes('business') || label.includes('metric') || label.includes('impact')) {
        scoreRatio += hasAny(text, businessTerms) ? 0.3 : -0.15;
    }
    if (label.includes('clarity') || label.includes('problem') || label.includes('prd')) {
        scoreRatio += hasAny(text, clarityTerms) ? 0.25 : -0.1;
    }
    if (label.includes('priorit') || label.includes('risk') || label.includes('scope')) {
        scoreRatio += hasAny(text, scopeTerms) ? 0.25 : -0.1;
    }
    if (hasAny(text, ['feature', 'solution']) && !hasAny(text, ['problem', 'evidence', 'because'])) {
        scoreRatio -= 0.15;
    }

    return Math.max(0, Math.min(points, Math.round(points * Math.max(0.2, Math.min(1, scoreRatio)))));
}

function levelForPercentage(percentage: number): ActionReviewResult['level'] {
    if (percentage >= 85) return 'strong';
    if (percentage >= 70) return 'job_ready';
    if (percentage >= 50) return 'developing';
    return 'needs_revision';
}

function buildStrengths(action: WeeklyActionItem, text: string, percentage: number) {
    const strengths: string[] = [];

    if (text.length > 160) strengths.push('Your submission gives enough detail for a product review conversation.');
    if (hasAny(text, ['user', 'complaint', 'ticket', 'feedback', 'analytics', 'data'])) {
        strengths.push('You used workplace evidence instead of relying only on opinion.');
    }
    if (hasAny(text, ['metric', 'activation', 'completion', 'conversion', 'support', 'trust', 'revenue'])) {
        strengths.push('You connected the user problem to a business metric.');
    }
    if (hasAny(text, ['mvp', 'effort', 'constraint', 'risk', 'assumption', 'out of scope'])) {
        strengths.push('You showed trade-off thinking around scope and constraints.');
    }
    if (percentage >= 70) strengths.push(`This is usable for the ${action.title.toLowerCase()} deliverable.`);

    return strengths.slice(0, 4);
}

function buildGaps(action: WeeklyActionItem, text: string, percentage: number) {
    const gaps: string[] = [];

    if (text.length <= 160) gaps.push('Add more specific detail so stakeholders can understand your reasoning without asking follow-up questions.');
    if (!hasAny(text, ['complaint', 'ticket', 'feedback', 'analytics', 'data', 'evidence', 'quote'])) {
        gaps.push('Cite at least one piece of evidence from the workplace materials.');
    }
    if (!hasAny(text, ['metric', 'activation', 'completion', 'conversion', 'support', 'trust', 'revenue'])) {
        gaps.push('Explain how the issue affects a product or business metric.');
    }
    if (action.title.toLowerCase().includes('prd') && !hasAny(text, ['requirement', 'success metric', 'out of scope', 'risk', 'acceptance'])) {
        gaps.push('Make the PRD more execution-ready by adding requirements, success metrics, risks, and scope boundaries.');
    }
    if (action.title.toLowerCase().includes('prioritize') && !hasAny(text, ['impact', 'effort', 'priority', 'mvp'])) {
        gaps.push('Use the Impact vs Effort trade-off explicitly before recommending the MVP.');
    }
    if (percentage < 50 && gaps.length === 0) gaps.push('The submission needs stronger PM reasoning before it is portfolio-ready.');

    return gaps.slice(0, 4);
}

export function evaluateWeeklyActionSubmission(
    action: WeeklyActionItem,
    result: Record<string, unknown>
): ActionReviewResult {
    const text = stringifySubmission(result);
    const rubric = action.scoringRubric?.length
        ? action.scoringRubric
        : [{ id: 'completion', label: action.title, points: 10, description: action.description }];
    const maxScore = rubric.reduce((sum, criterion) => sum + criterion.points, 0);
    const score = rubric.reduce((sum, criterion) => sum + criterionScore(text, criterion.label, criterion.points), 0);
    const percentage = Math.round((score / Math.max(1, maxScore)) * 100);
    const level = levelForPercentage(percentage);
    const strengths = buildStrengths(action, text, percentage);
    const gaps = buildGaps(action, text, percentage);
    const requiresRevision = percentage < 70 || gaps.length >= 3;
    const revisionPrompt = requiresRevision
        ? `Revise this ${action.title.toLowerCase()} by adding evidence, business impact, and clearer product reasoning.`
        : 'Approved for this simulation stage. You can still polish wording before adding it to your portfolio.';
    const stakeholderReaction = requiresRevision
        ? 'Product review: This needs another pass before it would be accepted in a PM team review.'
        : 'Product review: This is clear enough to move the team forward.';

    return {
        score,
        maxScore,
        percentage,
        level,
        strengths,
        gaps,
        revisionPrompt,
        stakeholderReaction,
        requiresRevision,
    };
}
