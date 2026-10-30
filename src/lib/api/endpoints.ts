import type {
  BlogCategory, BlogPost, EventRsvpPayload, JobApplicationPayload, JobFacets, JobSort, CommunityEvent, ContactPayload, HiringEnquiryPayload, Job, Lang, ListResponse,
  NewsletterPayload, Partner, QuoteRequestPayload, Service, ServiceSlug, Stats, SubmitResult, TeamMember, Testimonial,
} from "@/types/api";
import { apiFetch } from "./client";

interface Opts {
  lang: Lang;
  signal?: AbortSignal;
}

export const api = {
  stats: ({ lang, signal }: Opts) => apiFetch<{ data: Stats }>("/stats", { lang, signal }).then((r) => r.data),
  featuredJobs: ({ lang, signal }: Opts) => apiFetch<ListResponse<Job>>("/jobs/featured", { lang, signal }),
  jobs: ({ lang, signal, ...query }: Opts & { q?: string; jobType?: string; careerLevel?: string; location?: string; industry?: string; sort?: JobSort; page?: number; pageSize?: number }) =>
    apiFetch<ListResponse<Job>>("/jobs", { lang, signal, query }),
  jobFacets: ({ lang, signal }: Opts) => apiFetch<{ data: JobFacets }>("/jobs/facets", { lang, signal }).then((r) => r.data),
  applyToJob: (slug: string, body: JobApplicationPayload, lang: Lang) =>
    apiFetch<{ data: SubmitResult }>(`/jobs/${slug}/apply`, { method: "POST", body, lang }),
  rsvpToEvent: (slug: string, body: EventRsvpPayload, lang: Lang) =>
    apiFetch<{ data: SubmitResult }>(`/events/${slug}/rsvp`, { method: "POST", body, lang }),
  testimonials: ({ lang, signal, service }: Opts & { service?: ServiceSlug }) =>
    apiFetch<ListResponse<Testimonial>>("/testimonials", { lang, signal, query: { service } }),
  upcomingEvents: ({ lang, signal }: Opts) => apiFetch<ListResponse<CommunityEvent>>("/events/upcoming", { lang, signal }),
  partners: ({ lang, signal }: Opts) => apiFetch<ListResponse<Partner>>("/partners", { lang, signal }),
  blogPosts: ({ lang, signal, page = 1, pageSize = 6, category, q }: Opts & { page?: number; pageSize?: number; category?: BlogCategory; q?: string }) =>
    apiFetch<ListResponse<BlogPost>>("/blog/posts", { lang, signal, query: { page, pageSize, category, q } }),
  blogPost: ({ lang, slug }: Opts & { slug: string }) => apiFetch<{ data: BlogPost }>(`/blog/posts/${slug}`, { lang }).then((r) => r.data),
  services: ({ lang }: Opts) => apiFetch<ListResponse<Service>>("/services", { lang }),
  service: ({ lang, slug }: Opts & { slug: string }) => apiFetch<{ data: Service }>(`/services/${slug}`, { lang }).then((r) => r.data),
  team: ({ lang }: Opts) => apiFetch<ListResponse<TeamMember>>("/team", { lang }),

  submitHiringEnquiry: (body: HiringEnquiryPayload, lang: Lang) =>
    apiFetch<{ data: SubmitResult }>("/leads/hiring-enquiry", { method: "POST", body, lang }),
  submitQuoteRequest: (body: QuoteRequestPayload, lang: Lang) =>
    apiFetch<{ data: SubmitResult }>("/leads/quote-request", { method: "POST", body, lang }),
  submitContact: (body: ContactPayload, lang: Lang) =>
    apiFetch<{ data: SubmitResult }>("/contact", { method: "POST", body, lang }),
  subscribeNewsletter: (body: NewsletterPayload, lang: Lang) =>
    apiFetch<{ data: SubmitResult }>("/newsletter/subscribe", { method: "POST", body, lang }),
};
