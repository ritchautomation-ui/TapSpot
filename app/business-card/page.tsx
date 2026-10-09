import type { Metadata } from "next";
import { BusinessCardSection, ProfilePreview } from "@/components/BusinessCardSection";
import { Container, ButtonLink } from "@/components/ui";

export const metadata: Metadata = {
  title: "NFC Digital Business Card",
  description: "A premium NFC business card that opens your mobile profile with one tap.",
};

const fields = ["Name and job title", "Business name and logo", "Photo and short bio", "Call, email and Save Contact buttons", "Facebook, Instagram, TikTok, LinkedIn, website", "Portfolio or services links"];

export default function Page() {
  return (
    <>
      <BusinessCardSection />
      <section className="bg-paper py-20 sm:py-24">
        <Container className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">A mini website for you, opened by a tap.</h2>
            <p className="mt-4 text-lg text-mute">The card stays clean and generic. Everything personal lives on your mobile profile, so it looks sharp on any phone.</p>
            <ul className="mt-6 space-y-2.5">{fields.map((f) => <li key={f} className="flex gap-3"><span className="font-bold text-brand" aria-hidden>✓</span>{f}</li>)}</ul>
            <ButtonLink href="/products/nfc-business-card" variant="dark" className="mt-8">Explore NFC business card</ButtonLink>
          </div>
          <ProfilePreview />
        </Container>
      </section>
    </>
  );
}
