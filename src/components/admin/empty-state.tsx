import type { ReactNode } from "react";
import { SearchX } from "lucide-react";
import { Card } from "@/components/ui/card";

export function EmptyState({ title, description, action }: { title: string; description: string; action?: ReactNode }) {
  return (
    <Card className="flex flex-col items-center px-5 py-14 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-500" aria-hidden="true"><SearchX size={24} /></span>
      <h2 className="mt-4 text-base font-semibold text-zinc-950">{title}</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-zinc-600">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </Card>
  );
}

