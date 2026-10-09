import Link from "next/link";
import { storeConfig } from "@/config/store";
import { Wordmark } from "./Brand";
import { Container } from "./ui";

export function Footer() {
  const c = storeConfig.contact;
  return (
    <footer className="bg-ink text-white">
      <Container className="grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Wordmark className="text-3xl" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            NFC review displays and digital business cards that make it easier for customers to connect with local businesses.
          </p>
        </div>
        <FooterCol title="Shop" items={[["Products", "/products"], ["Business card", "/business-card"], ["Cart", "/cart"]]} />
        <FooterCol title="Learn" items={[["How it works", "/how-it-works"], ["FAQ", "/faq"], ["Become a reseller", "/resellers"]]} />
        <div>
          <h3 className="text-sm font-semibold text-white">Contact</h3>
          <ul className="mt-4 space-y-2.5 text-sm text-white/70"><li><Link href="/contact" className="hover:text-white">Talk to TapSpot</Link></li>
            {c.facebookUrl && <li><a className="hover:text-white" href={c.facebookUrl} target="_blank" rel="noopener noreferrer">Facebook</a></li>}
            {c.messengerUrl && <li><a className="hover:text-white" href={c.messengerUrl} target="_blank" rel="noopener noreferrer">Messenger</a></li>}
            {c.email && <li><a className="hover:text-white" href={`mailto:${c.email}`}>{c.email}</a></li>}
            {c.phone && <li><a className="hover:text-white" href={`tel:${c.phone.replace(/\s/g, "")}`}>{c.phone}</a></li>}
          </ul>
        </div>
      </Container>
      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-2 pb-24 pt-6 text-sm text-white/60 sm:flex-row sm:justify-between lg:pb-6">
          <p>© {new Date().getFullYear()} {storeConfig.brandName}. All rights reserved.</p>
          <p>Made for businesses in the Philippines.</p>
        </Container>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }: { title: string; items: [string, string][] }) {
  return (
    <div>
      <h3 className="text-sm font-semibold text-white">{title}</h3>
      <ul className="mt-4 space-y-2.5 text-sm text-white/70">
        {items.map(([label, href]) => (
          <li key={href}><Link className="hover:text-white" href={href}>{label}</Link></li>
        ))}
      </ul>
    </div>
  );
}


