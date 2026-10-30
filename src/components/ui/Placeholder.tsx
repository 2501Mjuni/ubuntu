import { ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";

/** Labelled stand-in for photography that has not been supplied yet. Replace with next/image when assets arrive. */
export function Placeholder({ label, className, ratio = "aspect-[4/3]" }: { label: string; className?: string; ratio?: string }) {
  return (
    <div role="img" aria-label={label} className={cn("relative flex items-center justify-center overflow-hidden rounded-lg bg-[radial-gradient(circle_at_30%_20%,var(--color-chalk),var(--color-surface)_70%)]", ratio, className)}>
      <div className="flex flex-col items-center gap-2 px-4 text-center text-christalle/70">
        <ImageIcon className="size-8" aria-hidden />
        <span className="text-xs font-semibold tracking-wide uppercase">{label}</span>
      </div>
    </div>
  );
}
