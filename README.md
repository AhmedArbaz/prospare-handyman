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
- `src/lib/projects.ts`: recent work tiles (set `image` to show a photo; Supabase in Step 5)
- `src/components/`: Navbar, Hero, RecentWork, Services, HowItWorks, ContactBand, Footer
- `src/app/[locale]/book/page.tsx`: placeholder, real form comes in Step 4
- `public/prospare-logo.svg` and `src/app/icon.svg`: starter logo

## Done
Step 1 (setup, colors, i18n, logo) and Step 2 (layout, home page, footer).

## Note
Recent-work titles and the hero work-order card are sample content. Replace them with real jobs before launch.

## Hero photo
Drop a photo at `public/images/hero.jpg` (landscape, about 1920x1080). It replaces the animated tools illustration automatically, with a slow zoom and a solid dark overlay. Use a photo you own or one with a free license (Unsplash, Pexels).
