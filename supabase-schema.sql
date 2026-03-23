-- =============================================
-- StudyAI — Initial Schema  (run this FIRST)
-- =============================================
create extension if not exists "uuid-ossp";

-- subscriptions (legacy — kept for Stripe future support)
create table if not exists public.subscriptions (
  id                     uuid default uuid_generate_v4() primary key,
  user_id                uuid references auth.users(id) on delete cascade not null unique,
  stripe_customer_id     text default '',
  stripe_subscription_id text default '',
  plan                   text default 'free' check (plan in ('free','pro')),
  status                 text default 'active' check (status in ('active','canceled','past_due','trialing')),
  current_period_end     timestamptz default (now() + interval '1 year'),
  created_at             timestamptz default now()
);

-- tests
create table if not exists public.tests (
  id               uuid default uuid_generate_v4() primary key,
  user_id          uuid references auth.users(id) on delete cascade not null,
  title            text default 'Untitled Test',
  notes_content    text,
  questions        jsonb default '[]'::jsonb,
  total_questions  integer default 0,
  score            integer,
  completed_at     timestamptz,
  created_at       timestamptz default now()
);

-- test_results
create table if not exists public.test_results (
  id              uuid default uuid_generate_v4() primary key,
  test_id         uuid references public.tests(id) on delete cascade not null,
  user_id         uuid references auth.users(id) on delete cascade not null,
  answers         jsonb default '{}'::jsonb,
  score           integer not null default 0,
  total_questions integer not null default 0,
  time_taken      integer default 0,
  analysis        jsonb,
  created_at      timestamptz default now(),
  unique(test_id, user_id)
);

-- usage
create table if not exists public.usage (
  id              uuid default uuid_generate_v4() primary key,
  user_id         uuid references auth.users(id) on delete cascade not null,
  date            date not null default current_date,
  tests_generated integer default 0,
  created_at      timestamptz default now(),
  unique(user_id, date)
);

-- RLS
alter table public.subscriptions enable row level security;
alter table public.tests         enable row level security;
alter table public.test_results  enable row level security;
alter table public.usage         enable row level security;

create policy "subs select"    on public.subscriptions for select using (auth.uid()=user_id);
create policy "subs insert"    on public.subscriptions for insert with check (auth.uid()=user_id);
create policy "subs update"    on public.subscriptions for update using (auth.uid()=user_id);
create policy "tests select"   on public.tests         for select using (auth.uid()=user_id);
create policy "tests insert"   on public.tests         for insert with check (auth.uid()=user_id);
create policy "tests update"   on public.tests         for update using (auth.uid()=user_id);
create policy "tests delete"   on public.tests         for delete using (auth.uid()=user_id);
create policy "results select" on public.test_results  for select using (auth.uid()=user_id);
create policy "results insert" on public.test_results  for insert with check (auth.uid()=user_id);
create policy "results update" on public.test_results  for update using (auth.uid()=user_id);
create policy "usage select"   on public.usage         for select using (auth.uid()=user_id);
create policy "usage insert"   on public.usage         for insert with check (auth.uid()=user_id);
create policy "usage update"   on public.usage         for update using (auth.uid()=user_id);

-- Auto-create free subscription on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.subscriptions(user_id,plan,status) values(new.id,'free','active') on conflict(user_id) do nothing;
  return new;
end;$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Indexes
create index if not exists idx_tests_user     on public.tests(user_id);
create index if not exists idx_tests_created  on public.tests(created_at desc);
create index if not exists idx_results_test   on public.test_results(test_id);
create index if not exists idx_results_user   on public.test_results(user_id);
create index if not exists idx_usage_user_date on public.usage(user_id,date);
