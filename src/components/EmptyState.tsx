import { AlertCircle, FileText, Folder, Search } from "lucide-react";

type EmptyStateProps = {
  type: "no-repo" | "no-files" | "no-matches" | "error";
  message?: string;
};

const EmptyStateConfig = {
  "no-repo": {
    icon: Folder,
    title: "No Repository Loaded",
    description: "Enter a GitHub repository to view its markdown files",
  },
  "no-files": {
    icon: FileText,
    title: "No Markdown Files",
    description: "This repository doesn't contain any .md or .mdx files",
  },
  "no-matches": {
    icon: Search,
    title: "No Matches Found",
    description: "Try adjusting your filter or search criteria",
  },
  error: {
    icon: AlertCircle,
    title: "Something Went Wrong",
    description: "Failed to load content. Please try again.",
  },
};

export function EmptyState({ type, message }: EmptyStateProps) {
  const config = EmptyStateConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center gap-4 px-4 py-12 text-center">
      <Icon className="h-12 w-12 text-muted-foreground" />
      <div className="space-y-2">
        <h3 className="font-semibold text-lg">{config.title}</h3>
        <p className="max-w-sm text-muted-foreground text-sm">
          {message || config.description}
        </p>
      </div>
    </div>
  );
}
