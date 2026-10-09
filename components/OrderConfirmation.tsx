"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { paymentMethods } from "@/config/checkout";
import { shippingConfig } from "@/config/shipping";
import { storeConfig } from "@/config/store";
import { formatPrice } from "@/lib/format";
import { getLocalOrder } from "@/lib/services/orderService";
import type { Order } from "@/lib/types";
import { Button, ButtonLink } from "./ui";

function summaryText(o: Order): string {
  const lines = [
    `TapSpot order ${o.orderNumber}`,
    `Name: ${o.customer.fullName} | ${o.customer.email} | ${o.customer.phone}`,
    `Address: ${Object.values(o.shippingAddress).join(", ")}`,
    "",
    ...o.items.flatMap((i) => [
      `${i.quantity} x ${i.name} (${formatPrice(i.unitPrice)} each)`,
      ...Object.entries(i.setupDetails).filter(([, v]) => v).map(([k, v]) => `   ${k}: ${v}`),
    ]),
    "",
    `Subtotal ${formatPrice(o.subtotal)} | Shipping ${formatPrice(o.shipping)} | Discount -${formatPrice(o.discount)}`,
    `TOTAL ${formatPrice(o.total)}`,
    `Payment: ${paymentMethods.find((m) => m.id === o.paymentMethod)?.label ?? o.paymentMethod}`,
    o.notes ? `Notes: ${o.notes}` : "",
  ];
  return lines.filter((l) => l !== undefined).join("\n");
}

export function OrderConfirmation() {
  const params = useSearchParams();
  const num = params.get("order");
  const [order, setOrder] = useState<Order | null | undefined>(undefined);
  const [copied, setCopied] = useState(false);

  useEffect(() => { setOrder(num ? getLocalOrder(num) : null); }, [num]);

  if (order === undefined) return <p className="py-20 text-center text-mute">Loading…</p>;
  if (!order)
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">We couldn't find that order on this device</h2>
        <p className="mx-auto mt-2 max-w-md text-mute">Orders are shown on the device used to place them. If you just ordered, contact us with your order number.</p>
        <ButtonLink href="/" variant="dark" className="mt-6">Back to home</ButtonLink>
      </div>
    );

  const method = paymentMethods.find((m) => m.id === order.paymentMethod);
  const text = summaryText(order);
  const c = storeConfig.contact;
  const copy = async () => {
    try { await navigator.clipboard.writeText(text); setCopied(true); } catch { setCopied(false); }
  };

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{order.delivered ? "Order received." : "Order saved. One more step."}</h1>
      <p className="mt-3 text-lg text-mute">Thank you for choosing TapSpot, {order.customer.fullName.split(" ")[0]}.</p>
      <p className="mt-6 inline-block rounded-full bg-ink px-4 py-2 font-mono text-sm font-semibold text-white">{order.orderNumber}</p>

      {!order.delivered && (
        <div className="mt-6 rounded-2xl border border-brand bg-brand-soft p-5">
          <h2 className="font-bold">Send your order to TapSpot to finish</h2>
          <p className="mt-1 text-[15px]">This order is saved on your device only. TapSpot hasn't received it yet. Send the summary by email or Messenger so we can start.</p>
          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
            <ButtonLink external href={`mailto:${c.email}?subject=${encodeURIComponent(`Order ${order.orderNumber}`)}&body=${encodeURIComponent(text)}`} variant="primary">Email order to TapSpot</ButtonLink>
            <Button variant="dark" onClick={copy}>{copied ? "Copied" : "Copy order summary"}</Button>
            <ButtonLink href="/contact" variant="outline">Open Messenger</ButtonLink>
          </div>
        </div>
      )}

      <section className="mt-10">
        <h2 className="text-xl font-bold">Items</h2>
        <ul className="mt-3 divide-y divide-line border-y border-line">
          {order.items.map((i, idx) => (
            <li key={idx} className="py-4">
              <div className="flex justify-between gap-3"><span className="font-semibold">{i.name} × {i.quantity}</span><span className="tabular-nums">{formatPrice(i.unitPrice * i.quantity)}</span></div>
              <ul className="mt-1 space-y-0.5 text-sm text-mute">
                {Object.entries(i.setupDetails).filter(([, v]) => v).slice(0, 4).map(([k, v]) => <li key={k} className="truncate">{k}: {v}</li>)}
              </ul>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-1.5 text-[15px]">
          <div className="flex justify-between"><dt className="text-mute">Subtotal</dt><dd>{formatPrice(order.subtotal)}</dd></div>
          {order.discount > 0 && <div className="flex justify-between"><dt className="text-mute">Discount {order.discountCode}</dt><dd>−{formatPrice(order.discount)}</dd></div>}
          <div className="flex justify-between"><dt className="text-mute">Shipping</dt><dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd></div>
          <div className="flex justify-between border-t border-line pt-2 text-lg font-bold"><dt>Total</dt><dd>{formatPrice(order.total)}</dd></div>
        </dl>
      </section>

      <section className="mt-8 grid gap-6 sm:grid-cols-2">
        <div><h2 className="font-bold">Payment</h2><p className="mt-1 text-[15px] text-mute">{method?.label}. {method?.instructions}</p></div>
        <div><h2 className="font-bold">Shipping to</h2><p className="mt-1 text-[15px] text-mute">{order.customer.fullName}<br />{Object.values(order.shippingAddress).join(", ")}<br />{shippingConfig.label}</p></div>
      </section>

      <section className="mt-8 rounded-2xl bg-paper p-5 ring-1 ring-line">
        <h2 className="font-bold">What happens next</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-[15px] text-mute">
          <li>Your NFC setup details will be reviewed before programming.</li>
          <li>We message you the payment details.</li>
          <li>We program, test and pack your order (about {storeConfig.processingTime}).</li>
          <li>We ship it to your address.</li>
        </ol>
      </section>

      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/products" variant="dark">Continue shopping</ButtonLink>
        <ButtonLink href="/contact" variant="outline">Contact TapSpot</ButtonLink>
      </div>
    </div>
  );
}

