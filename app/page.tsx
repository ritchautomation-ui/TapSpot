import Link from "next/link";
import { BusinessCardSection } from "@/components/BusinessCardSection";
import { FaqList } from "@/components/FaqList";
import { Hero } from "@/components/Hero";
import { HowItWorks, TapDemo } from "@/components/HowItWorks";
import { ProductGrid } from "@/components/ProductGrid";
import { ResellerCTA } from "@/components/ResellerCTA";
import { RotatingShowcase } from "@/components/RotatingShowcase";
import { Testimonials } from "@/components/Testimonials";
import { UseCases } from "@/components/UseCases";
import { Container } from "@/components/ui";

export default function HomePage() {
  return (
    <>
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
      <TapDemo />
      <BusinessCardSection />
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
    </>
  );
}
