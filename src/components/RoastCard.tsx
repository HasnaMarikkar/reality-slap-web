import { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
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

const variants = [
  { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.45, ease: "easeOut" as const } },
  { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.5, delay: 0.35 } },
  { initial: { opacity: 0, scale: 0.96 }, animate: { opacity: 1, scale: 1 }, transition: { duration: 0.45, delay: 0.7, ease: "easeOut" as const } },
];

export function RoastCard({ roast, onEdit, onDelete, highlight }: RoastCardProps) {
  const ref = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rx = useSpring(useTransform(my, [-0.5, 0.5], [6, -6]), { stiffness: 180, damping: 18 });
  const ry = useSpring(useTransform(mx, [-0.5, 0.5], [-6, 6]), { stiffness: 180, damping: 18 });

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  return (
    <motion.article
      ref={ref}
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{
        rotateX: rx,
        rotateY: ry,
        transformPerspective: 1200,
      }}
      className={`group relative rounded-[2rem] bg-card p-6 space-y-5 will-change-transform ${
        highlight ? "shadow-clay-float animate-clay-glow" : "shadow-clay-3d"
      }`}
    >
      {/* glossy highlight */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-[2rem] opacity-70"
        style={{
          background:
            "linear-gradient(135deg, oklch(1 0 0 / 0.25) 0%, transparent 40%, transparent 100%)",
        }}
      />

      <header className="relative flex items-start justify-between gap-3">
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

      <div className="relative space-y-4">
        {sections.map(({ key, label, emoji }, i) => (
          <motion.div
            key={key}
            initial={highlight ? variants[i].initial : { opacity: 1 }}
            animate={variants[i].animate}
            transition={highlight ? variants[i].transition : { duration: 0 }}
            className="rounded-2xl bg-secondary/60 p-4 shadow-clay-inset space-y-2 transition-transform duration-300 hover:-translate-y-0.5"
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-accent">
              <span
                aria-hidden
                className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-card text-base shadow-clay-sm"
              >
                {emoji}
              </span>
              {label}
            </div>
            <p className="text-[15px] leading-relaxed text-foreground/90">
              {roast[key]}
            </p>
          </motion.div>
        ))}
      </div>

      <footer className="relative text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
        {new Date(roast.created_at).toLocaleString()}
      </footer>
    </motion.article>
  );
}
