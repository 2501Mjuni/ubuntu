/** Candidate/client portals are a later phase. Until NEXT_PUBLIC_PORTAL_URL is set, portal CTAs fall back to on-site anchors. */
const portal = (process.env.NEXT_PUBLIC_PORTAL_URL ?? "").replace(/\/$/, "");

export const hasPortal = portal !== "";
export const portalUrl = (path: string) => `${portal}${path}`;
