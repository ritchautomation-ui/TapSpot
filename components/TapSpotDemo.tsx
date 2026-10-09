"use client";

import Image from "next/image";
import { ButtonLink, Container } from "./ui";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

type DemoState = "IDLE" | "TAPPING" | "NOTIFYING" | "REVIEWING";

const ORDER: DemoState[] = ["IDLE", "TAPPING", "NOTIFYING", "REVIEWING"];
const TAP_MS = 2200; // phone glides in, then the NFC pulse plays
const NOTIFY_MS = 6000; // auto-opens the review page if the notification isn't clicked

const STEPS: { id: DemoState; title: string; desc: string }[] = [
  { id: "TAPPING", title: "Tap", desc: "Phone approaches the plaque" },
  { id: "NOTIFYING", title: "Connect", desc: "NFC link detected" },
  { id: "REVIEWING", title: "Review", desc: "Review page opens" },
];

const CAPTIONS: Record<DemoState, string> = {
  IDLE: "Press “Try the Demo” to see a customer tap the plaque.",
  TAPPING: "The phone is tapping the plaque…",
  NOTIFYING: "NFC link detected. Tap the notification on the phone.",
  REVIEWING: "The review page opens. Demo only; no real review is submitted.",
};

/* ---------- tiny inline icons (no extra dependencies) ---------- */
type IconProps = { className?: string };

const Svg = ({ className, children }: IconProps & { children: ReactNode }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
    className={className}
  >
    {children}
  </svg>
);

const NfcIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <rect x="6" y="2" width="12" height="20" rx="2.5" />
    <path d="M9.5 10.5a3.5 3.5 0 0 1 5 0M8 8.5a6 6 0 0 1 8 0" />
    <circle cx="12" cy="13.5" r=".6" fill="currentColor" />
  </Svg>
);
const RefreshIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M21 12a9 9 0 1 1-2.64-6.36M21 4v5h-5" />
  </Svg>
);
const CheckIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M20 6 9 17l-5-5" />
  </Svg>
);
const BackIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="M19 12H5M12 19l-7-7 7-7" />
  </Svg>
);
const StarIcon = ({ className }: IconProps) => (
  <Svg className={className}>
    <path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z" />
  </Svg>
);
const StatusIcons = () => (
  <div className="flex items-center gap-1 text-white" aria-hidden="true">
    <svg viewBox="0 0 18 12" className="h-2.5 w-3.5" fill="currentColor">
      <rect x="0" y="8" width="3" height="4" rx=".6" />
      <rect x="5" y="5.5" width="3" height="6.5" rx=".6" />
      <rect x="10" y="3" width="3" height="9" rx=".6" />
      <rect x="15" y="0" width="3" height="12" rx=".6" />
    </svg>
    <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round">
      <path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0" />
    </svg>
    <svg viewBox="0 0 28 14" className="h-3 w-5" fill="none" stroke="currentColor" strokeWidth="1.4">
      <rect x=".7" y=".7" width="23" height="12.6" rx="3.5" />
      <rect x="3" y="3" width="18" height="8" rx="1.8" fill="currentColor" stroke="none" />
      <path d="M26 5v4" strokeLinecap="round" />
    </svg>
  </div>
);

/* ---------- component ---------- */
type TapSpotDemoProps = {
  /** Optional destination for the section's secondary CTA (e.g. your NFC products page). */
  ctaHref?: string;
  ctaLabel?: string;
};

export default function TapSpotDemo({ ctaHref, ctaLabel = "Get your TapSpot plaque" }: TapSpotDemoProps) {
  const [state, setState] = useState<DemoState>("IDLE");
  const [dateLabel, setDateLabel] = useState("");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const clearTimers = useCallback(() => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  }, []);

  useEffect(() => {
    // Set client-side to avoid a server/client hydration mismatch.
    setDateLabel(
      new Intl.DateTimeFormat("en-US", { weekday: "long", month: "long", day: "numeric" }).format(new Date())
    );
    return clearTimers;
  }, [clearTimers]);

  const openReview = useCallback(() => {
    clearTimers();
    setState("REVIEWING");
  }, [clearTimers]);

  const start = () => {
    if (state !== "IDLE") return;
    clearTimers();
    setState("TAPPING");
    timers.current.push(
      setTimeout(() => {
        setState("NOTIFYING");
        timers.current.push(setTimeout(() => setState("REVIEWING"), NOTIFY_MS));
      }, TAP_MS)
    );
  };

  const reset = () => {
    clearTimers();
    setState("IDLE");
  };

  const stepStatus = (id: DemoState) => {
    const cur = ORDER.indexOf(state);
    const idx = ORDER.indexOf(id);
    return cur === idx ? "active" : cur > idx ? "completed" : "pending";
  };

  const notifying = state === "NOTIFYING";
  const reviewing = state === "REVIEWING";

  const phoneTransform =
    state === "IDLE"
      ? "translate-x-0 rotate-3 scale-95"
      : state === "TAPPING"
        ? "-translate-x-1/2 -rotate-3 scale-100"
        : state === "NOTIFYING"
          ? "translate-x-0 rotate-0 scale-100"
          : "translate-x-0 rotate-0 scale-100";

  return (
    <section id="demo" aria-labelledby="tapspot-demo-title" className="overflow-x-clip bg-white py-20 text-ink sm:py-24">
      <Container className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Copy + controls */}
        <div className="mx-auto w-full max-w-xl lg:mx-0">
          <div className="space-y-4 text-center lg:text-left">
            <h2 id="tapspot-demo-title" className="text-4xl font-bold tracking-tight sm:text-5xl">
              See the Tap in <span className="text-brand">Action</span>
            </h2>
            <p className="text-base leading-relaxed text-mute sm:text-lg">
              Make it easier for customers to find your business on Google and leave a review. One simple tap takes
              them directly to your review destination.
            </p>
          </div>

          <ol className="mt-8 hidden flex-col gap-5 sm:flex" aria-label="Demo steps">
            {STEPS.map((step, i) => {
              const s = stepStatus(step.id);
              return (
                <li
                  key={step.id}
                  className={`flex items-start gap-4 transition-opacity duration-300 ${s === "pending" ? "opacity-40" : "opacity-100"}`}
                  aria-current={s === "active" ? "step" : undefined}
                >
                  <span
                    className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors duration-300 ${
                      s === "active"
                        ? "bg-brand text-white shadow-lg shadow-brand/30"
                        : s === "completed"
                          ? "bg-ink text-white"
                          : "bg-line text-mute"
                    }`}
                  >
                    {s === "completed" ? <CheckIcon className="h-4 w-4" /> : i + 1}
                  </span>
                  <span>
                    <span className={`block text-lg font-bold ${s === "active" ? "text-brand" : "text-ink"}`}>
                      {step.title}
                    </span>
                    <span className="block text-sm font-medium text-mute">{step.desc}</span>
                  </span>
                </li>
              );
            })}
          </ol>

          <div className="mt-8 flex flex-col items-stretch gap-3 sm:flex-row sm:items-center lg:justify-start">
            <button
              type="button"
              onClick={start}
              disabled={state !== "IDLE"}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-brand px-8 text-[15px] font-semibold text-white transition active:scale-95 hover:bg-brand-dark disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
            >
              <NfcIcon className="h-5 w-5" /> Try the Demo
            </button>
            <button
              type="button"
              onClick={reset}
              disabled={state === "IDLE"}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-ink/20 bg-white px-8 text-[15px] font-semibold text-ink transition active:scale-95 hover:border-ink disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ink focus-visible:ring-offset-2"
            >
              <RefreshIcon className="h-5 w-5" /> Reset Demo
            </button>
          </div>

          {ctaHref && (
            <div className="mt-4">
              <ButtonLink href={ctaHref} variant="ghost" className="-ml-6">{ctaLabel} <span aria-hidden>→</span></ButtonLink>
            </div>
          )}
        </div>

        {/* Demo stage */}
        <div className="mx-auto w-full max-w-[500px]">
          <div className="overflow-hidden rounded-3xl bg-paper p-3 shadow-card ring-1 ring-line sm:p-5">
            <div className="relative aspect-square w-full">
              {/* Physical plaque */}
              <div className="absolute left-0 top-1/2 z-10 aspect-square w-[56%] -translate-y-1/2 overflow-hidden rounded-2xl border border-line bg-white shadow-lift">
                <Image
                  src="/images/tapspot-google-review-plaque.png"
                  alt="TapSpot Google Review NFC plaque"
                  fill
                  sizes="(min-width: 1024px) 280px, 60vw"
                  draggable={false}
                  className="origin-center scale-[1.4] select-none object-contain"
                />
                {/* NFC pulse, centred on the plaque's tap symbol */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute left-[43%] top-[67%] h-[26%] w-[26%] -translate-x-1/2 -translate-y-1/2"
                >
                  <span
                    className={`absolute inset-0 rounded-full border-2 border-brand motion-reduce:animate-none ${
                      state === "TAPPING" ? "animate-ping [animation-delay:800ms]" : "opacity-0"
                    }`}
                  />
                  <span
                    className={`absolute inset-[18%] rounded-full bg-brand/25 motion-reduce:animate-none ${
                      state === "TAPPING" ? "animate-ping [animation-delay:1000ms]" : "opacity-0"
                    }`}
                  />
                </div>
              </div>

              {/* Phone */}
              <div
                className={`absolute right-0 top-1/2 z-20 aspect-[9/19] w-[44%] -translate-y-1/2 overflow-hidden rounded-[1.6rem] border-[5px] border-ink bg-black shadow-lift transition-transform duration-[900ms] ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none sm:rounded-[2.1rem] sm:border-[7px] ${phoneTransform}`}
              >
                <div className="relative h-full w-full overflow-hidden bg-black">
                  {/* Lock-screen wallpaper */}
                  <div className="absolute inset-x-[6%] bottom-[10%] top-[34%]">
                    <Image
                      src="/images/icon.png"
                      alt="TapSpot logo on the phone lock screen"
                      fill
                      sizes="160px"
                      draggable={false}
                      className="select-none object-contain"
                    />
                  </div>

                  {/* Island + status bar */}
                  <div className="absolute left-1/2 top-1.5 z-50 h-[3.2%] w-[32%] -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />
                  <div className="absolute inset-x-0 top-0 z-10 flex h-8 items-center justify-between px-3 pt-1 text-[8px] font-medium text-white sm:px-4 sm:text-[10px]">
                    <span>9:41</span>
                    <StatusIcons />
                  </div>

                  {/* Lock-screen clock */}
                  <div
                    className={`absolute inset-x-0 top-[12%] z-10 flex flex-col items-center text-white transition-opacity duration-300 ${
                      reviewing ? "pointer-events-none opacity-0" : "opacity-100"
                    }`}
                  >
                    <div className="text-3xl font-light tracking-tight drop-shadow sm:text-5xl">9:41</div>
                    <div className="mt-0.5 min-h-3 text-[8px] font-medium text-white/90 sm:text-xs">{dateLabel}</div>
                  </div>

                  {/* NFC notification */}
                  <button
                    type="button"
                    onClick={() => notifying && openReview()}
                    tabIndex={notifying ? 0 : -1}
                    aria-hidden={!notifying}
                    aria-label="NFC link detected. Open Google Review"
                    className={`absolute inset-x-1 top-[27%] z-30 flex items-center gap-1 rounded-xl bg-white/95 p-1.5 text-left shadow-2xl backdrop-blur transition-all duration-500 motion-reduce:transition-none sm:inset-x-2.5 sm:gap-2.5 sm:rounded-2xl sm:p-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${
                      notifying ? "translate-y-0 scale-100 opacity-100 active:scale-95" : "pointer-events-none -translate-y-6 scale-95 opacity-0"
                    }`}
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand sm:h-9 sm:w-9">
                      <NfcIcon className="h-3 w-3 sm:h-5 sm:w-5" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[8px] font-bold leading-tight text-ink sm:text-xs">NFC Link Detected</span>
                      <span className="block truncate text-[7px] leading-tight text-mute sm:text-[11px]">Open Google Review</span>
                    </span>
                  </button>

                  {/* Simulated Google review page */}
                  <div
                    aria-hidden={!reviewing}
                    className={`absolute inset-0 z-40 flex flex-col bg-white transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)] motion-reduce:transition-none ${
                      reviewing ? "translate-y-0" : "translate-y-full"
                    }`}
                  >
                    <div className="flex items-center gap-2 border-b border-line px-2.5 pb-2 pt-7 sm:px-3 sm:pb-3 sm:pt-9">
                      <BackIcon className="h-3.5 w-3.5 shrink-0 text-mute sm:h-4 sm:w-4" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-[10px] font-bold text-ink sm:text-xs">Sample Business Cafe</p>
                        <p className="text-[8px] text-mute sm:text-[10px]">Google Review preview</p>
                      </div>
                    </div>
                    <div className="flex flex-1 flex-col items-center gap-1 px-3 pt-3 sm:gap-1.5 sm:px-4 sm:pt-5">
                      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-600 sm:h-10 sm:w-10 sm:text-base">
                        A
                      </div>
                      <p className="text-[11px] font-bold text-ink sm:text-sm">Rate and review</p>
                      <p className="text-center text-[8px] text-mute sm:text-[10px]">Share your experience to help others</p>
                      <div className="my-1 flex gap-0.5 text-amber-400 sm:my-2 sm:gap-1">
                        {[1, 2, 3, 4, 5].map((n) => (
                          <StarIcon key={n} className="h-3.5 w-3.5 sm:h-5 sm:w-5" />
                        ))}
                      </div>
                      <div className="h-10 w-full rounded-lg border border-line bg-paper p-1.5 text-[8px] text-mute sm:h-16 sm:p-2 sm:text-[10px]">
                        Share details of your own experience…
                      </div>
                      <div className="mt-auto mb-3 w-full rounded-full bg-blue-600 py-1.5 text-center text-[9px] font-bold text-white sm:mb-5 sm:py-2 sm:text-xs">
                        Post (Demo)
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-1.5 left-1/2 z-50 h-[3px] w-1/3 -translate-x-1/2 rounded-full bg-white/60" />
                </div>
              </div>
            </div>
          </div>

          {/* Step caption, readable at full size on every screen */}
          <p aria-live="polite" className="mt-4 text-center text-sm font-medium text-mute">
            {CAPTIONS[state]}
          </p>
        </div>
      </Container>
    </section>
  );
}
