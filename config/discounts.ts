import type { DiscountCode } from "@/lib/types";

/** Discount codes. Codes are case-insensitive. Edit freely. */
export const discountCodes: DiscountCode[] = [
  { code: "FIRSTORDER", type: "percent", value: 10, description: "10% off your first order", active: true },
  { code: "WELCOME", type: "fixed", value: 100, description: "₱100 off", minSubtotal: 1000, active: true },
];
