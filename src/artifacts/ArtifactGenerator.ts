import type {
  Artifact,
  ArtifactType,
  PRDContent,
  RoadmapContent,
  StakeholderUpdateContent,
  RetrospectiveContent,
  RiskAssessmentContent,
  DecisionLogContent,
  ProjectCharterContent,
  UserStory,
  ArtifactSection,
} from './types';
import type { GameState, Scenario, Phase } from '../simulation/core/SimulationEngine';

export interface ArtifactGenerationOptions {
  includeRecommendations?: boolean;
  detailLevel?: 'summary' | 'standard' | 'detailed';
  includeHistory?: boolean;
}

export class ArtifactGenerator {
  private gameState: GameState;
  private scenario: Scenario;

  constructor(gameState: GameState, scenario: Scenario) {
    this.gameState = gameState;
    this.scenario = scenario;
  }

  generateArtifact(
    type: ArtifactType,
    options: ArtifactGenerationOptions = {}
  ): Partial<Artifact> {
    const { detailLevel = 'standard' } = options;

    switch (type) {
      case 'prd':
        return this.generatePRD(detailLevel);
      case 'roadmap':
        return this.generateRoadmap(detailLevel);
      case 'stakeholder_update':
        return this.generateStakeholderUpdate(detailLevel);
      case 'retrospective':
        return this.generateRetrospective(detailLevel);
      case 'risk_assessment':
        return this.generateRiskAssessment(detailLevel);
      case 'decision_log':
        return this.generateDecisionLog(detailLevel);
      case 'project_charter':
        return this.generateProjectCharter(detailLevel);
      default:
        throw new Error(`Unknown artifact type: ${type}`);
    }
  }

  private generatePRD(detailLevel: string): Partial<Artifact> {
    const currentPhase = this.scenario.phases.find(
      p => p.id === this.gameState.currentPhaseId
    );

    const content: PRDContent = {
      sections: [],
      problemStatement: this.generateProblemStatement(),
      goals: this.generateGoals(),
      userStories: this.generateUserStories(),
      acceptanceCriteria: this.generateAcceptanceCriteria(),
      technicalRequirements: detailLevel === 'detailed' ? this.generateTechnicalRequirements() : undefined,
      successMetrics: this.generateSuccessMetrics(),
      timeline: this.generateTimeline(),
      dependencies: this.generateDependencies(),
    };

    const sections: ArtifactSection[] = [
      {
        id: 'overview',
        title: 'Overview',
        content: `**Project:** ${this.scenario.name}\n\n**Phase:** ${currentPhase?.name || 'Current'}\n\n**Week:** ${this.gameState.week}/${this.gameState.totalWeeks}\n\n${content.problemStatement}`,
        type: 'text',
        order: 1,
      },
      {
        id: 'goals',
        title: 'Goals & Objectives',
        content: content.goals.map(g => `• ${g}`).join('\n'),
        type: 'list',
        order: 2,
      },
      {
        id: 'user-stories',
        title: 'User Stories',
        content: content.userStories
          .map(
            us =>
              `**${us.title}** (${us.priority})\n${us.description}\n\nAcceptance Criteria:\n${us.acceptanceCriteria.map(ac => `  ✓ ${ac}`).join('\n')}`
          )
          .join('\n\n'),
        type: 'text',
        order: 3,
      },
    ];

    if (detailLevel === 'detailed') {
      sections.push(
        {
          id: 'technical',
          title: 'Technical Requirements',
          content: content.technicalRequirements?.join('\n• ') || '',
          type: 'list',
          order: 4,
        },
        {
          id: 'success-metrics',
          title: 'Success Metrics',
          content: content.successMetrics.map(m => `• ${m}`).join('\n'),
          type: 'list',
          order: 5,
        }
      );
    }

    content.sections = sections;

    return {
      type: 'prd',
      title: `PRD: ${this.scenario.name} - ${currentPhase?.name || 'Phase'}`,
      description: `Product requirements document for ${this.scenario.name} generated at Week ${this.gameState.week}`,
      content,
    };
  }

  private generateRoadmap(detailLevel: string): Partial<Artifact> {
    const timeline: RoadmapContent['timeline'] = this.scenario.phases.map(phase => ({
      id: phase.id,
      title: phase.name,
      description: phase.description || '',
      startWeek: this.calculatePhaseStartWeek(phase),
      endWeek: this.calculatePhaseEndWeek(phase),
      status: this.getPhaseStatus(phase),
      dependencies: phase.requiredDecisions || [],
      theme: phase.name,
    }));

    const milestones: RoadmapContent['milestones'] = this.scenario.timelineEvents.map(
      event => ({
        id: `milestone-${event.week}`,
        title: event.title,
        description: event.description,
        targetWeek: event.week,
        status: this.gameState.week >= event.week ? 'achieved' : 'pending',
        criteria: ['Complete all phase objectives', 'Pass stakeholder review', 'Meet quality gates'],
      })
    );

    const content: RoadmapContent = {
      sections: [],
      timeline,
      themes: this.scenario.phases.map(p => p.name),
      milestones,
      currentPhase: this.gameState.currentPhaseId,
    };

    const sections: ArtifactSection[] = [
      {
        id: 'timeline',
        title: 'Product Roadmap',
        content: this.formatRoadmapAsTable(timeline),
        type: 'table',
        order: 1,
      },
      {
        id: 'milestones',
        title: 'Key Milestones',
        content: milestones
          .map(
            m =>
              `**${m.title}** (Week ${m.targetWeek}) - ${m.status.toUpperCase()}\n${m.description}`
          )
          .join('\n\n'),
        type: 'text',
        order: 2,
      },
    ];

    if (detailLevel === 'detailed') {
      sections.push({
        id: 'dependencies',
        title: 'Dependencies & Risks',
        content: this.generateDependencyAnalysis(),
        type: 'text',
        order: 3,
      });
    }

    content.sections = sections;

    return {
      type: 'roadmap',
      title: `${this.scenario.name} - Product Roadmap`,
      description: `Strategic roadmap showing phases, milestones, and dependencies`,
      content,
    };
  }

  private generateStakeholderUpdate(_detailLevel: string): Partial<Artifact> {
    const content: StakeholderUpdateContent = {
      sections: [],
      period: `Week ${this.gameState.week}`,
      highlights: this.generateHighlights(),
      metrics: this.generateMetricSnapshots() as never,
      risks: this.generateRiskItems() as never,
      upcomingWork: this.generateUpcomingWork(),
      decisionsMade: this.gameState.decisionsMade.map(
        d => `${d.description} (Week ${d.week})`
      ),
    };

    const sections: ArtifactSection[] = [
      {
        id: 'executive-summary',
        title: 'Executive Summary',
        content: this.generateExecutiveSummary(),
        type: 'text',
        order: 1,
      },
      {
        id: 'highlights',
        title: 'Key Highlights',
        content: content.highlights.map(h => `✓ ${h}`).join('\n'),
        type: 'list',
        order: 2,
      },
      {
        id: 'metrics',
        title: 'Key Metrics',
        content: this.formatMetricsAsTable(content.metrics),
        type: 'table',
        order: 3,
      },
    ];

    if (_detailLevel !== 'summary') {
      sections.push(
        {
          id: 'risks',
          title: 'Risks & Mitigations',
          content: content.risks
            .map(
              r =>
                `**${r.description}** (Probability: ${r.probability}, Impact: ${r.impact})\nMitigation: ${r.mitigation}`
            )
            .join('\n\n'),
          type: 'text',
          order: 4,
        },
        {
          id: 'upcoming',
          title: 'Upcoming Work',
          content: content.upcomingWork.map(w => `• ${w}`).join('\n'),
          type: 'list',
          order: 5,
        }
      );
    }

    content.sections = sections;

    return {
      type: 'stakeholder_update',
      title: `Stakeholder Update - Week ${this.gameState.week}`,
      description: `Status update for ${this.scenario.name}`,
      content,
    };
  }

  private generateRetrospective(_detailLevel: string): Partial<Artifact> {
    const currentPhase = this.scenario.phases.find(
      p => p.id === this.gameState.currentPhaseId
    );

    const content: RetrospectiveContent = {
      sections: [],
      period: `${currentPhase?.name || 'Current Phase'} (Weeks ${this.calculatePhaseStartWeek(currentPhase!)}-${this.gameState.week})`,
      whatWentWell: this.generateWhatWentWell(),
      whatCouldBeBetter: this.generateWhatCouldBeBetter(),
      actionItems: this.generateActionItems() as never,
      metrics: {
        velocity: Math.round(this.gameState.progress / this.gameState.week),
        bugsFound: Math.floor(Math.random() * 10) + 2,
        teamMorale: Math.round(this.gameState.teamMorale),
        stakeholderSatisfaction: Math.round(
          this.gameState.stakeholders.reduce((acc, s) => acc + s.satisfaction, 0) /
            this.gameState.stakeholders.length
        ),
      },
    };

    const sections: ArtifactSection[] = [
      {
        id: 'metrics',
        title: 'Team Metrics',
        content: `**Velocity:** ${content.metrics.velocity}% per week\n**Team Morale:** ${content.metrics.teamMorale}%\n**Stakeholder Satisfaction:** ${content.metrics.stakeholderSatisfaction}%`,
        type: 'text',
        order: 1,
      },
      {
        id: 'went-well',
        title: 'What Went Well',
        content: content.whatWentWell.map(item => `🌟 ${item}`).join('\n'),
        type: 'list',
        order: 2,
      },
      {
        id: 'improvements',
        title: 'What Could Be Better',
        content: content.whatCouldBeBetter.map(item => `💡 ${item}`).join('\n'),
        type: 'list',
        order: 3,
      },
      {
        id: 'action-items',
        title: 'Action Items',
        content: content.actionItems
          .map(ai => `**${ai.description}** - Owner: ${ai.owner} - Status: ${ai.status}`)
          .join('\n'),
        type: 'text',
        order: 4,
      },
    ];

    content.sections = sections;

    return {
      type: 'retrospective',
      title: `Retrospective - ${currentPhase?.name}`,
      description: `Team reflection for ${currentPhase?.name}`,
      content,
    };
  }

  private generateRiskAssessment(_detailLevel: string): Partial<Artifact> {
    const content: RiskAssessmentContent = {
      sections: [],
      assessmentDate: new Date().toISOString().split('T')[0],
      overallRiskLevel: this.calculateOverallRiskLevel(),
      risks: this.generateDetailedRisks() as never,
      mitigationStrategies: this.generateMitigationStrategies(),
      contingencyPlans: this.generateContingencyPlans(),
    };

    const sections: ArtifactSection[] = [
      {
        id: 'overview',
        title: 'Risk Overview',
        content: `**Overall Risk Level:** ${content.overallRiskLevel.toUpperCase()}\n\n**Assessment Date:** ${content.assessmentDate}\n\n**Current Project Status:** Week ${this.gameState.week}/${this.gameState.totalWeeks}\n\n**Budget Utilization:** ${Math.round(((this.gameState.initialBudget - this.gameState.budget) / this.gameState.initialBudget) * 100)}%`,
        type: 'text',
        order: 1,
      },
      {
        id: 'risk-matrix',
        title: 'Risk Matrix',
        content: this.formatRiskMatrix(content.risks),
        type: 'table',
        order: 2,
      },
      {
        id: 'mitigation',
        title: 'Mitigation Strategies',
        content: content.mitigationStrategies.map(s => `• ${s}`).join('\n'),
        type: 'list',
        order: 3,
      },
    ];

    if (_detailLevel === 'detailed') {
      sections.push({
        id: 'detailed-risks',
        title: 'Detailed Risk Analysis',
        content: content.risks
          .map(
            r =>
              `**${r.description}**\nCategory: ${r.category}\nProbability: ${r.probability}\nImpact: ${r.impact}\nOwner: ${r.owner}\nMitigation: ${r.mitigation}`
          )
          .join('\n\n'),
        type: 'text',
        order: 4,
      });
    }

    content.sections = sections;

    return {
      type: 'risk_assessment',
      title: `Risk Assessment - Week ${this.gameState.week}`,
      description: `Comprehensive risk analysis for ${this.scenario.name}`,
      content,
    };
  }

  private generateDecisionLog(detailLevel: string): Partial<Artifact> {
    const content: DecisionLogContent = {
      sections: [],
      decisions: this.gameState.decisionsMade.map(d => ({
        id: d.id,
        week: d.week,
        date: d.timestamp.toISOString().split('T')[0],
        title: d.description,
        context: `Made during ${this.scenario.phases.find(p => p.id === d.phaseId)?.name || 'project'}`,
        options: [
          {
            id: 'selected',
            label: 'Selected',
            description: d.description,
            pros: ['Aligned with objectives', 'Optimal resource utilization'],
            cons: ['Some stakeholder resistance', 'Implementation complexity'],
            risk: 'medium',
          },
        ],
        selectedOption: 'selected',
        rationale: d.feedback || 'Based on project goals and constraints',
        stakeholders: this.gameState.stakeholders.map(s => s.name),
        outcome: `Implemented in Week ${d.week + 1}`,
      })),
    };

    const sections: ArtifactSection[] = [
      {
        id: 'decisions',
        title: 'Decision Log',
        content: content.decisions
          .map(
            d =>
              `**${d.title}** (Week ${d.week})\n${d.rationale}\nOutcome: ${d.outcome}`
          )
          .join('\n\n'),
        type: 'text',
        order: 1,
      },
    ];

    content.sections = sections;

    return {
      type: 'decision_log',
      title: `Decision Log - ${this.scenario.name}`,
      description: `Record of all key decisions made during the project`,
      content,
    };
  }

  private generateProjectCharter(detailLevel: string): Partial<Artifact> {
    const content: ProjectCharterContent = {
      sections: [],
      projectName: this.scenario.name,
      projectManager: 'You (Product Manager)',
      startDate: this.gameState.startedAt.toISOString().split('T')[0],
      endDate: this.calculateEndDate(),
      budget: `$${this.gameState.initialBudget}K`,
      objectives: this.scenario.phases.flatMap(p => p.objectives),
      scope: this.scenario.description,
      stakeholders: this.gameState.stakeholders.map(s => `${s.name} (${s.role})`),
      deliverables: this.generateDeliverables(),
      successCriteria: [
        'Complete all phase objectives',
        'Stay within budget constraints',
        'Maintain team morale above 60%',
        'Achieve stakeholder satisfaction > 75%',
        'Deliver on schedule',
      ],
      assumptions: [
        'Team capacity remains constant',
        'No major market changes',
        'Stakeholder availability maintained',
      ],
      constraints: [
        `Budget: $${this.gameState.initialBudget}K`,
        `Timeline: ${this.gameState.totalWeeks} weeks`,
        'Team size: 4 members',
      ],
    };

    const sections: ArtifactSection[] = [
      {
        id: 'overview',
        title: 'Project Overview',
        content: `**Project:** ${content.projectName}\n\n**Description:** ${content.scope}\n\n**Project Manager:** ${content.projectManager}\n\n**Duration:** ${content.startDate} to ${content.endDate}\n\n**Budget:** ${content.budget}`,
        type: 'text',
        order: 1,
      },
      {
        id: 'objectives',
        title: 'Objectives',
        content: content.objectives.map(o => `• ${o}`).join('\n'),
        type: 'list',
        order: 2,
      },
      {
        id: 'stakeholders',
        title: 'Key Stakeholders',
        content: content.stakeholders.join('\n'),
        type: 'list',
        order: 3,
      },
      {
        id: 'success-criteria',
        title: 'Success Criteria',
        content: content.successCriteria.map(sc => `✓ ${sc}`).join('\n'),
        type: 'list',
        order: 4,
      },
    ];

    content.sections = sections;

    return {
      type: 'project_charter',
      title: `Project Charter - ${this.scenario.name}`,
      description: `Official project charter and scope definition`,
      content,
    };
  }

  // Helper methods
  private generateProblemStatement(): string {
    return `As ${this.scenario.name}, we need to successfully deliver this project while balancing scope, budget, timeline, and stakeholder expectations. The primary challenge is managing ${this.gameState.totalWeeks} weeks of work with a $${this.gameState.initialBudget}K budget while maintaining team morale and stakeholder satisfaction.`;
  }

  private generateGoals(): string[] {
    return [
      'Complete all project phases on time',
      'Stay within allocated budget',
      'Maintain team morale above 60%',
      'Achieve stakeholder satisfaction > 75%',
      'Deliver quality outcomes that meet objectives',
    ];
  }

  private generateUserStories(): UserStory[] {
    return [
      {
        id: 'us-1',
        title: 'Project Planning',
        description: 'As a product manager, I need to define clear project scope and timeline so that the team understands what to deliver.',
        acceptanceCriteria: [
          'Project charter created and approved',
          'Timeline defined with milestones',
          'Success criteria documented',
        ],
        priority: 'critical',
        storyPoints: 5,
      },
      {
        id: 'us-2',
        title: 'Stakeholder Management',
        description: 'As a product manager, I need to keep stakeholders informed and aligned so that we maintain support throughout the project.',
        acceptanceCriteria: [
          'Regular status updates provided',
          'Stakeholder concerns addressed promptly',
          'Alignment achieved on key decisions',
        ],
        priority: 'high',
        storyPoints: 3,
      },
      {
        id: 'us-3',
        title: 'Risk Mitigation',
        description: 'As a product manager, I need to identify and mitigate risks so that the project stays on track.',
        acceptanceCriteria: [
          'Risk assessment completed',
          'Mitigation strategies implemented',
          'Contingency plans documented',
        ],
        priority: 'high',
        storyPoints: 5,
      },
    ];
  }

  private generateAcceptanceCriteria(): string[] {
    return [
      'All phase objectives completed',
      'Budget variance within ±10%',
      'Team morale maintained above 60%',
      'Stakeholder satisfaction above 75%',
      'No critical risks materialized',
    ];
  }

  private generateTechnicalRequirements(): string[] {
    return [
      'System reliability: 99.9% uptime',
      'Response time: < 200ms',
      'Security compliance: SOC 2',
      'Scalability: Support 10x growth',
    ];
  }

  private generateSuccessMetrics(): string[] {
    return [
      'On-time delivery rate: 100%',
      'Budget adherence: ±5%',
      'Team satisfaction: > 70%',
      'Stakeholder NPS: > 50',
      'Quality score: > 85%',
    ];
  }

  private generateTimeline(): string {
    return this.scenario.phases
      .map(p => `Week ${this.calculatePhaseStartWeek(p)}-${this.calculatePhaseEndWeek(p)}: ${p.name}`)
      .join('\n');
  }

  private generateDependencies(): string[] {
    return [
      'Stakeholder approvals required',
      'Team capacity availability',
      'Budget allocation confirmed',
      'Technical infrastructure ready',
    ];
  }

  private calculatePhaseStartWeek(phase: Phase): number {
    let startWeek = 1;
    for (const p of this.scenario.phases) {
      if (p.id === phase.id) break;
      startWeek += p.duration;
    }
    return startWeek;
  }

  private calculatePhaseEndWeek(phase: Phase): number {
    return this.calculatePhaseStartWeek(phase) + phase.duration - 1;
  }

  private getPhaseStatus(phase: Phase): RoadmapContent['timeline'][0]['status'] {
    const startWeek = this.calculatePhaseStartWeek(phase);
    const endWeek = this.calculatePhaseEndWeek(phase);
    
    if (this.gameState.week > endWeek) return 'completed';
    if (this.gameState.week >= startWeek && this.gameState.week <= endWeek) return 'in-progress';
    return 'planned';
  }

  private formatRoadmapAsTable(timeline: RoadmapContent['timeline']): string {
    return timeline
      .map(t => `${t.title} | Week ${t.startWeek}-${t.endWeek} | ${t.status.toUpperCase()}`)
      .join('\n');
  }

  private generateDependencyAnalysis(): string {
    return `Key Dependencies:\n\n1. Stakeholder approvals required for major decisions\n2. Team capacity affects delivery timeline\n3. Budget constraints limit options\n4. Technical dependencies must be resolved before implementation`;
  }

  private generateHighlights(): string[] {
    const highlights = [];
    if (this.gameState.week > 1) {
      highlights.push(`Completed ${this.gameState.week - 1} weeks of work`);
    }
    if (this.gameState.decisionsMade.length > 0) {
      highlights.push(`Made ${this.gameState.decisionsMade.length} key decisions`);
    }
    if (this.gameState.progress > 25) {
      highlights.push(`Achieved ${Math.round(this.gameState.progress)}% project completion`);
    }
    if (this.gameState.teamMorale > 75) {
      highlights.push('Maintained high team morale');
    }
    return highlights.length > 0 ? highlights : ['Project initiated', 'Team assembled', 'Planning completed'];
  }

  private generateMetricSnapshots(): { name: string; value: string; trend: 'up' | 'down' | 'stable'; target: string; status: string }[] {
    return [
      {
        name: 'Project Progress',
        value: `${Math.round(this.gameState.progress)}%`,
        trend: 'up',
        target: '100%',
        status: this.gameState.progress > 50 ? 'on-track' : this.gameState.progress > 25 ? 'on-track' : 'at-risk',
      },
      {
        name: 'Budget Remaining',
        value: `$${this.gameState.budget}K`,
        trend: 'down',
        target: `$${this.gameState.initialBudget * 0.2}K`,
        status: this.gameState.budget > this.gameState.initialBudget * 0.3 ? 'on-track' : 'at-risk',
      },
      {
        name: 'Team Morale',
        value: `${Math.round(this.gameState.teamMorale)}%`,
        trend: this.gameState.teamMorale > 70 ? 'stable' : 'down',
        target: '70%',
        status: this.gameState.teamMorale > 70 ? 'on-track' : 'at-risk',
      },
      {
        name: 'Risk Level',
        value: `${Math.round(this.gameState.riskLevel * 100)}%`,
        trend: this.gameState.riskLevel > 0.5 ? 'up' : 'stable',
        target: '< 40%',
        status: this.gameState.riskLevel < 0.4 ? 'on-track' : 'at-risk',
      },
    ];
  }

  private generateRiskItems() {
    return [
      {
        id: 'risk-1',
        description: 'Budget overrun due to scope changes',
        probability: this.gameState.budget < this.gameState.initialBudget * 0.5 ? 'high' : 'medium',
        impact: 'high',
        mitigation: 'Regular budget reviews and change control process',
        status: 'active',
      },
      {
        id: 'risk-2',
        description: 'Team burnout affecting morale',
        probability: this.gameState.teamMorale < 60 ? 'high' : 'medium',
        impact: 'medium',
        mitigation: 'Monitor workload and provide support',
        status: 'active',
      },
      {
        id: 'risk-3',
        description: 'Stakeholder misalignment on priorities',
        probability: 'medium',
        impact: 'medium',
        mitigation: 'Regular communication and alignment sessions',
        status: 'active',
      },
    ];
  }

  private generateUpcomingWork(): string[] {
    const upcoming = [];
    const currentPhase = this.scenario.phases.find(p => p.id === this.gameState.currentPhaseId);
    
    if (currentPhase) {
      const remainingObjectives = currentPhase.objectives.filter((_, i) => i >= this.gameState.week % 3);
      upcoming.push(...remainingObjectives.slice(0, 3));
    }
    
    upcoming.push(`Complete ${currentPhase?.name || 'current phase'} objectives`);
    upcoming.push('Prepare for next phase transition');
    
    return upcoming;
  }

  private generateExecutiveSummary(): string {
    return `Project ${this.scenario.name} is currently at Week ${this.gameState.week} of ${this.gameState.totalWeeks}. We have achieved ${Math.round(this.gameState.progress)}% completion with $${this.gameState.budget}K remaining budget. Key highlights include successful completion of project initiation and planning phases. Team morale is at ${Math.round(this.gameState.teamMorale)}% and stakeholder satisfaction remains positive. Risk levels are being actively monitored and managed.`;
  }

  private formatMetricsAsTable(metrics: { name: string; value: string; target?: string; status: string }[]): string {
    return metrics.map(m => `${m.name} | ${m.value} | Target: ${m.target} | ${m.status.toUpperCase()}`).join('\n');
  }

  private generateWhatWentWell(): string[] {
    return [
      'Successfully navigated early project challenges',
      'Strong stakeholder engagement and alignment',
      'Team collaboration and communication effective',
      'Key decisions made with good outcomes',
      'Budget management on track',
    ];
  }

  private generateWhatCouldBeBetter(): string[] {
    return [
      'Risk management could be more proactive',
      'Team workload distribution needs optimization',
      'Stakeholder communication frequency could increase',
      'Documentation could be more comprehensive',
    ];
  }

  private generateActionItems() {
    return [
      {
        id: 'ai-1',
        description: 'Implement weekly risk review meetings',
        owner: 'Product Manager',
        status: 'open',
      },
      {
        id: 'ai-2',
        description: 'Optimize team workload distribution',
        owner: 'Tech Lead',
        status: 'open',
      },
      {
        id: 'ai-3',
        description: 'Increase stakeholder update frequency',
        owner: 'Product Manager',
        status: 'open',
      },
    ];
  }

  private calculateOverallRiskLevel(): 'critical' | 'high' | 'medium' | 'low' {
    if (this.gameState.riskLevel > 0.7) return 'critical';
    if (this.gameState.riskLevel > 0.5) return 'high';
    if (this.gameState.riskLevel > 0.3) return 'medium';
    return 'low';
  }

  private generateDetailedRisks() {
    return this.generateRiskItems().map(r => ({
      ...r,
      category: 'business' as const,
      identifiedWeek: this.gameState.week - 1,
      owner: 'Product Manager',
      lastReviewed: new Date().toISOString().split('T')[0],
    }));
  }

  private generateMitigationStrategies(): string[] {
    return [
      'Regular budget reviews and forecasting',
      'Team wellness check-ins and support',
      'Proactive stakeholder communication',
      'Risk monitoring and early warning systems',
      'Change control and approval processes',
    ];
  }

  private generateContingencyPlans(): string[] {
    return [
      'Scope reduction options if budget tightens',
      'External contractor availability if needed',
      'Alternative technical approaches identified',
      'Stakeholder escalation paths defined',
    ];
  }

  private formatRiskMatrix(risks: RiskAssessmentContent['risks']): string {
    return risks.map(r => `${r.description} | ${r.probability} | ${r.impact} | ${r.status.toUpperCase()}`).join('\n');
  }

  private calculateEndDate(): string {
    const endDate = new Date(this.gameState.startedAt);
    endDate.setDate(endDate.getDate() + this.gameState.totalWeeks * 7);
    return endDate.toISOString().split('T')[0];
  }

  private generateDeliverables(): string[] {
    return this.scenario.phases.flatMap(p => p.objectives.map(o => `${p.name}: ${o}`));
  }
}

export default ArtifactGenerator;