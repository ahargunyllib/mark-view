import { EmptyState } from "@/components/EmptyState";
import { ErrorMessage } from "@/components/ErrorMessage";
import { FileList } from "@/components/FileList";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { RepositoryInput } from "@/components/RepositoryInput";
import {
  ContentSkeleton,
  FileListSkeleton,
} from "@/components/SkeletonLoaders";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { MarkdownFile, RepositoryMetadata } from "@/lib/github";
import { useState } from "react";
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
  error: string | null;
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
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "An error occurred",
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
      setState((prev) => ({
        ...prev,
        error: error instanceof Error ? error.message : "An error occurred",
        isLoadingContent: false,
      }));
    }
  };

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
        <div className="container mx-auto px-4 py-4">
          <RepositoryInput
            isLoading={state.isLoadingRepo}
            onLoadRepository={handleLoadRepository}
          />
          {state.error && (
            <div className="mt-3">
              <ErrorMessage
                message={state.error}
                onDismiss={() => setState((prev) => ({ ...prev, error: null }))}
              />
            </div>
          )}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto flex flex-1 gap-6 px-4 py-6">
        {/* Sidebar - File List */}
        <aside className="w-64 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Files</CardTitle>
              <CardDescription>
                {state.files.length > 0
                  ? `${state.files.length} markdown files`
                  : "Markdown files in repository"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {state.isLoadingFiles ? (
                <FileListSkeleton />
              ) : state.files.length > 0 ? (
                <FileList
                  files={state.files}
                  onSelectFile={handleSelectFile}
                  selectedFile={state.selectedFile || undefined}
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
        <main className="flex-1">
          <Card className="min-h-[600px]">
            <CardContent className="pt-6">
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

        {/* Table of Contents - Placeholder */}
        <aside className="w-64 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Table of Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <EmptyState
                message="TOC will appear here when viewing a file"
                type="no-repo"
              />
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

export default App;
