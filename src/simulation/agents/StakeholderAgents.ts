export interface PMAction {
  type: 'research' | 'communicate' | 'decide' | 'execute' | 'analyze';
  target: string;
  content: string;
}

export interface AgentContext {
  request?: { complexity?: number; scope?: number };
  metricDrop?: number;
  developmentFocus?: string;
  activationRate?: number;
  performanceScore?: number;
}

export abstract class Agent {
  id: string;
  name: string;
  role: string;

  constructor(id: string, name: string, role: string) {
    this.id = id;
    this.name = name;
    this.role = role;
  }

  abstract react(context: AgentContext): PMAction[];
  abstract communicate(message: string): string;
}

export class EngineeringLead extends Agent {
  capacity: number;
  currentProjects: string[];

  constructor() {
    super('eng-lead-01', 'Sarah Johnson', 'Engineering Lead');
    this.capacity = 10; // Available story points for the sprint
    this.currentProjects = [];
  }

  react(context: AgentContext): PMAction[] {
    const actions: PMAction[] = [];
    
    // Simulate engineering perspective on requirements
    if (context.request?.complexity && context.request.complexity > this.capacity * 0.5) {
      actions.push({
        type: 'communicate',
        target: 'pm',
        content: `This feature seems quite complex (${context.request.complexity}). With our current capacity of ${this.capacity} points per sprint, it would require significant time. Could we break it down or consider alternatives?`
      });
    }
    
    return actions;
  }

  communicate(message: string): string {
    // Respond from an engineering perspective
    if (message.includes('time estimate')) {
      return 'Based on the complexity, I estimate 12-16 hours for proper implementation. We\'ll need to account for unit tests, integration tests, and potential refactoring.';
    } else if (message.includes('delay')) {
      return 'Understand the rush, but rushing could lead to tech debt. Recommend allocating adequate time for quality.';
    } else {
      return 'I\'ll assess the technical requirements and get back with a detailed estimate.';
    }
  }
}

export class DesignerAgent extends Agent {
  workload: number; // 0-10 scale
  stylePreference: 'minimalist' | 'detailed' | 'innovative';

  constructor() {
    super('designer-01', 'Michael Chen', 'Product Designer');
    this.workload = 4; // Moderate
    this.stylePreference = 'minimalist';
  }

  react(context: AgentContext): PMAction[] {
    const actions: PMAction[] = [];
    
    if (context.request?.scope && context.request.scope > 5) {
      actions.push({
        type: 'communicate',
        target: 'pm',
        content: `Requesting broad design changes will take considerable time. My current workload is ${this.workload}/10. Suggest focusing on high-impact changes first.`
      });
    }
    
    return actions;
  }

  communicate(message: string): string {
    if (message.includes('ux')) {
      return 'For better user experience, I recommend conducting usability testing on the prototype. Our user research shows that intuitive flows improve retention by up to 40%.';
    } else if (message.includes('aesthetic')) {
      return 'While aesthetics matter, I prioritize functional design principles. Users care more about task completion than visual polish.';
    } else {
      return 'I can create mockups for this. How\'s the timeline look on your end?';
    }
  }
}

export class SupportAgent extends Agent {
  activeTickets: number;
  userSentiment: 'positive' | 'neutral' | 'negative';

  constructor() {
    super('support-01', 'Emma Rodriguez', 'Customer Success');
    this.activeTickets = 12;
    this.userSentiment = 'negative';
  }

  react(context: AgentContext): PMAction[] {
    const actions: PMAction[] = [];
    
    if (context.metricDrop && context.metricDrop > 10) {
      actions.push({
        type: 'communicate',
        target: 'pm',
        content: `I'm seeing increased support tickets regarding user confusion (${this.activeTickets} active). Could correlate with the metric drop. Need product guidance on common pain points.`
      });
    }
    
    return actions;
  }

  communicate(message: string): string {
    if (message.includes('confusing')) {
      return 'Our ticket data shows that users struggle with onboarding, specifically during account linking. Providing clearer instructions could reduce support volume.';
    } else if (message.includes('feature')) {
      return 'I can provide real user feedback on this feature. Our top concern from support is reliability over flashy features.';
    } else {
      return 'Happy to connect a support engineer to discuss user pain points in detail.';
    }
  }
}

export class SalesAgent extends Agent {
  quarterlyTarget: number;
  currentProgress: number;
  keyCustomerRequests: string[];

  constructor() {
    super('sales-01', 'David Kim', 'Head of Sales');
    this.quarterlyTarget = 1000000;
    this.currentProgress = 650000;
    this.keyCustomerRequests = ['Advanced reporting', 'Custom integration'];
  }

  react(context: AgentContext): PMAction[] {
    const actions: PMAction[] = [];
    
    if (context.developmentFocus !== 'customerRequested') {
      actions.push({
        type: 'communicate',
        target: 'pm',
        content: `We're behind on sales targets (${this.currentProgress}/${this.quarterlyTarget}). Key customers are requesting: ${this.keyCustomerRequests.join(', ')}. These could drive significant revenue if implemented.`
      });
    }
    
    return actions;
  }

  communicate(message: string): string {
    if (message.includes('timeline')) {
      return 'If we can deliver the requested features by next month, I can close deals worth $300K. Our biggest prospect is waiting on custom integrations.';
    } else if (message.includes('focus')) {
      return 'While core UX is important, enterprise clients want advanced features and integrations. That\'s where major contracts come from.';
    } else {
      return 'I have customer conversations recorded that would help inform feature priority. Can connect you with key prospects.';
    }
  }
}

export class LeadershipAgent extends Agent {
  strategicPriority: 'growth' | 'margins' | 'market_share' | 'product_quality';
  satisfactionWithProduct: number; // 0-10 scale

  constructor() {
    super('leadership-01', 'Alex Thompson', 'VP of Product');
    this.strategicPriority = 'growth';
    this.satisfactionWithProduct = 7;
  }

  react(context: AgentContext): PMAction[] {
    const actions: PMAction[] = [];
    
    // React to current state vs strategic priorities
    if ((context.activationRate ?? 0) < 55 && this.strategicPriority === 'growth') {
      actions.push({
        type: 'communicate',
        target: 'pm',
        content: `We need to hit 55% activation rate for Q2 growth targets. Current rate is ${context.activationRate}%. Focus on user onboarding improvements should be priority.`
      });
    }
    
    if ((context.performanceScore ?? 0) < 75) {
      actions.push({
        type: 'communicate',
        target: 'pm',
        content: `Overall product performance (score: ${context.performanceScore}) is concerning. We're lagging competitors. Address core issues first before adding new features.`
      });
    }
    
    return actions;
  }

  communicate(message: string): string {
    if (message.includes('strategy')) {
      return 'Focus on our core strategic goal: increasing activation rates. This ties directly to our growth metrics and customer acquisition costs.';
    } else if (message.includes('quarterly')) {
      return 'Q2 is make or break for our growth targets. We need measurable improvements of at least 15% for approval of next quarter\'s budget.';
    } else {
      return 'Success is measured by user retention in first 30 days. Everything should tie back to improving that metric.';
    }
  }
}