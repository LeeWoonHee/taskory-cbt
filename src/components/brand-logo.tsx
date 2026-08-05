import Image from "next/image";
import Link from "next/link";

export function BrandLogo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label="taskory 홈">
      <Image src="/taskory-mark.svg" alt="" width={40} height={40} className="size-10 rounded-xl" aria-hidden="true" />
      <span className="hidden text-base font-extrabold tracking-[-0.04em] text-[#17191c] sm:block">
        taskory
      </span>
    </Link>
  );
}
