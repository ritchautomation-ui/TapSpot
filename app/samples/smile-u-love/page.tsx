import type { Metadata } from "next";
import Link from "next/link";
import { RealSmileULove } from "@/components/samples/RealSmileULove";
import { Container, ButtonLink } from "@/components/ui";
import { cardPackages } from "@/data/packages";

// The clinic has agreed to be featured as a real example.
export const metadata: Metadata = { title: "Real example: Smile U Love Dental Clinic" };

const shows = [
  "A real clinic’s page, with its real services, phone and location",
  "A booking form on the page itself: the request is saved and both the patient and the clinic get an email",
  "A staff page with a login, where the clinic confirms or declines each request",
  "Call, Message and Directions buttons that really work",
  "Services in plain language, so patients know what to ask for",
  "Save contact, the clinic’s brand colors and its own logo",
];

export default function SmileULovePage() {
  return (
    <Container className="py-12 sm:py-16">
      <Link href="/business-card#card-packages" className="text-sm font-semibold">← Back to card packages</Link>
      <div className="mt-8 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
        <div className="lg:sticky lg:top-24">
          <p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">Real example</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">Smile U Love Dental Clinic</h1>
          <p className="mt-3 text-lg font-semibold">Business package style</p>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-mute">This is how the page behind a tap could look for a real dental clinic in Porac, Pampanga. The details come from the clinic’s public Facebook page and Google Maps listing.</p>

          <h2 className="mt-8 text-lg font-bold">What this example shows</h2>
          <ul className="mt-3 space-y-2.5">
            {shows.map((s) => <li key={s} className="flex gap-3 text-[15px]"><span className="font-bold text-brand" aria-hidden>✓</span>{s}</li>)}
          </ul>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-mute">The phone preview uses a demo booking form. Open the separate booking system to explore the full appointment page, with staff review, rescheduling and email confirmations. Requests submitted there are saved and may send email notifications.</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="https://smileulove-booking.vercel.app" variant="dark">View booking system ↗</ButtonLink>
            <ButtonLink href="/contact?offer=business" variant="primary">Ask about Business package</ButtonLink>
          </div>
          <nav aria-label="Other samples" className="mt-8 flex flex-wrap gap-2 text-sm font-semibold">
            <Link href="/samples/tambayan" className="inline-flex min-h-11 items-center rounded-full border border-line px-4 hover:bg-paper">See café example</Link>
            {cardPackages.map((p) => (
              <Link key={p.id} href={`/samples/${p.id}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 hover:bg-paper">See {p.name} sample</Link>
            ))}
          </nav>
        </div>
        <RealSmileULove />
      </div>
    </Container>
  );
}
