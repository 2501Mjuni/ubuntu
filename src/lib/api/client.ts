import type { ApiErrorBody } from "@/types/api";
import { API_BASE_URL, API_PREFIX, mocksEnabled } from "./config";

/** Thrown for every non-2xx response and for network failures. */
export class ApiError extends Error {
  constructor(
    readonly status: number,
    readonly code: string,
    message: string,
    readonly fields: Record<string, string[]> = {},
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type Query = Record<string, string | number | undefined | null>;

interface Options {
  method?: "GET" | "POST";
  query?: Query;
  body?: unknown;
  lang?: string;
  signal?: AbortSignal;
}

async function send(request: Request): Promise<Response> {
  if (mocksEnabled) {
    // Answered in-process on the server and in the browser alike: no network and no service worker,
    // so the demo also works on plain-HTTP origins where service workers are unavailable.
    const { resolveMock } = await import("@/mocks/server");
    const mocked = await resolveMock(request.clone());
    if (mocked) return mocked;
  }
  return fetch(request);
}

/** The only function in the app that performs network I/O. Components use the hooks and server loaders built on it. */
export async function apiFetch<T>(path: string, { method = "GET", query, body, lang, signal }: Options = {}): Promise<T> {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries({ ...query, lang })) {
    if (value !== undefined && value !== null && value !== "") params.set(key, String(value));
  }
  const qs = params.toString();
  const origin = API_BASE_URL || (typeof window === "undefined" ? "http://localhost:3000" : window.location.origin);
  const url = `${origin}${API_PREFIX}${path}${qs ? `?${qs}` : ""}`;

  let response: Response;
  try {
    response = await send(
      new Request(url, {
        method,
        signal,
        headers: { Accept: "application/json", ...(body === undefined ? {} : { "Content-Type": "application/json" }) },
        body: body === undefined ? undefined : JSON.stringify(body),
      }),
    );
  } catch {
    throw new ApiError(0, "network_error", "Network request failed");
  }

  if (!response.ok) {
    const parsed = (await response.json().catch(() => null)) as ApiErrorBody | null;
    throw new ApiError(
      response.status,
      parsed?.error?.code ?? "unknown",
      parsed?.error?.message ?? response.statusText,
      parsed?.error?.fields,
    );
  }
  return (await response.json()) as T;
}
