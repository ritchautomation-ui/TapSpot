import Image from "next/image";
import type { ProductVisualKey } from "@/lib/types";
import { NfcWaves, Wordmark } from "./Brand";

/** CSS-built TapSpot display. Real Google/Facebook badge crops come from the supplied artwork. */
export function Standee({ kind, className = "" }: { kind: "google" | "facebook"; className?: string }) {
  const isG = kind === "google";
  return (
    <div className={`relative aspect-[3/4.4] w-full overflow-hidden rounded-[7%/5%] bg-neutral-100 shadow-lift ring-1 ring-black/10 ${className}`}>
      <div className="flex h-[44%] flex-col items-center justify-start bg-[#1F4FB8] px-[8%] pt-[9%] text-center">
        <p className="text-[clamp(7px,1.9cqw,13px)] font-extrabold uppercase leading-tight text-white">
          {isG ? "We would appreciate your Google review!" : "Like & follow us on Facebook!"}
        </p>
        <Image
          src={isG ? "/images/badge-google.png" : "/images/badge-facebook.png"}
          alt=""
          width={112}
          height={112}
          className="mt-[6%] aspect-square w-[34%] rounded-full object-cover shadow-md"
        />
      </div>
      <div className="flex h-[56%] flex-col items-center justify-center gap-[5%] px-[8%] text-center">
        <div className="grid aspect-[16/10] w-[62%] place-items-center rounded-[50%] border-[3px] border-ink">
          <NfcWaves className="h-[55%] text-ink" />
        </div>
        <p className="text-[clamp(7px,1.7cqw,12px)] font-bold leading-tight text-ink">
          {isG ? "Tap to rate your experience" : "Tap to connect with us"}
        </p>
      </div>
    </div>
  );
}

export function NfcCard({ face, className = "" }: { face: "front" | "back"; className?: string }) {
  if (face === "front") {
    return (
      <div className={`relative aspect-[85.5/54] w-full overflow-hidden rounded-[5%/8%] bg-ink text-white shadow-lift ring-1 ring-white/10 ${className}`}>
        <div className="absolute -bottom-[35%] -right-[12%] aspect-square w-[62%] rounded-full bg-brand" />
        <div className="absolute left-[7%] top-[14%]">
          <Wordmark className="text-[clamp(14px,5.4cqw,34px)]" />
          <p className="mt-[3%] text-[clamp(5px,1.6cqw,11px)] font-medium tracking-[0.3em] text-white/80">NFC BUSINESS CARD</p>
        </div>
        <div className="absolute bottom-[14%] left-[7%] flex items-center gap-[4%]">
          <NfcWaves className="h-[clamp(18px,7cqw,44px)] text-white" />
          <div className="border-l border-white/40 pl-3">
            <p className="text-[clamp(8px,2.8cqw,18px)] font-extrabold leading-none">TAP HERE</p>
            <p className="mt-1 text-[clamp(5px,1.6cqw,11px)] tracking-[0.25em] text-white/80">TO CONNECT</p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`relative aspect-[85.5/54] w-full overflow-hidden rounded-[5%/8%] bg-neutral-200 text-ink shadow-lift ring-1 ring-black/10 ${className}`}>
      <div className="absolute -right-[6%] -top-[28%] aspect-square w-[40%] rounded-full bg-brand" />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <Wordmark className="text-[clamp(14px,6cqw,38px)]" />
        <p className="mt-[2%] text-[clamp(5px,1.6cqw,11px)] tracking-[0.3em] text-ink/70">NFC SOLUTIONS</p>
        <p className="mt-[5%] text-[clamp(6px,1.9cqw,13px)] font-semibold tracking-[0.2em]">
          TAP. <span className="text-brand">CONNECT.</span> GROW.
        </p>
      </div>
    </div>
  );
}

/** Static product visual used in cards. Container-type enables the cqw units above. */
export function ProductVisual({ visual, className = "" }: { visual: ProductVisualKey; className?: string }) {
  return (
    <div className={`grid place-items-center ${className}`} style={{ containerType: "inline-size" }}>
      {visual === "google" && <div className="w-[52%]"><Standee kind="google" /></div>}
      {visual === "facebook" && <div className="w-[52%]"><Standee kind="facebook" /></div>}
      {visual === "bundle" && (
        <div className="relative flex w-[86%] items-end justify-center">
          <div className="w-[44%] -rotate-3"><Standee kind="google" /></div>
          <div className="-ml-[4%] w-[44%] rotate-3"><Standee kind="facebook" /></div>
        </div>
      )}
      {visual === "business-card" && (
        <div className="relative w-[84%]">
          <div className="w-[88%] -rotate-6 opacity-95"><NfcCard face="back" /></div>
          <div className="absolute left-[14%] top-[22%] w-[88%] rotate-3"><NfcCard face="front" /></div>
        </div>
      )}
    </div>
  );
}
