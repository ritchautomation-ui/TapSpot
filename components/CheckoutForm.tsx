"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { paymentMethods } from "@/config/checkout";
import { getProduct } from "@/data/products";
import { formatPrice, makeOrderNumber } from "@/lib/format";
import { submitOrder } from "@/lib/services/orderService";
import type { CustomerInfo, Order, ShippingAddress } from "@/lib/types";
import { validateAddress, validateCustomer, validateSetup, type Errors } from "@/lib/validation";
import { useCart } from "./CartProvider";
import { DiscountBox } from "./DiscountBox";
import { TotalsTable } from "./TotalsTable";
import { Button, ButtonLink, Field, inputClass } from "./ui";

const emptyCustomer: CustomerInfo = { fullName: "", email: "", phone: "" };
const emptyAddress: ShippingAddress = { unit: "", street: "", barangay: "", city: "", province: "", postalCode: "" };

export function CheckoutForm() {
  const router = useRouter();
  const { lines, totals, discountCode, ready, clear } = useCart();
  const methods = paymentMethods.filter((m) => m.enabled);
  const [customer, setCustomer] = useState(emptyCustomer);
  const [address, setAddress] = useState(emptyAddress);
  const [payment, setPayment] = useState(methods[0]?.id ?? "");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [setupProblems, setSetupProblems] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  if (!ready) return <p className="py-20 text-center text-mute">Loading checkout…</p>;
  if (lines.length === 0)
    return (
      <div className="py-20 text-center">
        <h2 className="text-2xl font-bold">Nothing to check out yet</h2>
        <p className="mt-2 text-mute">Add a product to your cart first.</p>
        <ButtonLink href="/products" variant="dark" className="mt-6">Browse products</ButtonLink>
      </div>
    );

  const field = (group: "c" | "a", key: string, label: string, opts: { type?: string; auto?: string; inputMode?: "numeric" | "tel" | "email"; help?: string } = {}) => {
    const id = `${group}-${key}`;
    const val = group === "c" ? customer[key as keyof CustomerInfo] : address[key as keyof ShippingAddress];
    const err = errors[key];
    return (
      <Field id={id} label={label} error={err} help={opts.help}>
        <input id={id} name={key} value={val} type={opts.type ?? "text"} autoComplete={opts.auto} inputMode={opts.inputMode}
          aria-invalid={err ? true : undefined} aria-describedby={err ? `${id}-error` : opts.help ? `${id}-help` : undefined}
          onChange={(e) => (group === "c" ? setCustomer((s) => ({ ...s, [key]: e.target.value })) : setAddress((s) => ({ ...s, [key]: e.target.value })))}
          className={inputClass(!!err)} />
      </Field>
    );
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = { ...validateCustomer(customer), ...validateAddress(address) };
    const problems: string[] = [];
    for (const l of lines) {
      const p = getProduct(l.productId);
      if (!p) continue;
      const se = validateSetup(p, l.setup);
      if (Object.keys(se).length) problems.push(`${p.name}: ${Object.values(se)[0]}`);
    }
    setErrors(errs);
    setSetupProblems(problems);
    if (!payment) { setSubmitError("Choose a payment method."); return; }
    if (Object.keys(errs).length || problems.length) {
      const first = Object.keys(errs)[0];
      if (first) document.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
      return;
    }
    setSubmitError(null);
    setSubmitting(true);
    const draft: Order = {
      id: crypto.randomUUID(),
      orderNumber: makeOrderNumber(),
      customer, shippingAddress: address,
      items: lines.map((l) => {
        const p = getProduct(l.productId)!;
        return { productId: p.id, name: p.name, unitPrice: p.price ?? 0, quantity: l.quantity, setupDetails: l.setup };
      }),
      subtotal: totals.subtotal, shipping: totals.shipping, discount: totals.discount, discountCode: totals.discount > 0 ? discountCode : null,
      total: totals.total, paymentMethod: payment, notes, status: "pending-review",
      createdAt: new Date().toISOString(), delivered: false,
    };
    try {
      const saved = await submitOrder(draft);
      clear();
      router.push(`/order-confirmation?order=${encodeURIComponent(saved.orderNumber)}`);
    } catch {
      setSubmitting(false);
      setSubmitError("Something went wrong placing your order. Your cart is safe. Please try again.");
    }
  };

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-10 lg:grid-cols-[1.4fr_1fr]">
      <div className="space-y-10">
        {(Object.keys(errors).length > 0 || setupProblems.length > 0) && (
          <div role="alert" className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-800">
            <p className="font-semibold">Fix these to place your order:</p>
            <ul className="mt-1 list-disc pl-5">
              {Object.values(errors).map((m) => <li key={m}>{m}</li>)}
              {setupProblems.map((m) => <li key={m}>{m} <Link className="underline" href="/cart">Review your cart</Link></li>)}
            </ul>
          </div>
        )}
        <fieldset className="space-y-4">
          <legend className="mb-1 text-xl font-bold">Contact information</legend>
          {field("c", "fullName", "Full name", { auto: "name" })}
          <div className="grid gap-4 sm:grid-cols-2">
            {field("c", "email", "Email", { type: "email", auto: "email", inputMode: "email" })}
            {field("c", "phone", "Mobile number", { type: "tel", auto: "tel", inputMode: "tel", help: "For courier updates, like 0917 123 4567." })}
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-1 text-xl font-bold">Delivery address</legend>
          {field("a", "unit", "House, unit or building", { auto: "address-line1" })}
          {field("a", "street", "Street", { auto: "address-line2" })}
          <div className="grid gap-4 sm:grid-cols-2">
            {field("a", "barangay", "Barangay")}
            {field("a", "city", "City or municipality", { auto: "address-level2" })}
            {field("a", "province", "Province", { auto: "address-level1" })}
            {field("a", "postalCode", "Postal code", { auto: "postal-code", inputMode: "numeric" })}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-3 text-xl font-bold">Payment method</legend>
          <div className="space-y-3">
            {methods.map((m) => (
              <label key={m.id} className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 ${payment === m.id ? "border-ink bg-paper" : "border-line"}`}>
                <input type="radio" name="payment" value={m.id} checked={payment === m.id} onChange={() => setPayment(m.id)} className="mt-1 h-5 w-5 accent-[#FF6903]" />
                <span>
                  <span className="block font-semibold">{m.label}</span>
                  <span className="block text-sm text-mute">{m.description}</span>
                </span>
              </label>
            ))}
          </div>
          <p className="mt-3 text-sm text-mute">You won't be charged now. After we review your setup details, we'll message you how to pay.</p>
        </fieldset>

        <Field id="notes" label="Order notes" optional>
          <textarea id="notes" rows={3} value={notes} onChange={(e) => setNotes(e.target.value)} className={inputClass()} />
        </Field>
      </div>

      <aside className="h-fit space-y-5 rounded-3xl bg-paper p-6 ring-1 ring-line lg:sticky lg:top-24">
        <h2 className="text-xl font-bold">Order summary</h2>
        <ul className="divide-y divide-line">
          {lines.map((l) => {
            const p = getProduct(l.productId);
            if (!p || p.price === null) return null;
            return (
              <li key={l.lineId} className="flex justify-between gap-3 py-3 text-[15px]">
                <span>{p.name} <span className="text-mute">× {l.quantity}</span><br /><span className="text-sm text-mute">{formatPrice(p.price)} each</span></span>
                <span className="font-semibold tabular-nums">{formatPrice(p.price * l.quantity)}</span>
              </li>
            );
          })}
        </ul>
        <DiscountBox />
        <TotalsTable totals={totals} />
        {submitError && <p role="alert" className="text-sm font-medium text-red-700">{submitError}</p>}
        <Button type="submit" disabled={submitting} className="w-full">{submitting ? "Placing order…" : `Place order · ${formatPrice(totals.total)}`}</Button>
        <p className="text-center text-xs text-mute">Your NFC setup details are reviewed before programming.</p>
      </aside>
    </form>
  );
}
