import type { Order } from "@/lib/types";
import { paymentMethods } from "@/config/checkout";

/**
 * PAYMENT INTEGRATION POINT
 * -------------------------
 * TapSpot has no payment gateway connected, so this returns a MANUAL result:
 * nothing is charged. You confirm payment with the customer yourself.
 *
 * To connect PayMongo / Xendit / Stripe later:
 *  1. Add the secret key to .env.local (never in code), e.g. PAYMONGO_SECRET_KEY
 *  2. Create a server route (app/api/payments/route.ts) that creates a checkout session
 *  3. Make this function call that route and return { kind: "redirect", url }
 *  Never collect card numbers in this app. Let the provider host the card form.
 */
export type PaymentResult =
  | { kind: "manual"; instructions: string }
  | { kind: "redirect"; url: string };

export async function startPayment(order: Order): Promise<PaymentResult> {
  const method = paymentMethods.find((m) => m.id === order.paymentMethod);
  return { kind: "manual", instructions: method?.instructions ?? "We'll message you the payment details." };
}
