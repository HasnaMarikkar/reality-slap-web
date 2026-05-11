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
  { key: "roast" as const, label: "Roast", icon: Flame, emoji: "🔥" },
  { key: "reality_check" as const, label: "Reality Check", icon: ScanEye, emoji: "🪞" },
  { key: "advice" as const, label: "Advice", icon: Wrench, emoji: "🛠️" },
];

// Stagger: roast slides up, reality fades in, advice appears last
const variants = [
  { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease: "easeOut" as const } },
  { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5, delay: 0.35 } },
  { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.45, delay: 0.7, ease: "easeOut" as const } },
];

export function RoastCard({ roast, onEdit, onDelete, highlight }: RoastCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className={`rounded-3xl bg-card p-6 space-y-5 ${
        highlight ? "shadow-glow" : "shadow-clay"
      }`}
      style={highlight ? { boxShadow: "var(--shadow-glow)" } : undefined}
    >
      <header className="flex items-start justify-between gap-3">
        <p className="text-sm text-muted-foreground italic flex-1 leading-relaxed">
          "{roast.user_input}"
        </p>
        {(onEdit || onDelete) && (
          <div className="flex gap-1 shrink-0">
            {onEdit && (
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-xl hover:bg-secondary"
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
                className="h-9 w-9 rounded-xl text-destructive hover:text-destructive hover:bg-destructive/10"
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
        {sections.map(({ key, label, emoji }, i) => (
          <motion.div
            key={key}
            initial={highlight ? variants[i].initial : { opacity: 1 }}
            animate={variants[i].animate}
            transition={highlight ? variants[i].transition : { duration: 0 }}
            className="rounded-2xl bg-secondary/50 p-4 shadow-clay-inset space-y-2"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
              <span aria-hidden className="text-base">{emoji}</span>
              {label}
            </div>
            <p className="text-[15px] leading-relaxed text-foreground/90">
              {roast[key]}
            </p>
          </motion.div>
        ))}
      </div>

      <footer className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        {new Date(roast.created_at).toLocaleString()}
      </footer>
    </motion.article>
  );
}
