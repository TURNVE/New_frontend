-- Migration: Portfolio Tables
-- Tables for user portfolios and portfolio items (projects/achievements)
-- Includes theme engine for public portfolio customization

-- Portfolios table
create table public.portfolios (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users on delete cascade not null,
    title varchar(255) not null,
    description text,
    is_published boolean default false,
    share_token varchar(255) unique,
    published_at timestamptz,

    -- Theme engine fields
    theme_preset varchar(50) default 'professional'
        check (theme_preset in ('professional', 'creative', 'minimalist', 'vibrant', 'dark')),
    show_achievements boolean default true,
    show_ratings boolean default true,
    show_budget boolean default true,
    show_team_size boolean default true,
    layout_style varchar(50) default 'grid'
        check (layout_style in ('grid', 'masonry', 'list')),
    custom_css text,

    created_at timestamptz default now(),
    updated_at timestamptz default now(),

    constraint share_token_format check (share_token is null or share_token ~ '^portfolio-'),
    constraint unique_user_portfolio unique (user_id)
);

create index idx_portfolios_share_token on portfolios(share_token) where share_token is not null;
create index idx_portfolios_published on portfolios(is_published);

-- Portfolio Items table
create table public.portfolio_items (
    id uuid primary key default gen_random_uuid(),
    portfolio_id uuid references portfolios(id) on delete cascade not null,
    user_id uuid references auth.users on delete cascade not null,
    title varchar(255) not null,
    description text,
    category varchar(100),
    tags text[] default array[]::text[],
    role varchar(100),
    industry varchar(100),
    duration_weeks integer,
    budget numeric(12, 2),
    team_size integer,
    image_url text,
    external_url text,
    metrics jsonb default '{}'::jsonb,
    display_order integer default 0,
    is_featured boolean default false,
    created_at timestamptz default now(),
    updated_at timestamptz default now(),

    constraint portfolio_items_team_size_check check (team_size is null or team_size > 0),
    constraint portfolio_items_duration_check check (duration_weeks is null or duration_weeks > 0),
    constraint portfolio_items_budget_check check (budget is null or budget >= 0),
    constraint portfolio_items_display_order_check check (display_order >= 0)
);

create index idx_portfolio_items_portfolio on portfolio_items(portfolio_id);
create index idx_portfolio_items_user on portfolio_items(user_id);
create index idx_portfolio_items_industry on portfolio_items(industry);
create index idx_portfolio_items_tags on portfolio_items using gin(tags);
create index idx_portfolio_items_created on portfolio_items(created_at desc);
create index idx_portfolio_items_featured on portfolio_items(is_featured) where is_featured = true;
create index idx_portfolio_items_order on portfolio_items(portfolio_id, display_order);

-- Enable RLS
alter table public.portfolios enable row level security;
alter table public.portfolio_items enable row level security;

-- RLS Policies for portfolios

-- Users can view their own portfolios
create policy "Users can view their own portfolios." on portfolios
    for select using (auth.uid() = user_id);

-- Users can insert their own portfolios
create policy "Users can create their own portfolios." on portfolios
    for insert with check (auth.uid() = user_id);

-- Users can update their own portfolios
create policy "Users can update their own portfolios." on portfolios
    for update using (auth.uid() = user_id);

-- Users can delete their own portfolios
create policy "Users can delete their own portfolios." on portfolios
    for delete using (auth.uid() = user_id);

-- Public can view published portfolios
create policy "Published portfolios are viewable by everyone." on portfolios
    for select using (is_published = true);

-- RLS Policies for portfolio_items

-- Users can view their own items
create policy "Users can view their own portfolio items." on portfolio_items
    for select using (auth.uid() = user_id);

-- Users can insert their own items
create policy "Users can create their own portfolio items." on portfolio_items
    for insert with check (auth.uid() = user_id);

-- Users can update their own items
create policy "Users can update their own portfolio items." on portfolio_items
    for update using (auth.uid() = user_id);

-- Users can delete their own items
create policy "Users can delete their own portfolio items." on portfolio_items
    for delete using (auth.uid() = user_id);

-- Public can view items in published portfolios
create policy "Items in published portfolios are viewable by everyone." on portfolio_items
    for select using (
        exists (
            select 1 from portfolios
            where portfolios.id = portfolio_items.portfolio_id
            and portfolios.is_published = true
        )
    );

-- Updated at triggers
create trigger handle_portfolios_updated_at
    before update on public.portfolios
    for each row execute procedure public.handle_updated_at();

create trigger handle_portfolio_items_updated_at
    before update on public.portfolio_items
    for each row execute procedure public.handle_updated_at();

-- Consolidated function to handle new user setup (profile + portfolio)
-- This replaces any existing individual triggers to avoid race conditions
create or replace function public.handle_new_user_setup()
returns trigger
set search_path = ''
language plpgsql
security definer
as $$
begin
  -- Create profile
  insert into public.profiles (id, full_name, avatar_url, username)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'username'
  )
  on conflict (id) do update set
    full_name = excluded.full_name,
    avatar_url = excluded.avatar_url,
    username = excluded.username;

  -- Create default portfolio
  insert into public.portfolios (user_id, title)
  values (new.id, 'My TURNVE Portfolio')
  on conflict (user_id) do nothing;

  return new;
end;
$$;

-- Drop old individual triggers if they exist, then create consolidated one
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_created_portfolio on auth.users;

create trigger on_auth_user_created
    after insert on auth.users
    for each row execute procedure public.handle_new_user_setup();
