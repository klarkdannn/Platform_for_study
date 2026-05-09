-- Run this in Supabase SQL Editor: https://app.supabase.com → SQL Editor

-- Profiles (extends Supabase auth.users)
create table if not exists public.profiles (
  id        uuid references auth.users on delete cascade primary key,
  full_name text,
  role      text default 'student' check (role in ('student', 'teacher')),
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (new.id, new.raw_user_meta_data->>'full_name', 'student');
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Submissions
create table if not exists public.submissions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references public.profiles(id) on delete cascade not null,
  exercise_id text not null,
  code        text not null,
  status      text check (status in ('passed', 'failed')) not null,
  output      text,
  created_at  timestamptz default now()
);

-- Row Level Security
alter table public.profiles   enable row level security;
alter table public.submissions enable row level security;

-- Profiles: everyone reads their own, teachers read all
create policy "users_own_profile" on public.profiles
  for select using (auth.uid() = id);

create policy "teachers_read_all_profiles" on public.profiles
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'teacher')
  );

create policy "users_update_own_profile" on public.profiles
  for update using (auth.uid() = id);

-- Submissions: users CRUD own, teachers read all
create policy "users_own_submissions" on public.submissions
  for all using (auth.uid() = user_id);

create policy "teachers_read_all_submissions" on public.submissions
  for select using (
    exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'teacher')
  );

-- To make a user a teacher, run:
-- update public.profiles set role = 'teacher' where id = '<user-uuid>';
