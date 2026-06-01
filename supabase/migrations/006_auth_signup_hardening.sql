-- Harden Supabase Auth signup side effects.
-- Keeps auth.users creation from failing if profile/portfolio setup is retried or partially deployed.

alter table public.profiles
  add column if not exists role_interest text,
  add column if not exists org_website text,
  add column if not exists org_industry text,
  add column if not exists org_size text;

create schema if not exists private;

create or replace function private.handle_new_user_setup()
returns trigger
set search_path = ''
language plpgsql
security definer
as $$
declare
  requested_role text := coalesce(new.raw_user_meta_data->>'role', 'USER');
  requested_username text := nullif(new.raw_user_meta_data->>'username', '');
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
    role_interest,
    org_website,
    org_industry,
    org_size
  )
  values (
    new.id,
    nullif(new.raw_user_meta_data->>'full_name', ''),
    nullif(new.raw_user_meta_data->>'avatar_url', ''),
    requested_username,
    requested_role,
    nullif(new.raw_user_meta_data->>'role_interest', ''),
    nullif(new.raw_user_meta_data->>'org_website', ''),
    nullif(new.raw_user_meta_data->>'org_industry', ''),
    nullif(new.raw_user_meta_data->>'org_size', '')
  )
  on conflict (id) do update set
    full_name = coalesce(excluded.full_name, public.profiles.full_name),
    avatar_url = coalesce(excluded.avatar_url, public.profiles.avatar_url),
    username = coalesce(excluded.username, public.profiles.username),
    role = excluded.role,
    role_interest = coalesce(excluded.role_interest, public.profiles.role_interest),
    org_website = coalesce(excluded.org_website, public.profiles.org_website),
    org_industry = coalesce(excluded.org_industry, public.profiles.org_industry),
    org_size = coalesce(excluded.org_size, public.profiles.org_size),
    updated_at = now();

  if to_regclass('public.portfolios') is not null then
    insert into public.portfolios (user_id, title)
    values (new.id, 'My TURNVE Portfolio')
    on conflict (user_id) do nothing;
  end if;

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_created_portfolio on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure private.handle_new_user_setup();
