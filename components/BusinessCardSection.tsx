import Image from "next/image";
import { ButtonLink, Container } from "./ui";

/** Phone mock of the digital profile. Placeholder content only, clearly a sample. */
export function ProfilePreview() {
  return (
    <div className="mx-auto w-60 rounded-[2rem] border-[6px] border-ink bg-white p-3 shadow-lift" role="img" aria-label="Sample digital profile on a phone">
      <div className="rounded-2xl bg-ink p-4 text-center text-white">
        <div className="mx-auto h-16 w-16 rounded-full bg-neutral-700 ring-2 ring-brand" />
        <p className="mt-3 font-bold">Your Name</p>
        <p className="text-xs text-white/70">Your title · Your business</p>
      </div>
      <div className="mt-3 grid gap-2 text-center text-xs font-semibold">
        <div className="rounded-full bg-brand py-2.5 text-white">Save contact</div>
        <div className="rounded-full border border-line py-2.5">Call</div>
        <div className="rounded-full border border-line py-2.5">Email</div>
        <div className="rounded-full border border-line py-2.5">Facebook · Instagram · LinkedIn</div>
      </div>
      <p className="mt-3 text-center text-[10px] text-mute">Sample layout</p>
    </div>
  );
}

export function BusinessCardSection() {
  return (
    <section id="business-card" className="bg-white py-20 sm:py-28">
      <Container className="grid items-center gap-12 lg:grid-cols-2">
        <div className="overflow-hidden rounded-3xl ring-1 ring-line shadow-card">
          <Image src="/images/business-cards.jpg" alt="TapSpot NFC business card, black front and light back" width={1536} height={1024} className="h-auto w-full" sizes="(min-width:1024px) 540px, 100vw" />
        </div>
        <div>
          <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">Your professional identity, one tap away.</h2>
          <p className="mt-4 text-lg leading-relaxed text-mute">
            A premium NFC card for dentists, realtors, insurance agents, freelancers and business owners. Tap it on a phone and your mobile profile opens, with your contact details and links ready to save.
          </p>
          <ol className="mt-8 grid grid-cols-3 gap-3 text-center text-sm font-semibold">
            <li className="rounded-2xl bg-paper p-4 ring-1 ring-line">Tap the card</li>
            <li className="rounded-2xl bg-paper p-4 ring-1 ring-line">Your profile opens</li>
            <li className="rounded-2xl bg-paper p-4 ring-1 ring-line">They connect</li>
          </ol>
          <div className="mt-8"><ButtonLink href="/products/nfc-business-card" variant="dark">Explore NFC business card</ButtonLink></div>
        </div>
      </Container>
    </section>
  );
}
