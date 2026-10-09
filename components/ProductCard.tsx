import Link from "next/link";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProductArtwork } from "./ProductArtwork";
import { cardPackages } from "@/data/packages";

export function ProductCard({ product }: { product: Product }) {
  const href = product.id === "nfc-business-card" ? "/business-card#card-packages" : `/products/${product.slug}`;
  return (
    <article className="group flex flex-col overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-line">
      <Link href={href} className="relative block bg-paper" aria-label={product.name}>
        <ProductArtwork product={product} className="aspect-[5/4] w-full" />
        {product.badge && (
          <span className="absolute left-4 top-4 rounded-full bg-brand px-3 py-1 text-sm font-semibold text-white">{product.badge}</span>
        )}
      </Link>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-xl font-bold"><Link href={href}>{product.name}</Link></h3>
        <p className="mt-2 flex-1 text-[15px] leading-relaxed text-mute">{product.tagline}</p>
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <p className="font-bold tabular-nums">
            {product.price !== null ? formatPrice(product.price) : product.id === "nfc-business-card" ? `From ${formatPrice(cardPackages[0].price)}` : "Price on request"}
            {product.price !== null && product.priceNote && <span className="ml-1 text-sm font-normal text-mute">{product.priceNote}</span>}
          </p>
          <Link href={href} className="inline-flex min-h-11 items-center rounded-full bg-ink px-5 text-sm font-semibold text-white hover:bg-neutral-800">
            {product.id === "google-facebook-bundle" ? "Get the bundle" : "View product"}
          </Link>
        </div>
      </div>
    </article>
  );
}

