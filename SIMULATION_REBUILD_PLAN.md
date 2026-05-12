# TURN Simulation Rebuild Plan

## Vision
**Not a quiz. A job you actually do.**  
TURN drops users into a real company (NovaPay), gives them a real project, and surrounds them with AI avatar colleagues who behave like real people. Users produce real work and get real feedback.

---

## Current State
- ❌ Needs complete redo
- Current implementation uses a task/backlog system that doesn't match the vision

---

## Target Architecture

### Core Experience (6-Week PM Simulation)
1. **Sign Up** → User creates account, selects Product Manager track
2. **Get Hired** → Receives offer letter + project brief from NovaPay (CEO)
3. **Meet Your Team** → 5 AI avatars introduced with personalities + roles
4. **Do the Work** → Chat with avatars, submit deliverables, make decisions across 4 phases
5. **Earn Artifacts** → PRD, Roadmap, Risk Log, Stakeholder Report auto-saved to Portfolio
6. **Build CV + Apply** → Simulation experience auto-fills CV. Apply to real jobs.

---

## 4 Phases

| Phase | Duration | Focus | Deliverables |
|-------|-----------|-------|--------------|
| **Discovery** | Week 1-2 | Chat with CEO, CTO, Data Analyst | Discovery Summary |
| **Definition** | Week 3-4 | Write PRD, get 3 sign-offs | PRD + Product Roadmap |
| **Delivery** | Week 5-6 | Manage team, handle blockers | Risk Log + Stakeholder Update |
| **Launch** | Week 7-8 | Execute launch, run retro | Launch Plan + Retrospective |

---

## 5 Avatar Stakeholders (NovaPay)

| Avatar | Role | Personality | Behavior |
|--------|------|--------------|----------|
| **Sarah Rodriguez** | CEO | Driven, impatient, results-focused | Pushes for speed, praises structure |
| **Marcus Chen** | CTO | Logical, detail-oriented, protective | Flags technical constraints |
| **Amara Johnson** | Designer | Creative, collaborative, UX advocate | Pushes back if UX ignored |
| **David Kim** | Developer | Pragmatic, scope-conscious | Raises blockers early, needs clarity |
| **Lisa Thompson** | Data Analyst | Methodical, evidence-first | Won't volunteer data unless asked right |

---

## Key Features

### 1. Avatar Chat System
- Chat with 5 stakeholders individually
- Avatars remember context (last 10 messages)
- GPT-4 powered with persona system prompts
- Proactive messages at key events (phase start, deadline, deliverable submitted)

### 2. Deliverable Submission
- User writes real PM documents (not multiple choice)
- Avatars review and respond (approve, pushback, ask questions)
- Documents auto-saved to Portfolio

### 3. Live KPI Dashboard
- Budget, Progress, Team Morale, Stakeholder Trust
- Updates in real-time based on user actions

---

## Implementation Tasks

### Phase 1: Foundation (Week 1-2)
- [ ] **1.1** Create new SimulationShell component structure
- [ ] **1.2** Set up 4-phase state machine (Discovery/Definition/Delivery/Launch)
- [ ] **1.3** Build NovaPay company context (fintech, onboarding redesign project)
- [ ] **1.4** Create phase progression logic with week transitions

### Phase 2: Avatar System (Week 3-4)
- [ ] **2.1** Implement 5 avatar data structures with personalities
- [ ] **2.2** Build AvatarChat component with per-avatar threads
- [ ] **2.3** Integrate GPT-4 API with system prompts per avatar
- [ ] **2.4** Add conversation memory (last 10 messages per avatar)
- [ ] **2.5** Implement proactive message triggers (phase start, deadlines)

### Phase 3: Deliverables (Week 5-6)
- [ ] **3.1** Create deliverable submission form component
- [ ] **3.2** Build 7 deliverable types:
  - Discovery Summary
  - PRD (Product Requirements Document)
  - Product Roadmap
  - Risk Log
  - Stakeholder Status Update
  - Launch Plan
  - Retrospective Document
- [ ] **3.3** Implement avatar review system (approval/pushback)
- [ ] **3.4** Add auto-save to Portfolio on submission

### Phase 4: KPI Dashboard (Week 7-8)
- [ ] **4.1** Build real-time KPI cards:
  - Budget tracking
  - Progress (% through simulation)
  - Team Morale
  - Stakeholder Trust
- [ ] **4.2** Implement action-consequence logic (skip meeting = trust drop)
- [ ] **4.3** Add visual trends and alerts

### Phase 5: UI/UX Polish (Week 9-10)
- [ ] **5.1** Design matching the dark theme (per design guide: #0d0f12 bg, #f0a500 accent)
- [ ] **5.2** Build responsive layouts for all components
- [ ] **5.3** Add loading states for GPT-4 calls
- [ ] **5.4** Implement error handling and empty states
- [ ] **5.5** Add final score screen with artifact generation

---

## Technical Notes

### For Developer (Paul)
- Each avatar is a separate GPT-4 system prompt
- Pass simulation state into every avatar API call
- Use Supabase Edge Functions for proactive messages
- Simulation state schema in Supabase

### Out of Scope (per design guide)
- ❌ Team collaboration mode
- ❌ Voice AI
- ❌ PMP prep
- ❌ Stripe payments
- ❌ LinkedIn API
- ❌ Badges/gamification
- ❌ Multiple career tracks beyond Product Manager

---

## File Structure

```
src/
├── features/simulation-nova/          # New simulation module
│   ├── NovaSimulation.tsx             # Main component
│   ├── components/
│   │   ├── AvatarChat.tsx             # Chat interface
│   │   ├── AvatarList.tsx             # Avatar sidebar
│   │   ├── KPIDashboard.tsx           # Real-time metrics
│   │   ├── DeliverableForm.tsx        # Submit deliverables
│   │   ├── PhaseTimeline.tsx          # 4-phase progress
│   │   └── DeliverableReview.tsx      # Avatar feedback UI
│   ├── hooks/
│   │   ├── useAvatarChat.ts           # Chat logic
│   │   └── useSimulationPhase.ts      # Phase state machine
│   └── data/
│       └── novaPayAvatars.ts           # Avatar configs
├── config/
│   └── simulationTemplates.ts         # Keep PM templates only
```

---

## Success Criteria

1. ✅ User can progress through 4 phases over 6 weeks
2. ✅ User can chat with 5 unique AI avatars
3. ✅ User can submit 7 different deliverable types
4. ✅ Avatars respond contextually based on persona
5. ✅ KPIs update based on user actions
6. ✅ Deliverables auto-save to Portfolio
7. ✅ Final score generated at completion