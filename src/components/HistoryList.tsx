import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listRoasts, type Roast } from "@/lib/roasts-api";
import { RoastCard } from "./RoastCard";
import { EditModal } from "./EditModal";
import { DeleteConfirmation } from "./DeleteConfirmation";
import { EmptyState } from "./EmptyState";
import { Skeleton } from "@/components/ui/skeleton";

interface HistoryListProps {
  highlightId?: string | null;
}

export function HistoryList({ highlightId }: HistoryListProps) {
  const { data, isLoading, error } = useQuery({
    queryKey: ["roasts"],
    queryFn: listRoasts,
  });

  const [editing, setEditing] = useState<Roast | null>(null);
  const [deleting, setDeleting] = useState<Roast | null>(null);

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[0, 1].map((i) => (
          <Skeleton key={i} className="h-48 w-full rounded-3xl" />
        ))}
      </div>
    );
  }

  if (error) {
    console.error("[HistoryList] load failed:", error);
    return (
      <p className="text-sm text-destructive">
        Could not load history. Please try again.
      </p>
    );
  }

  if (!data || data.length === 0) return <EmptyState />;

  return (
    <>
      <div className="space-y-4">
        {data.map((r) => (
          <RoastCard
            key={r.id}
            roast={r}
            highlight={r.id === highlightId}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
        ))}
      </div>
      <EditModal roast={editing} onClose={() => setEditing(null)} />
      <DeleteConfirmation roast={deleting} onClose={() => setDeleting(null)} />
    </>
  );
}
