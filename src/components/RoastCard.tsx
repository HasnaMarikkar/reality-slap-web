import { motion } from "framer-motion";
import { Flame, ScanEye, Wrench, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Roast } from "@/lib/roasts-api";

interface RoastCardProps {
  roast: Roast;
  onEdit?: (r: Roast) => void;
  onDelete?: (r: Roast) => void;
  highlight?: boolean;
}

const sections = [
  { key: "roast" as const, label: "Roast", icon: Flame, color: "text-accent" },
  { key: "reality_check" as const, label: "Reality Check", icon: ScanEye, color: "text-primary" },
  { key: "advice" as const, label: "Advice", icon: Wrench, color: "text-foreground" },
];

export function RoastCard({ roast, onEdit, onDelete, highlight }: RoastCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className={`rounded-3xl border bg-card/70 backdrop-blur-md p-6 space-y-5 ${
        highlight
          ? "border-primary/40 shadow-[var(--shadow-glow)]"
          : "border-border"
      }`}
    >
      <header className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground italic flex-1">
          "{roast.user_input}"
        </p>
        {(onEdit || onDelete) && (
          <div className="flex gap-1 shrink-0">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => onEdit(roast)}
                aria-label="Edit"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-destructive hover:text-destructive"
                onClick={() => onDelete(roast)}
                aria-label="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </header>

      <div className="space-y-4">
        {sections.map(({ key, label, icon: Icon, color }) => (
          <div key={key} className="space-y-1.5">
            <div className={`flex items-center gap-2 text-xs font-semibold uppercase tracking-wider ${color}`}>
              <Icon className="h-3.5 w-3.5" />
              {label}
            </div>
            <p className="text-sm leading-relaxed text-foreground/90">
              {roast[key]}
            </p>
          </div>
        ))}
      </div>

      <footer className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {new Date(roast.created_at).toLocaleString()}
      </footer>
    </motion.article>
  );
}
