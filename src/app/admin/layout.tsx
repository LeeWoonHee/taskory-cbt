import type { ReactNode } from "react";
import { AdminNavigation } from "@/components/admin/admin-navigation";
import { DemoDataProvider } from "@/components/admin/demo-data-provider";
import { DemoNotice } from "@/components/admin/demo-notice";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <DemoDataProvider>
      <a href="#admin-main" className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition-transform focus:translate-y-0">
        본문으로 건너뛰기
      </a>
      <AdminNavigation />
      <div className="min-h-screen lg:pl-64">
        <main id="admin-main" tabIndex={-1} className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          <DemoNotice />
          {children}
        </main>
      </div>
    </DemoDataProvider>
  );
}

