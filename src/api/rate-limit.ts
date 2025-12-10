import { getGitHubClient } from "@/lib/github";
import { CacheKeys, appCache } from "@/lib/cache";
import {
  createErrorResponse,
  createSuccessResponse,
  logRequest,
} from "@/lib/api-helpers";
import type { RateLimitInfo } from "@/lib/github";

/**
 * GET /api/rate-limit
 * Get current GitHub API rate limit status
 */
export async function getRateLimit(_request: Request): Promise<Response> {
  try {
    logRequest("GET", "/api/rate-limit");

    // Check cache first (cache for 60 seconds)
    const cacheKey = CacheKeys.rateLimit();
    const cached = appCache.get<RateLimitInfo>(cacheKey);

    if (cached) {
      return createSuccessResponse(cached, true);
    }

    // Fetch from GitHub
    const client = getGitHubClient();
    const rateLimit = await client.getRateLimit();

    // Cache for 60 seconds
    appCache.set(cacheKey, rateLimit);

    return createSuccessResponse(rateLimit, false);
  } catch (error) {
    return createErrorResponse(error, "Failed to fetch rate limit");
  }
}
