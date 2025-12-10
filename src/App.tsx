import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { FileFilters } from "@/components/FileFilters";
import { FileList } from "@/components/FileList";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { RepositoryInput } from "@/components/RepositoryInput";
import {
  ContentSkeleton,
  FileListSkeleton,
  TOCSkeleton,
} from "@/components/SkeletonLoaders";
import { TableOfContents, useScrollSpy } from "@/components/TableOfContents";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type ErrorDetails, getErrorDetails } from "@/lib/errors";
import { applyFilters } from "@/lib/filters/regex";
import type { MarkdownFile, RepositoryMetadata } from "@/lib/github";
import { flattenToc, generateToc } from "@/lib/markdown/toc";
import { useCallback, useMemo, useState } from "react";
import "./index.css";
import "./styles/markdown.css";

type AppState = {
  repository: RepositoryMetadata | null;
  files: MarkdownFile[];
  selectedFile: string | null;
  fileContent: string | null;
  isLoadingRepo: boolean;
  isLoadingFiles: boolean;
  isLoadingContent: boolean;
  error: ErrorDetails | null;
  includeFilter: string;
  excludeFilter: string;
};

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Component manages complex state interactions
export function App() {
  const [state, setState] = useState<AppState>({
    repository: null,
    files: [],
    selectedFile: null,
    fileContent: null,
    isLoadingRepo: false,
    isLoadingFiles: false,
    isLoadingContent: false,
    error: null,
    includeFilter: "",
    excludeFilter: "",
  });

  const validateRepository = async (
    owner: string,
    repo: string,
    ref?: string
  ) => {
    const response = await fetch("/api/repository/validate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, repo, ref }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to validate repository");
    }

    const data = await response.json();
    return data.data;
  };

  const fetchRepositoryFiles = async (
    owner: string,
    repo: string,
    ref?: string
  ) => {
    const response = await fetch("/api/repository/files", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ owner, repo, ref }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to fetch files");
    }

    const data = await response.json();
    return data.data;
  };

  const handleLoadRepository = async (
    owner: string,
    repo: string,
    ref?: string
  ) => {
    setState((prev) => ({
      ...prev,
      isLoadingRepo: true,
      isLoadingFiles: true,
      error: null,
      repository: null,
      files: [],
      selectedFile: null,
      fileContent: null,
    }));

    try {
      const repository = await validateRepository(owner, repo, ref);
      setState((prev) => ({
        ...prev,
        repository,
        isLoadingRepo: false,
      }));

      const files = await fetchRepositoryFiles(owner, repo, ref);
      setState((prev) => ({
        ...prev,
        files,
        isLoadingFiles: false,
      }));
    } catch (error) {
      const errorDetails = getErrorDetails(error);
      setState((prev) => ({
        ...prev,
        error: errorDetails,
        isLoadingRepo: false,
        isLoadingFiles: false,
      }));
    }
  };

  const handleSelectFile = async (path: string) => {
    if (!state.repository) {
      return;
    }

    setState((prev) => ({
      ...prev,
      selectedFile: path,
      isLoadingContent: true,
      error: null,
    }));

    try {
      const response = await fetch("/api/repository/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          owner: state.repository.owner,
          repo: state.repository.name,
          path,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch content");
      }

      const contentData = await response.json();
      setState((prev) => ({
        ...prev,
        fileContent: contentData.data.content,
        isLoadingContent: false,
      }));
    } catch (error) {
      const errorDetails = getErrorDetails(error);
      setState((prev) => ({
        ...prev,
        error: errorDetails,
        isLoadingContent: false,
      }));
    }
  };

  // Filter handlers
  const handleIncludeFilterChange = useCallback((pattern: string) => {
    setState((prev) => ({ ...prev, includeFilter: pattern }));
  }, []);

  const handleExcludeFilterChange = useCallback((pattern: string) => {
    setState((prev) => ({ ...prev, excludeFilter: pattern }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      includeFilter: "",
      excludeFilter: "",
    }));
  }, []);

  // Apply filters to file list
  const filteredFiles = useMemo(() => {
    const result = applyFilters(
      state.files,
      state.includeFilter,
      state.excludeFilter,
      { caseSensitive: false }
    );
    return result.files;
  }, [state.files, state.includeFilter, state.excludeFilter]);

  // Generate TOC from file content
  const toc = useMemo(() => {
    if (!state.fileContent) {
      return [];
    }
    return generateToc(state.fileContent);
  }, [state.fileContent]);

  // Get flat list of heading IDs for scroll spy
  const headingIds = useMemo(
    () => flattenToc(toc).map((item) => item.id),
    [toc]
  );

  // Track active heading with scroll spy
  const activeId = useScrollSpy(headingIds);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <h1 className="font-bold text-2xl">MarkView</h1>
          <p className="text-muted-foreground text-sm">
            Generate readable documentation from GitHub repository Markdown
            files
          </p>
        </div>
      </header>

      {/* Repository Input */}
      <div className="border-b bg-muted/50">
        <div className="container mx-auto space-y-2 px-4 py-4">
          <RepositoryInput
            isLoading={state.isLoadingRepo}
            onLoadRepository={handleLoadRepository}
          />
          {state.error && (
            <ErrorMessage
              message={state.error.message}
              onDismiss={() => setState((prev) => ({ ...prev, error: null }))}
              suggestion={state.error.suggestion}
              type={state.error.type}
            />
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto flex flex-1 flex-col gap-6 px-4 py-6 lg:flex-row">
        {/* Sidebar - File List */}
        <aside
          aria-label="File browser"
          className="w-full shrink-0 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-64 lg:overflow-y-auto"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Files</CardTitle>
              <CardDescription>
                {state.files.length > 0
                  ? `${state.files.length} markdown files`
                  : "Markdown files in repository"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {state.files.length > 0 && (
                <FileFilters
                  excludePattern={state.excludeFilter}
                  filteredCount={filteredFiles.length}
                  includePattern={state.includeFilter}
                  onClear={handleClearFilters}
                  onExcludeChange={handleExcludeFilterChange}
                  onIncludeChange={handleIncludeFilterChange}
                  totalCount={state.files.length}
                />
              )}
              {state.isLoadingFiles ? (
                <FileListSkeleton />
              ) : filteredFiles.length > 0 ? (
                <FileList
                  files={filteredFiles}
                  onSelectFile={handleSelectFile}
                  selectedFile={state.selectedFile || undefined}
                />
              ) : state.files.length > 0 ? (
                <EmptyState
                  message="No files match the current filters"
                  type="no-matches"
                />
              ) : state.repository ? (
                <EmptyState type="no-files" />
              ) : (
                <EmptyState type="no-repo" />
              )}
            </CardContent>
          </Card>
        </aside>

        {/* Main Content - Markdown Viewer */}
        <main aria-label="Document viewer" className="min-w-0 flex-1">
          <Card>
            <CardContent className="overflow-x-auto">
              {state.isLoadingContent ? (
                <ContentSkeleton />
              ) : state.fileContent &&
                state.repository &&
                state.selectedFile ? (
                <MarkdownRenderer
                  content={state.fileContent || ""}
                  owner={state.repository?.owner || ""}
                  path={state.selectedFile || ""}
                  ref={state.repository?.defaultBranch || "main"}
                  repo={state.repository?.name || ""}
                />
              ) : (
                <EmptyState
                  message={
                    state.files.length > 0
                      ? "Select a file to view its contents"
                      : "Load a repository to see its markdown files"
                  }
                  type="no-repo"
                />
              )}
            </CardContent>
          </Card>
        </main>

        {/* Table of Contents */}
        <aside className="w-full shrink-0 lg:sticky lg:top-6 lg:h-[calc(100vh-3rem)] lg:w-64 lg:overflow-y-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Table of Contents</CardTitle>
              <CardDescription>
                {toc.length > 0
                  ? `${toc.length} headings`
                  : "Headings in the current document"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state.isLoadingContent ? (
                <TOCSkeleton />
              ) : state.fileContent ? (
                <TableOfContents activeId={activeId} toc={toc} />
              ) : (
                <EmptyState
                  message="TOC will appear here when viewing a file"
                  type="no-repo"
                />
              )}
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

export default App;
