create extension if not exists pgcrypto;

alter table public.simulations
  add column if not exists user_id uuid references auth.users(id) on delete set null,
  add column if not exists visibility text not null default 'private' check (visibility in ('private', 'unlisted', 'public')),
  add column if not exists share_token text not null default encode(gen_random_bytes(18), 'hex'),
  add column if not exists truth_score integer,
  add column if not exists reality_ledger jsonb,
  add column if not exists variable_lab jsonb,
  add column if not exists action_plan jsonb,
  add column if not exists memory_snapshot jsonb;

create unique index if not exists simulations_share_token_idx on public.simulations (share_token);
create index if not exists simulations_user_id_idx on public.simulations (user_id);
create index if not exists simulations_created_at_idx on public.simulations (created_at desc);
create index if not exists simulations_type_idx on public.simulations (type);

alter table public.simulations enable row level security;

drop policy if exists "simulations_select_own" on public.simulations;
create policy "simulations_select_own" on public.simulations
  for select to authenticated
  using (auth.uid() = user_id);

drop policy if exists "simulations_insert_own" on public.simulations;
create policy "simulations_insert_own" on public.simulations
  for insert to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "simulations_update_own" on public.simulations;
create policy "simulations_update_own" on public.simulations
  for update to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "simulations_delete_own" on public.simulations;
create policy "simulations_delete_own" on public.simulations
  for delete to authenticated
  using (auth.uid() = user_id);

create table if not exists public.simulation_memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  simulation_id uuid references public.simulations(id) on delete cascade,
  type text not null,
  title text not null,
  summary text not null,
  patterns jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.simulation_outcomes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  simulation_id uuid not null references public.simulations(id) on delete cascade,
  actual_outcome text not null,
  outcome_notes text,
  accuracy_score integer check (accuracy_score between 0 and 100),
  created_at timestamptz not null default now()
);

create table if not exists public.simulation_variable_runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  simulation_id uuid not null references public.simulations(id) on delete cascade,
  variable_changes jsonb not null default '{}'::jsonb,
  result jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.simulation_memories enable row level security;
alter table public.simulation_outcomes enable row level security;
alter table public.simulation_variable_runs enable row level security;

drop policy if exists "simulation_memories_owner_all" on public.simulation_memories;
create policy "simulation_memories_owner_all" on public.simulation_memories
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "simulation_outcomes_owner_all" on public.simulation_outcomes;
create policy "simulation_outcomes_owner_all" on public.simulation_outcomes
  for all to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "simulation_variable_runs_owner_all" on public.simulation_variable_runs;
create policy "simulation_variable_runs_owner_all" on public.simulation_variable_runs
  for all to authenticated
  using (auth.uid() = user_id or user_id is null)
  with check (auth.uid() = user_id or user_id is null);