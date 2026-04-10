import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import type { Session } from "next-auth";

/** Standard API response shape per SPEC.md §12 */
export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ success: true, data }, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

/** Session with guaranteed user.id (post auth-check) */
export type AuthedSession = Session & { user: { id: string } };

/**
 * Retrieve the authenticated session or return a 401 response.
 * When `response` is null the session is guaranteed to have user.id.
 */
export async function requireAuth(): Promise<
  | { session: AuthedSession; response: null }
  | { session: null; response: NextResponse }
> {
  const session = await auth();
  if (!session?.user?.id) {
    return { session: null, response: err("Non authentifié", 401) };
  }
  return { session: session as AuthedSession, response: null };
}
