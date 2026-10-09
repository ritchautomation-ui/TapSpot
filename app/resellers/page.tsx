import type { Metadata } from "next";
import { Container, ButtonLink } from "@/components/ui";


export const metadata: Metadata = { title: "Become a reseller", description: "Bulk orders and reseller options for TapSpot NFC products." };

export default function Page() {
  return (
    <Container className="max-w-3xl py-14 sm:py-24">
      <h1 className="text-5xl font-bold tracking-tight">Interested in bulk orders or reselling TapSpot?</h1>
      <p className="mt-5 text-lg leading-relaxed text-mute">
        If you pitch to local businesses, TapSpot can help you offer NFC review displays and digital business cards. Message us with what you have in mind, like how many units and what kind of businesses you serve, and we'll get back to you.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink href="/contact">Contact TapSpot</ButtonLink>
        <ButtonLink href="/contact" variant="outline">Request a quote</ButtonLink>
      </div>
    </Container>
  );
}

