import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useServerFn } from "@tanstack/react-start";
import { Toaster, toast } from "sonner";
import { InputBox } from "@/components/InputBox";
import { LoadingState } from "@/components/LoadingState";
import { ErrorState } from "@/components/ErrorState";
import { HistoryList } from "@/components/HistoryList";
import { generateRoast } from "@/lib/roast.functions";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Reality Slap — AI roasts, reality checks, and real advice" },
      {
        name: "description",
        content:
          "Drop a habit, excuse, or life situation and get a witty roast, a brutally honest reality check, and practical advice powered by AI.",
      },
      { property: "og:title", content: "Reality Slap" },
      {
        property: "og:description",
        content:
          "AI-powered roasts, reality checks, and practical advice for the situations you keep avoiding.",
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
    onSuccess: (row) => {
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
    <main className="min-h-screen px-4 py-10 sm:py-16">
      <Toaster theme="dark" position="top-center" richColors />

      <div className="mx-auto w-full max-w-2xl space-y-8">
        <header className="text-center space-y-3">
          <h1 className="text-5xl sm:text-6xl font-bold text-gradient leading-[1.05]">
            Reality Slap
          </h1>
          <p className="text-muted-foreground text-base sm:text-lg max-w-md mx-auto">
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
            className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground"
          >
            History
          </h2>
          <HistoryList highlightId={highlightId} />
        </section>

        <footer className="pt-8 text-center text-xs text-muted-foreground">
          Built with Lovable · AI is opinionated, not infallible.
        </footer>
      </div>
    </main>
  );
}
