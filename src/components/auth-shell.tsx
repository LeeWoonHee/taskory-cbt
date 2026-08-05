import { ShieldCheckIcon } from "@phosphor-icons/react/dist/ssr";
import type { ReactNode } from "react";

export function AuthShell({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <main className="flex flex-1 items-center justify-center bg-white px-5 py-12 sm:py-20">
      <section className="w-full max-w-lg rounded-[28px] border border-[#dfe3e8] bg-white p-7 shadow-[0_24px_80px_rgba(23,25,28,0.07)] sm:p-10">
        <span className="flex size-12 items-center justify-center rounded-2xl bg-[#eef5ff] text-[#2563eb]"><ShieldCheckIcon size={25} weight="duotone" aria-hidden="true" /></span>
        <h1 className="mt-7 text-3xl font-extrabold tracking-[-0.05em] text-[#17191c]">{title}</h1>
        <p className="mt-3 text-sm leading-6 text-[#7a818b]">{description}</p>
        {children}
      </section>
    </main>
  );
}
