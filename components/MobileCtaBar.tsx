"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "./CartProvider";

/** Routes where a floating bar would get in the way of forms or the order flow. */
const HIDDEN_ON = ["/cart", "/checkout", "/contact", "/order-confirmation"];

/** Small-screen shortcut to shop or message, shown once the visitor scrolls past the hero. */
export function MobileCtaBar() {
  const pathname = usePathname();
  const { drawerOpen } = useCart();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const hiddenRoute = HIDDEN_ON.some((p) => pathname.startsWith(p));
  const show = scrolled && !hiddenRoute && !drawerOpen;

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-30 border-t border-line bg-white/95 px-4 pt-3 backdrop-blur transition-transform duration-300 motion-reduce:transition-none lg:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
      style={{ paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))" }}
    >
      <div className="mx-auto flex max-w-md gap-3">
        <Link
          href="/products"
          tabIndex={show ? 0 : -1}
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full bg-brand text-[15px] font-semibold text-white hover:bg-brand-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          Shop NFC products
        </Link>
        <Link
          href="/contact"
          tabIndex={show ? 0 : -1}
          className="inline-flex min-h-12 flex-1 items-center justify-center rounded-full border border-ink/20 text-[15px] font-semibold text-ink hover:border-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2"
        >
          Message us
        </Link>
      </div>
    </div>
  );
}
