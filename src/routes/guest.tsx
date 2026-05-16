import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Toaster, toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { InputBox } from "@/components/InputBox";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { EmptyState } from "@/components/EmptyState";
import { RoastCard } from "@/components/RoastCard";
import { HeroHeader } from "@/components/HeroHeader";
import { generateRoastGuest } from "@/lib/roast.functions";
import type { Roast } from "@/lib/roasts-api";
import { Info } from "lucide-react";

export const Route = createFileRoute("/guest")({
  component: GuestPage,
  head: () => ({
    meta: [
      { title: "Try Reality Slap — Guest mode" },
      {
        name: "description",
        content: "Try Reality Slap without an account. Roasts are temporary and disappear when you leave.",
      },
    ],
  }),
});

function GuestPage() {
  const generate = useServerFn(generateRoastGuest);
  const [items, setItems] = useState<Roast[]>([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState("");

  const mutation = useMutation({
    mutationFn: (input: string) => generate({ data: { input } }),
    onSuccess: (row) => {
      setItems((prev) => [row as Roast, ...prev]);
      setHighlightId(row.id);
    },
    onError: (e: Error) => toast.error(e.message || "Something went wrong"),
  });

  const handleSubmit = (input: string) => {
    setLastInput(input);
    mutation.mutate(input);
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <Navbar guest />
      <main className="px-4 pb-16">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <HeroHeader eyebrow="Guest mode · session-only" />

          <div className="rounded-2xl bg-card shadow-clay-sm p-3 flex items-center gap-2.5 text-sm text-foreground/80">
            <Info className="h-4 w-4 text-accent shrink-0" />
            <span>
              <Link to="/login" className="font-semibold text-accent underline-offset-2 hover:underline">
                Sign in
              </Link>{" "}
              to save your roast history.
            </span>
          </div>

          <InputBox onSubmit={handleSubmit} isLoading={mutation.isPending} />

          {mutation.isPending && <LoadingState />}

          {mutation.isError && (
            <ErrorState
              message={(mutation.error as Error)?.message || "Something went wrong"}
              onRetry={lastInput ? () => mutation.mutate(lastInput) : undefined}
            />
          )}

          <section aria-labelledby="guest-heading" className="space-y-4">
            <h2
              id="guest-heading"
              className="text-xs font-bold uppercase tracking-[0.2em] text-accent pl-1"
            >
              This Session
            </h2>
            {items.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="space-y-4">
                {items.map((r) => (
                  <RoastCard key={r.id} roast={r} highlight={r.id === highlightId} />
                ))}
              </div>
            )}
          </section>

          <footer className="pt-8 text-center text-xs text-muted-foreground font-medium">
            Built with Lovable · AI is opinionated, not infallible.
          </footer>
        </div>
      </main>
    </>
  );
}
