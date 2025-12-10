import type { MarkdownFile } from "@/lib/github";
import { cn } from "@/lib/utils";

type FileListProps = {
  files: MarkdownFile[];
  selectedFile?: string;
  onSelectFile: (path: string) => void;
};

/**
 * Extract filename from path
 */
function getFileName(path: string): string {
  const parts = path.split("/");
  return parts.at(-1) || "";
}

/**
 * Extract directory from path
 */
function getDirectory(path: string): string {
  const parts = path.split("/");
  if (parts.length === 1) {
    return "";
  }
  return parts.slice(0, -1).join("/");
}

/**
 * Group files by directory
 */
function groupFilesByDirectory(
  files: MarkdownFile[]
): Record<string, MarkdownFile[]> {
  const grouped: Record<string, MarkdownFile[]> = {};

  for (const file of files) {
    const dir = getDirectory(file.path) || "Root";
    if (!grouped[dir]) {
      grouped[dir] = [];
    }
    grouped[dir].push(file);
  }

  return grouped;
}

export function FileList({ files, selectedFile, onSelectFile }: FileListProps) {
  const groupedFiles = groupFilesByDirectory(files);
  const directories = Object.keys(groupedFiles).sort();

  return (
    <nav aria-label="Markdown files" className="space-y-4 pr-4">
      {directories.map((dir) => (
        <div className="space-y-1" key={dir}>
          <h3 className="px-2 font-medium text-muted-foreground text-sm">
            {dir}
          </h3>
          <div className="space-y-0.5">
            {groupedFiles[dir]?.map((file) => (
              <button
                aria-current={selectedFile === file.path ? "page" : undefined}
                aria-label={`View ${getFileName(file.path)}`}
                className={cn(
                  "w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors",
                  "hover:bg-accent hover:text-accent-foreground",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  selectedFile === file.path &&
                    "bg-accent font-medium text-accent-foreground"
                )}
                key={file.path}
                onClick={() => onSelectFile(file.path)}
                type="button"
              >
                {getFileName(file.path)}
              </button>
            ))}
          </div>
        </div>
      ))}
    </nav>
  );
}
