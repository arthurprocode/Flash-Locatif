/**
 * In-memory sliding-window rate limiter.
 * Suitable for single-instance deployments (MVP).
 * For multi-instance production use, replace with Redis (e.g. Upstash).
 */

interface RateLimitEntry {
  count: number;
  /** Unix timestamp (ms) when the window resets */
  resetAt: number;
}

/** Key → request count within the current window */
const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 60_000; // 1 minute
const MAX_REQUESTS = 10; // max requests per key per window

// Clean up stale entries every 5 minutes to avoid unbounded memory growth
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (now > entry.resetAt) store.delete(key);
  }
}, 5 * 60_000);

export interface RateLimitResult {
  allowed: boolean;
  /** Seconds until the window resets (only set when not allowed) */
  retryAfter?: number;
}

/**
 * Check whether the given key is within the rate limit.
 * Mutates the in-memory store on every call.
 */
export function checkRateLimit(key: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(key);

  // No record yet, or window has expired → start fresh
  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true };
  }

  if (entry.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      retryAfter: Math.ceil((entry.resetAt - now) / 1_000),
    };
  }

  entry.count += 1;
  return { allowed: true };
}
