-- Migration: Organization workspace accounts, simulations, clients, and direct access links

create table if not exists public.organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  logo_url text,
  description text,
  website text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'enterprise')),
  settings jsonb not null default jsonb_build_object(
    'allowClientInvites', true,
    'requireApproval', false,
    'defaultSimulationAccess', 'immediate',
    'emailNotifications', true,
    'weeklyReports', true
  ),
  branding jsonb not null default jsonb_build_object(
    'primaryColor', '#2563eb',
    'secondaryColor', '#0f172a'
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_members (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  avatar_url text,
  role text not null default 'viewer' check (role in ('owner', 'admin', 'editor', 'viewer')),
  invited_at timestamptz not null default now(),
  joined_at timestamptz,
  last_active_at timestamptz,
  unique (organization_id, email),
  unique (organization_id, user_id)
);

create table if not exists public.organization_simulations (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  title text not null,
  description text not null,
  thumbnail_url text,
  category text not null default 'custom' check (category in (
    'project-management',
    'crisis-management',
    'team-building',
    'strategic-planning',
    'stakeholder-management',
    'product-launch',
    'custom'
  )),
  template_id text,
  config jsonb not null default '{}'::jsonb,
  status text not null default 'draft' check (status in ('draft', 'published', 'archived')),
  target_roles text[] not null default array[]::text[],
  difficulty text not null default 'intermediate' check (difficulty in ('beginner', 'intermediate', 'advanced')),
  duration integer not null default 120 check (duration > 0),
  created_by uuid references auth.users(id) on delete set null,
  published_at timestamptz,
  metrics jsonb not null default jsonb_build_object(
    'totalAssignments', 0,
    'activeAssignments', 0,
    'completedCount', 0,
    'averageScore', 0,
    'averageCompletionTime', 0
  ),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.organization_clients (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  full_name text,
  avatar_url text,
  status text not null default 'invited' check (status in ('invited', 'active', 'inactive')),
  metadata jsonb not null default jsonb_build_object('tags', array[]::text[]),
  invited_at timestamptz not null default now(),
  joined_at timestamptz,
  last_active_at timestamptz,
  assigned_simulations integer not null default 0,
  completed_simulations integer not null default 0,
  average_score numeric(5, 2) not null default 0,
  unique (organization_id, email)
);

create table if not exists public.client_simulations (
  id uuid primary key default gen_random_uuid(),
  client_id uuid not null references public.organization_clients(id) on delete cascade,
  simulation_id uuid not null references public.organization_simulations(id) on delete cascade,
  assigned_by uuid references auth.users(id) on delete set null,
  assigned_at timestamptz not null default now(),
  due_date timestamptz,
  instructions text,
  status text not null default 'assigned' check (status in ('assigned', 'in_progress', 'completed', 'overdue')),
  started_at timestamptz,
  completed_at timestamptz,
  score numeric(5, 2),
  feedback text,
  progress integer not null default 0 check (progress between 0 and 100),
  current_phase integer not null default 0,
  time_spent integer not null default 0,
  unique (client_id, simulation_id)
);

create table if not exists public.organization_access_links (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  simulation_id uuid references public.organization_simulations(id) on delete cascade,
  client_id uuid references public.organization_clients(id) on delete cascade,
  token text not null unique,
  label text,
  is_active boolean not null default true,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (simulation_id is not null or client_id is not null)
);

create table if not exists public.organization_activity (
  id uuid primary key default gen_random_uuid(),
  organization_id uuid not null references public.organizations(id) on delete cascade,
  actor_id uuid references auth.users(id) on delete set null,
  actor_name text not null default 'System',
  actor_avatar_url text,
  action text not null,
  target_type text not null,
  target_id text not null,
  target_name text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists idx_organization_members_user on public.organization_members(user_id);
create index if not exists idx_organization_members_org on public.organization_members(organization_id);
create index if not exists idx_org_sims_org_status on public.organization_simulations(organization_id, status);
create index if not exists idx_org_clients_org_status on public.organization_clients(organization_id, status);
create index if not exists idx_client_simulations_client on public.client_simulations(client_id);
create index if not exists idx_client_simulations_simulation on public.client_simulations(simulation_id);
create index if not exists idx_org_access_links_token on public.organization_access_links(token) where is_active = true;
create index if not exists idx_org_activity_org_created on public.organization_activity(organization_id, created_at desc);

alter table public.organizations enable row level security;
alter table public.organization_members enable row level security;
alter table public.organization_simulations enable row level security;
alter table public.organization_clients enable row level security;
alter table public.client_simulations enable row level security;
alter table public.organization_access_links enable row level security;
alter table public.organization_activity enable row level security;

create or replace function public.is_organization_member(p_organization_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.organization_members
    where organization_id = p_organization_id
      and user_id = auth.uid()
  );
$$;

create or replace function public.organization_member_role(p_organization_id uuid)
returns text
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.organization_members
  where organization_id = p_organization_id
    and user_id = auth.uid()
  limit 1;
$$;

drop policy if exists "Members can view their organizations." on public.organizations;
create policy "Members can view their organizations." on public.organizations
  for select using (public.is_organization_member(id));

drop policy if exists "Authenticated users can create organizations." on public.organizations;
create policy "Authenticated users can create organizations." on public.organizations
  for insert with check (auth.uid() is not null);

drop policy if exists "Admins can update organizations." on public.organizations;
create policy "Admins can update organizations." on public.organizations
  for update using (public.organization_member_role(id) in ('owner', 'admin'))
  with check (public.organization_member_role(id) in ('owner', 'admin'));

drop policy if exists "Public can view organizations through active access links." on public.organizations;
create policy "Public can view organizations through active access links." on public.organizations
  for select using (
    exists (
      select 1
      from public.organization_access_links
      where organization_access_links.organization_id = organizations.id
        and organization_access_links.is_active = true
        and (organization_access_links.expires_at is null or organization_access_links.expires_at > now())
    )
  );

drop policy if exists "Members can view organization members." on public.organization_members;
create policy "Members can view organization members." on public.organization_members
  for select using (public.is_organization_member(organization_id));

drop policy if exists "Users can insert their owner membership." on public.organization_members;
create policy "Users can insert their owner membership." on public.organization_members
  for insert with check (
    user_id = auth.uid()
    and role = 'owner'
    and not exists (
      select 1 from public.organization_members existing
      where existing.organization_id = organization_members.organization_id
    )
  );

drop policy if exists "Admins can manage organization members." on public.organization_members;
create policy "Admins can manage organization members." on public.organization_members
  for all using (public.organization_member_role(organization_id) in ('owner', 'admin'))
  with check (public.organization_member_role(organization_id) in ('owner', 'admin'));

drop policy if exists "Members can view organization simulations." on public.organization_simulations;
create policy "Members can view organization simulations." on public.organization_simulations
  for select using (public.is_organization_member(organization_id));

drop policy if exists "Editors can manage organization simulations." on public.organization_simulations;
create policy "Editors can manage organization simulations." on public.organization_simulations
  for all using (public.organization_member_role(organization_id) in ('owner', 'admin', 'editor'))
  with check (public.organization_member_role(organization_id) in ('owner', 'admin', 'editor'));

drop policy if exists "Public can view simulations through active access links." on public.organization_simulations;
create policy "Public can view simulations through active access links." on public.organization_simulations
  for select using (
    status = 'published'
    and exists (
      select 1
      from public.organization_access_links
      where organization_access_links.simulation_id = organization_simulations.id
        and organization_access_links.is_active = true
        and (organization_access_links.expires_at is null or organization_access_links.expires_at > now())
    )
  );

drop policy if exists "Members can view organization clients." on public.organization_clients;
create policy "Members can view organization clients." on public.organization_clients
  for select using (public.is_organization_member(organization_id));

drop policy if exists "Editors can manage organization clients." on public.organization_clients;
create policy "Editors can manage organization clients." on public.organization_clients
  for all using (public.organization_member_role(organization_id) in ('owner', 'admin', 'editor'))
  with check (public.organization_member_role(organization_id) in ('owner', 'admin', 'editor'));

drop policy if exists "Public can view clients through active access links." on public.organization_clients;
create policy "Public can view clients through active access links." on public.organization_clients
  for select using (
    exists (
      select 1
      from public.organization_access_links
      where organization_access_links.client_id = organization_clients.id
        and organization_access_links.is_active = true
        and (organization_access_links.expires_at is null or organization_access_links.expires_at > now())
    )
  );

drop policy if exists "Members can view client simulation assignments." on public.client_simulations;
create policy "Members can view client simulation assignments." on public.client_simulations
  for select using (
    exists (
      select 1
      from public.organization_clients
      where organization_clients.id = client_simulations.client_id
        and public.is_organization_member(organization_clients.organization_id)
    )
  );

drop policy if exists "Editors can manage client simulation assignments." on public.client_simulations;
create policy "Editors can manage client simulation assignments." on public.client_simulations
  for all using (
    exists (
      select 1
      from public.organization_clients
      where organization_clients.id = client_simulations.client_id
        and public.organization_member_role(organization_clients.organization_id) in ('owner', 'admin', 'editor')
    )
  )
  with check (
    exists (
      select 1
      from public.organization_clients
      where organization_clients.id = client_simulations.client_id
        and public.organization_member_role(organization_clients.organization_id) in ('owner', 'admin', 'editor')
    )
  );

drop policy if exists "Members can manage access links." on public.organization_access_links;
create policy "Members can manage access links." on public.organization_access_links
  for all using (public.organization_member_role(organization_id) in ('owner', 'admin', 'editor'))
  with check (public.organization_member_role(organization_id) in ('owner', 'admin', 'editor'));

drop policy if exists "Active access links are publicly readable by token." on public.organization_access_links;
create policy "Active access links are publicly readable by token." on public.organization_access_links
  for select using (is_active = true and (expires_at is null or expires_at > now()));

drop policy if exists "Members can view organization activity." on public.organization_activity;
create policy "Members can view organization activity." on public.organization_activity
  for select using (public.is_organization_member(organization_id));

drop policy if exists "Members can create organization activity." on public.organization_activity;
create policy "Members can create organization activity." on public.organization_activity
  for insert with check (public.is_organization_member(organization_id));

drop trigger if exists handle_organizations_updated_at on public.organizations;
create trigger handle_organizations_updated_at
  before update on public.organizations
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_organization_simulations_updated_at on public.organization_simulations;
create trigger handle_organization_simulations_updated_at
  before update on public.organization_simulations
  for each row execute procedure public.handle_updated_at();

drop trigger if exists handle_organization_access_links_updated_at on public.organization_access_links;
create trigger handle_organization_access_links_updated_at
  before update on public.organization_access_links
  for each row execute procedure public.handle_updated_at();

create or replace function public.invite_clients(
  p_organization_id uuid,
  p_emails text[],
  p_simulation_ids uuid[] default array[]::uuid[],
  p_message text default null
)
returns setof public.organization_clients
language plpgsql
security definer
set search_path = public
as $$
declare
  invite_email text;
  created_client public.organization_clients;
begin
  if public.organization_member_role(p_organization_id) not in ('owner', 'admin', 'editor') then
    raise exception 'Not authorized to invite clients';
  end if;

  foreach invite_email in array p_emails loop
    insert into public.organization_clients (organization_id, email, metadata)
    values (
      p_organization_id,
      lower(trim(invite_email)),
      jsonb_build_object('tags', array[]::text[], 'inviteMessage', p_message)
    )
    on conflict (organization_id, email) do update set
      invited_at = now(),
      metadata = organization_clients.metadata || jsonb_build_object('inviteMessage', p_message)
    returning * into created_client;

    if coalesce(array_length(p_simulation_ids, 1), 0) > 0 then
      insert into public.client_simulations (client_id, simulation_id, assigned_by)
      select created_client.id, simulation_id, auth.uid()
      from unnest(p_simulation_ids) as simulation_id
      on conflict (client_id, simulation_id) do nothing;
    end if;

    return next created_client;
  end loop;
end;
$$;
