"use client";
import Link from "next/link";
import { useRef, type CSSProperties } from "react";
import { showcaseProducts } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { ShowcaseArtwork } from "./ShowcaseArtwork";
import { useShowcase } from "./useShowcase";
import styles from "./RotatingShowcase.module.css";
const items = showcaseProducts();

export function RotatingShowcase() {
  const c = useShowcase(items.length);
  const active = items[c.index];
  const drag = useRef<{ x: number; y: number; id: number } | null>(null);
  const suppressClick = useRef(false);
  return (
    <section id="showcase" ref={c.sectionRef} className={styles.section}
      aria-roledescription="carousel" aria-labelledby="showcase-heading"
      onPointerEnter={e => { if (e.pointerType === "mouse") c.setHovered(true); }}
      onPointerLeave={e => { if (e.pointerType === "mouse") c.setHovered(false); }}
      onFocusCapture={() => c.setFocused(true)}
      onBlurCapture={e => { if (!e.currentTarget.contains(e.relatedTarget)) { c.interact(); c.setFocused(false); } }}
      onKeyDown={e => {
        if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); c.go(e.key === "ArrowRight" ? 1 : -1); }
      }}>
      <div className={styles.heading}>
        <h2 id="showcase-heading">Choose how you want customers to connect.</h2>
        <p>TapSpot makes everyday customer actions simpler with one tap.</p>
      </div>
      <div className={styles.stage} tabIndex={0} aria-label="Product showcase. Swipe or use left and right arrow keys."
        onPointerDown={e => {
          if (!e.isPrimary || e.button !== 0) return;
          drag.current = { x: e.clientX, y: e.clientY, id: e.pointerId };
          suppressClick.current = false; c.setTouching(true); c.interact();
        }}
        onPointerMove={e => {
          const d = drag.current;
          if (!d || d.id !== e.pointerId) return;
          const dx = Math.abs(e.clientX - d.x), dy = Math.abs(e.clientY - d.y);
          if (dx > 10 || dy > 10) suppressClick.current = true;
          if (dx > 10 && dx > dy * 1.2 && !e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.setPointerCapture(e.pointerId);
        }}
        onPointerUp={e => {
          const d = drag.current;
          if (d && d.id === e.pointerId) {
            const dx = e.clientX - d.x, dy = e.clientY - d.y;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.2) { suppressClick.current = true; c.go(dx < 0 ? 1 : -1); }
          }
          drag.current = null; c.setTouching(false); c.interact();
          if (e.currentTarget.hasPointerCapture(e.pointerId)) e.currentTarget.releasePointerCapture(e.pointerId);
        }}
        onPointerCancel={() => { drag.current = null; suppressClick.current = true; c.setTouching(false); c.interact(); }}
        onPointerLeave={e => { if (drag.current && !e.currentTarget.hasPointerCapture(drag.current.id)) { drag.current = null; c.setTouching(false); c.interact(); } }}
        onLostPointerCapture={e => { if (e.target === e.currentTarget) { drag.current = null; c.setTouching(false); } }}
        onClickCapture={e => { if (suppressClick.current) { e.preventDefault(); e.stopPropagation(); suppressClick.current = false; } }}>
        <div className={styles.wheel}>
          {items.map((product, i) => {
            const radians = (i - c.step) * (2 * Math.PI / items.length);
            const depth = (1 + Math.cos(radians)) / 2;
            const selected = i === c.index;
            const style = { "--x": Math.sin(radians), "--depth": depth,
              "--turn": `${-Math.sin(radians) * 24}deg`, "--scale": 0.48 + depth * 0.52,
              "--opacity": 0.3 + depth * 0.7, zIndex: Math.round(depth * 100) } as CSSProperties;
            const artwork = <ShowcaseArtwork product={product} />;
            return <div key={product.id} className={styles.product} style={style} data-active={selected}>
              {product.available ? (
                <Link href={`/products/${product.slug}`} draggable={false} tabIndex={selected ? 0 : -1}
                  onClick={e => { if (!selected) { e.preventDefault(); c.select(i); } }}
                  aria-label={selected ? `View ${product.name}` : `Select ${product.shortName}`} className={styles.productTarget}>{artwork}</Link>
              ) : (
                <button type="button" tabIndex={selected ? 0 : -1} className={styles.productTarget}
                  aria-label={selected ? `${product.name}: Coming soon` : `Select ${product.shortName}`}
                  aria-disabled={selected && !product.available ? true : undefined}
                  onClick={() => c.select(i)}>{artwork}</button>
              )}
            </div>;
          })}
        </div>
      </div>
      <div className={styles.controls}>
        <button type="button" aria-label="Previous product" onClick={() => c.go(-1)} className={styles.arrow}>←</button>
        <span className={styles.counter} aria-hidden="true">{String(c.index + 1).padStart(2, "0")} <span>/ {String(items.length).padStart(2, "0")}</span></span>
        <button type="button" aria-label="Next product" onClick={() => c.go(1)} className={styles.arrow}>→</button>
        {!c.reduced && <button type="button" className={styles.pause} aria-label={c.paused ? "Resume automatic rotation" : "Pause automatic rotation"}
          onClick={() => c.setPaused(!c.paused)}>{c.paused ? "Play" : "Pause"}</button>}
      </div>
      <div className={styles.info} aria-live={c.auto ? "off" : "polite"} aria-atomic="true">
        <h3>{active.name}</h3>
        <p className={styles.tagline}>{active.tagline}</p>
        <p className={styles.price}>{active.available ? active.price === null ? "Price on request" : <>{formatPrice(active.price)} <span>{active.priceNote}</span></> : "Coming soon"}</p>
        {active.available ? <Link className={styles.cta} href={`/products/${active.slug}`}>View product <span aria-hidden="true">↗</span></Link> : <span className={styles.unavailable}>Not available to order yet</span>}
      </div>
      <div className={styles.selector} role="group" aria-label="Choose product">
        {items.map((product, i) => <button type="button" key={product.id} aria-pressed={i === c.index}
          aria-label={`${product.shortName}${product.available ? "" : ", coming soon"}`} onClick={() => c.select(i)}>
          <span className={styles.dot} aria-hidden="true" />{product.shortName}
        </button>)}
      </div>
      <p className={styles.hint}>Swipe to explore. Tap the centre product to learn more.</p>
    </section>
  );
}
