/**
 * GitHub API Type Definitions
 *
 * API Endpoints Used:
 * - Repository validation: GET /repos/:owner/:repo
 * - Git Tree API: GET /repos/:owner/:repo/git/trees/:ref?recursive=1
 * - File contents: GET /repos/:owner/:repo/contents/:path
 * - Rate limit: GET /rate_limit
 */

/**
 * GitHub API Repository Response
 * From: GET /repos/:owner/:repo
 */
export type GitHubRepository = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  private: boolean;
  owner: {
    login: string;
    id: number;
    avatar_url: string;
  };
  html_url: string;
  default_branch: string;
  size: number;
  language: string | null;
  created_at: string;
  updated_at: string;
  pushed_at: string;
};

/**
 * GitHub API Git Tree Response
 * From: GET /repos/:owner/:repo/git/trees/:ref?recursive=1
 */
export type GitHubTreeResponse = {
  sha: string;
  url: string;
  tree: GitHubTreeItem[];
  truncated: boolean;
};

export type GitHubTreeItem = {
  path: string;
  mode: string;
  type: "blob" | "tree";
  sha: string;
  size?: number;
  url: string;
};

/**
 * GitHub API File Content Response
 * From: GET /repos/:owner/:repo/contents/:path
 */
export type GitHubFileContent = {
  name: string;
  path: string;
  sha: string;
  size: number;
  url: string;
  html_url: string;
  git_url: string;
  download_url: string | null;
  type: "file" | "dir" | "symlink" | "submodule";
  content?: string; // base64 encoded
  encoding?: "base64";
  _links: {
    self: string;
    git: string;
    html: string;
  };
};

/**
 * GitHub API Rate Limit Response
 * From: GET /rate_limit
 */
export type GitHubRateLimitResponse = {
  resources: {
    core: GitHubRateLimit;
    search: GitHubRateLimit;
    graphql: GitHubRateLimit;
  };
  rate: GitHubRateLimit;
};

export type GitHubRateLimit = {
  limit: number;
  remaining: number;
  reset: number; // Unix timestamp
  used: number;
};

/**
 * Custom types for our application
 */

export type RepositoryMetadata = {
  owner: string;
  name: string;
  fullName: string;
  description: string | null;
  defaultBranch: string;
  isPrivate: boolean;
  htmlUrl: string;
};

export type MarkdownFile = {
  path: string;
  sha: string;
  size: number;
  url: string;
};

export type FileContent = {
  path: string;
  content: string; // decoded markdown content
  sha: string;
  size: number;
};

export type RateLimitInfo = {
  limit: number;
  remaining: number;
  resetAt: Date;
  used: number;
};

/**
 * Error types
 */

export class GitHubAPIError extends Error {
  statusCode?: number;
  response?: unknown;

  constructor(message: string, statusCode?: number, response?: unknown) {
    super(message);
    this.name = "GitHubAPIError";
    this.statusCode = statusCode;
    this.response = response;
  }
}

export class RepositoryNotFoundError extends GitHubAPIError {
  constructor(owner: string, repo: string) {
    super(`Repository ${owner}/${repo} not found`, 404);
    this.name = "RepositoryNotFoundError";
  }
}

export class RepositoryForbiddenError extends GitHubAPIError {
  constructor(owner: string, repo: string) {
    super(
      `Repository ${owner}/${repo} is private or you don't have access`,
      403
    );
    this.name = "RepositoryForbiddenError";
  }
}

export class RateLimitExceededError extends GitHubAPIError {
  resetAt: Date;

  constructor(resetAt: Date) {
    super(
      `GitHub API rate limit exceeded. Resets at ${resetAt.toISOString()}`,
      403
    );
    this.name = "RateLimitExceededError";
    this.resetAt = resetAt;
  }
}

/**
 * ETag cache entry
 */
export type ETagCacheEntry = {
  etag: string;
  data: unknown;
  timestamp: number;
};
