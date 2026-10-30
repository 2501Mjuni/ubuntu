/** Public API contract (base path /api/v1/public). Mirrored in docs/api-contract.md. */

export type Lang = "en" | "sw";

export interface ListResponse<T> {
  data: T[];
  meta: { page: number; pageSize: number; total: number };
}

export interface ApiErrorBody {
  error: { code: string; message: string; fields?: Record<string, string[]> };
}

export interface Stats {
  placedCandidates: number;
  activeJobs: number;
  clientCompanies: number;
  yearsExperience: number;
}

export type JobType = "FULL_TIME" | "PART_TIME" | "CONTRACT" | "INTERNSHIP" | "CONSULTANCY";
export type CareerLevel = "JUNIOR" | "INTERMEDIATE" | "SENIOR";

export interface Job {
  id: string;
  slug: string;
  title: string;
  /** null when the client asked for the company name to be hidden. */
  companyName: string | null;
  industry: string;
  location: string;
  jobType: JobType;
  careerLevel: CareerLevel;
  /** null means "Competitive". */
  salaryRange: { min: number; max: number; currency: string } | null;
  deadline: string | null;
  postedAt: string;
  skills: string[];
  summary: string;
}

export interface JobFacets {
  locations: string[];
  industries: string[];
}

export type JobSort = "newest" | "deadline" | "salary";

export interface JobApplicationPayload {
  name: string;
  email: string;
  phone: string;
  coverNote?: string;
  consent: true;
  website?: string;
  captchaToken?: string;
}

export interface Testimonial {
  id: string;
  type: "company" | "candidate";
  quote: string;
  authorName: string;
  authorRole: string;
  organisation: string | null;
  /** Slug of the related service, when the quote is about one. */
  service: ServiceSlug | null;
}

export interface CommunityEvent {
  id: string;
  slug: string;
  title: string;
  category: string;
  startsAt: string;
  endsAt: string | null;
  venue: string | null;
  onlineUrl: string | null;
  isPaid: boolean;
  price: number | null;
  currency: string | null;
}

export interface Partner {
  id: string;
  name: string;
  /** null until the client supplies the logo file. */
  logoUrl: string | null;
  website: string | null;
}

export const blogCategories = ["career-advice", "hr-insights", "company-news", "events"] as const;
export type BlogCategory = (typeof blogCategories)[number];

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Plain text; paragraphs separated by a blank line. No HTML. */
  body: string;
  category: BlogCategory;
  authorName: string;
  publishedAt: string;
  readingMinutes: number;
  coverImageUrl: string | null;
}

export const serviceSlugs = ["talent-acquisition", "capacity-building", "team-building", "event-management"] as const;
export type ServiceSlug = (typeof serviceSlugs)[number];

export interface Service {
  slug: ServiceSlug;
  title: string;
  summary: string;
  intro: string;
  offerings: string[];
  process: { title: string; description: string }[];
  outcomes: { title: string; description: string }[];
  /** Captions for the gallery (event management shows it; photos come later). */
  gallery: string[];
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  photoUrl: string | null;
}

/** Form payloads. Every form also sends `website` (honeypot, must be empty) and an optional `captchaToken`. */
interface LeadBase {
  consent: true;
  website?: string;
  captchaToken?: string;
}

export interface HiringEnquiryPayload extends LeadBase {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  roles: string;
  headcount?: number;
  message?: string;
}

export interface QuoteRequestPayload extends LeadBase {
  service: Exclude<ServiceSlug, "talent-acquisition">;
  organisation: string;
  name: string;
  email: string;
  phone: string;
  participants?: number;
  preferredDate?: string;
  details: string;
}

export interface ContactPayload extends LeadBase {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface NewsletterPayload {
  email: string;
  website?: string;
  captchaToken?: string;
}

export interface SubmitResult {
  id: string;
}

export interface EventRsvpPayload {
  name: string;
  email: string;
  phone: string;
  attendees?: number;
  consent: true;
  website?: string;
  captchaToken?: string;
}
