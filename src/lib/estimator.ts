/**
 * Illustrative hiring estimate. Every number here is a PLACEHOLDER for the demo and must be replaced
 * with Ubuntu Impact's real fee schedule and time-to-fill figures before launch.
 */
export const levels = ["JUNIOR", "INTERMEDIATE", "SENIOR"] as const;
export type EstimatorLevel = (typeof levels)[number];

const feeRate: Record<EstimatorLevel, [number, number]> = { JUNIOR: [0.08, 0.1], INTERMEDIATE: [0.1, 0.13], SENIOR: [0.13, 0.17] };
const days: Record<EstimatorLevel, [number, number]> = { JUNIOR: [14, 21], INTERMEDIATE: [21, 35], SENIOR: [35, 60] };

export function estimate({ level, monthlySalary, roles }: { level: EstimatorLevel; monthlySalary: number; roles: number }) {
  const annual = monthlySalary * 12;
  const [lo, hi] = feeRate[level];
  return {
    fee: [Math.round((annual * lo * roles) / 1000) * 1000, Math.round((annual * hi * roles) / 1000) * 1000] as [number, number],
    days: days[level],
    shortlist: level === "SENIOR" ? 3 : 5,
  };
}
