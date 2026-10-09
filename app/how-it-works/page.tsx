import type { Metadata } from "next";
import { HowItWorks, TapDemo } from "@/components/HowItWorks";
import { Container, ButtonLink } from "@/components/ui";

export const metadata: Metadata = { title: "How it works", description: "Tap, open, connect. How TapSpot NFC products work, and how we set up your order." };

const process = [
  "You choose a product and enter your business details and link.",
  "You check out. We review your setup details.",
  "We message you the payment details.",
  "We program the NFC chip and test it.",
  "We pack and ship your order.",
];

export default function Page() {
  return (
    <>
      <Container className="pt-14 sm:pt-20"><h1 className="max-w-2xl text-5xl font-bold tracking-tight">How TapSpot works.</h1></Container>
      <HowItWorks heading="What your customer does" />
      <TapDemo />
      <section className="bg-paper py-20">
        <Container>
          <h2 className="text-4xl font-bold tracking-tight">What happens when you order</h2>
          <ol className="mt-10 max-w-2xl space-y-4">
            {process.map((s, i) => (
              <li key={s} className="flex gap-4"><span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-ink font-bold text-white">{i + 1}</span><span className="pt-1.5 text-lg">{s}</span></li>
            ))}
          </ol>
          <ButtonLink href="/products" className="mt-10">Shop NFC products</ButtonLink>
        </Container>
      </section>
    </>
  );
}
