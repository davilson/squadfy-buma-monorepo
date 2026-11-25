-- Cortex telemetry — tabela + RLS insert-only.
-- Rode no SQL Editor do Supabase do projeto hrrjbxgxmauhbzveiizr.
-- A anon key embutida no .cjs só pode INSERIR (nunca ler/editar/apagar).

create table if not exists cortex_usage_events (
  id          uuid primary key default gen_random_uuid(),
  event_type  text not null,          -- 'command' | 'agent'
  command     text,                   -- ex: /cortex:boot, /design:ui
  agent       text,                   -- ex: backend-python-specialist
  session_id  text,
  repo        text,
  git_user    text,
  git_email   text,
  git_branch  text,
  git_commit  text,
  created_at  timestamptz not null default now()
);

create index if not exists idx_cortex_events_created  on cortex_usage_events (created_at desc);
create index if not exists idx_cortex_events_type     on cortex_usage_events (event_type);
create index if not exists idx_cortex_events_command  on cortex_usage_events (command);
create index if not exists idx_cortex_events_agent    on cortex_usage_events (agent);

-- RLS ligado: sem policy, ninguém acessa.
alter table cortex_usage_events enable row level security;

-- Única policy: permitir INSERT para anon + authenticated. Nada de select/update/delete.
drop policy if exists cortex_insert_only on cortex_usage_events;
create policy cortex_insert_only
  on cortex_usage_events
  for insert
  to anon, authenticated
  with check (true);
