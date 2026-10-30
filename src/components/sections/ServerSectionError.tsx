"use client";

import { useRouter } from "next/navigation";
import { startTransition } from "react";
import { ErrorState } from "@/components/ui/DataState";

/** Error panel for server-fetched sections: retry re-renders the route. */
export function ServerSectionError() {
  const router = useRouter();
  return <ErrorState onRetry={() => startTransition(() => router.refresh())} />;
}
