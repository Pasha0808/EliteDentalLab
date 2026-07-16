-- ============================================================================
-- Elite Dental Lab — Supabase schema
--
-- HOW TO USE (one time):
--   1. In your Supabase project, open "SQL Editor" → "New query"
--   2. Paste this whole file and click "Run"
--   3. Create your own admin account:
--        a. Authentication → Users → "Add user" → enter your email + password
--        b. Come back to SQL Editor and run (with your email filled in):
--           insert into public.profiles (id, role, display_name)
--           select id, 'admin', 'Elite Dental Lab'
--           from auth.users where email = 'YOUR_EMAIL_HERE';
--   4. (Recommended) Authentication → Sign In / Up → disable "Confirm email"
--      so offices can log in immediately after registering with their code.
--
-- PRIVACY: this schema stores NO patient information. Cases are identified
-- by lab case number + tooth number only. Keep it that way.
-- ============================================================================

-- ---------- Tables ----------

create table public.offices (
  id         uuid primary key default gen_random_uuid(),
  name       text not null,
  created_at timestamptz not null default now()
);

create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  office_id    uuid references public.offices (id),
  role         text not null default 'office' check (role in ('office', 'admin')),
  display_name text,
  created_at   timestamptz not null default now()
);

create table public.registration_codes (
  code       text primary key,
  office_id  uuid not null references public.offices (id),
  created_at timestamptz not null default now(),
  used_by    uuid references auth.users (id),
  used_at    timestamptz
);

create table public.cases (
  id          uuid primary key default gen_random_uuid(),
  case_number text not null unique,
  office_id   uuid not null references public.offices (id),
  doctor      text,
  tooth       text,
  restoration text,
  received    date not null default current_date,
  due         date,
  status      text not null default 'Received'
              check (status in ('Received', 'In Design', 'In Production', 'Quality Check', 'Shipped')),
  notes       text,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- ---------- Helper functions (bypass RLS safely) ----------

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

create or replace function public.my_office()
returns uuid
language sql stable security definer set search_path = public
as $$
  select office_id from public.profiles where id = auth.uid();
$$;

-- ---------- Row Level Security ----------
-- The whole point: an office can only ever read its own rows.

alter table public.offices            enable row level security;
alter table public.profiles           enable row level security;
alter table public.registration_codes enable row level security;
alter table public.cases              enable row level security;

-- offices: members see their own office; admin sees all and manages
create policy "offices_select" on public.offices for select
  using (is_admin() or id = my_office());
create policy "offices_insert" on public.offices for insert
  with check (is_admin());
create policy "offices_update" on public.offices for update
  using (is_admin());
create policy "offices_delete" on public.offices for delete
  using (is_admin());

-- profiles: users see their own profile; admin sees/manages all
create policy "profiles_select" on public.profiles for select
  using (id = auth.uid() or is_admin());
create policy "profiles_insert" on public.profiles for insert
  with check (is_admin());
create policy "profiles_update" on public.profiles for update
  using (is_admin());

-- registration codes: admin only (offices never need to read these)
create policy "codes_all" on public.registration_codes for all
  using (is_admin()) with check (is_admin());

-- cases: THE isolation rule — an office only sees cases with its office_id
create policy "cases_select" on public.cases for select
  using (is_admin() or office_id = my_office());
create policy "cases_insert" on public.cases for insert
  with check (is_admin());
create policy "cases_update" on public.cases for update
  using (is_admin());
create policy "cases_delete" on public.cases for delete
  using (is_admin());

-- ---------- Registration code flow ----------

-- Anyone may check whether a code is valid (returns true/false, nothing else)
create or replace function public.check_registration_code(p_code text)
returns boolean
language sql stable security definer set search_path = public
as $$
  select exists (
    select 1 from public.registration_codes
    where code = upper(trim(p_code)) and used_by is null
  );
$$;

-- A newly signed-up user redeems their code: links them to the office,
-- marks the code used. Runs with elevated rights but only affects the caller.
create or replace function public.redeem_registration_code(p_code text, p_display_name text default null)
returns void
language plpgsql security definer set search_path = public
as $$
declare
  v_office uuid;
begin
  select office_id into v_office
  from public.registration_codes
  where code = upper(trim(p_code)) and used_by is null;

  if v_office is null then
    raise exception 'invalid_code';
  end if;

  insert into public.profiles (id, office_id, role, display_name)
  values (auth.uid(), v_office, 'office', p_display_name)
  on conflict (id) do update set office_id = excluded.office_id;

  update public.registration_codes
  set used_by = auth.uid(), used_at = now()
  where code = upper(trim(p_code));
end;
$$;

revoke all on function public.check_registration_code(text) from public;
revoke all on function public.redeem_registration_code(text, text) from public;
grant execute on function public.check_registration_code(text) to anon, authenticated;
grant execute on function public.redeem_registration_code(text, text) to authenticated;

-- ---------- updated_at maintenance ----------

create or replace function public.touch_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger cases_touch before update on public.cases
  for each row execute function public.touch_updated_at();
