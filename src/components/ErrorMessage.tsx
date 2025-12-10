import { cn } from "@/lib/utils";
import { AlertTriangle, Info, X, XCircle } from "lucide-react";

type ErrorMessageProps = {
  type?: "error" | "warning" | "info";
  message: string;
  suggestion?: string;
  onDismiss?: () => void;
};

const ErrorConfig = {
  error: {
    icon: XCircle,
    className: "bg-destructive/10 border-destructive/20 text-destructive",
    iconClassName: "text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    className: "bg-yellow-500/10 border-yellow-500/20 text-yellow-700",
    iconClassName: "text-yellow-700",
  },
  info: {
    icon: Info,
    className: "bg-blue-500/10 border-blue-500/20 text-blue-700",
    iconClassName: "text-blue-700",
  },
};

export function ErrorMessage({
  type = "error",
  message,
  suggestion,
  onDismiss,
}: ErrorMessageProps) {
  const config = ErrorConfig[type];
  const Icon = config.icon;

  return (
    <div className={cn("rounded-lg border p-4", config.className)} role="alert">
      <div className="flex gap-3">
        <Icon className={cn("h-5 w-5 shrink-0", config.iconClassName)} />
        <div className="flex-1 space-y-1">
          <p className="font-medium text-sm">{message}</p>
          {suggestion ? (
            <p className="text-muted-foreground text-xs">{suggestion}</p>
          ) : null}
        </div>
        {onDismiss ? (
          <button
            aria-label="Dismiss"
            className="shrink-0 transition-opacity hover:opacity-70"
            onClick={onDismiss}
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  );
}
