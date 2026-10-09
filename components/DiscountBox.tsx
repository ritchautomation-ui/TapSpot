"use client";

import { useState } from "react";
import { findDiscount, validateDiscount } from "@/lib/pricing";
import { useCart } from "./CartProvider";
import { inputClass } from "./ui";

export function DiscountBox() {
  const { discountCode, applyDiscount, totals } = useCart();
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);

  const applied = findDiscount(discountCode);
  if (applied) {
    const active = totals.discount > 0;
    return (
      <div className="flex items-center justify-between rounded-xl bg-brand-soft px-4 py-3 text-sm">
        <p>
          <span className="font-semibold">{applied.code}</span>{" "}
          {active ? "applied" : `needs a subtotal of at least ₱${applied.minSubtotal?.toLocaleString("en-PH")}`}
        </p>
        <button type="button" className="font-semibold underline" onClick={() => applyDiscount(null)}>Remove</button>
      </div>
    );
  }
  const apply = () => {
    const err = validateDiscount(value, totals.subtotal);
    if (err) return setError(err);
    setError(null);
    applyDiscount(value.trim().toUpperCase());
    setValue("");
  };
  return (
    <div>
      <label htmlFor="discount" className="mb-1.5 block text-sm font-medium">Discount code</label>
      <div className="flex gap-2">
        <input id="discount" value={value} onChange={(e) => setValue(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); apply(); } }}
          className={inputClass(!!error)} autoCapitalize="characters" autoComplete="off" aria-describedby={error ? "discount-error" : undefined} />
        <button type="button" onClick={apply} disabled={!value.trim()} className="min-h-12 shrink-0 rounded-xl bg-ink px-5 font-semibold text-white hover:bg-neutral-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-40">Apply</button>
      </div>
      {error && <p id="discount-error" role="alert" className="mt-1.5 text-sm font-medium text-red-700">{error}</p>}
    </div>
  );
}
