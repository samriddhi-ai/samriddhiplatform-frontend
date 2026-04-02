-- MASTER SEED SCRIPT
-- Paste this script into your Supabase SQL Editor and click "Run" to populate your DB.
-- This script contains table definitions, policies, and rich test data for your Learning Platform.

-- ==========================================
-- 0. CLEAN SLATE (Optional but recommended)
-- ==========================================
drop table if exists public.quiz_attempts cascade;
drop table if exists public.module_quiz_questions cascade;
drop table if exists public.module_lessons cascade;
drop table if exists public.learning_modules cascade;
drop table if exists public.profiles cascade;
drop table if exists public.subjects cascade;

-- ==========================================
-- 1. SCHEMAS
-- ==========================================

create table if not exists public.profiles (
  id uuid primary key, -- References auth.users(id) in live system
  full_name text,
  class_level int default 9,
  avatar_url text,
  created_at timestamptz default now()
);

create table if not exists public.subjects (
  id text primary key,
  slug text unique not null,
  title text not null,
  class_level int not null,
  is_active boolean default true
);

create table if not exists public.learning_modules (
  id text primary key,
  subject_id text not null references public.subjects(id) on delete cascade,
  slug text not null,
  title text not null,
  content_json jsonb default '{}'::jsonb,
  difficulty text default 'medium',
  unique(subject_id, slug)
);

create table if not exists public.quiz_attempts (
  id bigint generated always as identity primary key,
  user_id uuid not null, -- References auth.users(id) in live system
  module_id text not null references public.learning_modules(id) on delete cascade,
  score int not null,
  answers_json jsonb default '{}'::jsonb,
  completed_at timestamptz default now()
);

create table if not exists public.module_lessons (
  id text primary key,
  module_id text not null references public.learning_modules(id) on delete cascade,
  title text not null,
  lesson_order int not null,
  content_json jsonb default '{}'::jsonb
);

create table if not exists public.module_quiz_questions (
  id text primary key,
  module_id text not null references public.learning_modules(id) on delete cascade,
  prompt text not null,
  options_json jsonb not null,
  answer_index int not null,
  explanation text,
  concept_tag text,
  question_order int not null
);

-- ==========================================
-- 2. SECURITY POLICIES (RLS)
-- ==========================================
alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.learning_modules enable row level security;
alter table public.quiz_attempts enable row level security;
alter table public.module_lessons enable row level security;
alter table public.module_quiz_questions enable row level security;

-- Profiles
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles for insert with check (auth.uid() = id);

-- Global Read for content
drop policy if exists "subjects_public_read" on public.subjects;
create policy "subjects_public_read" on public.subjects for select using (is_active = true);

drop policy if exists "modules_public_read" on public.learning_modules;
create policy "modules_public_read" on public.learning_modules for select using (true);

drop policy if exists "module_lessons_public_read" on public.module_lessons;
create policy "module_lessons_public_read" on public.module_lessons for select using (true);

drop policy if exists "module_quiz_public_read" on public.module_quiz_questions;
create policy "module_quiz_public_read" on public.module_quiz_questions for select using (true);

-- Quiz Attempts
drop policy if exists "attempts_select_own" on public.quiz_attempts;
create policy "attempts_select_own" on public.quiz_attempts for select using (auth.uid() = user_id);

drop policy if exists "attempts_insert_own" on public.quiz_attempts;
create policy "attempts_insert_own" on public.quiz_attempts for insert with check (auth.uid() = user_id);

-- ==========================================
-- 3. TEST DATA (SEEDING)
-- ==========================================

-- Subjects
insert into public.subjects (id, slug, title, class_level, is_active)
values
  ('sub-math', 'math', 'Mathematics', 9, true),
  ('sub-science', 'science', 'Science', 9, true),
  ('sub-english', 'english', 'English', 9, true),
  ('sub-history', 'history', 'History', 9, true)
on conflict (id) do update set title = excluded.title;

-- Learning Modules
insert into public.learning_modules (id, subject_id, slug, title, content_json, difficulty)
values
  ('mod-rational-numbers', 'sub-math', 'rational-numbers', 'Rational Numbers & Fractions', '{"summary":"Master fractions, equivalency, ordering, and essential math operations with rational numbers."}'::jsonb, 'medium'),
  ('mod-algebra-basics', 'sub-math', 'algebra-basics', 'Introduction to Algebra', '{"summary":"Understand variables, linear equations, and basic algebraic expressions."}'::jsonb, 'hard'),
  ('mod-motion-and-force', 'sub-science', 'motion-and-force', 'Motion, Speed & Force', '{"summary":"Explore the physical world: speed, velocity, acceleration, and Newton''s core laws."}'::jsonb, 'easy'),
  ('mod-cell-structure', 'sub-science', 'cell-structure', 'Cell Biology Basics', '{"summary":"Dive into the building blocks of life: cell structure, organelles, and functions."}'::jsonb, 'medium'),
  ('mod-reading-comprehension', 'sub-english', 'reading-comprehension', 'Reading Comprehension', '{"summary":"Improve inference, context clues, and summarize complex passages effectively."}'::jsonb, 'easy'),
  ('mod-ancient-civilizations', 'sub-history', 'ancient-civilizations', 'Ancient Civilizations', '{"summary":"Analyze the dawn of civilization in Mesopotamia, Egypt, and the Indus Valley."}'::jsonb, 'medium')
on conflict (id) do update set title = excluded.title, content_json = excluded.content_json, difficulty = excluded.difficulty;

-- Lessons
insert into public.module_lessons (id, module_id, title, lesson_order, content_json)
values
  ('les-rn-1', 'mod-rational-numbers', 'What is a Rational Number?', 1, '{"summary":"A rational number is any number that can be written as p/q where q is not zero.","key_points":["Integers are rational","Terminating decimals can be rational","Repeating decimals are rational"]}'::jsonb),
  ('les-rn-2', 'mod-rational-numbers', 'Equivalent Fractions', 2, '{"summary":"Equivalent fractions represent the same value.","key_points":["Multiply numerator and denominator by same non-zero number","Divide numerator and denominator by same factor"]}'::jsonb),
  ('les-rn-3', 'mod-rational-numbers', 'Comparing Rational Numbers', 3, '{"summary":"Compare using common denominator, decimal conversion, or number line.","key_points":["For negatives, numbers closer to zero are greater","Use LCM for reliable comparisons"]}'::jsonb),
  ('les-alg-1', 'mod-algebra-basics', 'Variables and Constants', 1, '{"summary":"Understand the difference between fixed values and placeholders.","key_points":["Constants (e.g., 5, -2)","Variables (e.g., x, y, a)","Terms and Coefficients"]}'::jsonb),
  ('les-cell-1', 'mod-cell-structure', 'The Discovery of Cells', 1, '{"summary":"Robert Hooke first observed cells in 1665 using a primitive microscope.","key_points":["Cell Theory basics","Microscope advancements","Prokaryotic vs Eukaryotic overview"]}'::jsonb),
  ('les-mf-1', 'mod-motion-and-force', 'Speed and Velocity Basics', 1, '{"summary":"Speed is distance/time while velocity includes direction.","key_points":["Average speed formula","Units: m/s and km/h","Difference between scalar and vector"]}'::jsonb),
  ('les-rc-1', 'mod-reading-comprehension', 'Finding Main Idea', 1, '{"summary":"Identify central message by tracking repeated themes and evidence.","key_points":["Topic sentence clues","Supporting details","Summarize in one line"]}'::jsonb)
on conflict (id) do update set title = excluded.title;

-- Questions
insert into public.module_quiz_questions
  (id, module_id, prompt, options_json, answer_index, explanation, concept_tag, question_order)
values
  ('qq-rn-1', 'mod-rational-numbers', 'Which fraction is equivalent to 3/4?', '["6/8","2/5","5/8","9/16"]'::jsonb, 0, 'Multiply numerator and denominator of 3/4 by 2 to get 6/8.', 'equivalent-fractions', 1),
  ('qq-rn-2', 'mod-rational-numbers', 'Which is greater: -1/2 or -3/8?', '["-1/2","-3/8","Both equal","Cannot compare"]'::jsonb, 1, '-3/8 is greater because it is closer to zero on the number line.', 'comparing-rationals', 2),
  ('qq-rn-3', 'mod-rational-numbers', 'What is 2/3 + 1/6?', '["1/2","5/6","3/4","2/9"]'::jsonb, 1, 'Convert 2/3 to 4/6, then 4/6 + 1/6 = 5/6.', 'fraction-operations', 3),
  ('qq-alg-1', 'mod-algebra-basics', 'Solve for x: 2x + 5 = 13', '["x=4","x=9","x=6","x=3"]'::jsonb, 0, '2x = 13 - 5 => 2x = 8 => x = 4.', 'linear-equations', 1),
  ('qq-cell-1', 'mod-cell-structure', 'Which organelle is known as the powerhouse of the cell?', '["Nucleus","Ribosome","Mitochondria","Vacuole"]'::jsonb, 2, 'Mitochondria are responsible for ATP production.', 'organelles', 1),
  ('qq-mf-1', 'mod-motion-and-force', 'A car covers 120 km in 2 hours. Its average speed is:', '["40 km/h","50 km/h","60 km/h","70 km/h"]'::jsonb, 2, 'Speed = distance/time = 120/2 = 60 km/h.', 'speed-formula', 1),
  ('qq-rc-1', 'mod-reading-comprehension', 'What is the best first step to find the main idea?', '["Memorize all words","Identify repeated theme","Skip headings","Ignore supporting details"]'::jsonb, 1, 'Repeated themes often point exactly to the core message the author intends.', 'main-idea', 1)
on conflict (id) do update set prompt = excluded.prompt;

-- Dummy Users
-- In Supabase Auth, they will need matching entries, but we insert these to simulate existing historical data for UI tests.
insert into public.profiles (id, full_name, class_level)
values
  ('00000000-0000-0000-0000-000000000001'::uuid, 'Aarav Sharma', 9),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'Diya Verma', 9),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'Rohan Das', 9),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'Anika Patil', 9)
on conflict (id) do update set full_name = excluded.full_name;

-- Dummy Quiz Attempts for Dashboard Charts
insert into public.quiz_attempts (user_id, module_id, score, answers_json)
values
  ('00000000-0000-0000-0000-000000000001'::uuid, 'mod-rational-numbers', 2, '{"q1":0,"q2":0,"q3":1}'::jsonb),
  ('00000000-0000-0000-0000-000000000002'::uuid, 'mod-rational-numbers', 3, '{"q1":0,"q2":1,"q3":1}'::jsonb),
  ('00000000-0000-0000-0000-000000000003'::uuid, 'mod-motion-and-force', 1, '{"q1":2}'::jsonb),
  ('00000000-0000-0000-0000-000000000001'::uuid, 'mod-reading-comprehension', 1, '{"q1":1}'::jsonb),
  ('00000000-0000-0000-0000-000000000004'::uuid, 'mod-cell-structure', 1, '{"qq-cell-1":2}'::jsonb)
on conflict do nothing;

SELECT 'Seeding complete! Database is populated and ready for E-Learning frontend testing.' as status;
