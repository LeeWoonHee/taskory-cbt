"use client";

import { useState } from "react";

const FEEDBACK_EMAIL = "dldns012@gmail.com";
const FEEDBACK_MAILTO =
  "mailto:dldns012@gmail.com?subject=taskory%20문의%20및%20의견&body=문의%20내용을%20작성해%20주세요.%0A%0A사용%20환경%3A%20";

export function FeedbackForm() {
  const [copied, setCopied] = useState(false);
  const [openingMail, setOpeningMail] = useState(false);

  async function copyEmail() {
    await navigator.clipboard.writeText(FEEDBACK_EMAIL);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  }

  function openMail() {
    if (openingMail) return;
    setOpeningMail(true);
    window.location.assign(FEEDBACK_MAILTO);
  }

  return (
    <div className="mt-8 flex flex-col gap-5">
      <p className="text-sm leading-6 text-[#626a74]">
        아래에서 메일을 직접 보내거나 이메일 주소를 복사할 수 있습니다.
      </p>
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={openMail}
          disabled={openingMail}
          className="flex h-14 flex-1 items-center justify-center rounded-2xl bg-[#17191c] px-5 text-sm font-bold text-white transition-colors hover:bg-[#2563eb] disabled:cursor-wait disabled:opacity-60 max-sm:py-4"
        >
          {openingMail ? "메일 앱 여는 중..." : "직접 보내기"}
        </button>
        <button
          type="button"
          onClick={copyEmail}
          className="flex h-14 flex-1 items-center justify-center rounded-2xl border border-[#dfe3e8] bg-white px-5 text-sm font-bold text-[#343a42] transition-colors hover:bg-[#f7f8fa] max-sm:py-4"
        >
          {copied ? "복사되었습니다" : "이메일 복사"}
        </button>
      </div>
      <div className="rounded-2xl bg-[#f7f8fa] px-4 py-4 text-center text-sm text-[#626a74]">
        받는 이메일:{" "}
        <span className="font-bold text-[#2563eb]">{FEEDBACK_EMAIL}</span>
      </div>
    </div>
  );
}
