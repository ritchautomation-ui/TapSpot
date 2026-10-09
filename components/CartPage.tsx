"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { CartLineItem } from "./CartLineItem";
import { DiscountBox } from "./DiscountBox";
import { TotalsTable } from "./TotalsTable";
import { ButtonLink } from "./ui";

export function CartPage() {
  const { lines, totals, ready } = useCart();
  if (!ready) return <p className="py-20 text-center text-mute">Loading your cart…</p>;
  if (lines.length === 0)
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">Your cart is empty</h2>
        <p className="mt-2 text-mute">Pick a TapSpot product and enter your setup details to add it.</p>
        <ButtonLink href="/products" variant="dark" className="mt-6">Browse products</ButtonLink>
      </div>
    );
  return (
    <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <ul className="divide-y divide-line border-y border-line">
        {lines.map((l) => <CartLineItem key={l.lineId} line={l} />)}
      </ul>
      <aside className="h-fit space-y-5 rounded-3xl bg-paper p-6 ring-1 ring-line">
        <DiscountBox />
        <TotalsTable totals={totals} />
        <ButtonLink href="/checkout" className="w-full">Send order request</ButtonLink>
        <Link href="/products" className="block text-center text-sm font-medium underline-offset-2 hover:underline">Continue shopping</Link>
      </aside>
    </div>
  );
}

