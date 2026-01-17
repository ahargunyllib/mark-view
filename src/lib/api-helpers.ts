import {
  GitHubAPIError,
  RateLimitExceededError,
  RepositoryForbiddenError,
  RepositoryNotFoundError,
} from "./github";

/**
 * Standard API error response format
 */
export type ErrorResponse = {
  error: string;
  message: string;
  statusCode: number;
  details?: unknown;
};

/**
 * Standard API success response format
 */
export type SuccessResponse<T> = {
  data: T;
  cached?: boolean;
};

/**
 * Create standardized error response
 */
export function createErrorResponse(
  error: unknown,
  defaultMessage = "An error occurred"
): Response {
  console.error("API Error:", error);

  // Handle GitHub API errors
  if (error instanceof RepositoryNotFoundError) {
    return Response.json(
      {
        error: "RepositoryNotFound",
        message: error.message,
        statusCode: 404,
      } satisfies ErrorResponse,
      { status: 404 }
    );
  }

  if (error instanceof RepositoryForbiddenError) {
    return Response.json(
      {
        error: "RepositoryForbidden",
        message: error.message,
        statusCode: 403,
      } satisfies ErrorResponse,
      { status: 403 }
    );
  }

  if (error instanceof RateLimitExceededError) {
    return Response.json(
      {
        error: "RateLimitExceeded",
        message: error.message,
        statusCode: 429,
        details: {
          resetAt: error.resetAt.toISOString(),
        },
      } satisfies ErrorResponse,
      { status: 429 }
    );
  }

  if (error instanceof GitHubAPIError) {
    return Response.json(
      {
        error: "GitHubAPIError",
        message: error.message,
        statusCode: error.statusCode || 500,
        details: error.response,
      } satisfies ErrorResponse,
      { status: error.statusCode || 500 }
    );
  }

  // Handle validation errors
  if (error instanceof Error && error.message.includes("Invalid")) {
    return Response.json(
      {
        error: "ValidationError",
        message: error.message,
        statusCode: 400,
      } satisfies ErrorResponse,
      { status: 400 }
    );
  }

  // Generic error
  return Response.json(
    {
      error: "InternalServerError",
      message: error instanceof Error ? error.message : defaultMessage,
      statusCode: 500,
    } satisfies ErrorResponse,
    { status: 500 }
  );
}

/**
 * Create standardized success response
 */
export function createSuccessResponse<T>(data: T, cached = false): Response {
  return Response.json({
    data,
    cached,
  } satisfies SuccessResponse<T>);
}

/**
 * Parse and validate JSON body from request
 */
export async function parseJsonBody<T>(request: Request): Promise<T> {
  try {
    const body = await request.json();
    return body as T;
  } catch {
    throw new Error("Invalid JSON body");
  }
}

/**
 * Validate required fields in request body
 */
export function validateRequiredFields<T extends Record<string, unknown>>(
  body: T,
  requiredFields: (keyof T)[]
): void {
  for (const field of requiredFields) {
    if (!body[field]) {
      throw new Error(`Missing required field: ${String(field)}`);
    }
  }
}

/**
 * Log API request
 */
export function logRequest(method: string, path: string, body?: unknown): void {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${method} ${path}`, body ? body : "");
}
