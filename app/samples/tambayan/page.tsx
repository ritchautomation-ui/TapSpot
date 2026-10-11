import type { Metadata } from "next";
import Link from "next/link";
import { RealTambayan } from "@/components/samples/RealTambayan";
import { Container, ButtonLink } from "@/components/ui";
import { cardPackages } from "@/data/packages";
import { formatPrice } from "@/lib/format";

// The café has agreed to be featured as a real example.
export const metadata: Metadata = { title: "Real example: Tambayan Coffee Shop" };

const shows = [
  "A real café’s page, with its real menu, hours and location",
  "Message, Email and Directions buttons that really work",
  "Menu split into categories, so customers find drinks fast",
  "An open or closed status that follows Philippine time",
  "Save contact, brand colors and the café’s own logo",
];

export default function RealExamplePage() {
  const business = cardPackages.find((p) => p.id === "business")!;
  return (
    <Container className="py-12 sm:py-16">
      <Link href="/business-card#card-packages" className="text-sm font-semibold">← Back to card packages</Link>
      <div className="mt-8 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
        <div className="lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">Real example</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Tambayan Coffee Shop</h1>
          <p className="mt-3 text-lg font-semibold">Business package style · {formatPrice(business.price)}</p>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-mute">This is how the page behind a tap could look for a real café in Porac, Pampanga. The details come from the café’s public Facebook page and Google Maps listing.</p>

          <h2 className="mt-8 text-lg font-bold">What this example shows</h2>
          <ul className="mt-3 space-y-2.5">
            {shows.map((s) => <li key={s} className="flex gap-3 text-[15px]"><span className="font-bold text-brand" aria-hidden>✓</span>{s}</li>)}
          </ul>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-mute">Try the buttons. They open the café’s real Messenger, email and map.</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/contact?offer=business" variant="primary">Ask about Business package</ButtonLink>
          </div>
          <nav aria-label="Other samples" className="mt-8 flex flex-wrap gap-2 text-sm font-semibold">
            {cardPackages.map((p) => (
              <Link key={p.id} href={`/samples/${p.id}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 hover:bg-paper">See {p.name} sample</Link>
            ))}
          </nav>
        </div>
        <RealTambayan />
      </div>
    </Container>
  );
}
