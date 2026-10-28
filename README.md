# Prospare Handyman Work

Next.js 15 + Tailwind 4 + next-intl (EN / FR / ES). Solid colors only: orange #F97316, yellow #FACC15, black #0A0A0A.

## Run
```bash
npm install
npm run dev
```
Open http://localhost:3000 (redirects to /en). Language switcher is in the navbar.

## Where things live
- `src/messages/{en,fr,es}.json`: all text
- `src/lib/site.ts`: phone and email placeholders (replace when ready)
- `src/lib/projects.ts`: recent work photos (Supabase in Step 5)
- `src/components/`: Navbar, Hero, RecentWork, Services, HowItWorks, ContactBand, Footer
- `src/app/[locale]/book/page.tsx` + `src/components/BookingForm.tsx`: booking form
- `src/app/api/booking/`: save booking, signed photo uploads, email
- `src/lib/booking.ts`: validation rules shared by browser and server
- `supabase/schema.sql`: tables, security rules, storage buckets
- `public/prospare-logo.svg` and `src/app/icon.svg`: starter logo

## Done
Day 1: setup, colors, i18n, logo. Day 1-2: layout, home page, footer.
Day 2: Supabase schema, storage, clients. Day 3: booking form, photo upload, email notifications.

## Note
Recent-work titles and the hero work-order card are sample content. Replace them with real jobs before launch.

## Hero photo
Drop a photo at `public/images/hero.jpg` (landscape, about 1920x1080). It replaces the animated tools illustration automatically, with a slow zoom and a solid dark overlay. Use a photo you own or one with a free license (Unsplash, Pexels).

## Images
`public/images/work/*.png` are the real job photos shown in "Recent work" (paths are set in `src/lib/projects.ts`). `public/images/services/*.svg` are original flat illustrations for the service cards.

## Setup: Supabase (Day 2)
1. Create a project at supabase.com.
2. SQL Editor: paste and run `supabase/schema.sql` (tables, row level security, buckets `booking-photos` private and `portfolio` public).
3. Authentication > Providers/Settings: turn OFF "Allow new users to sign up" (the admin policies trust any signed-in user).
4. Copy `.env.example` to `.env.local` and fill in the three Supabase values (Project Settings > API).

## Setup: email (Day 3)
1. Create a Resend account, verify your domain, then set `RESEND_API_KEY`, `RESEND_FROM` and `BOOKING_NOTIFY_EMAIL`.
2. Without a key, emails are only printed in the terminal, so you can develop without it.

## Optional: Turnstile spam protection
Create a Cloudflare Turnstile widget, set `NEXT_PUBLIC_TURNSTILE_SITE_KEY` and `TURNSTILE_SECRET_KEY`. A hidden honeypot field is always on.

## How a booking works
1. Browser validates (react-hook-form + zod) and POSTs to `/api/booking`.
2. Server validates again, saves the booking, emails the business and the customer, returns signed upload URLs.
3. Browser uploads photos straight to Supabase Storage, then POSTs `/api/booking/photos`, which records them and emails 7-day photo links.

Restart `npm run dev` after changing `.env.local`.
