import { CalendarDays, MapPin, Video } from "lucide-react";
import { useFormatter, useTranslations } from "next-intl";
import type { CommunityEvent } from "@/types/api";
import { Badge } from "./Badge";
import { Card } from "./Card";

export function EventCard({ event }: { event: CommunityEvent }) {
  const t = useTranslations("events");
  const format = useFormatter();
  const date = new Date(event.startsAt);
  return (
    <Card className="flex h-full gap-4 transition-shadow hover:shadow-md">
      <div className="flex size-16 shrink-0 flex-col items-center justify-center rounded-md bg-christalle text-white" aria-hidden>
        <span className="text-2xl leading-none font-extrabold">{format.dateTime(date, { day: "numeric" })}</span>
        <span className="text-xs uppercase">{format.dateTime(date, { month: "short" })}</span>
      </div>
      <div className="min-w-0 space-y-2">
        <Badge tone={event.isPaid ? "neutral" : "success"}>{event.isPaid && event.price ? `${format.number(event.price)} ${event.currency}` : t("free")}</Badge>
        <h3 className="text-lg font-bold text-christalle">{event.title}</h3>
        <p className="flex items-center gap-2 text-sm text-ink-muted"><CalendarDays className="size-4 text-violet" aria-hidden />{format.dateTime(date, { dateStyle: "medium", timeStyle: "short" })}</p>
        <p className="flex items-center gap-2 text-sm text-ink-muted">
          {event.venue ? <MapPin className="size-4 text-violet" aria-hidden /> : <Video className="size-4 text-violet" aria-hidden />}
          {event.venue ?? t("online")}
        </p>
      </div>
    </Card>
  );
}
