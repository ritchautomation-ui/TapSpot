import Image from "next/image";
import Link from "next/link";
import { storeConfig } from "@/config/store";

/** Horizontal logo (supplied TapSpot asset). */
export function Logo({ className = "h-9", priority = false }: { className?: string; priority?: boolean }) {
  return (
    <Link href="/" aria-label={`${storeConfig.brandName} home`} className="inline-flex items-center rounded-lg">
      <Image src="/images/logo.png" alt={storeConfig.brandName} width={1200} height={375} priority={priority} className={`${className} w-auto`} />
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
