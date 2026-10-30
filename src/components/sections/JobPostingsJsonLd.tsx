import { getLocale } from "next-intl/server";
import { JsonLd } from "@/components/layout/JsonLd";
import { loadFeaturedJobs } from "@/lib/api/server";
import { siteUrl } from "@/lib/utils";
import type { Job, Lang } from "@/types/api";

const employmentType: Record<Job["jobType"], string> = {
  FULL_TIME: "FULL_TIME", PART_TIME: "PART_TIME", CONTRACT: "CONTRACTOR", INTERNSHIP: "INTERN", CONSULTANCY: "CONTRACTOR",
};

/** JobPosting structured data for the featured jobs. Silent on failure: structured data must never break the page. */
export async function JobPostingsJsonLd() {
  const lang = (await getLocale()) as Lang;
  let jobs: Job[];
  try {
    jobs = await loadFeaturedJobs(lang);
  } catch {
    return null;
  }
  return (
    <>
      {jobs.map((job) => (
        <JsonLd
          key={job.id}
          data={{
            "@context": "https://schema.org",
            "@type": "JobPosting",
            title: job.title,
            description: job.summary,
            datePosted: job.postedAt,
            ...(job.deadline && { validThrough: job.deadline }),
            employmentType: employmentType[job.jobType],
            hiringOrganization: { "@type": "Organization", name: job.companyName ?? "Ubuntu Impact (confidential client)", sameAs: siteUrl },
            jobLocation: { "@type": "Place", address: { "@type": "PostalAddress", addressLocality: job.location, addressCountry: "TZ" } },
            ...(job.salaryRange && {
              baseSalary: { "@type": "MonetaryAmount", currency: job.salaryRange.currency, value: { "@type": "QuantitativeValue", minValue: job.salaryRange.min, maxValue: job.salaryRange.max, unitText: "MONTH" } },
            }),
          }}
        />
      ))}
    </>
  );
}
