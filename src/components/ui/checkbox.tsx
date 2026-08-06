"use client";

import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "@phosphor-icons/react";
import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/utils";

export function Checkbox({ className, ...props }: ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      className={cn("peer flex size-4 shrink-0 items-center justify-center rounded border border-[#cbd2dc] bg-white text-white outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[#93b4f5] disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-[#2563eb] data-[state=checked]:bg-[#2563eb]", className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator>
        <CheckIcon size={12} weight="bold" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}
