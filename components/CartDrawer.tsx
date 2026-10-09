"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "./CartProvider";
import { CartLineItem } from "./CartLineItem";
import { TotalsTable } from "./TotalsTable";
import { ButtonLink } from "./ui";

export function CartDrawer() {
  const { drawerOpen, closeDrawer, lines, totals, ready } = useCart();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!drawerOpen) return;
    const prev = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
      if (e.key === "Tab" && panelRef.current) {
        const f = panelRef.current.querySelectorAll<HTMLElement>("a[href],button:not([disabled]),input,[tabindex]:not([tabindex='-1'])");
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
      prev?.focus();
    };
  }, [drawerOpen, closeDrawer]);

  if (!drawerOpen) return null;
  return (
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="Your cart">
      <div className="absolute inset-0 bg-black/50" onClick={closeDrawer} aria-hidden />
      <div ref={panelRef} tabIndex={-1} className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-lift outline-none">
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <h2 className="text-lg font-bold">Your cart</h2>
          <button type="button" onClick={closeDrawer} aria-label="Close cart" className="grid h-11 w-11 place-items-center rounded-full hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden><path d="M6 6l12 12M18 6 6 18" /></svg>
          </button>
        </div>
        {!ready ? null : lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <p className="text-lg font-semibold">Your cart is empty</p>
            <p className="text-mute">Pick a TapSpot product to get started.</p>
            <Link href="/products" onClick={closeDrawer} className="inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-white">Browse products</Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
              {lines.map((l) => <CartLineItem key={l.lineId} line={l} onNavigate={closeDrawer} />)}
            </ul>
            <div className="space-y-4 border-t border-line bg-paper px-5 py-5">
              <TotalsTable totals={totals} />
              <ButtonLink href="/checkout" className="w-full" variant="primary">Checkout</ButtonLink>
              <div className="flex justify-between text-sm">
                <button type="button" onClick={closeDrawer} className="font-medium underline-offset-2 hover:underline">Continue shopping</button>
                <Link href="/cart" onClick={closeDrawer} className="font-medium underline-offset-2 hover:underline">View full cart</Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
