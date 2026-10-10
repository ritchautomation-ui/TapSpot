import type { Metadata } from "next";
import { storeConfig } from "@/config/store";
import { ContactActions, ContactCards } from "@/components/ContactActions";
import { Container } from "@/components/ui";
import { InquiryComposer } from "@/components/InquiryComposer";
import { cardPackages, growthBundle } from "@/data/packages";
import { getProduct } from "@/data/products";
import { formatPrice } from "@/lib/format";
import { customizeKinds, destinations, type CustomizeKind } from "@/config/customize";

type Params = { offer?: string; custom?: string; dest?: string; link?: string; qty?: string; notes?: string; art?: string; place?: string };

/** Builds the ready-made message for a request that came from /customize. Returns null for anything unexpected. */
function customMessage(q: Params): string | null {
  if (q.custom !== "sign" && q.custom !== "card") return null;
  const kind = q.custom as CustomizeKind;
  const cfg = customizeKinds[kind];
  const dest = destinations[kind].find(d => d.id === q.dest);
  if (!dest) return null;
  const qty = Math.min(999, Math.max(1, parseInt(q.qty ?? "1", 10) || 1));
  const clip = (v: string | undefined, n: number) => (v ?? "").replace(/\s+/g, " ").trim().slice(0, n);
  const lines = [
    `Hello TapSpot! I would like to request a design for the ${cfg.productName} (${formatPrice(cfg.price)} ${cfg.priceNote}).`,
    "",
    `Quantity: ${qty}`,
    `NFC opens: ${dest.label}${dest.needsLink ? ` - ${clip(q.link, 500)}` : ""}`,
    q.art ? `Artwork file: ${clip(q.art, 120)} (I will send the file here on Messenger)` : "Artwork file: I do not have one yet, please advise",
    ...(q.art && q.place ? [`Placement in the preview: ${clip(q.place, 120)}`] : []),
    `Special instructions: ${clip(q.notes, 500) || "None"}`,
    "",
    "My name:",
    "My business:",
    "My location:",
  ];
  return lines.join("\n");
}

export const metadata: Metadata = { title: "Contact TapSpot", description: "Talk to TapSpot about NFC displays, business cards and a setup for your local business." };
export default async function ContactPage({ searchParams }: { searchParams: Promise<Params> }) {
  const c = storeConfig.contact;
  const params = await searchParams;
  const { offer } = params;
  const custom = customMessage(params);
  const selection = cardPackages.find(p => p.id === offer) ?? (offer === growthBundle.id ? growthBundle : getProduct(offer || ""));
  const message = custom ?? (selection ? `Hello TapSpot! I'm interested in ${selection.name}${selection.price !== null ? ` (${formatPrice(selection.price)})` : ""}.\n\nMy name:\nMy business:\nMy location:\nQuantity:\n\nPlease confirm the inclusions, delivery and how to order.` : "Hello TapSpot! I would like to ask about your NFC products.\n\nMy name:\nMy business:\nMy location:\nProduct or service:\nQuantity:\n\nMy question:");
  return <Container className="py-16 sm:py-24">
    <p className="text-sm font-semibold uppercase tracking-widest text-brand">Contact TapSpot</p>
    <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Let’s make it easier for customers to find you.</h1>
    <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">Tell us your business name, the product you’re interested in and how many you need. We’ll help with the next step.</p>
    <div className="mt-10 max-w-3xl space-y-5"><ContactCards /><ContactActions /></div>
    {custom && <p className="mt-8 max-w-3xl rounded-2xl bg-brand-soft p-4 text-[15px] leading-relaxed"><strong>Next step:</strong> send this message on Messenger, then attach your artwork file in the same chat. Websites can’t send the file for you.</p>}
    <div className="mt-10 max-w-3xl"><InquiryComposer key={custom ? `custom-${params.custom}-${params.dest}` : offer || "general"} initialMessage={message} /></div>
    <dl className="mt-12 grid max-w-3xl gap-8 border-t border-line pt-8 sm:grid-cols-2">
      {c.phone && <div><dt className="text-sm text-mute">Phone</dt><dd className="mt-2 font-semibold"><a href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}>{c.phone}</a></dd></div>}
      {storeConfig.serviceArea && <div><dt className="text-sm text-mute">Service area</dt><dd className="mt-2 font-semibold">{storeConfig.serviceArea}</dd></div>}
      {c.supportHours && <div><dt className="text-sm text-mute">Hours</dt><dd className="mt-2 font-semibold">{c.supportHours}</dd></div>}
    </dl>
  </Container>;
}
