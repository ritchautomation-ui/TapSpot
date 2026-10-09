import Image from "next/image";
import { ButtonLink, Container } from "./ui";
import { NfcWaves } from "./Brand";

export function Hero() {
  return (
    <section className="overflow-hidden bg-white">
      <Container className="grid items-center gap-10 py-12 sm:py-16 lg:grid-cols-[1.05fr_1fr] lg:py-24">
        <div>
          <h1 className="text-[2.6rem] font-extrabold leading-[1.02] tracking-tight sm:text-6xl lg:text-7xl">
            Turn every customer into a reviewer.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-neutral-600">
            Smart NFC solutions that make it easier for customers to connect, review and engage with your business. One tap opens your Google review page or Facebook page.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink href="/products" variant="primary">Shop NFC products</ButtonLink>
            <ButtonLink href="/how-it-works" variant="outline">See how it works</ButtonLink>
          </div>
          <p className="mt-6 text-sm text-mute">NFC Google Review and NFC Facebook from ₱1,000. Both together for ₱1,500.</p>
        </div>
        <div className="relative">
          <div className="overflow-hidden rounded-[2rem] shadow-lift ring-1 ring-black/10">
            <Image src="/images/hero-scene.jpg" alt="Customer tapping a phone on a TapSpot NFC display to open a Google review page" width={1175} height={725} priority sizes="(min-width:1024px) 520px, 100vw" className="h-auto w-full" />
          </div>
          <div className="absolute -bottom-4 left-4 flex items-center gap-3 rounded-2xl bg-ink px-4 py-3 text-white shadow-lift sm:left-8">
            <NfcWaves className="h-7 w-7 text-brand" />
            <p className="text-sm font-semibold">Tap. Review. Done.</p>
          </div>
        </div>
      </Container>
    </section>
  );
}
