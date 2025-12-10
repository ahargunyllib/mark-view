/**
 * Regex filtering utilities for file lists
 */

import type { MarkdownFile } from "@/lib/github";

export type FilterOptions = {
  caseSensitive?: boolean;
};

export type FilterResult = {
  files: MarkdownFile[];
  error?: string;
};

/**
 * Validate a regex pattern
 */
export function validateRegex(pattern: string): {
  valid: boolean;
  error?: string;
} {
  if (!pattern || pattern.trim() === "") {
    return { valid: true };
  }

  try {
    new RegExp(pattern);
    return { valid: true };
  } catch (error) {
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Invalid regex pattern",
    };
  }
}

/**
 * Apply include filter (files matching the pattern)
 */
export function applyIncludeFilter(
  files: MarkdownFile[],
  pattern: string,
  options: FilterOptions = {}
): FilterResult {
  if (!pattern || pattern.trim() === "") {
    return { files };
  }

  try {
    const flags = options.caseSensitive ? "" : "i";
    const regex = new RegExp(pattern, flags);

    const filtered = files.filter((file) => regex.test(file.path));

    return { files: filtered };
  } catch (error) {
    return {
      files,
      error: error instanceof Error ? error.message : "Invalid regex pattern",
    };
  }
}

/**
 * Apply exclude filter (files NOT matching the pattern)
 */
export function applyExcludeFilter(
  files: MarkdownFile[],
  pattern: string,
  options: FilterOptions = {}
): FilterResult {
  if (!pattern || pattern.trim() === "") {
    return { files };
  }

  try {
    const flags = options.caseSensitive ? "" : "i";
    const regex = new RegExp(pattern, flags);

    const filtered = files.filter((file) => !regex.test(file.path));

    return { files: filtered };
  } catch (error) {
    return {
      files,
      error: error instanceof Error ? error.message : "Invalid regex pattern",
    };
  }
}

/**
 * Apply both include and exclude filters (AND operation)
 */
export function applyFilters(
  files: MarkdownFile[],
  includePattern: string,
  excludePattern: string,
  options: FilterOptions = {}
): FilterResult {
  // First apply include filter
  const includeResult = applyIncludeFilter(files, includePattern, options);
  if (includeResult.error) {
    return includeResult;
  }

  // Then apply exclude filter to the included files
  const excludeResult = applyExcludeFilter(
    includeResult.files,
    excludePattern,
    options
  );
  return excludeResult;
}

/**
 * Common filter presets
 */
export const FILTER_PRESETS = {
  documentation: {
    name: "Documentation Only",
    include: "^docs/",
    exclude: "",
  },
  noTests: {
    name: "Exclude Tests",
    include: "",
    exclude: "test|spec|\\.test\\.|_test\\.",
  },
  readmes: {
    name: "READMEs Only",
    include: "README",
    exclude: "",
  },
  rootOnly: {
    name: "Root Files Only",
    include: "^[^/]+\\.md$",
    exclude: "",
  },
} as const;
