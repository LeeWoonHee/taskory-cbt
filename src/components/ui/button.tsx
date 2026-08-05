import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "destructive";

const variants: Record<ButtonVariant, string> = {
  primary: "bg-blue-700 text-white hover:bg-blue-800 border-blue-700",
  secondary: "bg-zinc-100 text-zinc-950 hover:bg-zinc-200 border-zinc-200",
  outline: "bg-white text-zinc-800 hover:bg-zinc-50 border-zinc-400",
  ghost: "bg-transparent text-zinc-700 hover:bg-zinc-100 border-transparent",
  destructive: "bg-red-700 text-white hover:bg-red-800 border-red-700",
};

export function buttonClasses(variant: ButtonVariant = "primary", className?: string) {
  return cn(
    "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    className,
  );
}

export const Button = forwardRef<
  HTMLButtonElement,
  ButtonHTMLAttributes<HTMLButtonElement> & { variant?: ButtonVariant }
>(function Button({ className, variant = "primary", type = "button", ...props }, ref) {
  return <button ref={ref} type={type} className={buttonClasses(variant, className)} {...props} />;
});
