import { Button } from "@/components/ui/button";

interface ErrorStateProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ message, onRetry }: ErrorStateProps) {
  return (
    <div className="rounded-3xl bg-destructive/10 p-5 flex items-start gap-3 shadow-clay-sm">
      <div className="text-2xl">💥</div>
      <div className="flex-1 space-y-3">
        <p className="text-sm text-foreground">{message}</p>
        {onRetry && (
          <Button
            size="sm"
            onClick={onRetry}
            className="rounded-xl bg-card text-foreground shadow-clay-sm hover:scale-105 transition-transform"
          >
            Try again
          </Button>
        )}
      </div>
    </div>
  );
}
