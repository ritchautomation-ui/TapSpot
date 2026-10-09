import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { cardPackages } from '@/data/packages';
import { SampleProfile } from '@/components/SampleProfile';
export function generateStaticParams() { return cardPackages.map(p => ({ slug: p.id })); }
export const metadata: Metadata = { title: 'TapSpot card sample', robots: { index: false, follow: true } };
export default async function SamplePage({ params }: { params: Promise<{ slug: string }> }) {
 const { slug } = await params;
 const item = cardPackages.find(p => p.id === slug);
 if (!item) notFound();
 return <div className="bg-paper px-5 py-12 sm:py-16"><div className="mx-auto max-w-xl">
   <Link href="/business-card#card-packages" className="text-sm font-semibold">← Back to card packages</Link>
   <p className="mb-7 mt-6 text-sm text-mute">Interactive {item.name} sample · Example content</p>
   <SampleProfile variant={slug} />
   <p className="mt-6 text-sm leading-relaxed text-mute">Your final page uses your name, photos, links and business details. Sample actions demonstrate the experience and do not call or message anyone.</p>
   <Link href={`/contact?offer=${slug}`} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-white">Ask about the {item.name} package ↗</Link>
 </div></div>;
}
