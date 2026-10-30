import { ArrowUpRight, AudioLines, BookOpen, MoveUpRight, Sparkles } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import type { BlogPost } from "@/types/api";
import { Badge } from "./Badge";


export function BlogCard({ post, as: Heading = "h3" }: { post: BlogPost; as?: "h2" | "h3" }) {
  const t = useTranslations("blog");
  const format = useFormatter();
  const CoverIcon = { "career-advice": MoveUpRight, "hr-insights": AudioLines, "company-news": Sparkles, events: BookOpen }[post.category];
  return (
    <article className="blog-card group relative flex h-full flex-col gap-4">
      <div className={`editorial-cover editorial-cover-${post.category}`} aria-hidden="true"><span className="cover-label">Ubuntu / {t(`categories.${post.category}`)}</span><div className="cover-art"><i /><i /><i /><CoverIcon /></div><span className="cover-bottom">{t("readingTime", { minutes: post.readingMinutes })}<ArrowUpRight /></span></div>
      <div className="flex flex-1 flex-col gap-3">
        <div className="flex items-center gap-3 text-sm text-ink-muted">
          <Badge>{t(`categories.${post.category}`)}</Badge>
          <time dateTime={post.publishedAt}>{format.dateTime(new Date(post.publishedAt), { dateStyle: "medium" })}</time>
        </div>
        <Heading className="text-xl font-bold text-christalle">
          <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0 hover:underline">{post.title}</Link>
        </Heading>
        <p className="text-ink-muted">{post.excerpt}</p>
        <p className="mt-auto text-sm font-medium text-ink-muted">{t("readingTime", { minutes: post.readingMinutes })}</p>
      </div>
    </article>
  );
}
