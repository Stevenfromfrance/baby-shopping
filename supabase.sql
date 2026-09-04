-- À exécuter dans Supabase → SQL Editor
create table if not exists claims (
  id uuid primary key default gen_random_uuid(),
  product_id text not null unique,
  type text not null check (type in ('purchase', 'donation')),
  name text not null,
  message text not null default '',
  amount numeric,
  proof_note text,
  proof_data_url text,
  created_at timestamptz not null default now()
);

alter table claims enable row level security;

create policy "Lecture publique"
  on claims for select
  using (true);

create policy "Ajout public"
  on claims for insert
  with check (true);

create policy "Suppression publique"
  on claims for delete
  using (true);

create policy "Mise à jour publique"
  on claims for update
  using (true)
  with check (true);
