# Ubuntu Impact: public website (Phase 1)

Next.js 16 (App Router, Cache Components), TypeScript strict, Tailwind 4, next-intl (English and Kiswahili), react-hook-form + zod, TanStack Query, MSW, Framer Motion. Later phases (candidate, client and admin portals) reuse the design system in `src/components/ui` and the tokens in `src/app/globals.css`.

## Run

```bash
npm install
cp .env.example .env.local     # then set NEXT_PUBLIC_USE_MOCKS=true while the backend is not ready
npm run dev                    # http://localhost:3000  (redirects to /en)
npm run build && npm start     # production build
npm run lint
npx tsc --noEmit
```

Dev-only design system: `/en/design-system` (404 in production).

## How data works

* All network calls live in `src/lib/api/`. Components use the hooks in `hooks.ts` (client sections) or the cached loaders in `server.ts` (SEO pages: services, article, team). Nothing else calls `fetch`.
* The contract the backend must implement is in [`docs/api-contract.md`](docs/api-contract.md).
* **Mocks:** MSW handlers in `src/mocks/` run in development, or anywhere `NEXT_PUBLIC_USE_MOCKS=true`. In the browser a service worker answers; on the server (rendering and builds) the same handlers are called directly, so no network is needed.
  * Error states: add `?mockError=stats,jobs,testimonials,events,partners,blog` (or `all`) to any page URL. For server-rendered content set `MOCK_ERRORS=blog,services` in the environment.
  * Latency: `NEXT_PUBLIC_MOCK_DELAY_MS` (default 600, browser only).
  * Mock content is fictional and shown with a red "sample content" banner.
* **Builds without mocks need the real endpoints.** Services, blog articles and the team page are rendered at build time, so `npm run build` fails if those routes do not exist yet.

## Placeholders to replace

| What | Where |
|---|---|
| Brand typeface (Hanken Grotesk is a stand-in) | `src/app/[locale]/layout.tsx` (one line) |
| Photos (hero, services, gallery, blog covers, team) | `src/components/ui/Placeholder.tsx` usages |
| Office address, email, phone | `src/messages/*.json` (`footer.*Placeholder`) |
| WhatsApp number | `NEXT_PUBLIC_WHATSAPP_NUMBER` |
| Map location | `NEXT_PUBLIC_MAPS_QUERY` |
| Mission wording, company history, team bios | `src/messages/*.json` (`about.*`) |
| Privacy and cookie policy text | `src/messages/*.json` (`legal.*`) |
| Kiswahili copy (a draft; needs a fluent reviewer) | `src/messages/sw.json` |
| Candidate / client portal links | `NEXT_PUBLIC_PORTAL_URL` (until set, "Find a Job" scrolls to featured jobs) |
| CAPTCHA | `CaptchaSlot` in `src/components/forms/FormParts.tsx` |

## Structure

```
src/app/[locale]/        pages (home, services/[slug], about, blog, blog/[slug], contact, hire, quote, privacy, cookies)
src/components/ui/       design-system components
src/components/sections/ page sections
src/components/forms/    lead forms
src/lib/api/             the only place that does network I/O
src/lib/schemas/         zod schemas (error messages are translation keys)
src/mocks/               MSW handlers and bilingual sample data
src/messages/            en.json, sw.json
```
