create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
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
  user_id uuid not null references auth.users(id) on delete cascade,
  module_id text not null references public.learning_modules(id) on delete cascade,
  score int not null,
  answers_json jsonb default '{}'::jsonb,
  completed_at timestamptz default now()
);

insert into public.subjects (id, slug, title, class_level, is_active)
values
  ('sub-math', 'math', 'Mathematics', 9, true),
  ('sub-science', 'science', 'Science', 9, true),
  ('sub-english', 'english', 'English', 9, true)
on conflict (id) do update
set
  slug = excluded.slug,
  title = excluded.title,
  class_level = excluded.class_level,
  is_active = excluded.is_active;

insert into public.learning_modules (id, subject_id, slug, title, content_json, difficulty)
values
  (
    'mod-rational-numbers',
    'sub-math',
    'rational-numbers',
    'Rational Numbers',
    '{"summary":"Learn fractions, equivalent forms, ordering, and operations."}'::jsonb,
    'medium'
  ),
  (
    'mod-motion-and-force',
    'sub-science',
    'motion-and-force',
    'Motion and Force',
    '{"summary":"Explore speed, velocity, acceleration, and Newton laws."}'::jsonb,
    'easy'
  ),
  (
    'mod-reading-comprehension',
    'sub-english',
    'reading-comprehension',
    'Reading Comprehension Basics',
    '{"summary":"Improve inference, vocabulary context, and summary building."}'::jsonb,
    'easy'
  )
on conflict (id) do update
set
  subject_id = excluded.subject_id,
  slug = excluded.slug,
  title = excluded.title,
  content_json = excluded.content_json,
  difficulty = excluded.difficulty;

alter table public.profiles enable row level security;
alter table public.subjects enable row level security;
alter table public.learning_modules enable row level security;
alter table public.quiz_attempts enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
on public.profiles for select
using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
on public.profiles for update
using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
on public.profiles for insert
with check (auth.uid() = id);

drop policy if exists "subjects_public_read" on public.subjects;
create policy "subjects_public_read"
on public.subjects for select
using (is_active = true);

drop policy if exists "modules_public_read" on public.learning_modules;
create policy "modules_public_read"
on public.learning_modules for select
using (true);

drop policy if exists "attempts_select_own" on public.quiz_attempts;
create policy "attempts_select_own"
on public.quiz_attempts for select
using (auth.uid() = user_id);

drop policy if exists "attempts_insert_own" on public.quiz_attempts;
create policy "attempts_insert_own"
on public.quiz_attempts for insert
with check (auth.uid() = user_id);
