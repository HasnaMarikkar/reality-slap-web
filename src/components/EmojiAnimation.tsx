import { motion } from "framer-motion";

const EMOJIS = ["😭", "🙃", "🤡", "💀", "😔"];

export function EmojiAnimation() {
  return (
    <div className="flex justify-center gap-3 py-2" aria-hidden>
      {EMOJIS.map((e, i) => (
        <motion.span
          key={e}
          initial={{ opacity: 0, y: 10, scale: 0.6 }}
          animate={{
            opacity: 1,
            y: [0, -10, 0],
            scale: 1,
          }}
          transition={{
            opacity: { duration: 0.3, delay: i * 0.08 },
            scale: { duration: 0.3, delay: i * 0.08 },
            y: {
              duration: 1.1,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.12,
            },
          }}
          className="text-3xl sm:text-4xl drop-shadow-sm"
        >
          {e}
        </motion.span>
      ))}
    </div>
  );
}
