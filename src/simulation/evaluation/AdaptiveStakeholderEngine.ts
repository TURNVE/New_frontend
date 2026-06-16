export type StakeholderRole = "ceo" | "cto" | "cfo" | "data_lead" | "support_lead" | "marketing_lead";
export type ResponseType = "challenge" | "support" | "block" | "escalation" | "question";
export type InteractionType = "email" | "slack" | "meeting" | "injection_response";
export type UserHandling = "good" | "neutral" | "poor";
export type TriggerType = "user_claim" | "user_mistake" | "timing" | "injection";

export interface HiddenAgenda {
  primaryGoal: string;
  riskTolerance: number;
  politicalSensitivity: string[];
  resourceConstraints: string[];
}

export interface Position {
  currentPosition: string;
  positionStrength: number;
  hasChangedRecently: boolean;
  changeReason: string | null;
}

export interface InteractionLog {
  timestamp: number;
  stakeholderId: string;
  interactionType: InteractionType;
  userAction: string;
  stakeholderResponse: string;
  userHandling: UserHandling;
  topic: string;
  stakeholderSatisfaction: number;
}

export interface RelationshipState {
  trustLevel: number;
  alignmentCount: number;
  conflictCount: number;
  lastInteraction: InteractionLog | null;
  pendingConcerns: string[];
}

export interface Stakeholder {
  id: string;
  role: StakeholderRole;
  hiddenAgenda: HiddenAgenda;
  relationshipState: RelationshipState;
  positions: Record<string, Position>;
}

export interface StakeholderResponse {
  id: string;
  stakeholderId: string;
  responseType: ResponseType;
  trigger: {
    type: TriggerType;
    details: string;
  };
  content: string;
  urgency: "low" | "medium" | "high";
  requiresResponse: boolean;
}

export interface AdaptiveStakeholderSystem {
  sessionId: string;
  stakeholders: Record<string, Stakeholder>;
  interactionLog: InteractionLog[];
  pendingResponses: StakeholderResponse[];
}

export interface StakeholderConfig {
  id: string;
  role: StakeholderRole;
  primaryGoal: string;
  riskTolerance: number;
  politicalSensitivity: string[];
  resourceConstraints: string[];
}

export interface ProcessUserActionInput {
  userAction: {
    type: InteractionType;
    to: string;
    contentSummary: string;
  };
  claimsInMessage?: string[];
}

export interface ApplyInjectionInput {
  injection: {
    type: "constraint_change" | "feedback" | "position_change";
    stakeholder: string;
    newConstraint?: string;
    feedback?: string;
    newPosition?: string;
  };
}

export interface RecordUserResponseInput {
  stakeholderId: string;
  userResponse: string;
  handlingQuality: UserHandling;
}

const DEFAULT_STAKEHOLDER_CONFIGS: StakeholderConfig[] = [
  {
    id: "ceo",
    role: "ceo",
    primaryGoal: "Revenue growth and company success",
    riskTolerance: 0.5,
    politicalSensitivity: ["revenue", "growth", "market share"],
    resourceConstraints: ["cannot exceed budget", "need board approval for large bets"]
  },
  {
    id: "cto",
    role: "cto",
    primaryGoal: "Technical excellence and system reliability",
    riskTolerance: 0.3,
    politicalSensitivity: ["technical debt", "architecture", "security"],
    resourceConstraints: ["limited engineering bandwidth", "can only ship ONE major feature per quarter"]
  },
  {
    id: "cfo",
    role: "cfo",
    primaryGoal: "Cost efficiency and financial returns",
    riskTolerance: 0.2,
    politicalSensitivity: ["budget", "ROI", "expenses"],
    resourceConstraints: ["strict budget limits", "need ROI justification"]
  },
  {
    id: "data_lead",
    role: "data_lead",
    primaryGoal: "Data accuracy and proper analysis",
    riskTolerance: 0.4,
    politicalSensitivity: ["data quality", "analysis methodology"],
    resourceConstraints: ["limited analysis bandwidth", "need clear questions"]
  },
  {
    id: "support_lead",
    role: "support_lead",
    primaryGoal: "Customer satisfaction and issue resolution",
    riskTolerance: 0.6,
    politicalSensitivity: ["customer complaints", "service quality"],
    resourceConstraints: ["limited support capacity"]
  }
];

export class AdaptiveStakeholderEngine {
  private system: AdaptiveStakeholderSystem;
  private responseIdCounter: number = 0;
  private interactionIdCounter: number = 0;

  constructor(sessionId: string, config?: StakeholderConfig[]) {
    this.system = {
      sessionId,
      stakeholders: {},
      interactionLog: [],
      pendingResponses: []
    };

    const stakeholders = config || DEFAULT_STAKEHOLDER_CONFIGS;
    for (const s of stakeholders) {
      this.system.stakeholders[s.id] = this.createStakeholder(s);
    }
  }

  private createStakeholder(config: StakeholderConfig): Stakeholder {
    return {
      id: config.id,
      role: config.role,
      hiddenAgenda: {
        primaryGoal: config.primaryGoal,
        riskTolerance: config.riskTolerance,
        politicalSensitivity: config.politicalSensitivity,
        resourceConstraints: config.resourceConstraints
      },
      relationshipState: {
        trustLevel: 0.6,
        alignmentCount: 0,
        conflictCount: 0,
        lastInteraction: null,
        pendingConcerns: []
      },
      positions: {}
    };
  }

  processUserAction(input: ProcessUserActionInput): StakeholderResponse | null {
    const { userAction, claimsInMessage } = input;
    const stakeholder = this.system.stakeholders[userAction.to];

    if (!stakeholder) return null;

    const response = this.generateResponse(userAction, stakeholder, claimsInMessage || []);

    this.logInteraction(
      userAction.to,
      userAction.type,
      userAction.contentSummary,
      response.content,
      this.inferUserHandling(userAction.contentSummary, response),
      this.extractTopic(userAction.contentSummary)
    );

    if (response.requiresResponse) {
      this.system.pendingResponses.push(response);
    }

    return response;
  }

  private generateResponse(
    userAction: ProcessUserActionInput["userAction"],
    stakeholder: Stakeholder,
    claims: string[]
  ): StakeholderResponse {
    const { contentSummary } = userAction;
    const contentLower = contentSummary.toLowerCase();

    if (this.checkConstraintViolation(stakeholder, contentLower)) {
      return this.generateBlockResponse(stakeholder, contentSummary);
    }

    if (stakeholder.relationshipState.pendingConcerns.length > 0) {
      return this.generateEscalationResponse(stakeholder);
    }

    if (this.checkDomainConflict(stakeholder, claims)) {
      return this.generateChallengeResponse(stakeholder, claims);
    }

    if (stakeholder.relationshipState.trustLevel < 0.3) {
      return this.generateSkepticalResponse(stakeholder, contentSummary);
    }

    if (this.checkAlignmentOpportunity(stakeholder, contentLower)) {
      return this.generateSupportResponse(stakeholder);
    }

    return this.generateNeutralResponse(stakeholder, contentSummary);
  }

  private checkConstraintViolation(stakeholder: Stakeholder, contentLower: string): boolean {
    for (const constraint of stakeholder.hiddenAgenda.resourceConstraints) {
      const constraintKeywords = constraint.toLowerCase().split(" ");
      if (constraintKeywords.every(k => contentLower.includes(k))) {
        if (!contentLower.includes("acknowledge") && 
            !contentLower.includes("respect") &&
            !contentLower.includes("limited")) {
          return true;
        }
      }
    }
    return false;
  }

  private checkDomainConflict(stakeholder: Stakeholder, claims: string[]): boolean {
    if (claims.length === 0) return false;

    for (const claim of claims) {
      const claimLower = claim.toLowerCase();

      for (const sensitivity of stakeholder.hiddenAgenda.politicalSensitivity) {
        if (claimLower.includes(sensitivity) && 
            !claimLower.includes("agree") &&
            !claimLower.includes("support")) {
          return true;
        }
      }
    }
    return false;
  }

  private checkAlignmentOpportunity(stakeholder: Stakeholder, contentLower: string): boolean {
    const goalKeywords = stakeholder.hiddenAgenda.primaryGoal.toLowerCase().split(" ");
    return goalKeywords.some(k => k.length > 4 && contentLower.includes(k));
  }

  private generateBlockResponse(stakeholder: Stakeholder, action: string): StakeholderResponse {
    stakeholder.relationshipState.trustLevel = Math.max(
      0,
      stakeholder.relationshipState.trustLevel - 0.15
    );
    stakeholder.relationshipState.conflictCount++;
    stakeholder.relationshipState.pendingConcerns.push(
      "User proposed solution that violates stated constraints"
    );

    return {
      id: this.generateResponseId(),
      stakeholderId: stakeholder.id,
      responseType: "block",
      trigger: {
        type: "user_claim",
        details: action
      },
      content: `As I mentioned, ${stakeholder.hiddenAgenda.resourceConstraints.join(", ")}. Which one is the priority?`,
      urgency: "high",
      requiresResponse: true
    };
  }

  private generateEscalationResponse(stakeholder: Stakeholder): StakeholderResponse {
    const concern = stakeholder.relationshipState.pendingConcerns[0];

    return {
      id: this.generateResponseId(),
      stakeholderId: stakeholder.id,
      responseType: "escalation",
      trigger: {
        type: "timing",
        details: concern
      },
      content: concern,
      urgency: "medium",
      requiresResponse: true
    };
  }

  private generateChallengeResponse(stakeholder: Stakeholder, claims: string[]): StakeholderResponse {
    stakeholder.relationshipState.conflictCount++;

    return {
      id: this.generateResponseId(),
      stakeholderId: stakeholder.id,
      responseType: "challenge",
      trigger: {
        type: "user_claim",
        details: claims.join(", ")
      },
      content: `You've made claims about ${stakeholder.hiddenAgenda.politicalSensitivity[0]}, but you haven't discussed this with ${stakeholder.role}. Can you provide your analysis?`,
      urgency: "low",
      requiresResponse: false
    };
  }

  private generateSkepticalResponse(stakeholder: Stakeholder, action: string): StakeholderResponse {
    return {
      id: this.generateResponseId(),
      stakeholderId: stakeholder.id,
      responseType: "challenge",
      trigger: {
        type: "user_mistake",
        details: action
      },
      content: `I'm not sure about this approach. Can you walk me through your reasoning?`,
      urgency: "low",
      requiresResponse: false
    };
  }

  private generateSupportResponse(stakeholder: Stakeholder): StakeholderResponse {
    stakeholder.relationshipState.alignmentCount++;
    stakeholder.relationshipState.trustLevel = Math.min(
      1.0,
      stakeholder.relationshipState.trustLevel + 0.1
    );

    return {
      id: this.generateResponseId(),
      stakeholderId: stakeholder.id,
      responseType: "support",
      trigger: {
        type: "user_claim",
        details: "User aligned with stakeholder goals"
      },
      content: `This aligns well with ${stakeholder.hiddenAgenda.primaryGoal}. Let's discuss how to move forward.`,
      urgency: "low",
      requiresResponse: false
    };
  }

  private generateNeutralResponse(stakeholder: Stakeholder, action: string): StakeholderResponse {
    return {
      id: this.generateResponseId(),
      stakeholderId: stakeholder.id,
      responseType: "question",
      trigger: {
        type: "user_claim",
        details: action
      },
      content: `I've noted your proposal. What's your timeline for this?`,
      urgency: "low",
      requiresResponse: false
    };
  }

  applyInjection(input: ApplyInjectionInput): void {
    const { injection } = input;
    const stakeholder = this.system.stakeholders[injection.stakeholder];

    if (!stakeholder) return;

    if (injection.type === "constraint_change" && injection.newConstraint) {
      stakeholder.hiddenAgenda.resourceConstraints.push(injection.newConstraint);

      const response: StakeholderResponse = {
        id: this.generateResponseId(),
        stakeholderId: stakeholder.id,
        responseType: "escalation",
        trigger: {
          type: "injection",
          details: `New constraint: ${injection.newConstraint}`
        },
        content: `Important update: ${injection.newConstraint}. Please account for this in your planning.`,
        urgency: "high",
        requiresResponse: true
      };

      this.system.pendingResponses.push(response);
    }

    if (injection.type === "feedback" && injection.feedback) {
      stakeholder.relationshipState.pendingConcerns.push(injection.feedback);
    }

    if (injection.type === "position_change" && injection.newPosition) {
      const topic = Object.keys(stakeholder.positions)[0] || "general";
      stakeholder.positions[topic] = {
        currentPosition: injection.newPosition,
        positionStrength: 0.7,
        hasChangedRecently: true,
        changeReason: "New information received"
      };
    }
  }

  recordUserResponse(input: RecordUserResponseInput): void {
    const { stakeholderId, userResponse, handlingQuality } = input;
    const stakeholder = this.system.stakeholders[stakeholderId];

    if (!stakeholder) return;

    const trustDelta = this.calculateTrustImpact(handlingQuality);
    stakeholder.relationshipState.trustLevel = Math.max(
      0,
      Math.min(1.0, stakeholder.relationshipState.trustLevel + trustDelta)
    );

    if (handlingQuality === "good" && stakeholder.relationshipState.pendingConcerns.length > 0) {
      stakeholder.relationshipState.pendingConcerns.shift();
    }

    if (handlingQuality === "poor") {
      stakeholder.relationshipState.conflictCount++;
    }
  }

  private calculateTrustImpact(handling: UserHandling): number {
    switch (handling) {
      case "good":
        return 0.15;
      case "neutral":
        return 0.0;
      case "poor":
        return -0.2;
    }
  }

  private logInteraction(
    stakeholderId: string,
    type: InteractionType,
    userAction: string,
    response: string,
    handling: UserHandling,
    topic: string
  ): void {
    const log: InteractionLog = {
      timestamp: Date.now(),
      stakeholderId,
      interactionType: type,
      userAction,
      stakeholderResponse: response,
      userHandling: handling,
      topic,
      stakeholderSatisfaction: this.system.stakeholders[stakeholderId]?.relationshipState.trustLevel || 0.5
    };

    this.system.interactionLog.push(log);

    const stakeholder = this.system.stakeholders[stakeholderId];
    if (stakeholder) {
      stakeholder.relationshipState.lastInteraction = log;
    }
  }

  private inferUserHandling(action: string, response: StakeholderResponse): UserHandling {
    const actionLower = action.toLowerCase();

    if (actionLower.includes("acknowledge") || 
        actionLower.includes("thank") ||
        actionLower.includes("agree")) {
      return "good";
    }

    if (actionLower.includes("ignore") ||
        actionLower.includes("dismiss") ||
        actionLower.includes("no need")) {
      return "poor";
    }

    return "neutral";
  }

  private extractTopic(content: string): string {
    const contentLower = content.toLowerCase();
    const topics = [
      { keyword: "budget", topic: "budget" },
      { keyword: "timeline", topic: "timeline" },
      { keyword: "onboarding", topic: "onboarding" },
      { keyword: "pricing", topic: "pricing" },
      { keyword: "churn", topic: "churn" },
      { keyword: "data", topic: "data" },
      { keyword: "technical", topic: "technical" }
    ];

    for (const t of topics) {
      if (contentLower.includes(t.keyword)) {
        return t.topic;
      }
    }

    return "general";
  }

  private generateResponseId(): string {
    return `response_${++this.responseIdCounter}`;
  }

  getRelationshipSummary(): Record<string, { trust: number; conflicts: number; alignment: number }> {
    const summary: Record<string, { trust: number; conflicts: number; alignment: number }> = {};

    for (const [id, stakeholder] of Object.entries(this.system.stakeholders)) {
      summary[id] = {
        trust: stakeholder.relationshipState.trustLevel,
        conflicts: stakeholder.relationshipState.conflictCount,
        alignment: stakeholder.relationshipState.alignmentCount
      };
    }

    return summary;
  }

  getTrustLevel(stakeholderId: string): number {
    return this.system.stakeholders[stakeholderId]?.relationshipState.trustLevel || 0;
  }

  getPendingResponses(): StakeholderResponse[] {
    return this.system.pendingResponses;
  }

  clearPendingResponse(responseId: string): void {
    this.system.pendingResponses = this.system.pendingResponses.filter(
      r => r.id !== responseId
    );
  }

  getStakeholder(stakeholderId: string): Stakeholder | undefined {
    return this.system.stakeholders[stakeholderId];
  }

  getAllStakeholders(): Record<string, Stakeholder> {
    return this.system.stakeholders;
  }

  hasLowTrustStakeholders(): boolean {
    return Object.values(this.system.stakeholders).some(
      s => s.relationshipState.trustLevel < 0.3
    );
  }

  getBlockedCount(): number {
    return this.system.pendingResponses.filter(r => r.responseType === "block").length;
  }

  getSystem(): AdaptiveStakeholderSystem {
    return this.system;
  }
}

export function createAdaptiveStakeholderEngine(
  sessionId: string,
  config?: StakeholderConfig[]
): AdaptiveStakeholderEngine {
  return new AdaptiveStakeholderEngine(sessionId, config);
}