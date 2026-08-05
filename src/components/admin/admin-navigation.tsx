"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Users, ClipboardList, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState } from "react";
import { cn } from "@/lib/cn";

const links = [
  { href: "/admin/members", label: "회원 관리", icon: Users },
  { href: "/admin/exams", label: "시험 관리", icon: ClipboardList },
] as const;

function NavigationLinks({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav aria-label="관리자 주 메뉴" className="flex flex-col gap-1">
      {links.map(({ href, label, icon: Icon }) => {
        const active = pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            aria-current={active ? "page" : undefined}
            onClick={onNavigate}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
              active ? "bg-blue-50 font-semibold text-blue-800" : "text-zinc-700 hover:bg-zinc-100",
            )}
          >
            <Icon size={18} aria-hidden="true" />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}

function Brand() {
  return (
    <Link href="/admin" className="flex min-h-11 items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-700 text-sm font-bold text-white" aria-hidden="true">T</span>
      <span>
        <span className="block text-base font-bold text-zinc-950">Taskory CBT</span>
        <span className="block text-xs text-zinc-500">운영 관리자</span>
      </span>
    </Link>
  );
}

export function AdminNavigation() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-zinc-200 bg-white px-4 py-5 lg:flex">
        <Brand />
        <div className="mt-8 flex-1"><NavigationLinks pathname={pathname} /></div>
        <div className="rounded-lg border border-blue-100 bg-blue-50 p-3">
          <p className="text-xs font-semibold text-blue-900">데모 모드</p>
          <p className="mt-1 text-xs leading-5 text-blue-800">인증 없이 샘플 데이터로 동작합니다.</p>
        </div>
      </aside>

      <header className="sticky top-0 z-20 flex min-h-16 items-center justify-between border-b border-zinc-200 bg-white/95 px-4 backdrop-blur lg:hidden">
        <Brand />
        <button type="button" aria-label="관리자 메뉴 열기" aria-expanded={open} onClick={() => setOpen(true)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg text-zinc-700 hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
          <Menu aria-hidden="true" size={22} />
        </button>
      </header>

      <AnimatePresence>
        {open ? (
          <>
            <motion.button
              type="button"
              aria-label="관리자 메뉴 닫기"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: reducedMotion ? 0.08 : 0.18 }}
              className="fixed inset-0 z-40 bg-zinc-950/50"
              onClick={() => setOpen(false)}
            />
            <motion.aside
              initial={{ x: reducedMotion ? 0 : "-100%" }} animate={{ x: 0 }} exit={{ x: reducedMotion ? 0 : "-100%" }}
              transition={{ duration: reducedMotion ? 0.08 : 0.2, ease: "easeOut" }}
              className="fixed inset-y-0 left-0 z-50 flex w-[min(20rem,calc(100%-3rem))] flex-col bg-white p-4 shadow-2xl"
              aria-label="모바일 관리자 메뉴"
            >
              <div className="flex items-center justify-between">
                <Brand />
                <button type="button" autoFocus aria-label="관리자 메뉴 닫기" onClick={() => setOpen(false)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-lg hover:bg-zinc-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600">
                  <X size={22} aria-hidden="true" />
                </button>
              </div>
              <div className="mt-8"><NavigationLinks pathname={pathname} onNavigate={() => setOpen(false)} /></div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

