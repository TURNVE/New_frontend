# TURNVE Simulation Improvements - Reducing Ambiguity

**Date:** April 22, 2026  
**Status:** ✅ Core improvements completed for PM-001 and WEB-DEV-01

---

## Problem Statement

Simulations were too ambiguous for users:
- ❌ No clear week-by-week tasks
- ❌ Vague evaluation criteria
- ❌ No stakeholder challenge feedback
- ❌ Missing in-context guidance
- ❌ Users didn't know what "good" looked like

---

## Solution: Three-Layer Clarity System

### 1. **Evaluation Rubrics** ✅
Specific scoring criteria for each task type with:
- **Weighted criteria** (e.g., "Data Support: 30%")
- **Concrete examples** of excellent vs poor work
- **Clear expectations** for what earns a passing score

**Example from PM-001 Crisis Assessment:**
```typescript
crisis_assessment: {
  criteria: [
    { id: 'completeness', label: 'Completeness', weight: 0.3, 
      description: 'All critical issues identified' },
    { id: 'severity_accuracy', label: 'Severity Accuracy', weight: 0.25, 
      description: 'Correct prioritization of threats' },
  ],
  examples: {
    excellent: 'Identified compliance, technical debt, and CEO pressure. 
                Ranked compliance as critical (regulatory risk)...',
    poor: 'Listed "some issues" without specifics...'
  }
}
```

### 2. **Stakeholder Challenges** ✅
Real-time feedback when users make common mistakes:
- **Trigger-based**: Detects vague language, missing analysis, contradictions
- **Contextual**: Specific to the stakeholder's role and concerns
- **Time-pressure**: Challenges have timeout (5-40 minutes)
- **Educational**: Explains WHY the approach is problematic

**Example from WEB-DEV-01:**
```typescript
// When user writes vague diagnosis
'vague-diagnosis': {
  trigger: ['hopefully', 'maybe', 'might', 'probably', 'seems like'],
  challenge: {
    stakeholderId: 'cto',
    channel: 'slack',
    subject: 'Need specifics on diagnosis',
    message: 'Your diagnosis is too vague. "Maybe database" is not 
              actionable. I need specific queries, specific components, 
              specific evidence. Can you provide that?',
    timeoutMinutes: 15
  }
}
```

### 3. **In-Context Guidance** ✅
Week-by-week hints and stakeholder tips:
- **Opening context**: Sets the scene for each week
- **Actionable hints**: 3-5 specific things to try
- **Stakeholder tips**: How to communicate with each person
- **Progressive disclosure**: Only shows relevant info for current week

**Example from PM-001 Week 1:**
```typescript
week1: {
  opening: 'You are the Senior PM at PayLink. Launch day is in 72 hours...',
  hints: [
    'Start by reading the compliance report and engineering assessment thoroughly',
    'Prioritize issues by business impact, not technical complexity',
    'Remember: Compliance in fintech is not optional - regulatory fines can exceed $500K'
  ],
  stakeholderTips: {
    ceo: 'Be direct and data-driven. Marcus values honesty but needs business justification.',
    cto: 'Sarah is analytical - she wants to see you understand the technical tradeoffs.',
    compliance: 'David is formal and risk-averse. Show him you take compliance seriously.'
  }
}
```

---

## What Changed in the Code

### New File Structure
```
src/
├── simulation/
│   └── content/
│       ├── pm-001/
│       │   └── pm-001-content.ts      ✅ NEW
│       └── web-dev-01/
│           └── web-dev-01-content.ts  ✅ NEW
└── config/
    └── simulationTemplates.ts         🔄 UPDATED
```

### Simulation Template Interface
Added 3 new fields to `SimulationTemplate`:
```typescript
interface SimulationTemplate {
  // ... existing fields ...
  
  // NEW: Structured per-week content
  weeklySignals?: WeeklySignal[];
  weeklyEvents?: WeeklyEvent[];
  weeklyActions?: WeeklyActionItem[];
  
  // NEW: Evaluation rubrics
  evaluationRubrics?: Record<string, {
    criteria: Array<{ id: string; label: string; weight: number; description: string }>;
    examples: { excellent: string; poor: string };
  }>;
  
  // NEW: Stakeholder challenges
  stakeholderChallenges?: Record<string, Record<string, {...}>>;
  
  // NEW: In-context guidance
  guidance?: Record<string, {
    opening?: string;
    hints: string[];
    stakeholderTips?: Record<string, string>;
  }>;
}
```

---

## Completed Simulations

### ✅ PM-001: PayLink - 72-Hour Launch Crisis
- **Week 1-3 content** fully defined
- **3 task types** with rubrics: crisis_assessment, stakeholder_comms, decision_memo
- **8 stakeholder challenges** across CEO, CTO, and Compliance
- **Weekly signals** (5) and **events** (4) scheduled
- **Guidance** for all 3 weeks

### ✅ WEB-DEV-01: Checkout Performance Under Fire
- **Week 1-8 content** fully defined
- **8 task types** with rubrics: diagnosis, root_cause_doc, architecture_decision, caching_implementation, db_optimization, load_testing, production_rollout, go_no_go
- **12 stakeholder challenges** across CTO, CFO, Product, DevOps
- **Weekly signals** (7) and **events** (6) scheduled
- **Guidance** for all 8 weeks

---

## Remaining Work

### 🔄 Simulations Needing Same Treatment
1. **PM-002: ShopEase - BNPL Growth Bet** (4 weeks)
2. **PM-003: TechCore - Infrastructure Rebuild** (12 weeks)
3. **PM-004: NewWave - Product Discovery** (6 weeks)
4. **BRAND-001: Nike Vision - Brand Refresh** (6 weeks)

### 🔧 Integration Tasks
1. **UI Components**: Display rubrics in ArtifactSubmissionModal
2. **Challenge Engine**: Integrate stakeholderChallenges into SimulationPage
3. **Guidance Panel**: Add collapsible hints UI in dashboard
4. **Scoring Engine**: Use evaluationRubrics for automated feedback

---

## Impact on User Experience

### Before:
> "Week 1: Project Kickoff. Your simulation has begun! As the PM, you'll need to make strategic decisions each week."

❌ No idea what decisions to make  
❌ No idea how they're evaluated  
❌ No feedback on mistakes  

### After:
> **Week 1: Crisis Assessment**  
> 🎯 **Tasks:**
> - Crisis Triage: Assess All Issues (Due: End of Week 1)
> - CEO Briefing: Present Findings (Due: End of Week 1)
> - Stakeholder Alignment Check (Due: End of Week 1)
> 
> 💡 **Hints:**
> - Start by reading the compliance report thoroughly
> - Prioritize issues by business impact, not technical complexity
> 
> 📊 **Evaluation:**
> - Completeness (30%): All critical issues identified
> - Severity Accuracy (25%): Correct prioritization
> - Clarity (25%): Clear, actionable language
> - Timeliness (20%): Completed within 6-hour window

✅ Clear tasks with deadlines  
✅ Know exactly how work is evaluated  
✅ Get help when stuck  

---

## Next Steps

1. **Test PM-001 and WEB-DEV-01** with real users
2. **Collect feedback** on clarity improvements
3. **Create content** for remaining 4 simulations
4. **Build UI components** to surface rubrics and guidance
5. **Implement automated scoring** based on rubrics

---

## Files Changed

- ✅ `src/simulation/content/pm-001/pm-001-content.ts` (NEW - 450 lines)
- ✅ `src/simulation/content/web-dev-01/web-dev-01-content.ts` (NEW - 650 lines)
- ✅ `src/config/simulationTemplates.ts` (UPDATED - added imports and content fields)
- ✅ `src/shared/simulation/types.ts` (already had required types)

---

**Summary:** Ambiguity reduced by providing **clear tasks**, **explicit evaluation criteria**, **real-time feedback**, and **contextual guidance** for 2 of 6 simulations.
