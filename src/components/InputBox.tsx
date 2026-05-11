import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Flame } from "lucide-react";

interface InputBoxProps {
  onSubmit: (input: string) => void;
  isLoading: boolean;
}

const MAX = 500;

export function InputBox({ onSubmit, isLoading }: InputBoxProps) {
  const [value, setValue] = useState("");
  const trimmed = value.trim();
  const canSubmit = trimmed.length > 0 && trimmed.length <= MAX && !isLoading;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(trimmed);
    setValue("");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl bg-card p-5 shadow-clay space-y-3"
    >
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, MAX))}
        placeholder="Drop a habit, excuse, or life situation…"
        rows={3}
        className="resize-none border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 px-1 placeholder:text-muted-foreground/70"
        disabled={isLoading}
      />
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-semibold text-muted-foreground tabular-nums pl-1">
          {trimmed.length}/{MAX}
        </span>
        <Button
          type="submit"
          disabled={!canSubmit}
          className="h-12 px-6 rounded-2xl bg-gradient-brand text-accent-foreground font-bold text-base shadow-clay hover:scale-[1.03] active:scale-[0.98] transition-transform disabled:opacity-60 disabled:scale-100 disabled:hover:scale-100"
        >
          <Flame className="mr-1.5 h-4 w-4" />
          {isLoading ? "Slapping…" : "Slap Me With Reality"}
        </Button>
      </div>
    </form>
  );
}
