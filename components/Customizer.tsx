"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ACCEPTED_TYPES,
  MAX_UPLOAD_BYTES,
  customizeKinds,
  destinations,
  type CustomizeKind,
} from "@/config/customize";
import { formatPrice } from "@/lib/format";
import { isValidUrl } from "@/lib/validation";
import { NfcWaves } from "./Brand";
import { QuantitySelector } from "./QuantitySelector";
import { Button } from "./ui";

type Art = { url: string; name: string; w: number; h: number };
type Fit = "fit" | "fill";

const DEFAULTS = { fit: "fit" as Fit, zoom: 100, x: 0, y: 0, rot: 0 };

/** Width of the artwork as a % of the printable area, before the zoom is applied. */
function baseWidthPct(art: Art, areaAspect: number, fit: Fit) {
  const ri = art.w / art.h;
  const wider = ri >= areaAspect;
  const matchWidth = fit === "fit" ? wider : !wider;
  return matchWidth ? 100 : (ri / areaAspect) * 100;
}

function ArtLayer({ art, areaAspect, fit, zoom, x, y, rot }: { art: Art | null; areaAspect: number } & typeof DEFAULTS) {
  if (!art) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[#F4F4F5] p-3 text-center">
        <span className="text-[11px] font-semibold leading-snug text-[#737373] sm:text-xs">Your design will appear here</span>
      </div>
    );
  }
  const width = (baseWidthPct(art, areaAspect, fit) * zoom) / 100;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={art.url}
      alt="Your uploaded design"
      draggable={false}
      className="pointer-events-none absolute max-w-none select-none"
      style={{
        left: `${50 + x}%`,
        top: `${50 + y}%`,
        width: `${width}%`,
        height: "auto",
        transform: `translate(-50%, -50%) rotate(${rot}deg)`,
      }}
    />
  );
}

function Guides({ show }: { show: boolean }) {
  if (!show) return null;
  return <div aria-hidden className="pointer-events-none absolute inset-[5%] rounded-[3px] border border-dashed border-brand/90" />;
}

function SignPreview(props: { art: Art | null; guides: boolean } & typeof DEFAULTS) {
  const { areaAspect } = customizeKinds.sign;
  return (
    <div
      role="img"
      aria-label="Live preview of your custom TapSpot NFC sign"
      className="relative mx-auto aspect-[3/4] w-full max-w-[330px] overflow-hidden rounded-[7%/5%] bg-[#ffffff] shadow-lift ring-1 ring-black/10"
      style={{ containerType: "inline-size" }}
    >
      <div className="absolute inset-x-0 top-0 h-[62%] overflow-hidden bg-[#ffffff]">
        <ArtLayer art={props.art} areaAspect={areaAspect} fit={props.fit} zoom={props.zoom} x={props.x} y={props.y} rot={props.rot} />
        <Guides show={props.guides} />
      </div>
      <div className="absolute inset-x-0 bottom-0 flex h-[38%] flex-col items-center justify-center gap-[6%] bg-[#0A0A0A] px-[6%] text-center text-white">
        <div className="grid aspect-[16/10] w-[34%] place-items-center rounded-[50%] border-[3px] border-white">
          <NfcWaves className="h-[55%] text-white" />
        </div>
        <p className="whitespace-nowrap font-bold uppercase tracking-wider" style={{ fontSize: "6.5cqw" }}>
          Tap to <span className="text-brand">connect</span>
        </p>
      </div>
    </div>
  );
}

function CardPreview(props: { art: Art | null; guides: boolean } & typeof DEFAULTS) {
  const { areaAspect } = customizeKinds.card;
  return (
    <div className="mx-auto w-full max-w-[460px]">
      <div
        role="img"
        aria-label="Live preview of the front of your custom TapSpot NFC business card"
        className="relative aspect-[85.5/54] w-full overflow-hidden rounded-[4%/6.5%] bg-[#ffffff] shadow-lift ring-1 ring-black/10"
      >
        <ArtLayer art={props.art} areaAspect={areaAspect} fit={props.fit} zoom={props.zoom} x={props.x} y={props.y} rot={props.rot} />
        <Guides show={props.guides} />
      </div>
    </div>
  );
}

function Slider({ id, label, value, min, max, step = 1, unit, onChange, disabled }: {
  id: string; label: string; value: number; min: number; max: number; step?: number; unit: string; onChange: (n: number) => void; disabled?: boolean;
}) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-medium">{label}</label>
        <span className="text-sm tabular-nums text-mute">{value}{unit}</span>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 h-8 w-full cursor-pointer accent-brand disabled:cursor-not-allowed disabled:opacity-40"
      />
    </div>
  );
}

export function Customizer({ initialKind = "sign" }: { initialKind?: CustomizeKind }) {
  const router = useRouter();
  const uid = useId();
  const fileInput = useRef<HTMLInputElement>(null);

  const [kind, setKind] = useState<CustomizeKind>(initialKind);
  const [art, setArt] = useState<Art | null>(null);
  const [uploadError, setUploadError] = useState("");
  const [dragging, setDragging] = useState(false);

  const [fit, setFit] = useState<Fit>(DEFAULTS.fit);
  const [zoom, setZoom] = useState(DEFAULTS.zoom);
  const [x, setX] = useState(DEFAULTS.x);
  const [y, setY] = useState(DEFAULTS.y);
  const [rot, setRot] = useState(DEFAULTS.rot);
  const [guides, setGuides] = useState(false);

  const [destId, setDestId] = useState(destinations[initialKind][0].id);
  const [link, setLink] = useState("");
  const [linkTouched, setLinkTouched] = useState(false);
  const [qty, setQty] = useState(1);
  const [notes, setNotes] = useState("");

  const cfg = customizeKinds[kind];
  const dests = destinations[kind];
  const dest = dests.find((d) => d.id === destId) ?? dests[0];

  // Free the blob URL when the image changes or the page closes.
  const artUrl = art?.url;
  useEffect(() => () => { if (artUrl) URL.revokeObjectURL(artUrl); }, [artUrl]);

  const resetPlacement = useCallback(() => { setFit(DEFAULTS.fit); setZoom(DEFAULTS.zoom); setX(DEFAULTS.x); setY(DEFAULTS.y); setRot(DEFAULTS.rot); }, []);

  const loadFile = useCallback((file: File | undefined | null) => {
    if (!file) return;
    if (!ACCEPTED_TYPES.includes(file.type)) { setUploadError("Please upload a PNG, JPG or WEBP image."); return; }
    if (file.size > MAX_UPLOAD_BYTES) { setUploadError("That file is over 10 MB. Please upload a smaller image."); return; }
    const url = URL.createObjectURL(file);
    const probe = new Image();
    probe.onload = () => {
      setUploadError("");
      setArt({ url, name: file.name, w: probe.naturalWidth, h: probe.naturalHeight });
      resetPlacement();
    };
    probe.onerror = () => { URL.revokeObjectURL(url); setUploadError("We couldn't read that image. Try another file."); };
    probe.src = url;
  }, [resetPlacement]);

  const removeArt = () => { setArt(null); setUploadError(""); resetPlacement(); if (fileInput.current) fileInput.current.value = ""; };

  const switchKind = (k: CustomizeKind) => {
    if (k === kind) return;
    setKind(k);
    setDestId(destinations[k][0].id);
    setLink("");
    setLinkTouched(false);
  };

  const linkError = (() => {
    if (!dest.needsLink) return "";
    const v = link.trim();
    if (!v) return "Enter the link you want the NFC to open.";
    if (!isValidUrl(v)) return "Use a full link starting with https://";
    if (dest.hosts) {
      const host = new URL(v).hostname.toLowerCase();
      if (!dest.hosts.some((h) => host.includes(h))) return dest.hostMessage ?? "That link doesn't look right.";
    }
    return "";
  })();
  const canRequest = !linkError;

  const request = () => {
    setLinkTouched(true);
    if (!canRequest) return;
    const p = new URLSearchParams({ custom: kind, dest: dest.id, qty: String(qty) });
    if (dest.needsLink) p.set("link", link.trim());
    if (notes.trim()) p.set("notes", notes.trim().slice(0, 500));
    if (art) {
      p.set("art", art.name.slice(0, 120));
      p.set("place", `${fit === "fit" ? "Fit" : "Fill"}, zoom ${zoom}%, position X ${x} / Y ${y}, rotation ${rot}°`);
    }
    router.push(`/contact?${p.toString()}`);
  };

  const preview = { art, guides, fit, zoom, x, y, rot };
  const noArt = !art;
  const field = "block w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-base text-ink placeholder:text-neutral-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand";
  const seg = (on: boolean) => `inline-flex min-h-11 flex-1 items-center justify-center rounded-full px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${on ? "bg-ink text-white" : "text-ink hover:bg-black/5"}`;

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-14">
      {/* Preview */}
      <div className="lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-3xl bg-paper p-6 ring-1 ring-line sm:p-10">
          {kind === "sign" ? <SignPreview {...preview} /> : <CardPreview {...preview} />}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-mute">
          {cfg.blurb} Final print placement may be adjusted before production.
        </p>
        <label className="mt-3 inline-flex min-h-11 cursor-pointer items-center gap-3 text-sm font-medium">
          <input type="checkbox" checked={guides} onChange={(e) => setGuides(e.target.checked)} className="h-5 w-5 accent-brand" />
          Show safe-area guide
        </label>
      </div>

      {/* Controls */}
      <div className="space-y-8">
        <div role="group" aria-label="What are you customizing?" className="flex gap-1 rounded-full border border-line bg-white p-1">
          {(Object.keys(customizeKinds) as CustomizeKind[]).map((k) => (
            <button key={k} type="button" aria-pressed={kind === k} onClick={() => switchKind(k)} className={seg(kind === k)}>
              {customizeKinds[k].label}
            </button>
          ))}
        </div>

        <section aria-labelledby={`${uid}-up`}>
          <h2 id={`${uid}-up`} className="text-xl font-bold">1. Upload your design</h2>
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); loadFile(e.dataTransfer.files?.[0]); }}
            className={`mt-4 rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${dragging ? "border-brand bg-brand-soft" : "border-neutral-300"}`}
          >
            <p className="text-[15px] font-medium">{art ? art.name : "Drag and drop your artwork here"}</p>
            <p className="mt-1 text-sm text-mute">PNG, JPG or WEBP, up to 10 MB</p>
            <div className="mt-4 flex flex-wrap justify-center gap-3">
              <Button type="button" variant="dark" onClick={() => fileInput.current?.click()}>{art ? "Replace image" : "Choose image"}</Button>
              {art && <Button type="button" variant="outline" onClick={removeArt}>Remove</Button>}
            </div>
            <input ref={fileInput} type="file" accept={ACCEPTED_TYPES.join(",")} className="sr-only" aria-label="Upload your design" onChange={(e) => loadFile(e.target.files?.[0])} />
          </div>
          {uploadError && <p role="alert" className="mt-2 text-sm font-medium text-red-700">{uploadError}</p>}
          <p className="mt-2 text-sm text-mute">Only upload artwork you have permission to use. Your image stays on your device until you send it to us on Messenger.</p>
        </section>

        <section aria-labelledby={`${uid}-adj`}>
          <h2 id={`${uid}-adj`} className="text-xl font-bold">2. Adjust it</h2>
          <div className="mt-4 space-y-4">
            <div role="group" aria-label="Fit or fill" className="flex gap-1 rounded-full border border-line p-1">
              <button type="button" disabled={noArt} aria-pressed={fit === "fit"} onClick={() => setFit("fit")} className={`${seg(fit === "fit")} disabled:opacity-40`}>Fit</button>
              <button type="button" disabled={noArt} aria-pressed={fit === "fill"} onClick={() => setFit("fill")} className={`${seg(fit === "fill")} disabled:opacity-40`}>Fill</button>
            </div>
            <Slider id={`${uid}-zoom`} label="Zoom" value={zoom} min={25} max={300} unit="%" onChange={setZoom} disabled={noArt} />
            <Slider id={`${uid}-x`} label="Horizontal position" value={x} min={-50} max={50} unit="" onChange={setX} disabled={noArt} />
            <Slider id={`${uid}-y`} label="Vertical position" value={y} min={-50} max={50} unit="" onChange={setY} disabled={noArt} />
            <Slider id={`${uid}-rot`} label="Rotation" value={rot} min={-180} max={180} unit="°" onChange={setRot} disabled={noArt} />
            <div className="flex flex-wrap gap-3">
              <Button type="button" variant="outline" disabled={noArt} onClick={() => { setX(0); setY(0); }}>Center design</Button>
              <Button type="button" variant="outline" disabled={noArt} onClick={resetPlacement}>Reset</Button>
            </div>
          </div>
        </section>

        <section aria-labelledby={`${uid}-ord`}>
          <h2 id={`${uid}-ord`} className="text-xl font-bold">3. Order details</h2>
          <div className="mt-4 space-y-5">
            <fieldset>
              <legend className="mb-2 text-sm font-medium">Where should the NFC open?</legend>
              <div className="flex flex-wrap gap-2">
                {dests.map((d) => (
                  <button key={d.id} type="button" aria-pressed={d.id === dest.id}
                    onClick={() => { setDestId(d.id); setLink(""); setLinkTouched(false); }}
                    className={`inline-flex min-h-11 items-center rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand ${d.id === dest.id ? "border-brand bg-brand-soft text-ink" : "border-neutral-300 hover:border-ink"}`}>
                    {d.label}
                  </button>
                ))}
              </div>
            </fieldset>

            {dest.needsLink ? (
              <div>
                <label htmlFor={`${uid}-link`} className="mb-1.5 block text-sm font-medium">Link</label>
                <input id={`${uid}-link`} type="url" inputMode="url" value={link} placeholder={dest.placeholder}
                  onChange={(e) => setLink(e.target.value)} onBlur={() => setLinkTouched(true)}
                  aria-invalid={linkTouched && !!linkError} aria-describedby={linkTouched && linkError ? `${uid}-link-err` : undefined}
                  className={`${field} ${linkTouched && linkError ? "!border-red-600" : ""}`} />
                {linkTouched && linkError && <p id={`${uid}-link-err`} role="alert" className="mt-1.5 text-sm font-medium text-red-700">{linkError}</p>}
              </div>
            ) : (
              <p className="rounded-xl bg-brand-soft p-4 text-sm leading-relaxed">We’ll build your mobile profile page (photo, contact details, social links and Save Contact) and point the card to it. We’ll ask for your details by message.</p>
            )}

            <div className="flex flex-wrap items-center gap-4">
              <QuantitySelector value={qty} onChange={setQty} />
              <p className="text-sm text-mute">Need many? Message us about bulk orders.</p>
            </div>

            <div>
              <label htmlFor={`${uid}-notes`} className="mb-1.5 block text-sm font-medium">Special instructions <span className="font-normal text-mute">(optional)</span></label>
              <textarea id={`${uid}-notes`} rows={3} maxLength={500} value={notes} onChange={(e) => setNotes(e.target.value)}
                placeholder="Colors, text to add, anything we should know" className={field} />
            </div>
          </div>
        </section>

        <div className="rounded-3xl border border-line p-5 sm:p-6">
          <p className="text-3xl font-bold tabular-nums">{formatPrice(cfg.price)} <span className="text-base font-normal text-mute">{cfg.priceNote}</span></p>
          {qty > 1 && <p className="mt-1 text-sm text-mute">{qty} × {formatPrice(cfg.price)} = <span className="font-semibold text-ink">{formatPrice(cfg.price * qty)}</span>, delivery confirmed by message.</p>}
          <Button type="button" variant="primary" onClick={request} aria-disabled={!canRequest} className={`mt-5 w-full ${canRequest ? "" : "opacity-50"}`}>Request this design</Button>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            This opens a ready-made message to TapSpot. Send your artwork file with it on Messenger, then we’ll confirm the final layout, delivery and payment with you. No payment is collected on this website.
          </p>
        </div>
      </div>
    </div>
  );
}
