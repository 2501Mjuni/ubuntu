"use client";

import { AlertCircle, Inbox } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { Button } from "./Button";

/** Shared empty and error panels so every data section behaves the same way. */
export function EmptyState({ title, description }: { title?: string; description?: string }) {
  const t = useTranslations("states");
  return (
    <div className="flex flex-col items-center gap-2 rounded-lg border border-dashed border-line-strong px-6 py-12 text-center">
      <Inbox className="size-8 text-ink-muted" aria-hidden />
      <p className="font-semibold text-ink">{title ?? t("emptyTitle")}</p>
      <p className="max-w-sm text-sm text-ink-muted">{description ?? t("emptyDescription")}</p>
    </div>
  );
}

export function ErrorState({ onRetry, retrying }: { onRetry: () => void; retrying?: boolean }) {
  const t = useTranslations("states");
  return (
    <div role="alert" className="flex flex-col items-center gap-3 rounded-lg border border-danger/30 bg-danger/5 px-6 py-10 text-center">
      <AlertCircle className="size-8 text-danger" aria-hidden />
      <p className="font-semibold text-ink">{t("errorTitle")}</p>
      <p className="max-w-sm text-sm text-ink-muted">{t("errorDescription")}</p>
      <Button variant="secondary" size="sm" onClick={onRetry} disabled={retrying}>{retrying ? t("retrying") : t("retry")}</Button>
    </div>
  );
}

/** Wraps a TanStack Query result with consistent loading, error and empty handling. */
export function QueryBoundary<T>({ query, skeleton, isEmpty, empty, children }: {
  query: { data?: T; isPending: boolean; isError: boolean; isFetching: boolean; refetch: () => unknown };
  skeleton: ReactNode;
  isEmpty?: (data: T) => boolean;
  empty?: { title?: string; description?: string };
  children: (data: T) => ReactNode;
}) {
  if (query.isPending) return <div aria-busy="true">{skeleton}</div>;
  if (query.isError || query.data === undefined) return <ErrorState onRetry={() => void query.refetch()} retrying={query.isFetching} />;
  if (isEmpty?.(query.data)) return <EmptyState {...empty} />;
  return <>{children(query.data)}</>;
}
