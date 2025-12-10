import type {
  ETagCacheEntry,
  FileContent,
  GitHubFileContent,
  GitHubRateLimitResponse,
  GitHubRepository,
  GitHubTreeResponse,
  MarkdownFile,
  RateLimitInfo,
  RepositoryMetadata,
} from "./types";
import {
  GitHubAPIError,
  RateLimitExceededError,
  RepositoryForbiddenError,
  RepositoryNotFoundError,
} from "./types";

/**
 * GitHub API Client
 * Handles all interactions with the GitHub REST API
 */
export class GitHubClient {
  private readonly baseUrl = "https://api.github.com";
  private readonly token?: string;
  private readonly etagCache: Map<string, ETagCacheEntry> = new Map();

  constructor(token?: string) {
    this.token = token || process.env.GITHUB_TOKEN;
  }

  /**
   * Get request headers for GitHub API
   */
  private getHeaders(etag?: string): HeadersInit {
    const headers: HeadersInit = {
      Accept: "application/vnd.github.v3+json",
      "User-Agent": "MarkView-App",
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    if (etag) {
      headers["If-None-Match"] = etag;
    }

    return headers;
  }

  /**
   * Parse rate limit information from response headers
   */
  private parseRateLimitHeaders(headers: Headers): Partial<RateLimitInfo> {
    const limit = headers.get("x-ratelimit-limit");
    const remaining = headers.get("x-ratelimit-remaining");
    const reset = headers.get("x-ratelimit-reset");

    if (!(limit && remaining && reset)) {
      return {};
    }

    return {
      limit: Number.parseInt(limit, 10),
      remaining: Number.parseInt(remaining, 10),
      resetAt: new Date(Number.parseInt(reset, 10) * 1000),
    };
  }

  /**
   * Make a request to the GitHub API with error handling
   */
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const cacheKey = endpoint;
    const cachedEntry = this.etagCache.get(cacheKey);

    const headers = this.getHeaders(cachedEntry?.etag);
    const url = `${this.baseUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      // Handle 304 Not Modified - return cached data
      if (response.status === 304 && cachedEntry) {
        return cachedEntry.data as T;
      }

      // Parse rate limit info
      const rateLimitInfo = this.parseRateLimitHeaders(response.headers);

      // Check for rate limit exceeded
      if (
        response.status === 403 &&
        rateLimitInfo.remaining !== undefined &&
        rateLimitInfo.remaining === 0
      ) {
        throw new RateLimitExceededError(
          rateLimitInfo.resetAt || new Date(Date.now() + 3_600_000)
        );
      }

      // Handle error responses
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new GitHubAPIError(
          errorData.message || `GitHub API error: ${response.status}`,
          response.status,
          errorData
        );
      }

      const data = await response.json();

      // Store ETag for caching
      const etag = response.headers.get("etag");
      if (etag) {
        this.etagCache.set(cacheKey, {
          etag,
          data,
          timestamp: Date.now(),
        });
      }

      return data;
    } catch (error) {
      if (error instanceof GitHubAPIError) {
        throw error;
      }
      throw new GitHubAPIError(
        `Network error: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  /**
   * Validate repository and get metadata
   * @throws {RepositoryNotFoundError} If repository doesn't exist
   * @throws {RepositoryForbiddenError} If repository is private/forbidden
   */
  async validateRepository(
    owner: string,
    repo: string
  ): Promise<RepositoryMetadata> {
    try {
      const data = await this.request<GitHubRepository>(
        `/repos/${owner}/${repo}`
      );

      return {
        owner: data.owner.login,
        name: data.name,
        fullName: data.full_name,
        description: data.description,
        defaultBranch: data.default_branch,
        isPrivate: data.private,
        htmlUrl: data.html_url,
      };
    } catch (error) {
      if (error instanceof GitHubAPIError) {
        if (error.statusCode === 404) {
          throw new RepositoryNotFoundError(owner, repo);
        }
        if (error.statusCode === 403) {
          throw new RepositoryForbiddenError(owner, repo);
        }
      }
      throw error;
    }
  }

  /**
   * Get file tree for repository, filtered to markdown files only
   * @param owner Repository owner
   * @param repo Repository name
   * @param ref Branch/tag/commit ref (defaults to default branch)
   */
  async getFileTree(
    owner: string,
    repo: string,
    ref?: string
  ): Promise<MarkdownFile[]> {
    // If no ref provided, get the default branch first
    let treeRef = ref;
    if (!treeRef) {
      const repoMetadata = await this.validateRepository(owner, repo);
      treeRef = repoMetadata.defaultBranch;
    }

    const data = await this.request<GitHubTreeResponse>(
      `/repos/${owner}/${repo}/git/trees/${treeRef}?recursive=1`
    );

    // Filter to only markdown files and map to our format
    const markdownFiles = data.tree
      .filter((item) => {
        if (item.type !== "blob") {
          return false;
        }
        const path = item.path.toLowerCase();
        return path.endsWith(".md") || path.endsWith(".mdx");
      })
      .map((item) => ({
        path: item.path,
        sha: item.sha,
        size: item.size || 0,
        url: item.url,
      }));

    return markdownFiles;
  }

  /**
   * Get file content from repository
   * @param owner Repository owner
   * @param repo Repository name
   * @param path File path
   * @param ref Branch/tag/commit ref (optional)
   */
  async getFileContent(
    owner: string,
    repo: string,
    path: string,
    ref?: string
  ): Promise<FileContent> {
    const endpoint = ref
      ? `/repos/${owner}/${repo}/contents/${path}?ref=${ref}`
      : `/repos/${owner}/${repo}/contents/${path}`;

    const data = await this.request<GitHubFileContent>(endpoint);

    // Decode base64 content
    if (!data.content || data.encoding !== "base64") {
      throw new GitHubAPIError("File content is not base64 encoded");
    }

    // Decode base64 content
    const decodedContent = atob(data.content.replace(/\n/g, ""));

    return {
      path: data.path,
      content: decodedContent,
      sha: data.sha,
      size: data.size,
    };
  }

  /**
   * Get current rate limit status
   */
  async getRateLimit(): Promise<RateLimitInfo> {
    const data = await this.request<GitHubRateLimitResponse>("/rate_limit");

    return {
      limit: data.rate.limit,
      remaining: data.rate.remaining,
      resetAt: new Date(data.rate.reset * 1000),
      used: data.rate.used,
    };
  }

  /**
   * Clear ETag cache
   */
  clearCache(): void {
    this.etagCache.clear();
  }

  /**
   * Get cache size
   */
  getCacheSize(): number {
    return this.etagCache.size;
  }
}

/**
 * Singleton instance for convenience
 */
let clientInstance: GitHubClient | null = null;

export function getGitHubClient(token?: string): GitHubClient {
  if (!clientInstance) {
    clientInstance = new GitHubClient(token);
  }
  return clientInstance;
}
