import Image from 'next/image';
import Link from 'next/link';
import { cardPackages } from '@/data/packages';
import { formatPrice } from '@/lib/format';
import { Container } from './ui';

export function ProfilePreview({ variant = 'starter' }: { variant?: string }) {
  const dark = variant === 'executive';
  return <div className={`mx-auto w-52 overflow-hidden rounded-[2rem] border-[5px] border-neutral-800 shadow-xl ${dark ? 'bg-neutral-950 text-white' : 'bg-white text-ink'}`} role="img" aria-label={`${variant} sample digital profile`}>
    <div className={`px-5 pb-5 pt-7 ${variant === 'business' ? 'bg-brand' : dark ? 'bg-neutral-900' : 'bg-paper'}`}>
      <div className="mb-5 h-1 w-9 rounded-full bg-current opacity-20" />
      <div className={`grid h-12 w-12 place-items-center rounded-full text-sm font-bold ${dark ? 'bg-brand text-ink' : 'bg-ink text-white'}`}>TS</div>
      <p className="mt-4 text-lg font-bold">{variant === 'starter' ? 'Your Name' : 'Your Business'}</p>
      <p className="mt-1 text-[10px] opacity-65">{variant === 'starter' ? 'Your title · Your company' : 'Local business. Lasting connections.'}</p>
    </div>
    <div className="space-y-2 p-4 text-center text-[10px] font-semibold">
      <div className={`rounded-full py-2.5 ${dark ? 'bg-brand text-ink' : 'bg-ink text-white'}`}>Save contact</div>
      <div className="grid grid-cols-2 gap-2"><div className="rounded-lg border border-current/20 py-2">Call</div><div className="rounded-lg border border-current/20 py-2">Email</div></div>
      {variant !== 'starter' && <div className="rounded-lg border border-current/20 px-3 py-4 text-left"><span className="block opacity-50">EXPLORE</span><span className="mt-2 block">{dark ? 'Our story & selected work' : 'Services & business details'}</span></div>}
      <p className="pt-3 text-[9px] font-normal opacity-50">Powered by TapSpot · Sample</p>
    </div>
  </div>;
}

export function BusinessCardSection() {
 return <section id="business-card" className="bg-white py-20 sm:py-28"><Container>
   <div className="grid items-center gap-10 lg:grid-cols-2">
     <div className="overflow-hidden rounded-3xl bg-paper"><Image src="/images/business-cards.jpg" alt="TapSpot NFC business cards in black and white" width={1536} height={1024} className="h-auto w-full" sizes="(min-width:1024px) 540px, 100vw" /></div>
     <div><p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">TapSpot digital business cards</p>
       <h2 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl">Your profile or business.<br />One tap away.</h2>
       <p className="mt-5 text-lg leading-relaxed text-mute">A physical NFC card opens your digital page on a compatible phone. Share your details, introduce your business and give people a simple way to reach you.</p>
       <div className="mt-6 flex flex-wrap gap-2 text-xs font-semibold">{['NFC-enabled card','Mobile-friendly page','Contact & social links'].map(t => <span key={t} className="rounded-full border border-line px-3 py-2">{t}</span>)}</div>
       <Link href="#card-packages" className="mt-7 inline-block py-3 font-semibold underline underline-offset-4">Choose your card experience ↓</Link>
     </div>
   </div>
   <div id="card-packages" className="mt-20 scroll-mt-24">
     <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-semibold uppercase tracking-[.18em] text-brand">Powered by your TapSpot card</p><h3 className="mt-3 max-w-lg text-3xl font-bold tracking-tight sm:text-4xl">Choose the page behind the tap.</h3></div><p className="max-w-sm text-sm leading-relaxed text-mute">From a simple contact page to a custom business experience. Explore a sample, then message us to get started.</p></div>
     <div className="mt-10 grid gap-6 md:grid-cols-3">{cardPackages.map(p => <article key={p.id} className={`flex flex-col overflow-hidden rounded-3xl border ${p.id === 'business' ? 'border-brand' : 'border-line'}`}>
       <div className={`relative h-[310px] overflow-hidden px-5 pt-7 ${p.id === 'business' ? 'bg-brand-soft' : p.id === 'executive' ? 'bg-neutral-900' : 'bg-paper'}`}>
         <ProfilePreview variant={p.id} />
       </div>
       <div className="flex flex-1 flex-col p-6"><h4 className="text-xl font-bold">{p.name} Package</h4><p className="mt-3 text-3xl font-bold tracking-tight">{formatPrice(p.price)}</p><p className="mt-3 text-sm leading-relaxed text-mute">{p.description}</p>
         <ul className="mb-7 mt-5 flex-1 space-y-3 text-sm">{p.features.map(f => <li key={f} className="flex gap-2"><span className="text-brand" aria-hidden>✓</span>{f}</li>)}</ul>
         <Link href={`/contact?offer=${p.id}`} className={`inline-flex min-h-12 items-center justify-center rounded-full text-sm font-semibold ${p.id === 'business' ? 'bg-brand text-ink' : 'bg-ink text-white'}`}>Ask about {p.name} ↗</Link>
         <Link href={`/samples/${p.id}`} className="mt-2 inline-flex min-h-11 items-center justify-center text-sm font-semibold underline underline-offset-4">View sample</Link>
       </div>
     </article>)}</div>
     <p className="mt-6 text-sm text-mute">Message us to confirm your page content, customization and delivery before ordering.</p>
   </div>
 </Container></section>;
}
