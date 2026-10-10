"use client";


import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { formatPrice } from "@/lib/format";
import { validateSetup, type Errors } from "@/lib/validation";
import type { Product } from "@/lib/types";
import { useCart } from "./CartProvider";
import { ProductArtwork } from "./ProductArtwork";
import { QuantitySelector } from "./QuantitySelector";
import { SetupForm } from "./SetupForm";
import { Button, ButtonLink } from "./ui";

export function ProductDetail({ product }: { product: Product }) {
  const router = useRouter();
  const { addItem, openDrawer } = useCart();
  const [qty, setQty] = useState(1);
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Errors>({});

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
          <ProductArtwork product={product} className="aspect-[4/3] w-full" />
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

        {product.id === "custom-branded-sign" && (
          <div className="mt-8 rounded-3xl bg-brand-soft p-5 sm:p-6">
            <h2 className="text-lg font-bold">Preview your own design first</h2>
            <p className="mt-2 text-[15px] text-neutral-700">Upload your logo or artwork and see it on the sign before you order.</p>
            <ButtonLink href="/customize?product=sign" variant="dark" className="mt-4 w-full sm:w-auto">Customize your sign</ButtonLink>
          </div>
        )}

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
                <Button variant="primary" onClick={() => submit(true)}>{product.id === "google-facebook-bundle" ? "Get the bundle" : "Prepare order"}</Button>
              </div>
              {added && <p className="mt-3 text-sm text-mute" aria-live="polite">Added. You can keep shopping or check out from your cart.</p>}
              <p className="mt-4 text-sm text-mute">Product subtotal: {formatPrice((product.price ?? 0) * qty)} — delivery confirmed by message.</p>
            </>
          ) : (
            <div>
              <h2 className="text-lg font-bold">Choose your digital card package</h2>
              <p className="mt-2 text-mute">Explore Starter, Business and Executive options, then message us to arrange your setup.</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <ButtonLink href="/business-card#card-packages" className="w-full sm:w-auto">Explore packages</ButtonLink>
                <ButtonLink href="/customize?product=card" variant="outline" className="w-full sm:w-auto">Customize your card design</ButtonLink>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


