import type { Metadata } from "next";
import { FaqList } from "@/components/FaqList";
import { Container } from "@/components/ui";
import { faqs } from "@/data/faq";

export const metadata: Metadata = { title: "FAQ", description: "Answers about TapSpot NFC products, setup, shipping and ordering." };

export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org", "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  return (
    <Container className="max-w-3xl py-14 sm:py-20">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <h1 className="mb-10 text-5xl font-bold tracking-tight">Frequently asked questions</h1>
      <FaqList />
    </Container>
  );
}
