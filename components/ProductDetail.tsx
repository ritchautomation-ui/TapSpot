"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { storeConfig } from "@/config/store";
import { formatPrice } from "@/lib/format";
import { validateSetup, type Errors } from "@/lib/validation";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import { ProductVisual } from "./ProductVisual";
import { QuantitySelector } from "./QuantitySelector";
import { SetupForm } from "./SetupForm";
import { Button, ButtonLink } from "./ui";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem, openDrawer } = useCart();
  const [qty, setQty] = useState(1);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Errors>({});
  const [view, setView] = useState(0); // 0 = illustrated visual, 1+ = photos
  const [added, setAdded] = useState(false);

  const purchasable = product.price !== null;

  const submit = (goCheckout: boolean) => {
    const errs = validateSetup(product, values);
    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      const first = Object.keys(errs)[0];
      document.getElementById(`setup-${product.id}-${first}`)?.focus();
      return;
    }
    addItem(product.id, qty, values);
    setAdded(true);
    if (goCheckout) router.push("/checkout");
    else openDrawer();
  };

  return (
    <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="overflow-hidden rounded-3xl bg-paper ring-1 ring-line">
          {view === 0 ? (
            <ProductVisual visual={product.visual} className="aspect-[4/3] w-full" />
          ) : (
            <Image src={product.images[view - 1].src} alt={product.images[view - 1].alt} width={product.images[view - 1].width} height={product.images[view - 1].height} className="aspect-[4/3] w-full object-contain" priority />
          )}
        </div>
        <div className="mt-3 flex gap-3" role="group" aria-label="Product views">
          <button type="button" onClick={() => setView(0)} aria-label="Show illustration" aria-pressed={view === 0} className={`h-16 w-20 overflow-hidden rounded-xl bg-paper ring-2 ${view === 0 ? "ring-brand" : "ring-line"}`}>
            <ProductVisual visual={product.visual} className="h-full w-full" />
          </button>
          {product.images.map((img, i) => (
            <button key={img.src + i} type="button" onClick={() => setView(i + 1)} aria-label={`Show photo ${i + 1}`} aria-pressed={view === i + 1} className={`h-16 w-20 overflow-hidden rounded-xl ring-2 ${view === i + 1 ? "ring-brand" : "ring-line"}`}>
              <Image src={img.src} alt="" width={160} height={120} className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      </div>

      <div>
        <nav aria-label="Breadcrumb" className="text-sm text-mute">
          <Link href="/" className="hover:text-ink">Home</Link> / <Link href="/products" className="hover:text-ink">Products</Link> / <span className="text-ink">{product.shortName}</span>
        </nav>
        <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">{product.name}</h1>
        <p className="mt-3 text-lg text-mute">{product.tagline}</p>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <p className="text-3xl font-bold tabular-nums">{purchasable ? formatPrice(product.price!) : "Price on request"}</p>
          {purchasable && product.priceNote && <span className="text-mute">{product.priceNote}</span>}
          {product.badge && <span className="rounded-full bg-brand px-3 py-1 text-sm font-semibold text-white">{product.badge}</span>}
        </div>
        <p className="mt-5 leading-relaxed text-neutral-700">{product.description}</p>
        {product.id === "google-facebook-bundle" && (
          <p className="mt-4 rounded-xl bg-brand-soft p-4 text-[15px] font-medium">Includes 1 Google Review NFC + 1 Facebook NFC</p>
        )}

        <ul className="mt-6 space-y-2.5">
          {product.includes.map((i) => (
            <li key={i} className="flex gap-3 text-[15px]"><span className="mt-0.5 font-bold text-brand" aria-hidden>✓</span>{i}</li>
          ))}
        </ul>

        <div className="mt-8 rounded-3xl border border-line p-5 sm:p-6">
          {purchasable ? (
            <>
              <SetupForm product={product} values={values} errors={errors} onChange={(k, v) => { setValues((s) => ({ ...s, [k]: v })); if (errors[k]) setErrors((e) => { const n = { ...e }; delete n[k]; return n; }); }} />
              <div className="mt-6 flex flex-wrap items-center gap-4">
                <QuantitySelector value={qty} onChange={setQty} />
                <p className="text-sm text-mute">All units in this order share the setup above.</p>
              </div>
              {Object.keys(errors).length > 0 && (
                <p role="alert" className="mt-4 text-sm font-medium text-red-700">Fix the {Object.keys(errors).length} highlighted field{Object.keys(errors).length > 1 ? "s" : ""} to continue.</p>
              )}
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Button variant="dark" onClick={() => submit(false)}>{product.id === "google-facebook-bundle" ? "Add bundle to cart" : "Add to cart"}</Button>
                <Button variant="primary" onClick={() => submit(true)}>{product.id === "google-facebook-bundle" ? "Get the bundle" : "Buy now"}</Button>
              </div>
              {added && <p className="mt-3 text-sm text-mute" aria-live="polite">Added. You can keep shopping or check out from your cart.</p>}
              <p className="mt-4 text-sm text-mute">Total at checkout: {formatPrice((product.price ?? 0) * qty)} plus shipping.</p>
            </>
          ) : (
            <div>
              <h2 className="text-lg font-bold">Pricing is being finalized</h2>
              <p className="mt-2 text-mute">Message us and we'll send you the price and what we need to set up your profile.</p>
              <ButtonLink href={storeConfig.contact.messengerUrl} external className="mt-4 w-full sm:w-auto">Ask about pricing</ButtonLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
