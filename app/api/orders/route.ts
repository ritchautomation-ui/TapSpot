import { NextResponse } from "next/server";

/**
 * Receives an order from the checkout page.
 * - If ORDER_WEBHOOK_URL is set, forwards the order JSON there and reports delivered: true on success.
 * - Otherwise reports delivered: false (the order is NOT stored on the server).
 * Replace the body with a database insert (Supabase, Prisma...) when you're ready.
 */
export async function POST(request: Request) {
  let order: unknown;
  try {
    order = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid order data" }, { status: 400 });
  }
  const o = order as { orderNumber?: string; items?: unknown[] };
  if (!o?.orderNumber || !Array.isArray(o.items) || o.items.length === 0) {
    return NextResponse.json({ error: "Order is missing items" }, { status: 400 });
  }

  const webhook = process.env.ORDER_WEBHOOK_URL;
  if (!webhook) return NextResponse.json({ delivered: false });

  try {
    const res = await fetch(webhook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(order),
    });
    return NextResponse.json({ delivered: res.ok });
  } catch {
    return NextResponse.json({ delivered: false });
  }
}
