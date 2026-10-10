import Image from "next/image";
import Link from "next/link";
import { storeConfig } from "@/config/store";

/** Horizontal logo (supplied TapSpot asset). Night mode swaps to icon + white wordmark because the logo text is black. */
export function Logo({ className = "h-9", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" aria-label={`${storeConfig.brandName} home`} className="inline-flex items-center rounded-lg">
      <Image src="/images/logo.png" alt={storeConfig.brandName} width={256} height={80} sizes="160px" priority={priority} className={`${className} w-auto dark:hidden`} />
      <span className="hidden items-center gap-2 dark:inline-flex" aria-hidden>
        <Image src="/images/icon.png" alt="" width={64} height={64} sizes="40px" className={`${className} w-auto`} />
        <Wordmark className="text-[1.45rem] text-white" />
      </span>
    </Link>
  );
}

/** Text wordmark with the orange "O", for use on dark surfaces. */
export function Wordmark({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center font-black tracking-tight leading-none ${className}`} aria-label="TapSpot">
      TAPSP
      <span aria-hidden className="mx-[0.02em] inline-block aspect-square h-[0.78em] rounded-full bg-brand" />
      T
    </span>
  );
}

export function NfcWaves({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" className={className} aria-hidden>
      <path d="M14 14c5 6 5 14 0 20" />
      <path d="M23 8c8 9 8 23 0 32" />
      <path d="M32 3c11 12 11 30 0 42" />
    </svg>
  );
}
