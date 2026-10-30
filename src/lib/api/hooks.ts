"use client";

import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import { useLocale } from "next-intl";
import type { BlogCategory, EventRsvpPayload, JobApplicationPayload, JobSort, Lang } from "@/types/api";
import { api } from "./endpoints";

const useLang = () => useLocale() as Lang;

export function useStats() {
  const lang = useLang();
  return useQuery({ queryKey: ["stats", lang], queryFn: ({ signal }) => api.stats({ lang, signal }), staleTime: 5 * 60_000 });
}

export function useFeaturedJobs() {
  const lang = useLang();
  return useQuery({ queryKey: ["jobs", "featured", lang], queryFn: ({ signal }) => api.featuredJobs({ lang, signal }) });
}

export function useTestimonials() {
  const lang = useLang();
  return useQuery({ queryKey: ["testimonials", lang], queryFn: ({ signal }) => api.testimonials({ lang, signal }) });
}

export function useUpcomingEvents() {
  const lang = useLang();
  return useQuery({ queryKey: ["events", "upcoming", lang], queryFn: ({ signal }) => api.upcomingEvents({ lang, signal }) });
}

export function usePartners() {
  const lang = useLang();
  return useQuery({ queryKey: ["partners", lang], queryFn: ({ signal }) => api.partners({ lang, signal }), staleTime: 30 * 60_000 });
}

export function useBlogPosts(params: { page?: number; pageSize?: number; category?: BlogCategory; q?: string } = {}) {
  const lang = useLang();
  return useQuery({
    queryKey: ["blog", lang, params],
    queryFn: ({ signal }) => api.blogPosts({ lang, signal, ...params }),
    placeholderData: (previous) => previous,
  });
}

export function useServiceTestimonials(service: Parameters<typeof api.testimonials>[0]["service"]) {
  const lang = useLang();
  return useQuery({ queryKey: ["testimonials", lang, service], queryFn: ({ signal }) => api.testimonials({ lang, signal, service }) });
}

export function useHiringEnquiry() {
  const lang = useLang();
  return useMutation({ mutationFn: (body: Parameters<typeof api.submitHiringEnquiry>[0]) => api.submitHiringEnquiry(body, lang) });
}
export function useQuoteRequest() {
  const lang = useLang();
  return useMutation({ mutationFn: (body: Parameters<typeof api.submitQuoteRequest>[0]) => api.submitQuoteRequest(body, lang) });
}
export function useContactMessage() {
  const lang = useLang();
  return useMutation({ mutationFn: (body: Parameters<typeof api.submitContact>[0]) => api.submitContact(body, lang) });
}
export function useNewsletter() {
  const lang = useLang();
  return useMutation({ mutationFn: (body: Parameters<typeof api.subscribeNewsletter>[0]) => api.subscribeNewsletter(body, lang) });
}

export interface JobFilters {
  q?: string;
  jobType?: string;
  careerLevel?: string;
  location?: string;
  industry?: string;
  sort?: JobSort;
  page?: number;
}

export function useJobs(filters: JobFilters) {
  const lang = useLang();
  return useQuery({
    queryKey: ["jobs", "list", lang, filters],
    queryFn: ({ signal }) => api.jobs({ lang, signal, pageSize: 6, ...filters }),
    placeholderData: keepPreviousData,
  });
}

export function useJobFacets() {
  const lang = useLang();
  return useQuery({ queryKey: ["jobs", "facets", lang], queryFn: ({ signal }) => api.jobFacets({ lang, signal }), staleTime: 5 * 60_000 });
}

export function useJobApplication(slug: string) {
  const lang = useLang();
  return useMutation({ mutationFn: (body: JobApplicationPayload) => api.applyToJob(slug, body, lang) });
}

export function useEventRsvp(slug: string) {
  const lang = useLang();
  return useMutation({ mutationFn: (body: EventRsvpPayload) => api.rsvpToEvent(slug, body, lang) });
}
