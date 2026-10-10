import type { Metadata } from "next";
import { Customizer } from "@/components/Customizer";
import { Container } from "@/components/ui";
import type { CustomizeKind } from "@/config/customize";

export const metadata: Metadata = {
  title: "Customize your design",
  description: "Upload your artwork and preview it on a TapSpot NFC sign or business card before you order.",
};

export default async function CustomizePage({ searchParams }: { searchParams: Promise<{ product?: string }> }) {
  const { product } = await searchParams;
  const kind: CustomizeKind = product === "card" ? "card" : "sign";
  return (
    <Container className="py-14 sm:py-20">
      <h1 className="max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">See your design before you order.</h1>
      <p className="mt-4 max-w-xl text-lg text-mute">Upload your artwork, move it into place and preview it on your TapSpot sign or business card.</p>
      <div className="mt-12"><Customizer key={kind} initialKind={kind} /></div>
    </Container>
  );
}
