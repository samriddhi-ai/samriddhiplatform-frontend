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

insert into public.module_lessons (id, module_id, title, lesson_order, content_json)
values
  (
    'les-rn-1',
    'mod-rational-numbers',
    'What is a Rational Number?',
    1,
    '{
      "summary":"A rational number is any number that can be written as p/q where q is not zero.",
      "key_points":["Integers are rational","Terminating decimals can be rational","Repeating decimals are rational"]
    }'::jsonb
  ),
  (
    'les-rn-2',
    'mod-rational-numbers',
    'Equivalent Fractions',
    2,
    '{
      "summary":"Equivalent fractions represent the same value.",
      "key_points":["Multiply numerator and denominator by same non-zero number","Divide numerator and denominator by same factor"]
    }'::jsonb
  ),
  (
    'les-rn-3',
    'mod-rational-numbers',
    'Comparing Rational Numbers',
    3,
    '{
      "summary":"Compare using common denominator, decimal conversion, or number line.",
      "key_points":["For negatives, numbers closer to zero are greater","Use LCM for reliable comparisons"]
    }'::jsonb
  ),
  (
    'les-mf-1',
    'mod-motion-and-force',
    'Speed and Velocity Basics',
    1,
    '{
      "summary":"Speed is distance/time while velocity includes direction.",
      "key_points":["Average speed formula","Units: m/s and km/h","Difference between scalar and vector"]
    }'::jsonb
  ),
  (
    'les-rc-1',
    'mod-reading-comprehension',
    'Finding Main Idea',
    1,
    '{
      "summary":"Identify central message by tracking repeated themes and evidence.",
      "key_points":["Topic sentence clues","Supporting details","Summarize in one line"]
    }'::jsonb
  )
on conflict (id) do update
set
  module_id = excluded.module_id,
  title = excluded.title,
  lesson_order = excluded.lesson_order,
  content_json = excluded.content_json;

insert into public.module_quiz_questions
  (id, module_id, prompt, options_json, answer_index, explanation, concept_tag, question_order)
values
  (
    'qq-rn-1',
    'mod-rational-numbers',
    'Which fraction is equivalent to 3/4?',
    '["6/8","2/5","5/8","9/16"]'::jsonb,
    0,
    'Multiply both numerator and denominator of 3/4 by 2 to get 6/8.',
    'equivalent-fractions',
    1
  ),
  (
    'qq-rn-2',
    'mod-rational-numbers',
    'Which is greater: -1/2 or -3/8?',
    '["-1/2","-3/8","Both equal","Cannot compare"]'::jsonb,
    1,
    '-3/8 is greater because it is closer to zero.',
    'comparing-rationals',
    2
  ),
  (
    'qq-rn-3',
    'mod-rational-numbers',
    'What is 2/3 + 1/6?',
    '["1/2","5/6","3/4","2/9"]'::jsonb,
    1,
    'Convert 2/3 to 4/6, then add 4/6 + 1/6 = 5/6.',
    'fraction-operations',
    3
  ),
  (
    'qq-mf-1',
    'mod-motion-and-force',
    'A car covers 120 km in 2 hours. Its average speed is:',
    '["40 km/h","50 km/h","60 km/h","70 km/h"]'::jsonb,
    2,
    'Speed = distance/time = 120/2 = 60 km/h.',
    'speed-formula',
    1
  ),
  (
    'qq-rc-1',
    'mod-reading-comprehension',
    'What is the best first step to find the main idea?',
    '["Memorize all words","Identify repeated theme","Skip headings","Ignore supporting details"]'::jsonb,
    1,
    'Repeated themes and evidence point to the main idea.',
    'main-idea',
    1
  )
on conflict (id) do update
set
  module_id = excluded.module_id,
  prompt = excluded.prompt,
  options_json = excluded.options_json,
  answer_index = excluded.answer_index,
  explanation = excluded.explanation,
  concept_tag = excluded.concept_tag,
  question_order = excluded.question_order;

alter table public.module_lessons enable row level security;
alter table public.module_quiz_questions enable row level security;

drop policy if exists "module_lessons_public_read" on public.module_lessons;
create policy "module_lessons_public_read"
on public.module_lessons for select
using (true);

drop policy if exists "module_quiz_public_read" on public.module_quiz_questions;
create policy "module_quiz_public_read"
on public.module_quiz_questions for select
using (true);
