# Public website API contract

**Audience:** the backend developer building the Ubuntu Impact public API.
**Status:** requested by the frontend. The website is built and tested against mocks that implement exactly this contract (`src/mocks/handlers.ts`). If the backend differs, tell us and we will adapt the single API layer in `src/lib/api/`.

## 1. Conventions

| | |
|---|---|
| Base path | `/api/v1/public` (all routes below are relative to it) |
| Auth | None. These endpoints are public. |
| Format | JSON, UTF-8. Dates are ISO 8601 in UTC (`2026-11-12T08:00:00.000Z`). Money is a number in the major unit (TZS). |
| Language | `?lang=en` or `?lang=sw` on every request. Return all user-facing text in that language, falling back to English. |
| CORS | Allow the site origin(s) and `Content-Type`, `Accept`. |
| Caching | `GET`s are cached by the site for 1 minute to 1 day. Please send `Cache-Control` and keep payloads stable. |

### List envelope

```json
{ "data": [ ... ], "meta": { "page": 1, "pageSize": 6, "total": 24 } }
```

Single-resource responses are `{ "data": { ... } }`. Pagination uses `page` (from 1) and `pageSize`. A page past the end should return an empty `data` array, not an error.

### Error envelope

```json
{ "error": { "code": "validation_error", "message": "Some fields are invalid", "fields": { "email": ["email"] } } }
```

| Status | `code` | When |
|---|---|---|
| 400 | `invalid_request` | Malformed query or body |
| 404 | `not_found` | Unknown slug |
| 422 | `validation_error` | Field errors; `fields` maps field name to a list of **message keys** (see below) |
| 429 | `rate_limited` | Too many submissions (send `Retry-After`) |
| 5xx | `unavailable` / `server_error` | Anything else |

Please return JSON for every error, including 404 and 500. Field message keys the frontend translates: `required`, `email`, `phone`, `tooShort`, `tooLong`, `number`, `consent`, `spam`. Any other string is shown as-is.

## 2. Read endpoints

Types are TypeScript for precision (`src/types/api.ts` is the source of truth).

### `GET /stats`
```ts
{ data: { placedCandidates: number; activeJobs: number; clientCompanies: number; yearsExperience: number } }
```

### `GET /jobs/featured`
Up to 6 jobs the team has marked as featured. List envelope of:
```ts
{
  id: string; slug: string; title: string;
  companyName: string | null;          // null when the client asked to hide it
  industry: string; location: string;  // location is a city
  jobType: "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "CONSULTANCY";
  careerLevel: "JUNIOR" | "INTERMEDIATE" | "SENIOR";
  salaryRange: { min: number; max: number; currency: string } | null;   // null = "Competitive"
  deadline: string | null; postedAt: string;
  skills: string[]; summary: string;   // plain text, ~160 chars
}
```
The site also emits `JobPosting` structured data from these fields, so `postedAt` and `deadline` must be accurate.

### `GET /testimonials?service=<slug>`
`service` is optional (one of the four service slugs). List envelope of:
```ts
{ id: string; type: "company" | "candidate"; quote: string; authorName: string; authorRole: string;
  organisation: string | null; service: ServiceSlug | null }
```
Only approved testimonials, with the author's consent.

### `GET /events/upcoming`
Upcoming published events, soonest first. List envelope of:
```ts
{ id: string; slug: string; title: string; category: string; startsAt: string; endsAt: string | null;
  venue: string | null; onlineUrl: string | null; isPaid: boolean; price: number | null; currency: string | null }
```

### `GET /partners`
```ts
{ id: string; name: string; logoUrl: string | null; website: string | null }   // logoUrl absolute HTTPS, ideally SVG or WebP
```

### `GET /blog/posts?page=&pageSize=&category=`
`category` is one of `career-advice | hr-insights | company-news | events`. Newest first. List envelope of:
```ts
{ id: string; slug: string; title: string; excerpt: string;
  body: string;                 // plain text; paragraphs separated by a blank line. No HTML or Markdown.
  category: BlogCategory; authorName: string; publishedAt: string; readingMinutes: number;
  coverImageUrl: string | null }
```
The list may omit `body` (send an empty string). Unknown `category` returns 400.

### `GET /blog/posts/:slug`
`{ data: BlogPost }`, with `body`. 404 if missing or unpublished.

### `GET /services` and `GET /services/:slug`
Slugs: `talent-acquisition`, `capacity-building`, `team-building`, `event-management`.
```ts
{ slug: ServiceSlug; title: string; summary: string; intro: string;
  offerings: string[];
  process: { title: string; description: string }[];     // 3 to 5 steps, in order
  outcomes: { title: string; description: string }[];
  gallery: string[] }                                    // captions; the site shows photos when image URLs are added (see open questions)
```

### `GET /team`
```ts
{ id: string; name: string; role: string; bio: string; photoUrl: string | null }
```

## 3. Form endpoints (all `POST`, JSON)

Every form body also carries two anti-spam fields:
* `website`: honeypot. Real users never fill it. **Reject with 422 (`fields.website = ["spam"]`) if non-empty.**
* `captchaToken` (optional): the site has a slot for a CAPTCHA widget. Tell us which provider and we will send its token; verify it server-side.

Success: `201 { "data": { "id": "<uuid>" } }`. Validate every field server-side; the site validates too but must not be trusted.

| Endpoint | Fields (required unless marked) |
|---|---|
| `POST /leads/hiring-enquiry` | `companyName`, `contactName`, `email`, `phone`, `roles` (what they need, free text), `headcount` (optional int), `message` (optional), `consent: true` |
| `POST /leads/quote-request` | `service` (`capacity-building` \| `team-building` \| `event-management`), `organisation`, `name`, `email`, `phone`, `participants` (optional int), `preferredDate` (optional `YYYY-MM-DD`), `details`, `consent: true` |
| `POST /contact` | `name`, `email`, `phone` (optional), `subject`, `message`, `consent: true` |
| `POST /newsletter/subscribe` | `email` (the site shows "check your inbox to confirm", so please use double opt-in) |

Behaviour we need from the backend:
* `hiring-enquiry` and `quote-request` create a **CRM lead** (source: website enquiry / quote request) and notify the team. `quote-request` is `requirements §4.2`.
* `consent: true` must be stored with a timestamp (privacy requirement, `§10.2`).
* Phone numbers arrive as typed (`+255 712 345 678`, `0712345678`). Normalise to E.164 server-side.
* Rate-limit per IP.

## 4. Mapping to the existing backend

The live backend already exposes some related routes. They are not used yet because the shapes differ or are undocumented:

| This contract | Existing route | Note |
|---|---|---|
| `GET /jobs/featured` | `GET /api/v1/public/jobs/featured/` | Response is typed in the OpenAPI schema (`JobPublic`); fields differ (`company_name`, `location_city`, snake_case). Either serve both or tell us to adapt. |
| `GET /services`, `/blog/posts`, `/stats`-like data | `GET /api/v1/public/services/`, `/blog/`, `/home/` | No response schema in OpenAPI. |
| `POST /leads/hiring-enquiry` | `POST /api/v1/public/enquiries/hiring/` | No request schema in OpenAPI. |
| `POST /leads/quote-request` | `POST /api/v1/public/enquiries/quote/` | No request schema in OpenAPI. |
| `testimonials`, `events/upcoming`, `partners`, `team`, `contact`, `newsletter/subscribe` | none | New. |

Preferred outcome: implement this contract as written. If you would rather keep existing routes, send us their response/request schemas and we will adapt.

## 5. Open questions for the backend developer

1. Are slugs the same in English and Kiswahili? (We assume yes.)
2. How are images supplied (gallery photos, blog covers, partner logos, team photos)? We need absolute URLs and a recommended maximum size.
3. Which CAPTCHA provider, if any?
4. Is the newsletter backed by Mailchimp or the platform's own email engine?
5. Should the site receive `Cache-Control` / tags so we can revalidate on publish (for example a webhook that calls our revalidate route)?
6. Who owns the testimonial approval and consent workflow?


## Addendum: job board (demo build)

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/jobs` | Query: `q`, `jobType`, `careerLevel`, `location`, `industry` (each comma separated for multiple), `sort` (`newest`, `deadline`, `salary`), `page`, `pageSize`. Returns the standard list shape. |
| GET | `/jobs/facets` | `{ data: { locations: string[], industries: string[] } }` for the filter chips. |
| GET | `/jobs/:slug` | One job; 404 with the standard error shape when unknown. |
| POST | `/jobs/:slug/apply` | Body: `name`, `email`, `phone`, optional `coverNote`, `consent: true`, `website` (honeypot), optional `captchaToken`. 201 `{ data: { id } }`, 422 with `fields`. CV upload is not part of this demo; it needs a multipart or pre-signed upload decision. |

Job descriptions (responsibilities and requirements) are generic placeholder text on the site; the backend should add `responsibilities: string[]` and `requirements: string[]` to the job object.

## Addendum: events, blog search (demo build)

| Method | Path | Notes |
| --- | --- | --- |
| GET | `/events/upcoming` | Used by the Events page for both list and calendar views. The page filters by `category` on the client; move this server-side if the list grows beyond one page. |
| POST | `/events/:slug/rsvp` | Body: `name`, `email`, `phone`, optional `attendees`, `consent: true`, `website` (honeypot), optional `captchaToken`. 201 `{ data: { id } }`, 422 with `fields`. Capacity and waiting-list rules are not modelled yet. |
| GET | `/blog/posts` | New optional `q` query (full-text match on title, excerpt and body) alongside `category`, `page`, `pageSize`. Related articles reuse this endpoint with `category`. |
