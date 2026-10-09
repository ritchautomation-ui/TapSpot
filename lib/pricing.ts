import { discountCodes } from "@/config/discounts";
import { shippingConfig } from "@/config/shipping";
import { getProduct } from "@/data/products";
import type { CartLine, DiscountCode, Totals } from "./types";

export function findDiscount(code: string | null | undefined): DiscountCode | null {
  if (!code) return null;
  const c = code.trim().toUpperCase();
  return discountCodes.find((d) => d.active && d.code.toUpperCase() === c) ?? null;
}

export function lineUnitPrice(line: CartLine): number {
  return getProduct(line.productId)?.price ?? 0;
}

export function calcSubtotal(lines: CartLine[]): number {
  return lines.reduce((sum, l) => sum + lineUnitPrice(l) * l.quantity, 0);
}

/** Returns an error message if the code can't be applied, otherwise null. */
export function validateDiscount(code: string, subtotal: number): string | null {
  const d = findDiscount(code);
  if (!d) return "That code isn't valid. Check the spelling and try again.";
  if (d.minSubtotal && subtotal < d.minSubtotal)
    return `This code needs a subtotal of at least ₱${d.minSubtotal.toLocaleString("en-PH")}.`;
  return null;
}

export function calcTotals(lines: CartLine[], discountCode: string | null): Totals {
  const subtotal = calcSubtotal(lines);
  const d = findDiscount(discountCode);
  let discount = 0;
  let discountLabel: string | null = null;
  if (d && (!d.minSubtotal || subtotal >= d.minSubtotal)) {
    discount = d.type === "percent" ? Math.round((subtotal * d.value) / 100) : Math.min(d.value, subtotal);
    discountLabel = `${d.code} (${d.description})`;
  }
  const afterDiscount = Math.max(0, subtotal - discount);
  let shipping = 0;
  if (lines.length > 0 && shippingConfig.enabled) {
    const free = shippingConfig.freeShippingThreshold;
    shipping = free !== null && afterDiscount >= free ? 0 : shippingConfig.flatRate;
  }
  return { subtotal, discount, shipping, total: afterDiscount + shipping, discountLabel };
}
