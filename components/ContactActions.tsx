import { storeConfig } from "@/config/store";

export function ContactActions({ dark = false }: { dark?: boolean }) {
  const c = storeConfig.contact;
  const links = [
    ...(c.messengerUrl ? [{ href: c.messengerUrl, label: "Message on Messenger" }] : []),
    ...(c.phone ? [{ href: `tel:${c.phone.replace(/[^+\d]/g, "")}`, label: `Call ${c.phone}` }] : []),
    ...(c.email ? [{ href: `mailto:${c.email}`, label: "Email TapSpot" }] : []),
    ...(c.facebookUrl ? [{ href: c.facebookUrl, label: "Visit Facebook" }] : []),
  ];
  if (links.length === 0) {
    return <div className="flex flex-wrap gap-3"><a href="/contact" className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors ${dark ? "bg-brand text-ink hover:bg-orange-400" : "bg-ink text-white hover:bg-neutral-800"}`}>Send an inquiry<span className="ml-3" aria-hidden>→</span></a></div>;
  }
  return <div className="flex flex-wrap gap-3">{links.map((link, i) => <a key={link.href} href={link.href}
    {...(link.href.startsWith("https:") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    className={`inline-flex min-h-12 items-center justify-center rounded-full px-6 text-sm font-semibold transition-colors ${i === 0 ? "bg-brand text-ink hover:bg-orange-400" : dark ? "border border-white/30 text-white hover:bg-white/10" : "border border-line text-ink hover:bg-paper"}`}>{link.label}<span className="ml-3" aria-hidden>↗</span></a>)}</div>;
}
