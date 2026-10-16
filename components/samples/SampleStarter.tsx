"use client";

import Image from "next/image";
import { Icon, ICONS, PhoneFrame, PoweredBy, useNotice } from "./SampleShell";

const links = [
  { label: "Facebook", sub: "Connect with Ritch", href: "https://www.facebook.com/profile.php?id=61595222673008", icon: ICONS.chat },
  { label: "Instagram", sub: "@ritchviel", href: "https://www.instagram.com/ritchviel", icon: ICONS.star },
  { label: "Website", sub: "tapspot-nfc.vercel.app", href: "https://tapspot-nfc.vercel.app", icon: ICONS.globe },
];

/** Ritch’s personal TapSpot digital business card. */
export function SampleStarter() {
  const { notice } = useNotice();
  return (
    <PhoneFrame notice={notice} bg="#FFFFFF">
      <div className="px-6 pb-4 pt-10 text-[#0A0A0A]">
        <Image src="/images/ritch-viel-professional.webp" alt="Ritch Viel Sinfuego" width={112} height={112} priority className="mx-auto h-28 w-28 rounded-full object-cover ring-4 ring-white shadow-md" />
        <h1 className="mt-5 text-center text-[26px] font-bold tracking-tight">Ritch Viel Sinfuego</h1>
        <p className="mt-1 text-center text-[15px] text-[#6B6B6B]">NFC &amp; Digital Solutions Specialist</p>
        <p className="text-center text-[15px] text-[#6B6B6B]">TapSpot · Pampanga</p>

        <p className="mt-5 text-center text-[14px] leading-relaxed text-[#6B6B6B]">Hi, I’m Ritch Viel Sinfuego, the person behind TapSpot. I help local businesses connect with customers through NFC digital business cards, NFC review displays, websites, and online booking systems. Message me directly to discuss what we can build for your business.</p>

        <a href="/ritch-viel-sinfuego.vcf" download
          className="mt-7 flex min-h-12 w-full items-center justify-center rounded-full bg-[#FF6903] text-[15px] font-semibold text-[#0A0A0A]">
          Save contact
        </a>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[{ l: "Call", i: ICONS.phone, href: "tel:+639605854934" }, { l: "Email", i: ICONS.mail, href: "mailto:tapspotpampanga@gmail.com" }].map((b) => (
            <a key={b.l} href={b.href}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#D6D3D1] text-[15px] font-semibold">
              <Icon d={b.i} className="h-4 w-4" />{b.l}
            </a>
          ))}
        </div>

        <p className="mt-3 text-center text-[13px] text-[#6B6B6B]">09605854934<br />tapspotpampanga@gmail.com</p>

        <ul className="mt-7 space-y-2.5">
          {links.map((l) => (
            <li key={l.label}>
              <a href={l.href} target="_blank" rel="noopener noreferrer"
                className="flex min-h-14 w-full items-center gap-4 rounded-2xl border border-[#E7E5E4] px-4 text-left">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F4F1EC]"><Icon d={l.icon} className="h-4 w-4" /></span>
                <span><span className="block text-[15px] font-semibold">{l.label}</span><span className="block text-[13px] text-[#6B6B6B]">{l.sub}</span></span>
              </a>
            </li>
          ))}
        </ul>
        <PoweredBy color="#A1A1AA" />
      </div>
    </PhoneFrame>
  );
}

