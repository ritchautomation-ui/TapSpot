"use client";

import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { formatPrice } from "@/lib/format";
import { featuredProducts } from "@/data/products";
import type { Product } from "@/lib/types";
import { NfcCard, Standee } from "./ProductVisual";

function Object3D({ product }: { product: Product }) {
  switch (product.visual) {
    case "business-card":
      return (
        <div className="tilt-obj w-[min(78vw,420px)]">
          <div className="card-flip relative">
            <div className="backface-hidden"><NfcCard face="front" /></div>
            <div className="backface-hidden absolute inset-0 [transform:rotateY(180deg)]"><NfcCard face="back" /></div>
          </div>
        </div>
      );
    case "google":
      return <div className="tilt-obj sway w-[min(46vw,230px)]"><Standee kind="google" /></div>;
    case "facebook":
      return <div className="tilt-obj sway w-[min(46vw,230px)]"><Standee kind="facebook" /></div>;
    default:
      return (
        <div className="tilt-obj sway flex w-[min(78vw,430px)] items-end justify-center gap-[3%]">
          <div className="w-[44%]"><Standee kind="google" /></div>
          <div className="w-[44%]"><Standee kind="facebook" /></div>
        </div>
      );
  }
}

export function RotatingShowcase() {
  const items = featuredProducts();
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const drag = useRef<{ x: number; moved: boolean } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  const go = useCallback((n: number) => setIndex((i) => (i + n + items.length) % items.length), [items.length]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!stageRef.current?.contains(document.activeElement)) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go]);

  const onPointerDown = (e: React.PointerEvent) => { drag.current = { x: e.clientX, moved: false }; };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.pointerType === "mouse") {
      const px = (e.clientX - rect.left) / rect.width - 0.5;
      const py = (e.clientY - rect.top) / rect.height - 0.5;
      e.currentTarget.style.setProperty("--ry", `${px * 24}deg`);
      e.currentTarget.style.setProperty("--rx", `${-py * 14}deg`);
    }
    if (drag.current && Math.abs(e.clientX - drag.current.x) > 8) drag.current.moved = true;
  };
  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
  };
  const onLeave = (e: React.PointerEvent<HTMLDivElement>) => {
    e.currentTarget.style.setProperty("--ry", "0deg");
    e.currentTarget.style.setProperty("--rx", "0deg");
  };

  const active = items[index];

  return (
    <section id="showcase" aria-roledescription="carousel" aria-label="TapSpot products" className="bg-ink py-20 text-white sm:py-28">
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Choose how you want customers to connect.</h2>
          <p className="mt-4 text-lg text-white/70">TapSpot makes everyday customer actions simpler with one tap. Swipe or use the arrows, then tap a product to explore it.</p>
        </div>

        <div ref={stageRef} className="relative mt-12" tabIndex={0} aria-label="Product carousel. Use left and right arrow keys.">
          <div
            className="showcase-stage overflow-hidden touch-pan-y select-none"
            onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp} onPointerLeave={onLeave} onPointerCancel={() => (drag.current = null)}
          >
            <div className="flex transition-transform duration-500 ease-out motion-reduce:transition-none" style={{ transform: `translateX(-${index * 100}%)` }}>
              {items.map((p, i) => (
                <div key={p.id} className="w-full shrink-0" role="group" aria-roledescription="slide" aria-label={`${i + 1} of ${items.length}: ${p.name}`} aria-hidden={i !== index}>
                  <button
                    type="button" tabIndex={i === index ? 0 : -1}
                    onClick={() => { if (!drag.current?.moved) router.push(`/products/${p.slug}`); }}
                    className="group relative mx-auto grid h-[340px] w-full max-w-xl cursor-pointer place-items-center rounded-3xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:h-[400px]"
                    style={{ perspective: "1100px", containerType: "inline-size" }}
                    aria-label={`Open ${p.name}`}
                  >
                    <div aria-hidden className="absolute bottom-10 h-6 w-2/3 rounded-[50%] bg-black/60 blur-xl" />
                    <div className="tilt-wrap" style={{ transformStyle: "preserve-3d" }}>
                      <Object3D product={p} />
                    </div>
                  </button>
                </div>
              ))}
            </div>
          </div>

          <button type="button" onClick={() => go(-1)} aria-label="Previous product" className="absolute left-0 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:grid">‹</button>
          <button type="button" onClick={() => go(1)} aria-label="Next product" className="absolute right-0 top-1/2 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full border border-white/25 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand sm:grid">›</button>
        </div>

        <div className="mt-6 text-center" aria-live="polite">
          <h3 className="text-2xl font-bold">{active.name}</h3>
          <p className="mx-auto mt-2 max-w-md text-white/70">{active.tagline}</p>
          <p className="mt-2 font-semibold text-brand">{active.price !== null ? `${formatPrice(active.price)} ${active.priceNote ?? ""}` : "Price on request"}</p>
        </div>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button type="button" onClick={() => go(-1)} aria-label="Previous product" className="grid h-11 w-11 place-items-center rounded-full border border-white/25 sm:hidden">‹</button>
          <div role="tablist" aria-label="Choose product" className="flex gap-1">
            {items.map((p, i) => (
              <button key={p.id} role="tab" aria-selected={i === index} aria-label={p.shortName} onClick={() => setIndex(i)} className="grid h-11 w-8 place-items-center focus-visible:outline-none">
                <span className={`h-2 rounded-full transition-all ${i === index ? "w-7 bg-brand" : "w-2 bg-white/35"}`} />
              </button>
            ))}
          </div>
          <button type="button" onClick={() => go(1)} aria-label="Next product" className="grid h-11 w-11 place-items-center rounded-full border border-white/25 sm:hidden">›</button>
        </div>
      </div>
    </section>
  );
}
