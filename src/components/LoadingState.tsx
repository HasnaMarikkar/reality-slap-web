import { Skeleton } from "@/components/ui/skeleton";

export function LoadingState() {
  return (
    <div className="rounded-3xl border border-border bg-card/70 backdrop-blur-md p-6 space-y-5 animate-pulse">
      <p className="text-sm text-muted-foreground">Cooking your roast…</p>
      {["roast", "reality", "advice"].map((k) => (
        <div key={k} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      ))}
    </div>
  );
}
