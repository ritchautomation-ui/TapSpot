import type { Metadata } from "next";
import { NfcLinkGenerator } from "@/components/tools/NfcLinkGenerator";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "NFC Link Generator",
  description: "Find a business, generate its review link, and prepare your NFC tag.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <Container className="max-w-3xl py-12 sm:py-16">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">TapSpot NFC Link Generator</h1>
      <p className="mt-3 max-w-xl text-lg text-mute">Find a business, generate its review link, and prepare your NFC tag — all in one place.</p>
      <NfcLinkGenerator />
    </Container>
  );
}
