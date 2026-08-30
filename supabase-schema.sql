-- fondos.0km.app — esquema de base de datos para Supabase
-- Cómo usarlo: Supabase → tu proyecto → SQL Editor → pega este archivo completo → Run.
--
-- IMPORTANTE: este proyecto Supabase debe ser DISTINTO al de nahueltrek-site
-- (ver ARCHITECTURE_FONDOS_0KM.md, independencia de infraestructura).
--
-- Referencia completa del modelo de datos: DATA_GOVERNANCE_FONDOS_0KM.md

create extension if not exists "pgcrypto";

-- =========================================================
-- FONDOS (Master Plan secciones 9 y 57)
-- =========================================================
create table if not exists funds (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null,
  institution text,
  description text,
  objective text,
  beneficiaries text,
  regions text[] default '{}',
  communes text[] default '{}',
  amount text,
  cofinancing text,
  application_start date,
  application_end date,
  status text not null default 'por_confirmar'
    check (status in ('proximo','abierto','cerrado','finalizado','permanente','por_confirmar')),
  categories text[] default '{}',
  eligible_expenses text,
  official_url text,
  -- gobernanza (sección 57)
  source_name text,
  source_url text,
  source_type text check (source_type in ('official_web','official_document','official_api','official_platform','other')),
  source_reference text,
  last_verified_at timestamptz,
  next_review_at timestamptz,
  verified_by uuid,
  verification_status text not null default 'pending'
    check (verification_status in ('pending','verified','needs_review','expired','archived')),
  verification_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Historial de verificación (sección 58) — nunca se sobrescribe.
create table if not exists fund_verifications (
  id uuid primary key default gen_random_uuid(),
  fund_id uuid references funds(id) on delete cascade,
  verified_by uuid,
  verified_at timestamptz not null default now(),
  changes jsonb,
  source text,
  notes text,
  status text
);

-- =========================================================
-- ROLES (sección 60)
-- =========================================================
create table if not exists user_roles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null check (role in ('super_admin','administrador','curador','comercial','editor')),
  created_at timestamptz not null default now()
);

-- =========================================================
-- LEADS (secciones 24-26)
-- =========================================================
create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text,
  company text,
  email text,
  phone text,
  region text,
  commune text,
  business_type text,
  fund_id uuid references funds(id),
  fund_slug text, -- referencia liviana al fondo de origen (el formulario público solo conoce el slug, no el uuid)
  fund_status text,
  needs text,
  budget text,
  problem text,
  score integer default 0,
  status text not null default 'nuevo'
    check (status in ('nuevo','contactar','calificado','diagnostico','propuesta','negociacion','ganado','perdido','seguimiento')),
  source text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- =========================================================
-- Row Level Security
-- =========================================================
alter table funds enable row level security;
alter table fund_verifications enable row level security;
alter table user_roles enable row level security;
alter table leads enable row level security;

-- Lectura pública de fondos (el explorador es público).
create policy "funds_public_read" on funds for select using (true);

-- Escritura de fondos: solo curador/administrador/super_admin.
create policy "funds_write_curadores" on funds for all using (
  exists (
    select 1 from user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role in ('curador','administrador','super_admin')
  )
);

-- Historial de verificación: mismo criterio que funds.
create policy "fund_verifications_curadores" on fund_verifications for all using (
  exists (
    select 1 from user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role in ('curador','administrador','super_admin')
  )
);

-- Cualquiera puede crear un lead (formulario público de diagnóstico),
-- pero solo el equipo comercial/admin puede leer/gestionar.
create policy "leads_public_insert" on leads for insert with check (true);
create policy "leads_comercial_manage" on leads for select using (
  exists (
    select 1 from user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role in ('comercial','administrador','super_admin')
  )
);
create policy "leads_comercial_update" on leads for update using (
  exists (
    select 1 from user_roles
    where user_roles.user_id = auth.uid()
      and user_roles.role in ('comercial','administrador','super_admin')
  )
);

-- Roles: cada quien ve su propio rol; solo super_admin administra roles.
create policy "user_roles_self_read" on user_roles for select using (auth.uid() = user_id);
create policy "user_roles_super_admin_manage" on user_roles for all using (
  exists (
    select 1 from user_roles ur
    where ur.user_id = auth.uid() and ur.role = 'super_admin'
  )
);
