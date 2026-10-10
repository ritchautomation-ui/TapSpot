import type { Metadata } from "next";
import { storeConfig } from "@/config/store";
import { ContactActions, ContactCards } from "@/components/ContactActions";
import { Container } from "@/components/ui";
import { InquiryComposer } from "@/components/InquiryComposer";
import { cardPackages, growthBundle } from "@/data/packages";
import { getProduct } from "@/data/products";
import { formatPrice } from "@/lib/format";

export const metadata: Metadata = { title: "Contact TapSpot", description: "Talk to TapSpot about NFC displays, business cards and a setup for your local business." };
export default async function ContactPage({ searchParams }: { searchParams: Promise<{ offer?: string }> }) {
  const c = storeConfig.contact;
  const { offer } = await searchParams;
  const selection = cardPackages.find(p => p.id === offer) ?? (offer === growthBundle.id ? growthBundle : getProduct(offer || ""));
  const message = selection ? `Hello TapSpot! I'm interested in ${selection.name}${selection.price !== null ? ` (${formatPrice(selection.price)})` : ""}.\n\nMy name:\nMy business:\nMy location:\nQuantity:\n\nPlease confirm the inclusions, delivery and how to order.` : "Hello TapSpot! I would like to ask about your NFC products.\n\nMy name:\nMy business:\nMy location:\nProduct or service:\nQuantity:\n\nMy question:";
  return <Container className="py-16 sm:py-24">
    <p className="text-sm font-semibold uppercase tracking-widest text-brand">Contact TapSpot</p>
    <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-6xl">Let’s make it easier for customers to find you.</h1>
    <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">Tell us your business name, the product you’re interested in and how many you need. We’ll help with the next step.</p>
    <div className="mt-10 max-w-3xl space-y-5"><ContactCards /><ContactActions /></div>
    <div className="mt-10 max-w-3xl"><InquiryComposer key={offer || "general"} initialMessage={message} /></div>
    <dl className="mt-12 grid max-w-3xl gap-8 border-t border-line pt-8 sm:grid-cols-2">
      {c.phone && <div><dt className="text-sm text-mute">Phone</dt><dd className="mt-2 font-semibold"><a href={`tel:${c.phone.replace(/[^+\d]/g, "")}`}>{c.phone}</a></dd></div>}
      {storeConfig.serviceArea && <div><dt className="text-sm text-mute">Service area</dt><dd className="mt-2 font-semibold">{storeConfig.serviceArea}</dd></div>}
      {c.supportHours && <div><dt className="text-sm text-mute">Hours</dt><dd className="mt-2 font-semibold">{c.supportHours}</dd></div>}
    </dl>
  </Container>;
}
