"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { Icon, ICONS, PhoneFrame, PoweredBy, useNotice } from "./SampleShell";

/** Real details, taken from the café's public Facebook page and Google Maps listing. */
const cafe = {
  name: "Tambayan Coffee Shop",
  tagline: "Your cozy place to Tambay",
  motto: "Relax · Sip · Stay",
  address: "Stall 3, 847 National Road, Manibaug Paralaya, Porac, Pampanga 2008",
  plusCode: "4H67+5Q Porac, Pampanga",
  email: "tambayancoffee2026@gmail.com",
  facebook: "https://www.facebook.com/profile.php?id=61589801544231",
  messenger: "https://m.me/61589801544231",
  maps: "https://maps.app.goo.gl/MVi2xP2zhso7ouou5",
  openHour: 11, // 11:00 AM
  closeHour: 2, // 2:00 AM (next day)
};

type Row = [name: string, hot: string, iced?: string];
const menu: { group: string; note?: string; rows: Row[] }[] = [
  {
    group: "Coffee", note: "Hot / Iced",
    rows: [
      ["Americano", "88", "98"], ["Espresso", "88", "98"], ["Latte", "138", "148"], ["Mocha", "138", "158"],
      ["Hazelnut", "138", "158"], ["Vanilla Latte", "138", "158"], ["Spanish Latte", "138", "158"],
      ["White Chocolate", "138", "158"], ["Caramel Macchiato", "138", "158"], ["Salted Caramel", "138", "158"],
      ["Cereal Latte", "138", "158"], ["Biscoff Latte", "158", "168"],
    ],
  },
  { group: "Non-Coffee", rows: [["Pink Milk", "148"], ["Choco Milk", "148"], ["Mango Milk", "148"], ["Strawberry Milk", "148"], ["Blueberry Milk", "148"]] },
  { group: "Tea", rows: [["Thai Tea", "158"], ["Pure Matcha", "158"], ["Matcha Latte", "168"]] },
  { group: "Frappe", rows: [["Taro", "148"], ["Strawberry", "148"], ["Choco Kisses", "148"], ["Caramel Macchiato", "148"]] },
  { group: "Sodas", rows: [["Mango Soda", "78"], ["Lychee Soda", "78"], ["Blueberry Soda", "78"], ["Strawberry Soda", "78"], ["Green Apple Soda", "78"]] },
  {
    group: "Signatures",
    rows: [["Pinky Cloud", "188"], ["Pink Matcha", "188"], ["Dirty Matcha", "188"], ["Seasalt Matcha", "188"], ["Strawberry Matcha", "188"], ["Blueberry Matcha", "188"], ["Broken Heart", "198"], ["Tambayan Coffee", "228"]],
  },
  { group: "Snacks", rows: [["Fries", "98"], ["Nachos", "128"], ["Waffle", "148"], ["Hawaiian Pizza", "278"], ["All Meat Pizza", "298"]] },
];

const tabs = ["About", "Menu", "Location"] as const;
type Tab = (typeof tabs)[number];

const G = "#0F4D2E"; // brand green from the menu and logo
const CREAM = "#F7F3E8";

function openStatus(): { open: boolean; text: string } {
  const hour = Number(new Intl.DateTimeFormat("en-GB", { hour: "2-digit", hour12: false, timeZone: "Asia/Manila" }).format(new Date())) % 24;
  const open = hour >= cafe.openHour || hour < cafe.closeHour;
  return open ? { open, text: "Open now · until 2:00 AM" } : { open, text: "Closed · opens 11:00 AM" };
}

function saveContact(show: (m: string) => void) {
  const vcf = [
    "BEGIN:VCARD", "VERSION:3.0", `FN:${cafe.name}`, `ORG:${cafe.name}`,
    `EMAIL:${cafe.email}`, `URL:${cafe.facebook}`,
    `ADR;TYPE=WORK:;;${cafe.address};;;;`, "END:VCARD", "",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([vcf], { type: "text/vcard" }));
  const a = document.createElement("a");
  a.href = url; a.download = "tambayan-coffee-shop.vcf"; a.click();
  URL.revokeObjectURL(url);
  show("Contact saved. On a live card this is one tap.");
}

const linkBtn = "flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-2xl bg-white text-[13px] font-semibold shadow-sm ring-1 ring-[#E4DDC8]";

/** Business package, built for a real café. All links are real. */
export function RealTambayan() {
  const { notice, show } = useNotice();
  const [tab, setTab] = useState<Tab>("About");
  const [group, setGroup] = useState(menu[0].group);
  const [status, setStatus] = useState<{ open: boolean; text: string } | null>(null);

  useEffect(() => {
    setStatus(openStatus());
    const t = setInterval(() => setStatus(openStatus()), 60_000);
    return () => clearInterval(t);
  }, []);

  const current = menu.find((m) => m.group === group) ?? menu[0];

  return (
    <PhoneFrame notice={notice} bg={CREAM}>
      <div className="text-[#1B2A21]">
        <div className="relative h-[250px] overflow-hidden bg-[#0B2E1C]">
          <Image src="/images/tambayan-storefront.jpg" alt="Tambayan Coffee Shop storefront at night" fill sizes="400px" className="object-cover" priority />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-[#0B2E1C]" />
          <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 px-5 pb-4">
            <Image src="/images/tambayan-logo.png" alt="Tambayan Coffee Shop logo" width={84} height={84} className="h-[84px] w-[84px] rounded-2xl bg-white p-1 shadow-lg" />
            <div className="pb-1 text-white">
              <h1 className="text-[22px] font-bold leading-tight">{cafe.name}</h1>
              <p className="text-[13px] text-white/80">Café · Porac, Pampanga</p>
            </div>
          </div>
        </div>

        <div className="px-5 pt-4">
          <p className="inline-flex min-h-8 items-center gap-2 rounded-full px-3 text-[13px] font-medium ring-1 ring-[#DAD2B8]" style={{ backgroundColor: "#fff" }}>
            <span className={`h-2 w-2 rounded-full ${status ? (status.open ? "bg-[#2FB864]" : "bg-[#C8553D]") : "bg-[#BDB6A0]"}`} aria-hidden />
            {status ? status.text : "Open daily · 11 AM – 2 AM"}
          </p>

          <div className="mt-4 grid grid-cols-3 gap-2.5">
            <a href={cafe.messenger} target="_blank" rel="noopener noreferrer" className={linkBtn}>
              <Icon d={ICONS.chat} className="h-5 w-5" />Message
            </a>
            <a href={`mailto:${cafe.email}`} className={linkBtn}>
              <Icon d={ICONS.mail} className="h-5 w-5" />Email
            </a>
            <a href={cafe.maps} target="_blank" rel="noopener noreferrer" className={linkBtn}>
              <Icon d={ICONS.pin} className="h-5 w-5" />Directions
            </a>
          </div>
          <a href={cafe.facebook} target="_blank" rel="noopener noreferrer"
            className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white" style={{ backgroundColor: G }}>
            <Icon d={ICONS.globe} className="h-4 w-4" />Visit our Facebook page
          </a>
          <button type="button" onClick={() => saveContact(show)}
            className="mt-2 flex min-h-12 w-full items-center justify-center rounded-full border border-[#CFC6A9] text-[15px] font-semibold">
            Save contact
          </button>
        </div>

        <div role="tablist" aria-label="Café sections" className="mt-6 flex gap-6 border-b border-[#E4DDC8] px-5">
          {tabs.map((t) => (
            <button key={t} role="tab" id={`tb-tab-${t}`} aria-selected={tab === t} aria-controls="tb-panel" type="button" onClick={() => setTab(t)}
              className={`min-h-12 border-b-2 text-[15px] font-semibold transition-colors ${tab === t ? "text-[#1B2A21]" : "border-transparent text-[#7C8579]"}`}
              style={tab === t ? { borderColor: "#E0B13A" } : undefined}>{t}</button>
          ))}
        </div>

        <div id="tb-panel" role="tabpanel" aria-labelledby={`tb-tab-${tab}`} className="min-h-[320px] px-5 py-6">
          {tab === "About" && (
            <div>
              <h2 className="text-xl font-bold">{cafe.tagline}</h2>
              <p className="mt-1 text-[14px] font-semibold" style={{ color: G }}>{cafe.motto}</p>
              <ul className="mt-5 space-y-2.5 text-[15px]">
                {["Open every day, 11 AM to 2 AM", "Dine-in and takeout", "Signature matcha drinks, coffee, frappes and snacks", "Now on Grab"].map((f) => (
                  <li key={f} className="flex gap-3"><span className="font-bold" style={{ color: "#C99A1F" }} aria-hidden>✓</span>{f}</li>
                ))}
              </ul>
              <a href={cafe.maps} target="_blank" rel="noopener noreferrer"
                className="mt-6 flex min-h-12 items-center justify-between rounded-2xl px-4 text-[15px] font-semibold text-white" style={{ backgroundColor: G }}>
                <span className="inline-flex items-center gap-2"><Icon d={ICONS.star} className="h-4 w-4 text-[#E9C558]" />See reviews on Google Maps</span>
                <Icon d={ICONS.arrow} className="h-4 w-4" />
              </a>
            </div>
          )}

          {tab === "Menu" && (
            <div>
              <div role="group" aria-label="Menu categories" className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1">
                {menu.map((m) => (
                  <button key={m.group} type="button" aria-pressed={group === m.group} onClick={() => setGroup(m.group)}
                    className={`min-h-10 shrink-0 rounded-full px-4 text-[14px] font-semibold ring-1 transition-colors ${group === m.group ? "text-white ring-transparent" : "bg-white text-[#3E4A41] ring-[#DAD2B8]"}`}
                    style={group === m.group ? { backgroundColor: G } : undefined}>{m.group}</button>
                ))}
              </div>
              <div className="mt-4 flex items-baseline justify-between">
                <h2 className="text-lg font-bold">{current.group}</h2>
                {current.note && <span className="text-[12px] font-semibold text-[#7C8579]">{current.note}</span>}
              </div>
              <ul className="mt-1 divide-y divide-[#E4DDC8]">
                {current.rows.map(([n, a, b]) => (
                  <li key={n} className="flex items-baseline justify-between gap-4 py-3 text-[15px]">
                    <span>{n}</span>
                    <span className="font-semibold tabular-nums">{b ? `₱${a} / ₱${b}` : `₱${a}`}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-[12px] leading-relaxed text-[#7C8579]">Prices in PHP, as posted on the café’s Google Maps listing. They may change.</p>
            </div>
          )}

          {tab === "Location" && (
            <div>
              <h2 className="text-xl font-bold">Come tambay with us</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#46524A]">{cafe.address}</p>
              <p className="mt-1 text-[13px] text-[#7C8579]">Plus code: {cafe.plusCode}</p>
              <a href={cafe.maps} target="_blank" rel="noopener noreferrer"
                className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white" style={{ backgroundColor: G }}>
                <Icon d={ICONS.pin} className="h-4 w-4" />Open in Google Maps
              </a>
              <dl className="mt-6 space-y-2 text-[15px]">
                <div className="flex justify-between gap-4"><dt className="text-[#46524A]">Every day</dt><dd className="font-semibold">11:00 AM – 2:00 AM</dd></div>
              </dl>
              <p className="mt-5 text-[14px] text-[#46524A]">Email: <a href={`mailto:${cafe.email}`} className="font-semibold underline underline-offset-2">{cafe.email}</a></p>
            </div>
          )}
        </div>
        <PoweredBy color="#8B9488" />
      </div>
    </PhoneFrame>
  );
}
