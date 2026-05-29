import type {
    KPI,
    Risk,
    SimulationConfig,
    SimulationTask,
    Stakeholder,
    TaskScoringCriterion,
    TimelinePhase,
    WeeklyActionItem,
    WeeklyEvent,
    WeeklySignal,
    WorkplaceMaterial,
    PRDField,
    OutputTemplateItem,
} from '../../shared/simulation/types';

export const TURNVE_PM_SIMULATION_PROMPT_ENGINE = `You are TURNVE's AI Simulation Engine.
Create a realistic Product Management workplace simulation for an early-career learner acting as a Product Management Intern.
The simulation must feel like a real workplace project, not a classroom lesson.
Use messy company documents, user complaints, stakeholder requests, product metrics, and business goals.
The learner must complete: understand the product problem, review user evidence, separate user and business problems, define a problem statement, generate feature ideas, prioritize with Impact vs Effort, write a mini PRD, create user stories and acceptance criteria, prepare a stakeholder update, and create a portfolio case study summary.
For every task, include a task title, workplace scenario, workplace materials, learner instruction, output template, expected answer guide, scoring rubric, and feedback criteria.`;

export const PM_SCORING_RUBRIC = [
    { skillArea: 'Problem understanding', score: 15 },
    { skillArea: 'User feedback analysis', score: 15 },
    { skillArea: 'Business reasoning', score: 15 },
    { skillArea: 'Feature ideation', score: 10 },
    { skillArea: 'Prioritization', score: 15 },
    { skillArea: 'PRD clarity', score: 15 },
    { skillArea: 'User stories and acceptance criteria', score: 10 },
    { skillArea: 'Stakeholder communication', score: 5 },
] as const;

export const PM_PERFORMANCE_LEVELS = [
    { range: '0 to 49', level: 'Beginner Product Intern' },
    { range: '50 to 69', level: 'Developing Product Intern' },
    { range: '70 to 84', level: 'Job-ready Junior PM' },
    { range: '85 to 100', level: 'Strong Product Thinker' },
] as const;

export interface ProductManagementSimulationSpec {
    id: string;
    name: string;
    companyName: string;
    industry: string;
    productDescription: string;
    targetUsers: string;
    businessGoal: string;
    mainProductProblem: string;
    keyMetric: string;
    stakeholderContext: string[];
    selectedMvpFeature: string;
    selectedMvpReason: string;
    finalPortfolioOutcome: string;
    difficulty: SimulationConfig['difficulty'];
    primaryColor: string;
    budget: number;
    fundingStatus: string;
    employees: string;
    headquarters: string;
    technicalStack: string;
    marketContext: string;
    existingFlow: string[];
    analytics: string[];
    userFeedback: string[];
    supportTickets: string[];
    stakeholderMemo: string[];
    internalNotes: string[];
    featureIdeas: Array<{ idea: string; problemSolved: string }>;
    impactMapExamples: Array<{ userProblem: string; businessImpact: string; metricAffected: string }>;
    stakeholders: Stakeholder[];
    risks: Risk[];
    kpis: KPI[];
}

function material(id: string, title: string, source: string, content: string[]): WorkplaceMaterial {
    return { id, title, source, content };
}

function rubric(totalPoints: number, focus: string): TaskScoringCriterion[] {
    const clarity = Math.max(1, Math.round(totalPoints * 0.35));
    const evidence = Math.max(1, Math.round(totalPoints * 0.35));
    const practicality = totalPoints - clarity - evidence;

    return [
        {
            id: 'clarity',
            label: `${focus} clarity`,
            points: clarity,
            description: 'The answer is specific, easy to read, and framed in product language.',
        },
        {
            id: 'evidence',
            label: 'Evidence-based reasoning',
            points: evidence,
            description: 'The answer uses workplace documents, user quotes, support tickets, or metrics as evidence.',
        },
        {
            id: 'practicality',
            label: 'Practical judgment',
            points: practicality,
            description: 'The answer respects user needs, business goals, constraints, and MVP feasibility.',
        },
    ];
}

function outputTemplate(fields: PRDField[]): OutputTemplateItem[] {
    return fields.map((field) => ({
        id: field.id,
        label: field.label,
        guidance: field.placeholder,
    }));
}

function featureIdeaText(spec: ProductManagementSimulationSpec): string {
    return spec.featureIdeas.map((feature, index) => `${index + 1}. ${feature.idea}: ${feature.problemSolved}`).join('\n');
}

function impactMapText(spec: ProductManagementSimulationSpec): string {
    return spec.impactMapExamples
        .map((item, index) => `${index + 1}. ${item.userProblem} -> ${item.businessImpact} -> ${item.metricAffected}`)
        .join('\n');
}

function moduleMaterials(spec: ProductManagementSimulationSpec, moduleNumber: number): WorkplaceMaterial[] {
    const productBrief = material('product-brief', `${spec.companyName} product brief`, 'Product brief', [
        `${spec.companyName} builds ${spec.productDescription}.`,
        `Target users: ${spec.targetUsers}.`,
        `Business goal: ${spec.businessGoal}.`,
        `Main problem: ${spec.mainProductProblem}.`,
        `Key metric affected: ${spec.keyMetric}.`,
    ]);
    const analytics = material('analytics', 'Product analytics summary', 'Analytics', spec.analytics);
    const feedback = material('feedback', 'User feedback sample', 'Research notes', spec.userFeedback);
    const tickets = material('tickets', 'Support ticket excerpts', 'Customer support', spec.supportTickets);
    const memo = material('stakeholder-memo', 'Stakeholder memo', 'Head of Product', spec.stakeholderMemo);
    const notes = material('internal-notes', 'Internal stakeholder notes', 'Company docs', spec.internalNotes);
    const flow = material('existing-flow', 'Existing product flow', 'Product ops', [
        spec.existingFlow.join(' -> '),
    ]);
    const features = material('feature-ideas', 'Possible feature directions', 'PM scratchpad', [
        featureIdeaText(spec),
    ]);
    const impact = material('impact-examples', 'Problem to business impact examples', 'Analysis notes', [
        impactMapText(spec),
    ]);

    switch (moduleNumber) {
        case 1:
            return [productBrief, analytics, memo, flow];
        case 2:
            return [feedback, tickets];
        case 3:
            return [feedback, tickets, analytics, impact];
        case 4:
            return [feedback, analytics, notes];
        case 5:
            return [feedback, flow, features];
        case 6:
            return [features, notes, analytics];
        case 7:
            return [productBrief, features, notes];
        case 8:
            return [flow, features, notes];
        case 9:
            return [memo, analytics, notes];
        default:
            return [productBrief, analytics, feedback, features];
    }
}

function action(
    spec: ProductManagementSimulationSpec,
    moduleNumber: number,
    title: string,
    description: string,
    prdTitle: string,
    prdFields: PRDField[],
    expectedAnswerGuide: string[],
    points: number,
    artifactType: WeeklyActionItem['artifactType'],
    category: WeeklyActionItem['category'] = 'document'
): WeeklyActionItem {
    return {
        id: `${spec.id}-m${moduleNumber}`,
        week: moduleNumber,
        dueWeek: moduleNumber,
        title,
        description,
        category,
        actionType: 'submit_prd',
        priority: moduleNumber === 10 ? 'urgent' : moduleNumber <= 4 ? 'high' : 'normal',
        prdTitle,
        prdFields,
        workplaceScenario: scenarioForModule(spec, moduleNumber),
        workplaceMaterials: moduleMaterials(spec, moduleNumber),
        learnerInstruction: description,
        outputTemplate: outputTemplate(prdFields),
        expectedAnswerGuide,
        scoringRubric: rubric(points, title),
        feedbackCriteria: [
            'Uses direct evidence from the workplace materials.',
            'Separates observed user pain from assumed solutions.',
            'Connects the recommendation to the business goal and metric.',
            'Keeps the deliverable practical for an entry-level PM internship project.',
        ],
        artifactType,
    };
}

function scenarioForModule(spec: ProductManagementSimulationSpec, moduleNumber: number): string {
    const scenarios = [
        `You just joined ${spec.companyName} as a Product Management Intern. The Head of Product wants you to understand the company context before proposing any solution.`,
        'Customer Support has shared messy complaints and app reviews from users who got stuck. Your job is to find repeated pain points, not jump straight to features.',
        'The product team needs to know which user problems are also business problems. Connect user friction to the product metric leadership cares about.',
        'Your manager wants one sharp problem statement that can align Product, Engineering, Support, and Growth.',
        'Now that the problem is framed, you can suggest practical feature ideas that address the evidence.',
        'Engineering only has limited MVP capacity. You must choose one feature direction using Impact vs Effort trade-offs.',
        'The Engineering Lead needs a mini PRD for the selected MVP feature before design and build can start.',
        'Engineering is asking for implementation-ready user stories and testable acceptance criteria.',
        'The Head of Product wants a concise stakeholder update that explains the recommendation, evidence, priority, and next step.',
        `Package the full ${spec.companyName} project into a portfolio-ready PM case study that shows your thinking and deliverables.`,
    ];

    return scenarios[moduleNumber - 1];
}

export function buildProductManagementSimulation(spec: ProductManagementSimulationSpec): SimulationConfig {
    const weeklyActions: WeeklyActionItem[] = [
        action(
            spec,
            1,
            'Understand the Company and Product Problem',
            'Read the company brief, analytics, stakeholder memo, and existing flow. Summarize what the product does, who it serves, what problem the company faces, why it matters, and which metric is affected.',
            'Product Problem Summary',
            [
                { id: 'product', label: `What does ${spec.companyName} do?`, type: 'textarea', required: true, placeholder: spec.productDescription },
                { id: 'users', label: 'Who are the target users?', type: 'textarea', required: true, placeholder: spec.targetUsers },
                { id: 'problem', label: 'What problem is the company facing?', type: 'textarea', required: true, placeholder: spec.mainProductProblem },
                { id: 'importance', label: 'Why does this problem matter?', type: 'textarea', required: true, placeholder: `Connect the problem to ${spec.businessGoal}.` },
                { id: 'metric', label: 'What metric is affected?', type: 'text', required: true, placeholder: spec.keyMetric },
            ],
            [
                `Identifies ${spec.companyName} as the company and explains the product in plain language.`,
                `Names the right user group: ${spec.targetUsers}.`,
                `Connects the main problem to ${spec.keyMetric}.`,
                'Explains why solving it matters commercially, not only emotionally.',
            ],
            15,
            'project_charter'
        ),
        action(
            spec,
            2,
            'Review User Feedback and Identify Pain Points',
            'Read the user complaints, reviews, and support tickets. Group repeated complaints into the top three pain points and cite evidence for each one.',
            'Top 3 User Pain Points',
            [
                { id: 'pain1', label: 'Pain point 1', type: 'textarea', required: true, placeholder: 'Name the user problem and summarize the evidence.' },
                { id: 'pain2', label: 'Pain point 2', type: 'textarea', required: true, placeholder: 'Name the user problem and summarize the evidence.' },
                { id: 'pain3', label: 'Pain point 3', type: 'textarea', required: true, placeholder: 'Name the user problem and summarize the evidence.' },
                { id: 'why', label: 'Why these pain points matter', type: 'textarea', required: true, placeholder: 'Explain how these pain points affect user progress.' },
            ],
            [
                'Groups similar complaints instead of listing every quote separately.',
                'Uses support tickets or feedback quotes as evidence.',
                'Avoids feature recommendations at this stage.',
                'Explains why each pain point blocks user progress.',
            ],
            15,
            'user_research'
        ),
        action(
            spec,
            3,
            'Separate User Problems from Business Problems',
            'Create a problem-to-business-impact map. Show how user confusion, friction, or trust issues affect the business goal and metric.',
            'Problem to Business Impact Map',
            [
                { id: 'map1', label: 'User problem 1 -> business impact -> metric', type: 'textarea', required: true, placeholder: spec.impactMapExamples[0]?.businessImpact },
                { id: 'map2', label: 'User problem 2 -> business impact -> metric', type: 'textarea', required: true, placeholder: spec.impactMapExamples[1]?.businessImpact },
                { id: 'map3', label: 'User problem 3 -> business impact -> metric', type: 'textarea', required: true, placeholder: spec.impactMapExamples[2]?.businessImpact },
            ],
            [
                'Separates what users experience from what the company loses.',
                `Connects the map to ${spec.keyMetric}.`,
                'Shows business reasoning without ignoring the user experience.',
            ],
            15,
            'metrics_report'
        ),
        action(
            spec,
            4,
            'Define the Main Product Problem Statement',
            'Write one clear product problem statement that includes the user affected, the problem experienced, evidence, business impact, and the final statement.',
            'Product Problem Statement',
            [
                { id: 'user_affected', label: 'User affected', type: 'textarea', required: true, placeholder: spec.targetUsers },
                { id: 'problem_experienced', label: 'Problem experienced', type: 'textarea', required: true, placeholder: spec.mainProductProblem },
                { id: 'evidence', label: 'Evidence', type: 'textarea', required: true, placeholder: 'Use analytics, support tickets, and user feedback.' },
                { id: 'business_impact', label: 'Business impact', type: 'textarea', required: true, placeholder: `Low ${spec.keyMetric}.` },
                { id: 'final_statement', label: 'Final problem statement', type: 'textarea', required: true, placeholder: `${spec.mainProductProblem} because...` },
            ],
            [
                'Frames the problem without prescribing the solution too early.',
                'Mentions the affected user group and the business impact.',
                'Uses evidence from the documents.',
                'Can be read aloud in a product team meeting without extra explanation.',
            ],
            15,
            'decision_log'
        ),
        action(
            spec,
            5,
            'Generate Feature Ideas',
            'Suggest feature ideas that could solve the framed problem. For each idea, explain which user problem it addresses.',
            'Feature Idea List',
            [
                { id: 'ideas', label: 'Feature idea list', type: 'textarea', required: true, placeholder: featureIdeaText(spec) },
                { id: 'problem_fit', label: 'Problem each idea solves', type: 'textarea', required: true, placeholder: 'Map each idea to a pain point.' },
                { id: 'constraints', label: 'Important constraints', type: 'textarea', required: true, placeholder: 'Mention MVP timing, compliance, engineering, support, or operational limits.' },
            ],
            [
                'Includes multiple practical ideas, not one fixed answer.',
                'Links each idea back to an observed pain point.',
                'Respects the MVP constraint and stakeholder concerns.',
            ],
            10,
            'roadmap'
        ),
        action(
            spec,
            6,
            'Prioritize Features Using Impact vs Effort',
            'Rank the feature ideas by user impact, business impact, effort, and priority. Select one MVP feature and defend the trade-off.',
            'Impact vs Effort Matrix',
            [
                { id: 'matrix', label: 'Impact vs Effort matrix', type: 'textarea', required: true, placeholder: 'Feature | User impact | Business impact | Effort | Priority' },
                { id: 'mvp', label: 'Recommended MVP feature', type: 'text', required: true, placeholder: spec.selectedMvpFeature },
                { id: 'reason', label: 'Why this feature first?', type: 'textarea', required: true, placeholder: spec.selectedMvpReason },
            ],
            [
                `Selects a credible MVP such as ${spec.selectedMvpFeature}.`,
                'Explains why impact is high enough and effort is realistic.',
                'Shows trade-off thinking instead of treating every feature as equal.',
            ],
            15,
            'roadmap'
        ),
        action(
            spec,
            7,
            'Write a Mini PRD',
            'Document the selected MVP feature in a mini PRD that a designer and engineer could use to start discovery and implementation.',
            'Mini Product Requirements Document',
            [
                { id: 'feature_name', label: 'Feature name', type: 'text', required: true, placeholder: spec.selectedMvpFeature },
                { id: 'background', label: 'Background', type: 'textarea', required: true, placeholder: `Context from ${spec.companyName}, user feedback, and analytics.` },
                { id: 'problem_statement', label: 'Problem statement', type: 'textarea', required: true, placeholder: spec.mainProductProblem },
                { id: 'target_users', label: 'Target users', type: 'textarea', required: true, placeholder: spec.targetUsers },
                { id: 'goal', label: 'Goal', type: 'textarea', required: true, placeholder: spec.businessGoal },
                { id: 'success_metric', label: 'Success metric', type: 'text', required: true, placeholder: spec.keyMetric },
                { id: 'user_flow', label: 'User flow', type: 'textarea', required: true, placeholder: spec.existingFlow.join(' -> ') },
                { id: 'requirements', label: 'Functional requirements', type: 'textarea', required: true, placeholder: 'List must-have behavior for MVP.' },
                { id: 'out_of_scope', label: 'Out of scope', type: 'textarea', required: true, placeholder: 'List what will not be built in MVP.' },
                { id: 'risks', label: 'Risks and assumptions', type: 'textarea', required: true, placeholder: 'List product, engineering, compliance, or operational risks.' },
            ],
            [
                'PRD is structured and specific enough for delivery conversations.',
                'Success metric matches the business goal.',
                'Requirements describe behavior, not vague intent.',
                'Out-of-scope section prevents MVP creep.',
            ],
            15,
            'prd'
        ),
        action(
            spec,
            8,
            'Create User Stories and Acceptance Criteria',
            'Translate the PRD into implementation-ready user stories with acceptance criteria for engineering.',
            'User Stories and Acceptance Criteria',
            [
                { id: 'story1', label: 'User story 1 and acceptance criteria', type: 'textarea', required: true, placeholder: 'As a new user, I want..., so that...\nAcceptance criteria: ...' },
                { id: 'story2', label: 'User story 2 and acceptance criteria', type: 'textarea', required: true, placeholder: 'As a support/product/ops stakeholder, I want..., so that...' },
                { id: 'story3', label: 'User story 3 and acceptance criteria', type: 'textarea', required: true, placeholder: 'Include a testable edge case or system behavior.' },
            ],
            [
                'Uses the format: As a user, I want, so that.',
                'Acceptance criteria are testable and observable.',
                'Stories cover the primary user and at least one operational or edge case need.',
            ],
            10,
            'prd'
        ),
        {
            id: `${spec.id}-m9`,
            week: 9,
            dueWeek: 9,
            title: 'Prepare a Stakeholder Update',
            description: 'Write an update to Product, Engineering, Growth, Support, and any other relevant stakeholder. Include recommendation, evidence, reason for priority, and next step.',
            category: 'document',
            actionType: 'decision_text',
            priority: 'high',
            decisionPrompt: 'Stakeholder update message',
            decisionPlaceholder: `Subject: Recommendation to improve ${spec.keyMetric}\n\nSummary:\nKey evidence:\nRecommended solution: ${spec.selectedMvpFeature}\nReason for priority:\nNext step:`,
            workplaceScenario: scenarioForModule(spec, 9),
            workplaceMaterials: moduleMaterials(spec, 9),
            learnerInstruction: 'Write a concise workplace update that a Head of Product could forward to cross-functional stakeholders.',
            outputTemplate: [
                { id: 'subject', label: 'Subject' },
                { id: 'summary', label: 'Summary' },
                { id: 'evidence', label: 'Key evidence' },
                { id: 'solution', label: 'Recommended solution' },
                { id: 'priority', label: 'Reason for priority' },
                { id: 'next_step', label: 'Next step' },
            ],
            expectedAnswerGuide: [
                'Short enough for a workplace update.',
                'Uses evidence and makes one recommendation.',
                'Explains why this should be the MVP priority.',
                'Names the next action for Product or Engineering.',
            ],
            scoringRubric: rubric(5, 'Stakeholder communication'),
            feedbackCriteria: [
                'Direct, concise, and stakeholder-aware.',
                'Balances user pain, business impact, and implementation constraint.',
                'Avoids vague status updates without a next step.',
            ],
            artifactType: 'stakeholder_update',
        },
        action(
            spec,
            10,
            'Create a Portfolio Case Study Summary',
            'Turn the full simulation into a portfolio-ready PM case study. Show the problem, evidence, prioritization, selected solution, PRD summary, user stories, skills demonstrated, and what you would measure after launch.',
            'Portfolio-Ready PM Case Study',
            [
                { id: 'title', label: 'Project title', type: 'text', required: true, placeholder: spec.finalPortfolioOutcome },
                { id: 'role', label: 'Role', type: 'text', required: true, placeholder: 'Product Management Intern' },
                { id: 'context', label: 'Product context', type: 'textarea', required: true, placeholder: spec.productDescription },
                { id: 'problem', label: 'Problem', type: 'textarea', required: true, placeholder: spec.mainProductProblem },
                { id: 'insights', label: 'Research insights', type: 'textarea', required: true, placeholder: 'Top user pain points and evidence.' },
                { id: 'prioritization', label: 'Prioritization approach', type: 'textarea', required: true, placeholder: 'Impact vs Effort summary.' },
                { id: 'solution', label: 'Selected solution', type: 'textarea', required: true, placeholder: spec.selectedMvpFeature },
                { id: 'prd_summary', label: 'PRD summary', type: 'textarea', required: true, placeholder: 'Goal, success metric, core requirements.' },
                { id: 'stories', label: 'User stories created', type: 'textarea', required: true, placeholder: 'Summarize 2-3 user stories.' },
                { id: 'measurement', label: 'What I would measure after launch', type: 'textarea', required: true, placeholder: spec.keyMetric },
            ],
            [
                'Reads like a portfolio case study, not a classroom worksheet.',
                'Shows evidence, decisions, and deliverables.',
                'Includes a clear selected solution and measurement plan.',
                'Demonstrates entry-level PM thinking across discovery and delivery.',
            ],
            10,
            'project_charter'
        ),
    ];

    const weeklySignals: WeeklySignal[] = [
        {
            id: `${spec.id}-signal-1`,
            week: 1,
            source: 'Head of Product',
            sourceInitials: 'HP',
            sourceColor: 'bg-blue-500/20 text-blue-400',
            message: `${spec.companyName} needs a clear recommendation for ${spec.keyMetric}. Start with the evidence before proposing features.`,
            severity: 'info',
            tags: ['brief', 'product'],
        },
        {
            id: `${spec.id}-signal-2`,
            week: 2,
            source: 'Customer Support',
            sourceInitials: 'CS',
            sourceColor: 'bg-emerald-500/20 text-emerald-400',
            message: 'Support shared recent complaints. Look for patterns, not isolated anecdotes.',
            severity: 'warning',
            tags: ['support', 'feedback'],
        },
        {
            id: `${spec.id}-signal-6`,
            week: 6,
            source: 'Engineering Lead',
            sourceInitials: 'EN',
            sourceColor: 'bg-purple-500/20 text-purple-400',
            message: 'Engineering has limited MVP capacity. Please prioritize one practical improvement.',
            severity: 'warning',
            tags: ['mvp', 'engineering'],
        },
        {
            id: `${spec.id}-signal-10`,
            week: 10,
            source: 'PM Mentor',
            sourceInitials: 'PM',
            sourceColor: 'bg-primary/20 text-primary',
            message: 'Package your work into a case study. Show how you moved from evidence to decision.',
            severity: 'success',
            tags: ['portfolio'],
        },
    ];

    const weeklyEvents: WeeklyEvent[] = [
        {
            id: `${spec.id}-event-kickoff`,
            week: 1,
            type: 'meeting',
            title: `${spec.companyName} Product Kickoff`,
            description: 'Your PM mentor is opening the project and assigning the first analysis task.',
            from: 'PM Mentor',
            fromInitials: 'PM',
            fromColor: 'bg-blue-500/20 text-blue-400',
            priority: 'high',
            requiresAction: true,
            actionId: `${spec.id}-m1`,
            timeInWeek: 300,
        },
        {
            id: `${spec.id}-event-prd-review`,
            week: 7,
            type: 'request',
            title: 'Mini PRD Request',
            description: 'Engineering needs the selected MVP feature documented clearly before sprint planning.',
            from: 'Engineering Lead',
            fromInitials: 'EN',
            fromColor: 'bg-purple-500/20 text-purple-400',
            priority: 'high',
            requiresAction: true,
            actionId: `${spec.id}-m7`,
        },
        {
            id: `${spec.id}-event-final`,
            week: 10,
            type: 'request',
            title: 'Portfolio Case Study Due',
            description: 'Your manager wants the final case study summary for your internship portfolio.',
            from: 'Head of Product',
            fromInitials: 'HP',
            fromColor: 'bg-primary/20 text-primary',
            priority: 'urgent',
            requiresAction: true,
            actionId: `${spec.id}-m10`,
        },
    ];

    const timelinePhases: TimelinePhase[] = weeklyActions.map((item, index) => ({
        id: `${spec.id}-phase-${index + 1}`,
        name: `Module ${index + 1}`,
        status: index === 0 ? 'active' : 'pending',
        description: item.title,
        actionId: item.id,
        week: index + 1,
    }));

    const tasks: SimulationTask[] = weeklyActions.map((item, index) => ({
        id: `${spec.id}-task-${index + 1}`,
        type: item.artifactType ?? item.actionType,
        title: item.title,
        description: item.description,
        requirements: item.outputTemplate?.map((templateItem) => templateItem.label) ?? [],
    }));

    return {
        id: spec.id,
        name: spec.name,
        companyName: spec.companyName,
        industry: spec.industry,
        archetype: 'growth',
        logo: spec.companyName.slice(0, 2).toUpperCase(),
        primaryColor: spec.primaryColor,
        description: spec.productDescription,
        founded: '2024',
        employees: spec.employees,
        headquarters: spec.headquarters,
        budget: spec.budget,
        fundingStatus: spec.fundingStatus,
        challenge: spec.mainProductProblem,
        challengeDetails: `${spec.companyName} has asked you to investigate ${spec.mainProductProblem.toLowerCase()} and recommend one MVP product improvement that can improve ${spec.keyMetric.toLowerCase()}.`,
        totalWeeks: 10,
        teamSize: spec.stakeholders.length + 2,
        durationHours: 4,
        difficulty: spec.difficulty,
        passThreshold: 70,
        strongPassThreshold: 85,
        kpis: spec.kpis,
        stakeholders: spec.stakeholders,
        successCriteria: weeklyActions.map((item, index) => ({
            id: `${spec.id}-success-${index + 1}`,
            description: item.prdTitle ?? item.title,
            completed: false,
            weekDue: index + 1,
            priority: index < 8 ? 'high' : 'medium',
        })),
        timelinePhases,
        currentRisks: spec.risks,
        tasks,
        actions: [],
        weeklySignals,
        weeklyEvents,
        weeklyActions,
        evaluationRubrics: Object.fromEntries(weeklyActions.map((item) => [item.id, item.scoringRubric ?? []])),
        promptEngine: TURNVE_PM_SIMULATION_PROMPT_ENGINE,
        marketContext: spec.marketContext,
        technicalStack: spec.technicalStack,
        projectType: 'Product Management Internship Simulation',
    };
}
