create extension if not exists pgcrypto;

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  wechat text not null,
  email text,
  industry text not null,
  problem text not null,
  current_process text not null,
  input_type text not null,
  expected_output text not null,
  volume text not null,
  delivery_type text not null,
  private_deployment boolean not null default false,
  budget text,
  remark text,
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.tool_usages (
  id uuid primary key default gen_random_uuid(),
  tool_name text not null,
  input_type text,
  input_length integer,
  file_name text,
  file_size integer,
  success boolean not null default false,
  error_message text,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create table if not exists public.contact_clicks (
  id uuid primary key default gen_random_uuid(),
  action text not null,
  page text not null,
  tool_name text,
  ip_hash text,
  user_agent text,
  created_at timestamptz not null default now()
);

create index if not exists idx_tool_usages_tool_name_created_at on public.tool_usages(tool_name, created_at desc);
create index if not exists idx_contact_clicks_action_created_at on public.contact_clicks(action, created_at desc);
create index if not exists idx_leads_created_at on public.leads(created_at desc);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_leads_updated_at
before update on public.leads
for each row
execute function public.set_updated_at();

alter table public.leads enable row level security;
alter table public.tool_usages enable row level security;
alter table public.contact_clicks enable row level security;

revoke all on public.leads from anon, authenticated;
revoke all on public.tool_usages from anon, authenticated;
revoke all on public.contact_clicks from anon, authenticated;

-- Browser clients should not write directly to private operational tables.
create policy "no direct anon lead inserts"
on public.leads
for all
using (false)
with check (false);

create policy "no direct anon tool usage"
on public.tool_usages
for all
using (false)
with check (false);

create policy "no direct anon contact clicks"
on public.contact_clicks
for all
using (false)
with check (false);
