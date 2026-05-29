-- Migration: Company simulations and dashboard analytics support

alter table public.profiles
  add column if not exists org_website text,
  add column if not exists org_industry text,
  add column if not exists org_size text;

create table if not exists public.company_simulations (
  id text primary key,
  owner_id uuid references auth.users on delete cascade not null,
  title text not null,
  company_name text not null,
  industry text not null,
  description text,
  budget numeric(12, 2) default 0,
  duration_weeks integer default 12 check (duration_weeks > 0),
  team_size integer default 1 check (team_size > 0),
  status text default 'draft' check (status in ('draft', 'live')),
  is_public boolean default false,
  live_slug text unique not null,
  template jsonb not null default '{}'::jsonb,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_company_simulations_owner on public.company_simulations(owner_id);
create index if not exists idx_company_simulations_public on public.company_simulations(is_public, status);
create index if not exists idx_company_simulations_updated on public.company_simulations(updated_at desc);

alter table public.company_simulations enable row level security;

drop policy if exists "Company owners can view their simulations." on public.company_simulations;
drop policy if exists "Company owners can create simulations." on public.company_simulations;
drop policy if exists "Company owners can update their simulations." on public.company_simulations;
drop policy if exists "Company owners can delete their simulations." on public.company_simulations;
drop policy if exists "Published company simulations are viewable by everyone." on public.company_simulations;
drop policy if exists "Admins can manage company simulations." on public.company_simulations;

create policy "Company owners can view their simulations." on public.company_simulations
  for select using ((select auth.uid()) = owner_id);

create policy "Company owners can create simulations." on public.company_simulations
  for insert with check ((select auth.uid()) = owner_id);

create policy "Company owners can update their simulations." on public.company_simulations
  for update using ((select auth.uid()) = owner_id)
  with check ((select auth.uid()) = owner_id);

create policy "Company owners can delete their simulations." on public.company_simulations
  for delete using ((select auth.uid()) = owner_id);

create policy "Published company simulations are viewable by everyone." on public.company_simulations
  for select using (is_public = true and status = 'live');

create policy "Admins can manage company simulations." on public.company_simulations
  for all using (
    exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'ADMIN')
  )
  with check (
    exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'ADMIN')
  );

drop trigger if exists handle_company_simulations_updated_at on public.company_simulations;
create trigger handle_company_simulations_updated_at
  before update on public.company_simulations
  for each row execute procedure public.handle_updated_at();

drop policy if exists "Admins can view all simulation sessions" on public.simulation_sessions;
create policy "Admins can view all simulation sessions" on public.simulation_sessions
  for select using (
    exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'ADMIN')
  );

drop policy if exists "Admins can view all simulation decisions" on public.simulation_decisions;
create policy "Admins can view all simulation decisions" on public.simulation_decisions
  for select using (
    exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'ADMIN')
  );

drop policy if exists "Admins can view all simulation scores" on public.simulation_scores;
create policy "Admins can view all simulation scores" on public.simulation_scores
  for select using (
    exists (select 1 from public.profiles where id = (select auth.uid()) and role = 'ADMIN')
  );

drop policy if exists "Company owners can view sessions for owned simulations" on public.simulation_sessions;
create policy "Company owners can view sessions for owned simulations" on public.simulation_sessions
  for select using (
    exists (
      select 1 from public.company_simulations
      where company_simulations.id = simulation_sessions.scenario_key
      and company_simulations.owner_id = (select auth.uid())
    )
  );

drop policy if exists "Company owners can view scores for owned simulations" on public.simulation_scores;
create policy "Company owners can view scores for owned simulations" on public.simulation_scores
  for select using (
    exists (
      select 1
      from public.simulation_sessions
      join public.company_simulations
        on company_simulations.id = simulation_sessions.scenario_key
      where simulation_sessions.id = simulation_scores.session_id
      and company_simulations.owner_id = (select auth.uid())
    )
  );

create or replace function public.handle_new_user_setup()
returns trigger
set search_path = ''
language plpgsql
security definer
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data->>'role', 'USER');
begin
  if requested_role not in ('USER', 'RECRUITER', 'COMPANY', 'MENTOR', 'ADMIN') then
    requested_role := 'USER';
  end if;

  insert into public.profiles (
    id,
    full_name,
    avatar_url,
    username,
    role,
    org_website,
    org_industry,
    org_size
  )
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'username',
    requested_role,
    new.raw_user_meta_data->>'org_website',
    new.raw_user_meta_data->>'org_industry',
    new.raw_user_meta_data->>'org_size'
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    username = excluded.username,
    role = excluded.role,
    org_website = excluded.org_website,
    org_industry = excluded.org_industry,
    org_size = excluded.org_size;

  insert into public.portfolios (user_id, title)
  values (new.id, 'My TURNVE Portfolio')
  on conflict (user_id) do nothing;

  return new;
end;
$$;
