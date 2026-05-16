import { motion } from "framer-motion";

interface HeroHeaderProps {
  eyebrow?: string;
}

const BLOBS = [
  { emoji: "🔥", className: "top-2 -left-2 sm:left-4", rot: "-12deg", delay: 0 },
  { emoji: "💀", className: "top-0 -right-1 sm:right-6", rot: "10deg", delay: 0.6 },
  { emoji: "🪞", className: "-bottom-3 left-10 sm:left-20", rot: "-6deg", delay: 1.2 },
  { emoji: "✨", className: "-bottom-2 right-8 sm:right-24", rot: "14deg", delay: 1.8 },
];

export function HeroHeader({ eyebrow = "AI-powered emotional damage" }: HeroHeaderProps) {
  return (
    <header className="relative pt-6 pb-2">
      {/* Floating clay emoji blobs */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {BLOBS.map((b, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 + i * 0.12, duration: 0.5, ease: "backOut" }}
            className={`absolute ${b.className} flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-2xl bg-card text-2xl sm:text-3xl shadow-clay-float animate-clay-float`}
            style={{ ["--blob-rot" as string]: b.rot, animationDelay: `${b.delay}s` }}
          >
            {b.emoji}
          </motion.span>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mx-auto w-fit rounded-full bg-card px-4 py-1.5 shadow-clay-sm"
      >
        <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
          ⚡ {eyebrow}
        </span>
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut", delay: 0.1 }}
        className="mt-5 text-center font-display text-[2.6rem] sm:text-6xl leading-[1.02] text-foreground"
      >
        Get slapped <br className="sm:hidden" />
        <span className="text-gradient-animated">with reality</span>.
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.25 }}
        className="mt-3 text-center text-base sm:text-lg text-muted-foreground max-w-md mx-auto"
      >
        Roast. Reality check. Real advice. All in one slap.
      </motion.p>
    </header>
  );
}
