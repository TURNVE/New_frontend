-- Migration: Simulation Tables
-- Tables for simulation scenarios, sessions, decisions, and scores

-- Simulation Scenarios table
create table public.simulation_scenarios (
    id uuid primary key default gen_random_uuid(),
    key varchar(100) unique not null,
    name varchar(255) not null,
    description text,
    industry varchar(100),
    difficulty varchar(20) check (difficulty in ('beginner', 'intermediate', 'advanced')),
    duration_weeks integer default 12,
    team_size integer default 4,
    budget integer default 150,
    is_active boolean default true,
    initial_state jsonb,
    phases_config jsonb,
    actions_config jsonb,
    timeline_events jsonb,
    stakeholders_config jsonb,
    created_at timestamptz default now(),
    updated_at timestamptz default now()
);

create index idx_scenarios_industry on simulation_scenarios(industry);
create index idx_scenarios_difficulty on simulation_scenarios(difficulty);
create index idx_scenarios_key on simulation_scenarios(key);
create index idx_scenarios_active on simulation_scenarios(is_active);

-- Simulation Sessions table
create table public.simulation_sessions (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users on delete cascade not null,
    scenario_key varchar(100) references simulation_scenarios(key),
    status varchar(20) default 'active' check (status in ('active', 'completed', 'abandoned')),
    current_week integer default 1,
    total_weeks integer default 12,
    current_phase varchar(50) default 'phase-1',
    state jsonb default '{}'::jsonb,
    started_at timestamptz default now(),
    completed_at timestamptz,
    updated_at timestamptz default now()
);

create index idx_sessions_user on simulation_sessions(user_id);
create index idx_sessions_scenario on simulation_sessions(scenario_key);
create index idx_sessions_status on simulation_sessions(status);

-- Simulation Decisions table
create table public.simulation_decisions (
    id uuid primary key default gen_random_uuid(),
    session_id uuid references simulation_sessions(id) on delete cascade not null,
    phase_id varchar(50),
    action_id varchar(100),
    choice_id varchar(100),
    decision_text text,
    state_before jsonb,
    state_after jsonb,
    score_impact jsonb,
    feedback_received text,
    created_at timestamptz default now()
);

create index idx_decisions_session on simulation_decisions(session_id);
create index idx_decisions_phase on simulation_decisions(phase_id);

-- Simulation Scores table
create table public.simulation_scores (
    id uuid primary key default gen_random_uuid(),
    session_id uuid references simulation_sessions(id) on delete cascade not null,
    user_id uuid references auth.users on delete cascade not null,
    execution_score float default 0,
    risk_management_score float default 0,
    stakeholder_score float default 0,
    budget_score float default 0,
    team_management_score float default 0,
    overall_score float default 0,
    grade varchar(5),
    skill_scores jsonb,
    strengths jsonb,
    areas_for_improvement jsonb,
    completed_at timestamptz default now()
);

create index idx_scores_session on simulation_scores(session_id);
create index idx_scores_user on simulation_scores(user_id);

-- Enable RLS on all tables
alter table public.simulation_scenarios enable row level security;
alter table public.simulation_sessions enable row level security;
alter table public.simulation_decisions enable row level security;
alter table public.simulation_scores enable row level security;

-- RLS Policies for simulation_scenarios
create policy "Scenarios are viewable by everyone." on simulation_scenarios
    for select using (is_active = true);

create policy "Admins can manage scenarios." on simulation_scenarios
    for all using (
        exists (select 1 from profiles where id = auth.uid() and role = 'ADMIN')
    );

-- RLS Policies for simulation_sessions
create policy "Users can view their own sessions." on simulation_sessions
    for select using (auth.uid() = user_id);

create policy "Users can create their own sessions." on simulation_sessions
    for insert with check (auth.uid() = user_id);

create policy "Users can update their own sessions." on simulation_sessions
    for update using (auth.uid() = user_id);

create policy "Users can delete their own sessions." on simulation_sessions
    for delete using (auth.uid() = user_id);

-- RLS Policies for simulation_decisions
create policy "Users can view their own decisions." on simulation_decisions
    for select using (
        exists (select 1 from simulation_sessions where id = simulation_decisions.session_id and user_id = auth.uid())
    );

create policy "Users can create their own decisions." on simulation_decisions
    for insert with check (
        exists (select 1 from simulation_sessions where id = simulation_decisions.session_id and user_id = auth.uid())
    );

-- RLS Policies for simulation_scores
create policy "Users can view their own scores." on simulation_scores
    for select using (auth.uid() = user_id);

create policy "Users can create their own scores." on simulation_scores
    for insert with check (auth.uid() = user_id);

-- Updated at triggers
create trigger handle_simulation_scenarios_updated_at
    before update on public.simulation_scenarios
    for each row execute procedure public.handle_updated_at();

create trigger handle_simulation_sessions_updated_at
    before update on public.simulation_sessions
    for each row execute procedure public.handle_updated_at();

-- Seed default scenario
insert into simulation_scenarios (
    key, name, description, industry, difficulty, duration_weeks, team_size, budget,
    initial_state, phases_config, actions_config, timeline_events, stakeholders_config
) values (
    'default',
    'Default PM Simulation',
    'A standard project management simulation to practice core PM skills',
    'Technology',
    'intermediate',
    12,
    4,
    150,
    '{"week": 1, "budget": 150, "teamMorale": 75, "riskLevel": 0.3, "stakeholderTrust": 70, "progress": 0}'::jsonb,
    '[
        {"id": "phase-1", "name": "Planning", "duration": 4, "objectives": ["Define scope", "Assemble team", "Create timeline"]},
        {"id": "phase-2", "name": "Execution", "duration": 6, "objectives": ["Deliver features", "Manage stakeholders", "Track progress"]},
        {"id": "phase-3", "name": "Completion", "duration": 2, "objectives": ["Launch product", "Document lessons", "Handoff"]}
    ]'::jsonb,
    '{
        "team_hiring": {"id": "team_hiring", "name": "Hire Team Members", "category": "resource", "choices": [
            {"id": "senior_hire", "label": "Hire Senior Engineer", "effects": {"budget": -30, "teamMorale": 10}, "risk": 0.2},
            {"id": "junior_hire", "label": "Hire Junior Engineers", "effects": {"budget": -15, "teamMorale": 5}, "risk": 0.5}
        ]},
        "scope_definition": {"id": "scope_definition", "name": "Define Scope", "category": "process", "choices": [
            {"id": "realistic", "label": "Realistic Scope", "effects": {"progress": 10, "riskLevel": -0.1}, "risk": 0.3}
        ]}
    }'::jsonb,
    '[
        {"week": 3, "type": "crisis", "title": "Key Team Member Leaves", "impact": {"teamMorale": -15}},
        {"week": 6, "type": "opportunity", "title": "Budget Increase", "impact": {"budget": 25}}
    ]'::jsonb,
    '[
        {"id": "cto", "name": "Sarah Chen", "role": "CTO", "department": "Executive", "influence": 10, "satisfaction": 75},
        {"id": "product", "name": "Marcus Johnson", "role": "VP Product", "department": "Product", "influence": 8, "satisfaction": 70},
        {"id": "cfo", "name": "Emily Rodriguez", "role": "CFO", "department": "Finance", "influence": 9, "satisfaction": 65}
    ]'::jsonb
) on conflict (key) do nothing;