import Image from "next/image";
import type { Product } from "@/lib/types";
import styles from "./RotatingShowcase.module.css";

/** Six complete tiles share one cached source image; no artwork is regenerated. */
export function ShowcaseArtwork({ product }: { product: Product }) {
  const tile = product.showcaseTile ?? 0;
  return <span className={styles.artwork}>
    <Image src="/images/showcase-products.png" alt={`${product.name} TapSpot NFC display`}
      width={1536} height={1024} sizes="(max-width: 600px) 204vw, 1056px" draggable={false}
      className={styles.sheet} style={{ left: `${-(tile % 3) * 100}%`, top: `${-Math.floor(tile / 3) * 100}%` }} />
  </span>;
}
