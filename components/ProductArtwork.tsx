import Image from "next/image";
import { getProduct } from "@/data/products";
import type { Product } from "@/lib/types";
import { CustomSignArtwork } from "./CustomSignArtwork";
import { ShowcaseArtwork } from "./ShowcaseArtwork";

/** One artwork source across the showcase, catalogue, product detail and cart. */
export function ProductArtwork({ product, className = "" }: { product: Product; className?: string }) {
  if (product.showcaseTile !== undefined) return (
    <div className={`grid place-items-center bg-black p-[5%] ${className}`}>
      <div className="w-full max-w-[390px]"><ShowcaseArtwork product={product} /></div>
    </div>
  );
  if (product.visual === "bundle") return (
    <div className={`flex items-center justify-center gap-1 bg-black p-[4%] ${className}`}>
      {["google-review", "facebook"].map(id => <div key={id} className="w-1/2"><ShowcaseArtwork product={getProduct(id)!} /></div>)}
    </div>
  );
  if (product.visual === "custom-sign") return <CustomSignArtwork className={className} />;
  const photo = product.images[0];
  return photo ? <div className={`relative bg-paper ${className}`}><Image src={photo.src} alt={photo.alt} fill sizes="(min-width:1024px) 540px, 100vw" className="object-contain" /></div> : null;
}
