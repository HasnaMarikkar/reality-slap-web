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
      className="rounded-3xl border border-border bg-card/70 backdrop-blur-md p-5 shadow-[var(--shadow-glow)]"
    >
      <Textarea
        value={value}
        onChange={(e) => setValue(e.target.value.slice(0, MAX))}
        placeholder="Drop a habit, excuse, or life situation… and prepare to be slapped."
        rows={3}
        className="resize-none border-0 bg-transparent text-base focus-visible:ring-0 focus-visible:ring-offset-0 px-0"
        disabled={isLoading}
      />
      <div className="flex items-center justify-between gap-3 pt-3 border-t border-border">
        <span className="text-xs text-muted-foreground tabular-nums">
          {trimmed.length}/{MAX}
        </span>
        <Button
          type="submit"
          disabled={!canSubmit}
          className="bg-gradient-brand text-primary-foreground font-semibold hover:opacity-90 hover:scale-[1.02] transition-all shadow-[var(--shadow-glow)] disabled:opacity-50 disabled:scale-100"
        >
          <Flame className="mr-1.5 h-4 w-4" />
          {isLoading ? "Cooking…" : "Slap Me"}
        </Button>
      </div>
    </form>
  );
}
