import { storeConfig } from "@/config/store";

function MailIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}

function ChatIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.5-4.6A8 8 0 1 1 21 12Z" />
    </svg>
  );
}

function PhoneIcon({ className = "h-5 w-5" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2Z" />
    </svg>
  );
}

/** Where "Message on Facebook" goes: the Messenger chat link if set, otherwise the Facebook page. */
function facebookHref() {
  const c = storeConfig.contact;
  return c.messengerUrl || c.facebookUrl;
}

/** Two tappable cards: Email and Facebook. Only configured channels are shown. */
export function ContactCards({ dark = false }: { dark?: boolean }) {
  const c = storeConfig.contact;
  const fb = facebookHref();
  const cards = [
    ...(c.email ? [{ href: `mailto:${c.email}`, title: "Email", text: c.email, icon: <MailIcon />, external: false }] : []),
    ...(fb ? [{ href: fb, title: "Facebook", text: "Message TapSpot", icon: <ChatIcon />, external: true }] : []),
  ];
  if (cards.length === 0) return null;
  return (
    <ul className="grid gap-3">
      {cards.map((card) => (
        <li key={card.title}>
          <a
            href={card.href}
            {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className={`block rounded-2xl border p-4 transition-colors ${dark ? "border-white/15 bg-white/5 hover:bg-white/10" : "border-line bg-white hover:bg-paper"}`}
          >
            <span className="flex items-center gap-3 font-semibold"><span className="text-brand">{card.icon}</span>{card.title}</span>
            <span className={`mt-1.5 block break-words text-sm ${dark ? "text-white/65" : "text-mute"}`}>{card.text}</span>
          </a>
        </li>
      ))}
    </ul>
  );
}

export function ContactActions({ dark = false }: { dark?: boolean }) {
  const c = storeConfig.contact;
  const fb = facebookHref();
  const links = [
    ...(fb ? [{ href: fb, label: "Message on Facebook", icon: <ChatIcon className="h-4 w-4" /> }] : []),
    ...(c.email ? [{ href: `mailto:${c.email}`, label: "Email Us", icon: <MailIcon className="h-4 w-4" /> }] : []),
    ...(c.phone ? [{ href: `tel:${c.phone.replace(/[^+\d]/g, "")}`, label: `Call ${c.phone}`, icon: <PhoneIcon className="h-4 w-4" /> }] : []),
  ];
  if (links.length === 0) {
    return <div className="flex flex-wrap gap-3"><a href="/contact" className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors ${dark ? "bg-brand text-ink hover:bg-orange-400" : "bg-ink text-white hover:bg-neutral-800"}`}>Send an inquiry<span className="ml-3" aria-hidden>→</span></a></div>;
  }
  return <div className="flex flex-wrap gap-3">{links.map((link, i) => <a key={link.href} href={link.href}
    {...(link.href.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 text-sm font-semibold transition-colors ${i === 0 ? "bg-brand text-ink hover:bg-orange-400" : dark ? "border border-white/30 text-white hover:bg-white/10" : "border border-line text-ink hover:bg-paper"}`}>{link.icon}{link.label}</a>)}</div>;
}
