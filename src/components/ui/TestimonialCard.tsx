import { Quote } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Testimonial } from "@/types/api";
import { Badge } from "./Badge";
import { Card } from "./Card";

export function TestimonialCard({ item }: { item: Testimonial }) {
  const t = useTranslations("testimonials");
  return (
    <Card className="testimonial-card flex h-full flex-col gap-6">
      <Quote className="size-8 text-ribbon" aria-hidden />
      <blockquote className="flex-1 text-lg leading-relaxed text-ink">“{item.quote}”</blockquote>
      <footer className="space-y-2 border-t border-line pt-5">
        <Badge tone={item.type === "company" ? "brand" : "neutral"}>{t(item.type)}</Badge>
        <p className="font-bold text-christalle">{item.authorName}</p>
        <p className="text-sm text-ink-muted">{[item.authorRole, item.organisation].filter(Boolean).join(" · ")}</p>
      </footer>
    </Card>
  );
}
