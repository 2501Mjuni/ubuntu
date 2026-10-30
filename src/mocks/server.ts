import { getResponse } from "msw";
import { handlers } from "./handlers";

/** Resolves a request against the mock handlers without patching globals. Returns undefined when nothing matches. */
export async function resolveMock(request: Request): Promise<Response | undefined> {
  return getResponse(handlers, request);
}
