/**
 * Table of Contents generation utilities
 */

export type TocItem = {
  id: string;
  text: string;
  level: number;
  children: TocItem[];
};

const HEADING_REGEX = /^(#{1,6})\s+(.+)$/gm;

/**
 * Generate unique heading ID from text
 * Handles duplicate headings by adding numeric suffixes
 */
function generateUniqueId(text: string, existingIds: Set<string>): string {
  let baseId = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "") // Remove special characters
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-") // Replace multiple hyphens with single
    .trim();

  if (!baseId) {
    baseId = "heading";
  }

  let id = baseId;
  let counter = 1;

  while (existingIds.has(id)) {
    id = `${baseId}-${counter}`;
    counter += 1;
  }

  existingIds.add(id);
  return id;
}

/**
 * Parse markdown content and extract headings
 * Returns flat array of headings with metadata
 */
function extractHeadings(markdown: string): TocItem[] {
  const headings: TocItem[] = [];
  const existingIds = new Set<string>();

  // Reset regex state
  HEADING_REGEX.lastIndex = 0;

  let match = HEADING_REGEX.exec(markdown);
  while (match !== null) {
    const level = match[1]?.length;
    const text = match[2]?.trim();

    if (!(text && level)) {
      match = HEADING_REGEX.exec(markdown);
      continue;
    }

    // Only include h1-h4 for TOC
    if (level <= 4) {
      const id = generateUniqueId(text, existingIds);
      headings.push({
        id,
        text,
        level,
        children: [],
      });
    }

    match = HEADING_REGEX.exec(markdown);
  }

  return headings;
}

/**
 * Build nested TOC structure from flat headings array
 */
function buildTocTree(headings: TocItem[]): TocItem[] {
  if (headings.length === 0) {
    return [];
  }

  const root: TocItem[] = [];
  const stack: TocItem[] = [];

  for (const heading of headings) {
    const lastInStack = stack.at(-1);
    if (!lastInStack) {
      stack.push(heading);
      root.push(heading);
      continue;
    }

    // Pop stack until we find a parent (heading with lower level)
    while (stack.length > 0 && lastInStack.level >= heading.level) {
      stack.pop();
    }

    const newItem: TocItem = {
      ...heading,
      children: [],
    };

    if (stack.length === 0) {
      // Top level item
      root.push(newItem);
    } else {
      // Add as child to parent
      lastInStack.children.push(newItem);
    }

    stack.push(newItem);
  }

  return root;
}

/**
 * Generate complete TOC from markdown content
 */
export function generateToc(markdown: string): TocItem[] {
  const headings = extractHeadings(markdown);
  return buildTocTree(headings);
}

/**
 * Flatten nested TOC tree to array (useful for scroll spy)
 */
export function flattenToc(tocTree: TocItem[]): TocItem[] {
  const result: TocItem[] = [];

  function traverse(items: TocItem[]) {
    for (const item of items) {
      result.push(item);
      if (item.children.length > 0) {
        traverse(item.children);
      }
    }
  }

  traverse(tocTree);
  return result;
}
