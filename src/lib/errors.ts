/**
 * Error handling utilities
 */

export type ErrorDetails = {
  message: string;
  suggestion?: string;
  type?: "error" | "warning" | "info";
};

// Validation regex patterns at top level for performance
const REPO_VALID_PATTERN = /^[a-zA-Z0-9._-]+\/[a-zA-Z0-9._-]+$/;
const REF_INVALID_PATTERN = /[\s~^:?*[\]\\]|\.\.|@\{|\/\//;

/**
 * Map common errors to user-friendly messages
 */
// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Error mapping requires multiple conditionals
export function getErrorDetails(error: unknown): ErrorDetails {
  if (error instanceof Error) {
    const message = error.message.toLowerCase();

    // Repository not found
    if (message.includes("not found") || message.includes("404")) {
      return {
        message: "Repository not found",
        suggestion:
          "Double-check the owner/repo format and ensure the repository exists and is public.",
        type: "error",
      };
    }

    // Rate limit exceeded
    if (message.includes("rate limit") || message.includes("429")) {
      return {
        message: "GitHub API rate limit exceeded",
        suggestion:
          "Wait a few minutes before trying again, or add a GitHub token to increase your rate limit.",
        type: "warning",
      };
    }

    // Private repository
    if (
      message.includes("forbidden") ||
      message.includes("private") ||
      message.includes("403")
    ) {
      return {
        message: "Access denied to this repository",
        suggestion:
          "This repository may be private. Use a GitHub token with appropriate access.",
        type: "error",
      };
    }

    // Network errors
    if (
      message.includes("network") ||
      message.includes("fetch") ||
      message.includes("connection")
    ) {
      return {
        message: "Network error",
        suggestion: "Check your internet connection and try again.",
        type: "error",
      };
    }

    // Validation errors
    if (message.includes("invalid") || message.includes("validation")) {
      return {
        message: error.message,
        suggestion: "Please check your input and try again.",
        type: "error",
      };
    }

    // GitHub server errors
    if (message.includes("500") || message.includes("server error")) {
      return {
        message: "GitHub is experiencing issues",
        suggestion: "This is a temporary issue. Please try again later.",
        type: "warning",
      };
    }

    // Generic error with the actual message
    return {
      message: error.message,
      type: "error",
    };
  }

  return {
    message: "An unexpected error occurred",
    suggestion: "Please try again or report this issue if it persists.",
    type: "error",
  };
}

/**
 * Validate repository input format
 */
export function validateRepositoryInput(input: string): {
  valid: boolean;
  error?: string;
} {
  const trimmed = input.trim();

  if (!trimmed) {
    return { valid: false, error: "Repository input is required" };
  }

  // Check for owner/repo format
  const parts = trimmed.split("/");
  if (parts.length !== 2) {
    return {
      valid: false,
      error: 'Repository must be in "owner/repo" format',
    };
  }

  const [owner, repo] = parts;

  // Validate owner
  if (!owner || owner.length === 0) {
    return { valid: false, error: "Owner cannot be empty" };
  }

  // Validate repo
  if (!repo || repo.length === 0) {
    return { valid: false, error: "Repository name cannot be empty" };
  }

  // Check for invalid characters (GitHub allows alphanumeric, -, _, .)
  if (!REPO_VALID_PATTERN.test(trimmed)) {
    return {
      valid: false,
      error: "Repository contains invalid characters",
    };
  }

  return { valid: true };
}

/**
 * Validate branch/ref input (optional field)
 */
export function validateRefInput(input: string): {
  valid: boolean;
  error?: string;
} {
  if (!input || input.trim() === "") {
    return { valid: true }; // Optional field
  }

  const trimmed = input.trim();

  // Check for invalid characters in git refs
  // Refs can't contain: space, ~, ^, :, ?, *, [, \, .., @{, //
  if (REF_INVALID_PATTERN.test(trimmed)) {
    return {
      valid: false,
      error: "Branch/ref contains invalid characters",
    };
  }

  // Can't start with . or end with .lock
  if (trimmed.startsWith(".") || trimmed.endsWith(".lock")) {
    return {
      valid: false,
      error: "Invalid branch/ref format",
    };
  }

  return { valid: true };
}
