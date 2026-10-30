"use client";

import { ErrorState } from "@/components/ui/DataState";
import { Container } from "@/components/ui/Container";

export default function ServiceError({ reset }: { error: Error; reset: () => void }) {
  return <Container className="py-24"><ErrorState onRetry={reset} /></Container>;
}
