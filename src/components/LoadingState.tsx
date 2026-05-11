import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EmojiAnimation } from "./EmojiAnimation";

const MESSAGES = [
  "Preparing emotional damage…",
  "Consulting the sarcastic department…",
  "Analyzing your life choices…",
  "Warming up the truth cannon…",
  "Locating the nearest reality…",
];

export function LoadingState() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 1800);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-3xl bg-card p-8 shadow-clay text-center space-y-4">
      <EmojiAnimation />
      <AnimatePresence mode="wait">
        <motion.p
          key={idx}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.3 }}
          className="text-sm font-medium text-muted-foreground"
        >
          {MESSAGES[idx]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
