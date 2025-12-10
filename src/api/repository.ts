import { getGitHubClient } from "@/lib/github";
import { CacheKeys, appCache } from "@/lib/cache";
import {
  createErrorResponse,
  createSuccessResponse,
  logRequest,
  parseJsonBody,
  validateRequiredFields,
} from "@/lib/api-helpers";
import type { MarkdownFile, RepositoryMetadata } from "@/lib/github";

/**
 * Request types
 */
type ValidateRepoRequest = {
  owner: string;
  repo: string;
  ref?: string;
};

type FilesRequest = {
  owner: string;
  repo: string;
  ref?: string;
};

type ContentRequest = {
  owner: string;
  repo: string;
  path: string;
  ref?: string;
};

/**
 * POST /api/repository/validate
 * Validate repository and return metadata
 */
export async function validateRepository(request: Request): Promise<Response> {
  try {
    logRequest("POST", "/api/repository/validate");

    const body = await parseJsonBody<ValidateRepoRequest>(request);
    validateRequiredFields(body, ["owner", "repo"]);

    const { owner, repo } = body;

    // Check cache first
    const cacheKey = CacheKeys.repository(owner, repo);
    const cached = appCache.get<RepositoryMetadata>(cacheKey);

    if (cached) {
      return createSuccessResponse(cached, true);
    }

    // Fetch from GitHub
    const client = getGitHubClient();
    const metadata = await client.validateRepository(owner, repo);

    // Cache the result
    appCache.set(cacheKey, metadata);

    return createSuccessResponse(metadata, false);
  } catch (error) {
    return createErrorResponse(error, "Failed to validate repository");
  }
}

/**
 * POST /api/repository/files
 * Get list of markdown files in repository
 */
export async function getRepositoryFiles(request: Request): Promise<Response> {
  try {
    logRequest("POST", "/api/repository/files");

    const body = await parseJsonBody<FilesRequest>(request);
    validateRequiredFields(body, ["owner", "repo"]);

    const { owner, repo, ref } = body;

    // Check cache first
    const cacheKey = CacheKeys.fileTree(owner, repo, ref);
    const cached = appCache.get<MarkdownFile[]>(cacheKey);

    if (cached) {
      return createSuccessResponse(cached, true);
    }

    // Fetch from GitHub
    const client = getGitHubClient();
    const files = await client.getFileTree(owner, repo, ref);

    // Cache the result
    appCache.set(cacheKey, files);

    return createSuccessResponse(files, false);
  } catch (error) {
    return createErrorResponse(error, "Failed to fetch repository files");
  }
}

/**
 * POST /api/repository/content
 * Get content of a specific file
 */
export async function getFileContent(request: Request): Promise<Response> {
  try {
    logRequest("POST", "/api/repository/content");

    const body = await parseJsonBody<ContentRequest>(request);
    validateRequiredFields(body, ["owner", "repo", "path"]);

    const { owner, repo, path, ref } = body;

    // Check cache first
    const cacheKey = CacheKeys.fileContent(owner, repo, path, ref);
    const cached = appCache.get<{
      path: string;
      content: string;
      sha: string;
      size: number;
    }>(cacheKey);

    if (cached) {
      return createSuccessResponse(cached, true);
    }

    // Fetch from GitHub
    const client = getGitHubClient();
    const content = await client.getFileContent(owner, repo, path, ref);

    // Cache the result
    appCache.set(cacheKey, content);

    return createSuccessResponse(content, false);
  } catch (error) {
    return createErrorResponse(error, "Failed to fetch file content");
  }
}
