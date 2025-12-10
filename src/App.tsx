import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import "./index.css";

export function App() {
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
          <div className="flex gap-2">
            <Input
              className="flex-1"
              placeholder="owner/repo (e.g., facebook/react)"
            />
            <Button>Load Repository</Button>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="container mx-auto flex flex-1 gap-6 px-4 py-6">
        {/* Sidebar - File List */}
        <aside className="w-64 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Files</CardTitle>
              <CardDescription>Markdown files in repository</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                Load a repository to see files
              </p>
            </CardContent>
          </Card>
        </aside>

        {/* Main Content - Markdown Viewer */}
        <main className="flex-1">
          <Card className="min-h-[600px]">
            <CardContent className="pt-6">
              <p className="text-center text-muted-foreground">
                Select a file to view its contents
              </p>
            </CardContent>
          </Card>
        </main>

        {/* Table of Contents */}
        <aside className="w-64 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Table of Contents</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground text-sm">
                TOC will appear here
              </p>
            </CardContent>
          </Card>
        </aside>
      </div>
    </div>
  );
}

export default App;
