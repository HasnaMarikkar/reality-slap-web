import { Sparkles } from "lucide-react";

export function EmptyState() {
  return (
    <div className="rounded-3xl border border-dashed border-border p-10 text-center space-y-2">
      <Sparkles className="h-8 w-8 mx-auto text-primary" />
      <h3 className="font-display text-lg">No roasts yet</h3>
      <p className="text-sm text-muted-foreground">
        Type a habit or excuse above and hit Slap Me.
      </p>
    </div>
  );
}
