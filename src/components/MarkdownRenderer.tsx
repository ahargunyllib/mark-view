import { Suspense, lazy } from "react";
import { ContentSkeleton } from "./SkeletonLoaders";

// Lazy load the markdown preview component to reduce initial bundle size
const MarkdownPreview = lazy(() => import("@uiw/react-markdown-preview"));

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <Suspense fallback={<ContentSkeleton />}>
      <MarkdownPreview
        source={content}
        style={{ padding: 16 }}
        wrapperElement={{
          // TODO: Support dark mode if needed
          "data-color-mode": "light",
        }}
      />
    </Suspense>
  );
}
