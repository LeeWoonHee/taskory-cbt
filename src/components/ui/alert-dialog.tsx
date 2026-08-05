"use client";

import { useEffect, useId, useRef, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "@/components/ui/button";

interface AlertDialogProps {
  open: boolean;
  title: string;
  description: string;
  children?: ReactNode;
  cancelLabel: string;
  actionLabel: string;
  actionVariant?: "primary" | "destructive";
  busy?: boolean;
  onClose: () => void;
  onAction: () => void;
}

export function AlertDialog({
  open, title, description, children, cancelLabel, actionLabel,
  actionVariant = "destructive", busy = false, onClose, onAction,
}: AlertDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const cancelRef = useRef<HTMLButtonElement>(null);
  const titleId = useId();
  const descriptionId = useId();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      dialog.showModal();
      requestAnimationFrame(() => cancelRef.current?.focus());
    }
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      className="m-auto max-h-[calc(100vh-2rem)] w-[calc(100%-2rem)] max-w-md overflow-visible rounded-xl bg-transparent p-0 backdrop:bg-zinc-950/50"
      onCancel={(event) => {
        if (busy) event.preventDefault();
        else onClose();
      }}
      onClick={(event) => {
        if (event.target === dialogRef.current && !busy) onClose();
      }}
    >
      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: reducedMotion ? 1 : 0.98 }}
            transition={{ duration: reducedMotion ? 0.08 : 0.16, ease: "easeOut" }}
            className="rounded-xl border border-zinc-200 bg-white p-5 shadow-xl sm:p-6"
          >
            <h2 id={titleId} className="text-lg font-bold text-zinc-950">{title}</h2>
            <p id={descriptionId} className="mt-2 text-sm leading-6 text-zinc-600">{description}</p>
            {children ? <div className="mt-4">{children}</div> : null}
            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button ref={cancelRef} variant="outline" onClick={onClose} disabled={busy}>
                {cancelLabel}
              </Button>
              <Button variant={actionVariant} onClick={onAction} disabled={busy}>
                {busy ? "처리하는 중…" : actionLabel}
              </Button>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </dialog>
  );
}

