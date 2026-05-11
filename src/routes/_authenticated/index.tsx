import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Toaster, toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { InputBox } from "@/components/InputBox";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { HistoryList } from "@/components/HistoryList";
import { generateRoast } from "@/lib/roast.functions";

export const Route = createFileRoute("/_authenticated/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Reality Slap — Roasts, reality checks & real advice" },
      {
        name: "description",
        content:
          "Drop a habit, excuse, or life situation and get a witty roast, an honest reality check, and practical advice.",
      },
      { property: "og:title", content: "Reality Slap" },
      {
        property: "og:description",
        content: "Playful AI roasts, reality checks, and real advice — all in one slap.",
      },
    ],
  }),
});

function Index() {
  const qc = useQueryClient();
  const generate = useServerFn(generateRoast);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [lastInput, setLastInput] = useState<string>("");

  const mutation = useMutation({
    mutationFn: (input: string) => generate({ data: { input } }),
    onSuccess: (row: { id: string }) => {
      setHighlightId(row.id);
      qc.invalidateQueries({ queryKey: ["roasts"] });
    },
    onError: (e: Error) => {
      toast.error(e.message || "Something went wrong");
    },
  });

  const handleSubmit = (input: string) => {
    setLastInput(input);
    mutation.mutate(input);
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      <Navbar />
      <main className="px-4 pb-16">
        <div className="mx-auto w-full max-w-2xl space-y-8">
          <header className="text-center space-y-2 pt-4">
            <h1 className="text-4xl sm:text-5xl font-display text-foreground leading-[1.05]">
              Get slapped <span className="text-gradient">with reality</span>.
            </h1>
            <p className="text-muted-foreground text-base max-w-md mx-auto">
              Roast. Reality check. Real advice. All in one slap.
            </p>
          </header>

          <InputBox onSubmit={handleSubmit} isLoading={mutation.isPending} />

          {mutation.isPending && <LoadingState />}

          {mutation.isError && (
            <ErrorState
              message={(mutation.error as Error)?.message || "Something went wrong"}
              onRetry={lastInput ? () => mutation.mutate(lastInput) : undefined}
            />
          )}

          <section aria-labelledby="history-heading" className="space-y-4">
            <h2
              id="history-heading"
              className="text-xs font-bold uppercase tracking-[0.2em] text-accent pl-1"
            >
              Your History
            </h2>
            <HistoryList highlightId={highlightId} />
          </section>

          <footer className="pt-8 text-center text-xs text-muted-foreground font-medium">
            Built with Lovable · AI is opinionated, not infallible.
          </footer>
        </div>
      </main>
    </>
  );
}
