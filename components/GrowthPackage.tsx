import Link from 'next/link';
import { growthBundle } from '@/data/packages';
import { getProduct } from '@/data/products';
import { formatPrice } from '@/lib/format';
import { ProductArtwork } from './ProductArtwork';
import { Container } from './ui';
export function GrowthPackage() {
  return <section className="bg-paper py-16 sm:py-20"><Container>
    <div className="grid overflow-hidden rounded-3xl border border-line bg-white lg:grid-cols-2">
      <ProductArtwork product={getProduct('google-facebook-bundle')!} className="aspect-[4/3] w-full" />
      <div className="p-7 sm:p-10"><p className="text-xs font-semibold uppercase tracking-widest text-brand">For local businesses</p>
        <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{growthBundle.name}</h2>
        <p className="mt-4 leading-relaxed text-mute">{growthBundle.description}</p>
        <ul className="mt-6 space-y-3">{growthBundle.includes.map(item => <li key={item} className="flex gap-3"><span className="text-brand" aria-hidden>✓</span>{item}</li>)}</ul>
        <p className="mt-6 text-2xl font-bold">{growthBundle.price === null ? 'Request a quote' : formatPrice(growthBundle.price)}</p>
        <p className="mt-2 text-sm text-mute">Ask about the follower service, scope and delivery details before ordering.</p>
        <Link href={`/contact?offer=${growthBundle.id}`} className="mt-6 inline-flex min-h-12 items-center rounded-full bg-ink px-6 font-semibold text-white">Ask about this package <span className="ml-4" aria-hidden>↗</span></Link>
      </div>
    </div>
  </Container></section>;
}
