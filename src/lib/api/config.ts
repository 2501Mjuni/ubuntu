export const API_BASE_URL = (process.env.NEXT_PUBLIC_API_BASE_URL ?? "").replace(/\/$/, "");
export const API_PREFIX = "/api/v1/public";

/** Mocks run in development, or anywhere NEXT_PUBLIC_USE_MOCKS=true. */
export const mocksEnabled =
  process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_USE_MOCKS === "true";
