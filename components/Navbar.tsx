"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Logo } from "./Brand";
import { useCart } from "./CartProvider";

const links = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/how-it-works", label: "How it works" },
  { href: "/business-card", label: "Business card" },
  { href: "/faq", label: "FAQ" },
  { href: "/contact", label: "Contact" },
];

function CartIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M6 7h12l-1 12H7L6 7Z" />
      <path d="M9 7a3 3 0 0 1 6 0" />
    </svg>
  );
}

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { count, openDrawer } = useCart();

  useEffect(() => setOpen(false), [pathname]);

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-5 sm:px-8">
        <Logo className="h-8" priority />
        <nav aria-label="Main" className="hidden items-center gap-1 lg:flex">
          {links.map((l) => {
            const active = l.href === "/" ? pathname === "/" : pathname.startsWith(l.href);
            return (
              <Link key={l.href} href={l.href} aria-current={active ? "page" : undefined}
                className={`rounded-full px-4 py-2 text-[15px] font-medium transition-colors hover:bg-black/5 ${active ? "text-ink" : "text-mute"}`}>
                {l.label}
              </Link>
            );
          })}
        </nav>
        <div className="flex items-center gap-2">
          <button type="button" onClick={openDrawer} aria-label={`Open cart, ${count} item${count === 1 ? "" : "s"}`}
            className="relative grid h-11 w-11 place-items-center rounded-full hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
            <CartIcon />
            {count > 0 && (
              <span className="absolute right-0.5 top-0.5 grid h-5 min-w-5 place-items-center rounded-full bg-brand px-1 text-xs font-bold text-white">{count}</span>
            )}
          </button>
          <Link href="/products" className="hidden min-h-11 items-center rounded-full bg-ink px-5 text-[15px] font-semibold text-white hover:bg-neutral-800 sm:inline-flex">
            Get started
          </Link>
          <button type="button" className="grid h-11 w-11 place-items-center rounded-full hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand lg:hidden"
            aria-expanded={open} aria-controls="mobile-nav" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              {open ? <path d="M6 6l12 12M18 6 6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
            </svg>
          </button>
        </div>
      </div>
      {open && (
        <nav id="mobile-nav" aria-label="Mobile" className="border-t border-line bg-white px-5 pb-5 pt-2 lg:hidden">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="block border-b border-line py-4 text-lg font-semibold">{l.label}</Link>
          ))}
          <Link href="/products" className="mt-4 flex min-h-12 items-center justify-center rounded-full bg-brand text-base font-semibold text-white">Get started</Link>
        </nav>
      )}
    </header>
  );
}
