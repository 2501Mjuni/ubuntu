"use client";

import { animate, useInView, useReducedMotion } from "framer-motion";
import { useFormatter } from "next-intl";
import { useEffect, useRef, useState } from "react";

/** Counts up once when scrolled into view. With reduced motion, or before hydration, it shows the final value. */
export function StatCounter({ value, label, suffix = "" }: { value: number; label: string; suffix?: string }) {
  const format = useFormatter();
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10% 0px" });
  const reduce = useReducedMotion();
  const [shown, setShown] = useState(value);

  useEffect(() => {
    if (!inView || reduce) return;
    const controls = animate(0, value, { duration: 1.4, ease: "easeOut", onUpdate: (v) => setShown(Math.round(v)) });
    return () => controls.stop();
  }, [inView, reduce, value]);

  return (
    <div ref={ref} className="stat-item">
      <p className="text-4xl font-medium tracking-[-0.06em] text-white md:text-5xl" aria-label={`${format.number(value)}${suffix}`}>
        <span aria-hidden>{format.number(shown)}{suffix}</span>
      </p>
      <p className="mt-2 text-sm font-medium text-white/65">{label}</p>
    </div>
  );
}
