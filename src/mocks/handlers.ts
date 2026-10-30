import { delay, http, HttpResponse, type HttpHandler } from "msw";
import type { ApiErrorBody, BlogPost, Job, Lang, ListResponse, Service, ServiceSlug } from "@/types/api";
import { blogCategories, serviceSlugs } from "@/types/api";
import { eventSeeds, iso, jobSeeds, partnerSeeds, postSeeds, serviceSeeds, stats, teamSeeds, testimonialSeeds } from "./data";

const BASE = "*/api/v1/public";

const langOf = (req: Request): Lang => (new URL(req.url).searchParams.get("lang") === "sw" ? "sw" : "en");

const fail = (status: number, code: string, message: string, fields?: Record<string, string[]>) =>
  HttpResponse.json<ApiErrorBody>({ error: { code, message, fields } }, { status });

/**
 * Error toggle: add ?mockError=stats,blog (or "all") to the page URL in the browser,
 * or set MOCK_ERRORS=stats,blog for server-rendered content.
 */
function forcedError(key: string): boolean {
  const raw = typeof window === "undefined" ? process.env.MOCK_ERRORS : new URLSearchParams(window.location.search).get("mockError");
  const keys = (raw ?? "").split(",").map((s) => s.trim());
  return keys.includes("all") || keys.includes(key);
}

/** Simulated latency in the browser only; server rendering and builds stay instant. */
const wait = () => (typeof window === "undefined" ? Promise.resolve() : delay(Number(process.env.NEXT_PUBLIC_MOCK_DELAY_MS ?? 600)));

const list = <T,>(data: T[], page = 1, pageSize = data.length || 1): ListResponse<T> => ({
  data: data.slice((page - 1) * pageSize, page * pageSize),
  meta: { page, pageSize, total: data.length },
});

const jobs = (lang: Lang): Job[] =>
  jobSeeds.map((j, i) => ({
    id: `job-${i + 1}`, slug: j.slug, title: j.title[lang], companyName: j.company, industry: j.industry[lang], location: j.location,
    jobType: j.jobType, careerLevel: j.careerLevel,
    salaryRange: j.salary ? { min: j.salary[0], max: j.salary[1], currency: "TZS" } : null,
    deadline: iso(j.deadline), postedAt: iso(j.posted), skills: j.skills, summary: j.summary[lang],
  }));

const posts = (lang: Lang): BlogPost[] =>
  postSeeds.map((p, i) => ({
    id: `post-${i + 1}`, slug: p.slug, title: p.title[lang], excerpt: p.excerpt[lang], body: p.body[lang], category: p.category,
    authorName: "Ubuntu Impact", publishedAt: iso(p.days), readingMinutes: p.minutes, coverImageUrl: null,
  }));

const services = (lang: Lang): Service[] =>
  serviceSlugs.map((slug) => {
    const s = serviceSeeds[slug];
    return { slug, title: s.title[lang], summary: s.summary[lang], intro: s.intro[lang], offerings: s.offerings[lang], process: s.process[lang], outcomes: s.outcomes[lang], gallery: s.gallery[lang] };
  });

/** Mirrors the server-side rules the real backend must apply; used to exercise field-error states. */
function validate(body: Record<string, unknown>, required: string[]) {
  const fields: Record<string, string[]> = {};
  for (const key of required) if (!String(body[key] ?? "").trim()) fields[key] = ["required"];
  if (body.website) fields.website = ["spam"];
  return fields;
}

const submit = (key: string, required: string[]) =>
  http.post(`${BASE}/${key}`, async ({ request }) => {
    await wait();
    if (forcedError(key.split("/")[0])) return fail(503, "unavailable", "Service temporarily unavailable");
    const fields = validate((await request.json()) as Record<string, unknown>, required);
    if (Object.keys(fields).length) return fail(422, "validation_error", "Some fields are invalid", fields);
    return HttpResponse.json({ data: { id: crypto.randomUUID() } }, { status: 201 });
  });

export const handlers: HttpHandler[] = [
  http.get(`${BASE}/stats`, async () => {
    await wait();
    return forcedError("stats") ? fail(503, "unavailable", "Stats unavailable") : HttpResponse.json({ data: stats });
  }),
  http.get(`${BASE}/jobs/featured`, async ({ request }) => {
    await wait();
    if (forcedError("jobs")) return fail(503, "unavailable", "Jobs unavailable");
    if (forcedError("jobs-empty")) return HttpResponse.json(list<Job>([]));
    return HttpResponse.json(list(jobs(langOf(request)).slice(0, 3)));
  }),
  http.get(`${BASE}/jobs/facets`, async ({ request }) => {
    await wait();
    const all = jobs(langOf(request));
    return HttpResponse.json({ data: { locations: [...new Set(all.map((j) => j.location))].sort(), industries: [...new Set(all.map((j) => j.industry))].sort() } });
  }),
  http.get(`${BASE}/jobs/:slug`, async ({ request, params }) => {
    await wait();
    if (forcedError("jobs")) return fail(503, "unavailable", "Jobs unavailable");
    const job = jobs(langOf(request)).find((j) => j.slug === params.slug);
    return job ? HttpResponse.json({ data: job }) : fail(404, "not_found", "Job not found");
  }),
  http.get(`${BASE}/jobs`, async ({ request }) => {
    await wait();
    if (forcedError("jobs")) return fail(503, "unavailable", "Jobs unavailable");
    const q = new URL(request.url).searchParams;
    const text = (q.get("q") ?? "").toLowerCase().trim();
    const multi = (k: string) => (q.get(k) ?? "").split(",").filter(Boolean);
    const [types, levels, locations, industries] = [multi("jobType"), multi("careerLevel"), multi("location"), multi("industry")];
    const sort = q.get("sort") ?? "newest";
    const page = Number(q.get("page") ?? 1);
    const pageSize = Number(q.get("pageSize") ?? 6);
    const rows = jobs(langOf(request))
      .filter((j) => !text || [j.title, j.companyName ?? "", j.industry, j.location, j.summary, ...j.skills].join(" ").toLowerCase().includes(text))
      .filter((j) => !types.length || types.includes(j.jobType))
      .filter((j) => !levels.length || levels.includes(j.careerLevel))
      .filter((j) => !locations.length || locations.includes(j.location))
      .filter((j) => !industries.length || industries.includes(j.industry))
      .sort((a, b) =>
        sort === "salary" ? (b.salaryRange?.max ?? 0) - (a.salaryRange?.max ?? 0)
        : sort === "deadline" ? +new Date(a.deadline ?? "2100-01-01") - +new Date(b.deadline ?? "2100-01-01")
        : +new Date(b.postedAt) - +new Date(a.postedAt));
    return HttpResponse.json(list(rows, page, pageSize));
  }),
  http.get(`${BASE}/testimonials`, async ({ request }) => {
    await wait();
    if (forcedError("testimonials")) return fail(503, "unavailable", "Testimonials unavailable");
    const service = new URL(request.url).searchParams.get("service");
    const lang = langOf(request);
    const all = testimonialSeeds
      .filter((t) => !service || t.service === service)
      .map((t) => ({ id: t.id, type: t.type, quote: t.quote[lang], authorName: t.author, authorRole: t.role[lang], organisation: t.org, service: t.service as ServiceSlug }));
    return HttpResponse.json(list(all));
  }),
  http.get(`${BASE}/events/upcoming`, async ({ request }) => {
    await wait();
    if (forcedError("events")) return fail(503, "unavailable", "Events unavailable");
    const lang = langOf(request);
    return HttpResponse.json(
      list(eventSeeds.map((e) => ({
        id: e.id, slug: e.slug, title: e.title[lang], category: e.category[lang], startsAt: iso(e.days), endsAt: null, venue: e.venue, onlineUrl: e.online,
        isPaid: e.price !== null, price: e.price, currency: e.price ? "TZS" : null,
      }))),
    );
  }),
  http.get(`${BASE}/partners`, async () => {
    await wait();
    if (forcedError("partners")) return fail(503, "unavailable", "Partners unavailable");
    return HttpResponse.json(list(partnerSeeds.map((name, i) => ({ id: `p${i + 1}`, name, logoUrl: null, website: null }))));
  }),
  http.get(`${BASE}/blog/posts/:slug`, async ({ request, params }) => {
    await wait();
    if (forcedError("blog")) return fail(503, "unavailable", "Blog unavailable");
    const post = posts(langOf(request)).find((p) => p.slug === params.slug);
    return post ? HttpResponse.json({ data: post }) : fail(404, "not_found", "Post not found");
  }),
  http.get(`${BASE}/blog/posts`, async ({ request }) => {
    await wait();
    if (forcedError("blog")) return fail(503, "unavailable", "Blog unavailable");
    const q = new URL(request.url).searchParams;
    const category = q.get("category");
    const text = (q.get("q") ?? "").toLowerCase().trim();
    const filtered = posts(langOf(request))
      .filter((p) => !category || p.category === category)
      .filter((p) => !text || `${p.title} ${p.excerpt} ${p.body}`.toLowerCase().includes(text));
    if (category && !(blogCategories as readonly string[]).includes(category)) return fail(400, "invalid_category", "Unknown category");
    return HttpResponse.json(list(filtered, Number(q.get("page") ?? 1), Number(q.get("pageSize") ?? 6)));
  }),
  http.get(`${BASE}/services/:slug`, async ({ request, params }) => {
    const service = services(langOf(request)).find((s) => s.slug === params.slug);
    return service ? HttpResponse.json({ data: service }) : fail(404, "not_found", "Service not found");
  }),
  http.get(`${BASE}/services`, ({ request }) => HttpResponse.json(list(services(langOf(request))))),
  http.get(`${BASE}/team`, ({ request }) => {
    const lang = langOf(request);
    return HttpResponse.json(list(teamSeeds.map((m) => ({ id: m.id, name: m.name, role: m.role[lang], bio: m.bio[lang], photoUrl: null }))));
  }),

  submit("leads/hiring-enquiry", ["companyName", "contactName", "email", "phone", "roles"]),
  submit("leads/quote-request", ["service", "organisation", "name", "email", "phone", "details"]),
  submit("events/:slug/rsvp", ["name", "email", "phone"]),
  submit("jobs/:slug/apply", ["name", "email", "phone"]),
  submit("contact", ["name", "email", "subject", "message"]),
  submit("newsletter/subscribe", ["email"]),
];
