/**
 * URL transformation utilities for markdown content
 */

const ABSOLUTE_URL_REGEX = /^https?:\/\//i;

/**
 * Check if a URL is absolute
 */
export function isAbsoluteUrl(url: string): boolean {
  return ABSOLUTE_URL_REGEX.test(url) || url.startsWith("//");
}

/**
 * Transform relative image URL to absolute GitHub raw URL
 * @param src - Image source URL (relative or absolute)
 * @param owner - Repository owner
 * @param repo - Repository name
 * @param path - Current file path
 * @param ref - Branch/commit reference
 */
// biome-ignore lint/nursery/useMaxParams: GitHub URL transformation requires all 5 parameters
export function transformImageUrl(
  src: string,
  owner: string,
  repo: string,
  path: string,
  ref = "main"
): string {
  // If already absolute, return as is
  if (isAbsoluteUrl(src)) {
    return src;
  }

  // Get the directory of the current file
  const pathParts = path.split("/");
  pathParts.pop(); // Remove filename
  const currentDir = pathParts.join("/");

  // Resolve relative path
  let resolvedPath = src;
  if (src.startsWith("./")) {
    resolvedPath = `${currentDir}/${src.slice(2)}`;
  } else if (src.startsWith("../")) {
    const parts = src.split("/");
    let dir = currentDir;
    for (const part of parts) {
      if (part === "..") {
        const dirParts = dir.split("/");
        dirParts.pop();
        dir = dirParts.join("/");
      } else {
        dir = `${dir}/${part}`;
      }
    }
    resolvedPath = dir;
  } else if (src.startsWith("/")) {
    resolvedPath = src.slice(1); // Remove leading slash
  } else {
    resolvedPath = `${currentDir}/${src}`;
  }

  // Return GitHub raw URL
  return `https://raw.githubusercontent.com/${owner}/${repo}/${ref}/${resolvedPath}`;
}

/**
 * Generate heading ID from text
 */
export function generateHeadingId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();
}
