"use client";

import { Info, RotateCcw } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/ui/toast";
import { useDemoData } from "@/components/admin/demo-data-provider";

export function DemoNotice() {
  const { resetDemo } = useDemoData();
  const [message, setMessage] = useState("");
  return (
    <>
      <section aria-label="데모 환경 안내" className="mb-6 flex flex-col gap-3 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-950 sm:flex-row sm:items-center">
        <div className="flex min-w-0 flex-1 items-start gap-3">
          <Info size={18} className="mt-0.5 shrink-0" aria-hidden="true" />
          <p className="leading-6">
            <strong>데모 모드</strong> · 변경은 이 브라우저의 localStorage에만 저장됩니다. 인증·권한과 실제 API는 아직 연결되지 않았습니다.
          </p>
        </div>
        <Button
          variant="outline"
          className="shrink-0 border-blue-300 bg-white text-blue-900 hover:bg-blue-100"
          onClick={() => {
            resetDemo();
            setMessage("데모 데이터를 초기 상태로 복원했습니다.");
          }}
        >
          <RotateCcw size={16} aria-hidden="true" /> 데모 초기화
        </Button>
      </section>
      {message ? <Toast message={message} onClose={() => setMessage("")} /> : null}
    </>
  );
}

