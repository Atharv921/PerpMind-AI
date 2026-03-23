-- =============================================
-- StudyAI — Payment Migration  (run AFTER supabase-schema.sql)
-- =============================================

-- users table: is_pro is the primary Pro flag set by verify-payment
create table if not exists public.users (
  id                 uuid references auth.users(id) on delete cascade primary key,
  email              text,
  full_name          text,
  is_pro             boolean default false not null,
  payment_provider   text check (payment_provider in ('razorpay','stripe')),
  payment_id         text,
  pro_activated_at   timestamptz,
  created_at         timestamptz default now(),
  updated_at         timestamptz default now()
);

-- payments: full audit log
create table if not exists public.payments (
  id               uuid default uuid_generate_v4() primary key,
  user_id          uuid references auth.users(id) on delete cascade not null,
  order_id         text not null unique,
  payment_id       text,
  amount           integer not null,
  currency         text default 'INR',
  payment_provider text not null check (payment_provider in ('razorpay','stripe')),
  status           text not null default 'pending' check (status in ('pending','success','failed')),
  created_at       timestamptz default now(),
  updated_at       timestamptz default now()
);

-- RLS
alter table public.users    enable row level security;
alter table public.payments enable row level security;

create policy "users select" on public.users for select using (auth.uid()=id);
create policy "users update" on public.users for update using (auth.uid()=id);
create policy "users insert" on public.users for insert with check (auth.uid()=id);
create policy "pay select"   on public.payments for select using (auth.uid()=user_id);

-- Indexes
create index if not exists idx_users_is_pro      on public.users(is_pro);
create index if not exists idx_payments_user     on public.payments(user_id);
create index if not exists idx_payments_order    on public.payments(order_id);
create index if not exists idx_payments_status   on public.payments(status);

-- Auto-create users row on signup (syncs with auth.users)
create or replace function public.handle_new_user_profile()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.users(id,email,full_name,is_pro)
  values(new.id, new.email, new.raw_user_meta_data->>'full_name', false)
  on conflict(id) do nothing;
  return new;
end;$$;

drop trigger if exists on_auth_user_created_profile on auth.users;
create trigger on_auth_user_created_profile after insert on auth.users
  for each row execute procedure public.handle_new_user_profile();

-- Auto-update updated_at
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end;$$;

drop trigger if exists users_updated_at on public.users;
create trigger users_updated_at before update on public.users
  for each row execute procedure public.set_updated_at();

drop trigger if exists payments_updated_at on public.payments;
create trigger payments_updated_at before update on public.payments
  for each row execute procedure public.set_updated_at();
