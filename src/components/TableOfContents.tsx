import { ScrollArea } from "@/components/ui/scroll-area";
import type { TocItem } from "@/lib/markdown/toc";
import { useEffect, useState } from "react";

type TableOfContentsProps = {
  toc: TocItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
};

type TocItemComponentProps = {
  item: TocItem;
  activeId?: string;
  onItemClick?: (id: string) => void;
};

function TocItemComponent({
  item,
  activeId,
  onItemClick,
}: TocItemComponentProps) {
  const isActive = activeId === item.id;
  const hasChildren = item.children.length > 0;

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onItemClick?.(item.id);

    // Smooth scroll to element
    const element = document.getElementById(item.id);
    if (element) {
      const yOffset = -80; // Offset for fixed header
      const y = element.getBoundingClientRect().top + window.scrollY + yOffset;

      window.scrollTo({ top: y, behavior: "smooth" });

      // Update URL hash
      window.history.pushState(null, "", `#${item.id}`);
    }
  };

  return (
    <li>
      <a
        className={`block py-1.5 text-sm transition-colors ${isActive ? "font-medium text-primary" : "text-muted-foreground hover:text-foreground"}
          ${item.level === 1 ? "pl-0" : ""}
          ${item.level === 2 ? "pl-4" : ""}
          ${item.level === 3 ? "pl-8" : ""}
          ${item.level === 4 ? "pl-12" : ""}
        `}
        href={`#${item.id}`}
        onClick={handleClick}
      >
        {item.text}
      </a>
      {hasChildren && (
        <ul className="space-y-0">
          {item.children.map((child) => (
            <TocItemComponent
              activeId={activeId}
              item={child}
              key={child.id}
              onItemClick={onItemClick}
            />
          ))}
        </ul>
      )}
    </li>
  );
}

export function TableOfContents({
  toc,
  activeId,
  onItemClick,
}: TableOfContentsProps) {
  if (toc.length === 0) {
    return (
      <div className="text-muted-foreground text-sm">
        No headings found in this document
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)]">
      <nav aria-label="Table of contents">
        <ul className="space-y-0">
          {toc.map((item) => (
            <TocItemComponent
              activeId={activeId}
              item={item}
              key={item.id}
              onItemClick={onItemClick}
            />
          ))}
        </ul>
      </nav>
    </ScrollArea>
  );
}

type UseScrollSpyOptions = {
  offset?: number;
  rootMargin?: string;
};

/**
 * Hook to track which heading is currently visible using Intersection Observer
 */
export function useScrollSpy(
  headingIds: string[],
  options: UseScrollSpyOptions = {}
): string | undefined {
  const [activeId, setActiveId] = useState<string | undefined>();
  const { rootMargin = "-20% 0px -35% 0px" } = options;

  useEffect(() => {
    if (headingIds.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        // Find all visible headings
        const visibleHeadings = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => ({
            id: entry.target.id,
            top: entry.boundingClientRect.top,
          }))
          .sort((a, b) => a.top - b.top);

        // Set the topmost visible heading as active
        if (visibleHeadings.length > 0) {
          setActiveId(visibleHeadings[0]?.id);
        }
      },
      {
        rootMargin,
        threshold: [0, 0.25, 0.5, 0.75, 1],
      }
    );

    // Observe all heading elements
    const elements = headingIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);

    for (const el of elements) {
      observer.observe(el);
    }

    // Handle initial hash in URL
    const hash = window.location.hash.slice(1);
    if (hash && headingIds.includes(hash)) {
      setActiveId(hash);
    }

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, [headingIds, rootMargin]);

  return activeId;
}
