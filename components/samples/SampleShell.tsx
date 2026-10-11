"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

/** Short-lived message shown inside the phone, used by every sample action. */
export function useNotice() {
  const [notice, setNotice] = useState("");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const show = useCallback((msg: string) => {
    setNotice(msg);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setNotice(""), 3500);
  }, []);
  useEffect(() => () => { if (timer.current) clearTimeout(timer.current); }, []);
  return { notice, show };
}

export function downloadVcard(name: string, org: string, show: (m: string) => void) {
  const vcf = `BEGIN:VCARD\r\nVERSION:3.0\r\nFN:${name}\r\nORG:${org}\r\nNOTE:Sample contact from a TapSpot demo. Not a real person or business.\r\nEND:VCARD\r\n`;
  const url = URL.createObjectURL(new Blob([vcf], { type: "text/vcard" }));
  const a = document.createElement("a");
  a.href = url; a.download = "tapspot-sample.vcf"; a.click();
  URL.revokeObjectURL(url);
  show("Sample contact downloaded. Your live card saves your real details.");
}

/** Phone-shaped frame. Scrolls inside on large screens, full width on phones. */
export function PhoneFrame({ notice, bg, children }: { notice: string; bg: string; children: ReactNode }) {
  return (
    <div className="relative mx-auto w-full max-w-[400px] overflow-hidden rounded-[2.4rem] border-[7px] border-[#1c1c1f] shadow-lift" style={{ backgroundColor: bg }}>
      <div className="max-h-[780px] overflow-y-auto overscroll-contain">{children}</div>
      <p role="status" aria-live="polite"
        className={`pointer-events-none absolute inset-x-3 bottom-3 rounded-2xl bg-[#0A0A0A]/95 px-4 py-3 text-center text-[13px] font-medium leading-snug text-white shadow-lg transition-all duration-300 ${notice ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"}`}>
        {notice}
      </p>
    </div>
  );
}

export function PoweredBy({ color }: { color: string }) {
  return <p className="py-6 text-center text-[11px] tracking-wide" style={{ color }}>Powered by TapSpot</p>;
}

export function Icon({ d, className = "h-5 w-5" }: { d: string; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={d} />
    </svg>
  );
}
export const ICONS = {
  phone: "M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z",
  mail: "M3 7l9 6 9-6M5 5h14a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z",
  chat: "M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.5-4.6A8 8 0 1 1 21 12Z",
  pin: "M12 21s7-6.2 7-11a7 7 0 1 0-14 0c0 4.8 7 11 7 11Zm0-8.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z",
  globe: "M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18ZM3 12h18M12 3c2.5 2.5 3.5 5.5 3.5 9S14.5 18.5 12 21c-2.5-2.5-3.5-5.5-3.5-9S9.5 5.5 12 3Z",
  star: "m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3Z",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  close: "M6 6l12 12M18 6 6 18",
};
