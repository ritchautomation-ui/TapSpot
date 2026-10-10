import type { Metadata } from "next";
import { ProductGrid } from "@/components/ProductGrid";
import { ResellerCTA } from "@/components/ResellerCTA";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Products",
  description: "NFC Google Review, NFC Facebook, Google + Facebook bundle, custom branded NFC signs and NFC digital business cards from TapSpot.",
};

export default function ProductsPage() {
  return (
    <>
      <Container className="py-14 sm:py-20">
        <h1 className="text-5xl font-bold tracking-tight">Choose your TapSpot.</h1>
        <p className="mt-4 max-w-xl text-lg text-mute">Pick what you want customers to do with one tap.</p>
        <div className="mt-12"><ProductGrid /></div>
      </Container>
      <ResellerCTA />
    </>
  );
}
