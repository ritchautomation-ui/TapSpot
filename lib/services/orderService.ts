import { checkoutConfig } from "@/config/checkout";
import type { Order } from "@/lib/types";

/**
 * ORDER INTEGRATION POINT
 * -----------------------
 * submitOrder() sends the order to /api/orders. That route forwards it to the webhook in
 * ORDER_WEBHOOK_URL when you set one (Make, Zapier, n8n, Google Apps Script, Discord...).
 * With no webhook, the order is saved ONLY in this browser, and `delivered` is false:
 * the confirmation page then asks the customer to send the order summary to TapSpot.
 *
 * To use a real database later (Supabase, Firebase, Postgres + Prisma): edit
 * app/api/orders/route.ts to insert the order there. This file does not change.
 */
const KEY = "tapspot.orders.v1";

function readAll(): Order[] {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Order[]) : [];
  } catch {
    return [];
  }
}

function saveLocal(order: Order) {
  try {
    const rest = readAll().filter((o) => o.orderNumber !== order.orderNumber);
    localStorage.setItem(KEY, JSON.stringify([order, ...rest].slice(0, 20)));
  } catch {
    /* storage unavailable (private mode). The confirmation page still works from memory. */
  }
}

export async function submitOrder(order: Order): Promise<Order> {
  let delivered = false;
  try {
    const res = await fetch(checkoutConfig.orderSubmissionEndpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    if (res.ok) {
      const data = (await res.json()) as { delivered?: boolean };
      delivered = Boolean(data.delivered);
    }
  } catch {
    delivered = false;
  }
  const saved: Order = { ...order, delivered };
  saveLocal(saved);
  return saved;
}

export function getLocalOrder(orderNumber: string): Order | null {
  return readAll().find((o) => o.orderNumber === orderNumber) ?? null;
}
