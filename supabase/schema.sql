-- Prospare Handyman Work: run this once in Supabase > SQL Editor.
create extension if not exists pgcrypto;

-- ---------- Tables ----------
create table if not exists public.bookings (
  id             uuid primary key default gen_random_uuid(),
  created_at     timestamptz not null default now(),
  status         text not null default 'new' check (status in ('new','confirmed','done','cancelled')),
  name           text not null,
  phone          text not null,
  email          text not null,
  address        text not null,
  service        text not null,
  preferred_date date,
  preferred_time text not null default 'flexible',
  reason         text not null,
  locale         text not null default 'en'
);

create table if not exists public.booking_photos (
  id         uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  path       text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  title       text not null,
  description text,
  service     text,
  image_url   text,
  video_url   text,
  sort_order  int not null default 0,
  published   boolean not null default true
);

create table if not exists public.reviews (
  id         uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name       text not null,
  rating     int not null check (rating between 1 and 5),
  text       text not null,
  approved   boolean not null default false
);

create index if not exists bookings_created_idx on public.bookings (created_at desc);
create index if not exists booking_photos_booking_idx on public.booking_photos (booking_id);

-- ---------- Row level security ----------
alter table public.bookings       enable row level security;
alter table public.booking_photos enable row level security;
alter table public.projects       enable row level security;
alter table public.reviews        enable row level security;

-- Bookings and their photos: no public access. The website writes them from
-- server routes using the service role key (which bypasses RLS).

-- Public website can read published projects and approved reviews.
create policy "public read published projects" on public.projects for select using (published);
create policy "public read approved reviews"   on public.reviews  for select using (approved);
-- Visitors can submit a review, but it stays hidden until approved (Step 6).
create policy "public submit review" on public.reviews for insert with check (approved = false);

-- Admin: any signed-in user gets full access (Step 7).
-- IMPORTANT: Supabase > Authentication > turn OFF "Allow new users to sign up",
-- then create the owner account manually, so only the owner is "authenticated".
create policy "admin all bookings"       on public.bookings       for all to authenticated using (true) with check (true);
create policy "admin all booking photos" on public.booking_photos for all to authenticated using (true) with check (true);
create policy "admin all projects"       on public.projects       for all to authenticated using (true) with check (true);
create policy "admin all reviews"        on public.reviews        for all to authenticated using (true) with check (true);

-- ---------- Storage buckets ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('booking-photos', 'booking-photos', false, 5242880, array['image/jpeg','image/png','image/webp']),
  ('portfolio',      'portfolio',      true,  52428800, array['image/jpeg','image/png','image/webp','video/mp4','video/webm'])
on conflict (id) do nothing;

create policy "public read portfolio files" on storage.objects for select using (bucket_id = 'portfolio');
create policy "admin manage files" on storage.objects for all to authenticated
  using (bucket_id in ('portfolio','booking-photos')) with check (bucket_id in ('portfolio','booking-photos'));
