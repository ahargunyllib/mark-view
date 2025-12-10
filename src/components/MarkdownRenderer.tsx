import {
  generateHeadingId,
  transformImageUrl,
} from "@/lib/markdown/url-transform";
import ReactMarkdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";

const TRAILING_NEWLINE_REGEX = /\n$/;
const LANGUAGE_CLASS_REGEX = /language-(\w+)/;

type MarkdownRendererProps = {
  content: string;
  owner: string;
  repo: string;
  path: string;
  ref?: string;
};

export function MarkdownRenderer({
  content,
  owner,
  repo,
  path,
  ref = "main",
}: MarkdownRendererProps) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        components={{
          // Headings with auto-generated IDs
          h1: ({ children, ...props }) => {
            const text = String(children);
            const id = generateHeadingId(text);
            return (
              <h1 id={id} {...props}>
                {children}
              </h1>
            );
          },
          h2: ({ children, ...props }) => {
            const text = String(children);
            const id = generateHeadingId(text);
            return (
              <h2 id={id} {...props}>
                {children}
              </h2>
            );
          },
          h3: ({ children, ...props }) => {
            const text = String(children);
            const id = generateHeadingId(text);
            return (
              <h3 id={id} {...props}>
                {children}
              </h3>
            );
          },
          h4: ({ children, ...props }) => {
            const text = String(children);
            const id = generateHeadingId(text);
            return (
              <h4 id={id} {...props}>
                {children}
              </h4>
            );
          },
          h5: ({ children, ...props }) => {
            const text = String(children);
            const id = generateHeadingId(text);
            return (
              <h5 id={id} {...props}>
                {children}
              </h5>
            );
          },
          h6: ({ children, ...props }) => {
            const text = String(children);
            const id = generateHeadingId(text);
            return (
              <h6 id={id} {...props}>
                {children}
              </h6>
            );
          },

          // Links - open external links in new tab
          a: ({ href, children, ...props }) => {
            const isExternal = href?.startsWith("http");
            return (
              <a
                href={href}
                rel={isExternal ? "noopener noreferrer" : undefined}
                target={isExternal ? "_blank" : undefined}
                {...props}
              >
                {children}
              </a>
            );
          },

          // Images - transform relative URLs
          img: ({ src, alt, ...props }) => {
            const transformedSrc = src
              ? transformImageUrl(src, owner, repo, path, ref)
              : "";
            return (
              // biome-ignore lint/correctness/useImageSize: Dynamic markdown images don't have known dimensions
              <img {...props} alt={alt} loading="lazy" src={transformedSrc} />
            );
          },

          // Code blocks with syntax highlighting
          code: (props) => {
            const { inline, className, children, ...rest } = props as {
              inline?: boolean;
              className?: string;
              children?: React.ReactNode;
            };
            const _code = String(children).replace(TRAILING_NEWLINE_REGEX, "");
            const match = LANGUAGE_CLASS_REGEX.exec(className || "");
            const language = match ? match[1] : "";

            if (inline) {
              return (
                <code className={className} {...rest}>
                  {children}
                </code>
              );
            }

            // Use a simple pre/code for now, will enhance with Shiki client-side
            return (
              <div className="code-block">
                {language && <div className="code-block-lang">{language}</div>}
                <pre>
                  <code className={className} {...rest}>
                    {children}
                  </code>
                </pre>
              </div>
            );
          },
        }}
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
