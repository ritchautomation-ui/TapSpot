import Link from "next/link";
import { ContactSection } from "@/components/ContactSection";
import { GrowthPackage } from "@/components/GrowthPackage";
import { BusinessCardSection } from "@/components/BusinessCardSection";
import { FaqList } from "@/components/FaqList";
import { Hero } from "@/components/Hero";
import { HowItWorks } from "@/components/HowItWorks";
import { ProductGrid } from "@/components/ProductGrid";
import { ResellerCTA } from "@/components/ResellerCTA";
import { RotatingShowcase } from "@/components/RotatingShowcase";
import TapSpotDemo from "@/components/TapSpotDemo";
import { Testimonials } from "@/components/Testimonials";
import { UseCases } from "@/components/UseCases";
import { Container } from "@/components/ui";
import { storeConfig } from "@/config/store";

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: storeConfig.brandName,
  url: storeConfig.siteUrl,
  logo: `${storeConfig.siteUrl}/images/icon.png`,
  description: "NFC review displays and digital business cards for local businesses in the Philippines.",
  ...(storeConfig.contact.facebookUrl && { sameAs: [storeConfig.contact.facebookUrl] }),
};

export default function HomePage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }} />
      <Hero />
      <RotatingShowcase />
      <section id="products" className="bg-white py-20 sm:py-24">
        <Container>
          <h2 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Ready-to-use NFC for your business.</h2>
          <p className="mt-4 max-w-xl text-lg text-mute">We set up and test every product with your details before it ships.</p>
          <div className="mt-12"><ProductGrid /></div>
        </Container>
      </section>
      <HowItWorks />
      <TapSpotDemo ctaHref="/products" ctaLabel="Shop NFC products" />
      <BusinessCardSection />
      <GrowthPackage />
      <UseCases />
      <Testimonials />
      <section className="bg-white py-20 sm:py-24">
        <Container className="grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <div>
            <h2 className="text-4xl font-bold tracking-tight">Questions, answered.</h2>
            <Link href="/faq" className="mt-4 inline-block font-semibold underline underline-offset-4">See all FAQs</Link>
          </div>
          <FaqList homeOnly />
        </Container>
      </section>
      <ResellerCTA />
      <ContactSection />
    </>
  );
}
