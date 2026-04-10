/**
 * proxy.ts — Next.js 16 network-boundary proxy (replaces deprecated middleware.ts).
 * Runs on the Node.js runtime, so Node.js-only modules are fine here.
 * Uses the edge-safe authConfig (JWT decode only — no DB call at this layer).
 */
import { NextResponse, type NextRequest } from "next/server";
import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { checkRateLimit } from "@/lib/rate-limiter";

const { auth } = NextAuth(authConfig);

// NextAuth auth() middleware has a complex type — cast for our wrapper
type AuthMiddleware = (req: NextRequest) => Promise<Response | NextResponse>;

export async function proxy(request: NextRequest): Promise<Response | NextResponse> {
  const { pathname } = request.nextUrl;

  // ── Rate-limit all auth API endpoints ──────────────────────────────────────
  if (pathname.startsWith("/api/auth")) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      request.headers.get("x-real-ip") ??
      "unknown";

    const { allowed, retryAfter } = checkRateLimit(`auth:${ip}`);

    if (!allowed) {
      return NextResponse.json(
        { error: "Trop de tentatives. Veuillez réessayer dans quelques instants." },
        {
          status: 429,
          headers: { "Retry-After": String(retryAfter ?? 60) },
        }
      );
    }

    // Within limit — pass through (no auth guard needed on auth routes themselves)
    return NextResponse.next();
  }

  // ── Auth guard for all other matched routes ────────────────────────────────
  return (auth as unknown as AuthMiddleware)(request);
}

export const config = {
  matcher: [
    // Include /api/auth so rate limiting applies, exclude static assets
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
