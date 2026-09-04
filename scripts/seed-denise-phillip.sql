-- Seed: cadeaux déjà offerts par Denise et Phillip (4 sept.)
-- À exécuter dans Supabase → SQL Editor APRÈS supabase.sql

delete from claims
where product_id in ('baby-03', 'baby-54', 'baby-31', 'baby-64');

insert into claims (product_id, type, name, message, proof_note, created_at)
values
  (
    'baby-03',
    'purchase',
    'Denise and Phillip',
    'Can''t wait to see you 😍',
    '__gid__denise-phillip-2026-09-04__',
    '2026-09-04T13:46:00Z'
  ),
  (
    'baby-54',
    'purchase',
    'Denise and Phillip',
    'Can''t wait to see you 😍',
    '__gid__denise-phillip-2026-09-04__',
    '2026-09-04T13:46:00Z'
  ),
  (
    'baby-31',
    'purchase',
    'Denise and Phillip',
    'Can''t wait to see you 😍',
    '__gid__denise-phillip-2026-09-04__',
    '2026-09-04T13:46:00Z'
  ),
  (
    'baby-64',
    'purchase',
    'Denise and Phillip',
    'Can''t wait to see you 😍',
    '__gid__denise-phillip-2026-09-04__',
    '2026-09-04T13:46:00Z'
  );
