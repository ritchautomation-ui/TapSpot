import Link from "next/link";
import { storeConfig } from "@/config/store";
import { ContactActions } from "./ContactActions";
import { Container } from "./ui";

export function ContactSection() {
  return <section id="contact" className="bg-ink py-20 text-white sm:py-24">
    <Container className="grid gap-10 lg:grid-cols-[1.2fr_1fr] lg:items-center">
      <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">Let’s talk about your business</p>
        <h2 className="mt-4 max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">Your next customer connection starts here.</h2>
        <p className="mt-5 max-w-lg leading-relaxed text-white/65">Tell us what you do and where you want a tap to take your customers. We’ll help you choose your TapSpot and prepare the links for your setup.</p>
        {storeConfig.serviceArea && <p className="mt-5 text-sm text-white/80">Serving {storeConfig.serviceArea}</p>}
      </div>
      <div className="space-y-6"><ContactActions dark />
        <p className="text-sm text-white/60">For product questions, business card profiles and orders for your team.</p>
        <Link href="/contact" className="inline-block py-3 text-sm underline underline-offset-4">All contact details →</Link>
      </div>
    </Container>
  </section>;
}
