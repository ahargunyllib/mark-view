import MarkdownPreview from "@uiw/react-markdown-preview";

type MarkdownRendererProps = {
  content: string;
};

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <MarkdownPreview
      source={content}
      style={{ padding: 16 }}
      wrapperElement={{
        // TODO: Support dark mode if needed
        "data-color-mode": "light",
      }}
    />
  );
}
