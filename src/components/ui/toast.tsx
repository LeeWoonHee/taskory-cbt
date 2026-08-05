"use client";

import { X } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";

export function Toast({ message, onClose }: { message: string; onClose: () => void }) {
  const reducedMotion = useReducedMotion();
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: reducedMotion ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 right-4 z-50 flex max-w-[calc(100%-2rem)] items-start gap-3 rounded-xl bg-zinc-950 px-4 py-3 text-sm leading-5 text-white shadow-lg sm:max-w-md"
    >
      <span className="flex-1">{message}</span>
      <button type="button" onClick={onClose} aria-label="알림 닫기" className="inline-flex min-h-6 min-w-6 items-center justify-center rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white">
        <X size={16} aria-hidden="true" />
      </button>
    </motion.div>
  );
}

