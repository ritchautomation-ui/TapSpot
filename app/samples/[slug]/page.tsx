import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SampleBusiness } from "@/components/samples/SampleBusiness";
import { SampleExecutive } from "@/components/samples/SampleExecutive";
import { SampleStarter } from "@/components/samples/SampleStarter";
import { Container, ButtonLink } from "@/components/ui";
import { cardPackages } from "@/data/packages";

export function generateStaticParams() { return cardPackages.map((p) => ({ slug: p.id })); }
export const metadata: Metadata = { title: "TapSpot card sample", robots: { index: false, follow: true } };

const demo: Record<string, { who: string; shows: string[]; Sample: () => React.JSX.Element }> = {
  starter: {
    who: "Marco Reyes, a real estate broker",
    shows: ["Your photo or initials, name and title", "Save Contact, Call and Email buttons", "Links to your Facebook, Instagram, website and more"],
    Sample: SampleStarter,
  },
  business: {
    who: "Bahay Kape, a neighborhood café",
    shows: ["Everything in Starter", "Sections customers can switch between: About, Menu and Location", "Opening hours, directions and a Google review button", "Your brand colors"],
    Sample: SampleBusiness,
  },
  executive: {
    who: "Aria Reyes Studio, a wedding photographer",
    shows: ["A page designed around your brand, not a template", "Animated intro, photo gallery and rotating testimonials", "Packages with prices and a booking button", "Your own sections, wording and style"],
    Sample: SampleExecutive,
  },
};

export default async function SamplePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const item = cardPackages.find((p) => p.id === slug);
  const d = demo[slug];
  if (!item || !d) notFound();
  const Sample = d.Sample;

  return (
    <Container className="py-12 sm:py-16">
      <Link href="/business-card#card-packages" className="text-sm font-semibold">← Back to card packages</Link>
      <div className="mt-8 grid items-start gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,420px)] lg:gap-16">
        <div className="lg:sticky lg:top-24">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{item.name} package sample</h1>
          <p className="mt-4 max-w-md text-lg leading-relaxed text-mute">This is how the page behind your tap could look for {d.who}. It’s an example, so the people and businesses are made up.</p>

          <h2 className="mt-8 text-lg font-bold">What this sample shows</h2>
          <ul className="mt-3 space-y-2.5">
            {d.shows.map((s) => <li key={s} className="flex gap-3 text-[15px]"><span className="font-bold text-brand" aria-hidden>✓</span>{s}</li>)}
          </ul>
          <p className="mt-6 max-w-md text-sm leading-relaxed text-mute">Try the buttons. They show what would happen on a live page and don’t call or message anyone.</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href={`/contact?offer=${item.id}`} variant="primary">Ask about {item.name}</ButtonLink>
          </div>
          <nav aria-label="Other samples" className="mt-8 flex flex-wrap gap-2 text-sm font-semibold">
            {cardPackages.filter((p) => p.id !== slug).map((p) => (
              <Link key={p.id} href={`/samples/${p.id}`} className="inline-flex min-h-11 items-center rounded-full border border-line px-4 hover:bg-paper">See {p.name} sample</Link>
            ))}
          </nav>
        </div>
        <Sample />
      </div>
    </Container>
  );
}
