import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex shrink-0 items-center justify-center gap-2 border text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2563eb] focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        default: "border-[#E4002B] bg-[#E4002B] text-white hover:bg-[#bd0024]",
        primary: "border-blue-700 bg-blue-700 text-white hover:bg-blue-800",
        secondary: "border-zinc-200 bg-zinc-100 text-zinc-950 hover:bg-zinc-200",
        outline: "border-black bg-white text-black hover:bg-[#F7F7F8]",
        ghost: "border-transparent bg-transparent text-black hover:bg-[#F7F7F8]",
        dark: "border-black bg-black text-white hover:bg-[#292929]",
        destructive: "border-red-700 bg-red-700 text-white hover:bg-red-800",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-3 text-xs",
        lg: "h-14 px-7 text-base",
        icon: "size-11 p-0",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  },
);

export type ButtonVariant = NonNullable<VariantProps<typeof buttonVariants>["variant"]>;

export function buttonClasses(variant: ButtonVariant = "primary", className?: string) {
  return cn(buttonVariants({ variant }), "rounded-lg", className);
}

function Button({ className, variant, size, type = "button", ...props }: React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>) {
  return <button type={type} className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { Button, buttonVariants };
