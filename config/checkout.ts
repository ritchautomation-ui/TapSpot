import type { PaymentMethod } from "@/lib/types";

/**
 * Payment methods shown at checkout. TapSpot has no payment gateway connected yet,
 * so every method here is a MANUAL method: the customer places the order, then
 * you send payment details / confirm payment with them directly.
 * When you connect PayMongo, Xendit, etc. see lib/services/paymentService.ts.
 */
export const paymentMethods: PaymentMethod[] = [
  {
    id: "gcash",
    label: "GCash",
    enabled: true,
    description: "Pay by GCash after we confirm your order.",
    instructions: "We'll message you the GCash payment details after your order is reviewed.",
  },
  {
    id: "maya",
    label: "Maya",
    enabled: true,
    description: "Pay by Maya after we confirm your order.",
    instructions: "We'll message you the Maya payment details after your order is reviewed.",
  },
  {
    id: "bank-transfer",
    label: "Bank transfer",
    enabled: true,
    description: "Pay by online bank transfer after we confirm your order.",
    instructions: "We'll message you our bank details after your order is reviewed.",
  },
  {
    id: "cod",
    label: "Cash on delivery",
    enabled: false, // flip to true to offer it
    description: "Pay the courier when your order arrives.",
    instructions: "Please prepare the exact amount for the courier.",
  },
];

export const checkoutConfig = {
  /** Where order submissions go. See lib/services/orderService.ts */
  orderSubmissionEndpoint: "/api/orders",
  provinces: [] as string[], // optional: provide a list to turn Province into a dropdown
};
