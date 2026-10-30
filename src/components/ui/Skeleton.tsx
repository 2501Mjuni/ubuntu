import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

export function Skeleton({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      aria-hidden
      className={cn("rounded-md bg-[linear-gradient(90deg,var(--color-surface)_25%,var(--color-line)_50%,var(--color-surface)_75%)] bg-[length:200%_100%] motion-safe:animate-[shimmer_1.6s_linear_infinite]", className)}
      {...props}
    />
  );
}
