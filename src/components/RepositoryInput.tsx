import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

type RepositoryInputProps = {
  onLoadRepository: (owner: string, repo: string, ref?: string) => void;
  isLoading?: boolean;
};

const URL_PATTERN =
  /^https:\/\/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/([^/]+))?/;
const SIMPLE_PATTERN = /^([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_.-]+)$/;

/**
 * Parse GitHub repository URL or owner/repo format
 * Supports:
 * - owner/repo
 * - https://github.com/owner/repo
 * - https://github.com/owner/repo/tree/branch
 */
function parseRepositoryInput(input: string): {
  owner: string;
  repo: string;
  ref?: string;
} | null {
  const trimmed = input.trim();

  // Handle GitHub URL
  if (trimmed.startsWith("https://github.com/")) {
    const match = trimmed.match(URL_PATTERN);
    if (match?.[1] && match[2]) {
      return {
        owner: match[1],
        repo: match[2],
        ref: match[3],
      };
    }
    return null;
  }

  // Handle owner/repo format
  const match = trimmed.match(SIMPLE_PATTERN);
  if (match?.[1] && match[2]) {
    return {
      owner: match[1],
      repo: match[2],
    };
  }

  return null;
}

export function RepositoryInput({
  onLoadRepository,
  isLoading = false,
}: RepositoryInputProps) {
  const [input, setInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsed = parseRepositoryInput(input);
    if (!parsed) {
      setError("Invalid format. Use 'owner/repo' or paste a GitHub URL.");
      return;
    }

    onLoadRepository(parsed.owner, parsed.repo, parsed.ref);
  };

  return (
    <form className="space-y-3" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <Label htmlFor="repo-input">GitHub Repository</Label>
        <div className="flex gap-2">
          <Input
            className={error ? "border-destructive" : ""}
            disabled={isLoading}
            id="repo-input"
            onChange={(e) => setInput(e.target.value)}
            placeholder="owner/repo (e.g., facebook/react)"
            type="text"
            value={input}
          />
          <Button disabled={isLoading || !input.trim()} type="submit">
            {isLoading ? "Loading..." : "Load"}
          </Button>
        </div>
        {error ? <p className="text-destructive text-sm">{error}</p> : null}
        <p className="text-muted-foreground text-xs">
          Examples: facebook/react, https://github.com/microsoft/typescript
        </p>
      </div>
    </form>
  );
}
