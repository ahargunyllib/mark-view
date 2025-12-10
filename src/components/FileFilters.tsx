import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FILTER_PRESETS, validateRegex } from "@/lib/filters/regex";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

type FileFiltersProps = {
  includePattern: string;
  excludePattern: string;
  onIncludeChange: (pattern: string) => void;
  onExcludeChange: (pattern: string) => void;
  onClear: () => void;
  totalCount: number;
  filteredCount: number;
};

export function FileFilters({
  includePattern,
  excludePattern,
  onIncludeChange,
  onExcludeChange,
  onClear,
  totalCount,
  filteredCount,
}: FileFiltersProps) {
  const [includeError, setIncludeError] = useState<string>();
  const [excludeError, setExcludeError] = useState<string>();

  // Validate patterns on change
  useEffect(() => {
    const result = validateRegex(includePattern);
    setIncludeError(result.valid ? undefined : result.error);
  }, [includePattern]);

  useEffect(() => {
    const result = validateRegex(excludePattern);
    setExcludeError(result.valid ? undefined : result.error);
  }, [excludePattern]);

  const handlePresetSelect = (presetKey: string) => {
    if (presetKey === "none") {
      onClear();
      return;
    }

    const preset = FILTER_PRESETS[presetKey as keyof typeof FILTER_PRESETS];
    if (preset) {
      onIncludeChange(preset.include);
      onExcludeChange(preset.exclude);
    }
  };

  const hasFilters = includePattern || excludePattern;
  const showCount = totalCount > 0;

  return (
    <div className="space-y-3 border-b pb-4">
      <div className="flex items-center justify-between">
        <Label className="font-medium text-sm">Filters</Label>
        {hasFilters && (
          <Button
            className="h-7 px-2 text-xs"
            onClick={onClear}
            size="sm"
            variant="ghost"
          >
            <X className="mr-1 h-3 w-3" />
            Clear
          </Button>
        )}
      </div>

      {/* Preset filters */}
      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs" htmlFor="preset">
          Quick Filters
        </Label>
        <Select onValueChange={handlePresetSelect}>
          <SelectTrigger className="h-8 text-xs" id="preset">
            <SelectValue placeholder="Select a preset..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            {Object.entries(FILTER_PRESETS).map(([key, preset]) => (
              <SelectItem key={key} value={key}>
                {preset.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Include filter */}
      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs" htmlFor="include">
          Include (regex)
        </Label>
        <Input
          className={`h-8 text-xs ${includeError ? "border-destructive" : ""}`}
          id="include"
          onChange={(e) => onIncludeChange(e.target.value)}
          placeholder="e.g., ^docs/ or README"
          value={includePattern}
        />
        {includeError && (
          <p className="text-destructive text-xs">{includeError}</p>
        )}
      </div>

      {/* Exclude filter */}
      <div className="space-y-1.5">
        <Label className="text-muted-foreground text-xs" htmlFor="exclude">
          Exclude (regex)
        </Label>
        <Input
          className={`h-8 text-xs ${excludeError ? "border-destructive" : ""}`}
          id="exclude"
          onChange={(e) => onExcludeChange(e.target.value)}
          placeholder="e.g., test|spec"
          value={excludePattern}
        />
        {excludeError && (
          <p className="text-destructive text-xs">{excludeError}</p>
        )}
      </div>

      {/* Match count */}
      {showCount && (
        <div className="pt-1 text-muted-foreground text-xs">
          Showing {filteredCount} of {totalCount} files
          {hasFilters && filteredCount < totalCount && (
            <span className="text-primary"> (filtered)</span>
          )}
        </div>
      )}

      {/* Help text */}
      <div className="text-muted-foreground text-xs">
        <a
          className="underline hover:text-foreground"
          href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_expressions"
          rel="noopener noreferrer"
          target="_blank"
        >
          Regex syntax help
        </a>
      </div>
    </div>
  );
}
