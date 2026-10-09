"use client";

import Link from "next/link";
import { getProduct } from "@/data/products";
import { formatPrice } from "@/lib/format";
import type { CartLine } from "@/lib/types";
import { useCart } from "./CartProvider";
import { ProductArtwork } from "./ProductArtwork";
import { QuantitySelector } from "./QuantitySelector";

export function CartLineItem({ line, onNavigate }: { line: CartLine; onNavigate?: () => void }) {
  const { setQuantity, removeLine } = useCart();
  const product = getProduct(line.productId);
  if (!product || product.price === null) return null;
  const summary = product.setupFields
    .filter((f) => f.required && line.setup[f.key])
    .slice(0, 3)
    .map((f) => `${f.label}: ${line.setup[f.key]}`);
  return (
    <li className="flex gap-4 py-5">
      <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-paper ring-1 ring-line">
        <ProductArtwork product={product} className="h-full w-full" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/products/${product.slug}`} onClick={onNavigate} className="font-semibold leading-snug hover:underline">{product.name}</Link>
          <p className="font-semibold tabular-nums">{formatPrice(product.price * line.quantity)}</p>
        </div>
        <p className="text-sm text-mute">{formatPrice(product.price)} {product.priceNote ?? "each"}</p>
        {summary.length > 0 && (
          <ul className="mt-1.5 space-y-0.5 text-xs text-mute">
            {summary.map((s) => <li key={s} className="truncate" title={s}>{s}</li>)}
          </ul>
        )}
        <div className="mt-3 flex items-center justify-between">
          <QuantitySelector value={line.quantity} onChange={(n) => setQuantity(line.lineId, n)} label={`Quantity for ${product.name}`} />
          <button type="button" onClick={() => removeLine(line.lineId)} className="rounded-md px-2 py-2 text-sm font-medium text-mute underline-offset-2 hover:text-ink hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand">
            Remove
          </button>
        </div>
      </div>
    </li>
  );
}

