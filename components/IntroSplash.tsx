import Image from "next/image";
import { Wordmark } from "./Brand";

/**
 * Logo intro shown once per browser session (the inline script in app/layout.tsx
 * marks the session). Pure CSS timing (see globals.css), so it never gets stuck
 * and needs no JavaScript to disappear. Hidden for reduced-motion visitors.
 */
export function IntroSplash() {
  return (
    <div className="intro-splash" aria-hidden="true">
      <div className="intro-stage">
        <span className="intro-ring" />
        <span className="intro-ring intro-ring-2" />
        <span className="intro-ring intro-ring-3" />
        <Image src="/images/icon.png" alt="" width={112} height={112} priority className="intro-icon h-24 w-24 sm:h-28 sm:w-28" />
      </div>
      <Wordmark className="intro-word mt-8 text-4xl text-white sm:text-5xl" />
      <p className="intro-tag mt-3 text-xs font-semibold uppercase tracking-[0.32em] text-white/60">Tap. Connect. Grow.</p>
    </div>
  );
}
