-- SIMPLE TEST SEED (NO auth.users references)
-- Step 1: Create 2 users in Supabase Authentication -> Users
-- Step 2: Copy their UUIDs and replace below
-- Step 3: Run this SQL

with seed_users as (
  select
    '00000000-0000-0000-0000-000000000001'::uuid as user_id,
    'Aarav Sharma'::text as full_name,
    9::int as class_level
  union all
  select
    '00000000-0000-0000-0000-000000000002'::uuid,
    'Diya Verma',
    9
)
insert into public.profiles (id, full_name, class_level)
select user_id, full_name, class_level
from seed_users
on conflict (id) do update
set
  full_name = excluded.full_name,
  class_level = excluded.class_level;

-- Optional: add a couple of quiz attempts so dashboard/insights are not empty.
insert into public.quiz_attempts (user_id, module_id, score, answers_json)
values
  (
    '00000000-0000-0000-0000-000000000001'::uuid,
    'mod-rational-numbers',
    2,
    '{"q1":0,"q2":0,"q3":1}'::jsonb
  ),
  (
    '00000000-0000-0000-0000-000000000002'::uuid,
    'mod-rational-numbers',
    3,
    '{"q1":0,"q2":1,"q3":1}'::jsonb
  )
on conflict do nothing;
