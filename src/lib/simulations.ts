export const simulations = {
  async createSession(scenarioKey: string) {
    console.log('[STUB] simulations.createSession called with:', scenarioKey);
    return { session: { id: `stub-session-${Date.now()}` }, error: null };
  },

  async updateSession(sessionId: string, data: Record<string, unknown>) {
    console.log('[STUB] simulations.updateSession called for:', sessionId, data);
    return { session: { id: sessionId, ...data }, error: null };
  },

  async getSession(sessionId: string) {
    console.log('[STUB] simulations.getSession called for:', sessionId);
    return { session: { id: sessionId, state: null }, error: null };
  },

  async createDecision(data: Record<string, unknown>) {
    console.log('[STUB] simulations.createDecision called with:', data);
    return { decision: { id: `stub-decision-${Date.now()}`, ...data }, error: null };
  },

  async createScore(data: Record<string, unknown>) {
    console.log('[STUB] simulations.createScore called with:', data);
    return { score: { id: `stub-score-${Date.now()}`, ...data }, error: null };
  }
};
