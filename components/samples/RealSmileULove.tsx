"use client";

import Image from "next/image";
import { useState } from "react";
import { Icon, ICONS, PhoneFrame, PoweredBy, useNotice } from "./SampleShell";

/** Real details, taken from the clinic's public Facebook page and Google Maps listing. */
const clinic = {
  name: "Smile U Love Dental Clinic",
  branch: "Porac",
  address: "2nd Floor, above Porac Bank (Manibaug Branch), Purok 3, National Road, Manibaug Paralaya, Porac, Pampanga",
  plusCode: "4H67+9R Porac, Pampanga",
  phoneDisplay: "0930 460 6787",
  phoneTel: "+639304606787",
  facebook: "https://www.facebook.com/share/19VJyHkHxi/",
  maps: "https://maps.app.goo.gl/TKasa7jtP8MhEty76",
  booking: "https://px.molarsoft.com/_/smile-u-love-dental-clinic-728/booking/jWEaj30VUQ/step1",
};

const services: { name: string; detail: string }[] = [
  { name: "General dentistry", detail: "Check-ups and everyday dental care." },
  { name: "Orthodontics (braces)", detail: "Metal, ceramic and self-ligating braces. Flexible payment terms, ask us how." },
  { name: "Aesthetic dentistry", detail: "For a smile you feel good about." },
  { name: "Oral surgery", detail: "Message us to ask about your case." },
  { name: "Tooth replacement", detail: "3D printed 1-unit Maryland bridge. Message us to know your options." },
];

const tabs = ["About", "Services", "Location"] as const;
type Tab = (typeof tabs)[number];

const PINK = "#D93F78";
const TEAL = "#1E96B0";
const INK = "#1C2B3A";

function saveContact(show: (m: string) => void) {
  const vcf = [
    "BEGIN:VCARD", "VERSION:3.0", `FN:${clinic.name} - ${clinic.branch}`, `ORG:${clinic.name}`,
    `TEL;TYPE=WORK,VOICE:${clinic.phoneTel}`, `URL:${clinic.facebook}`,
    `ADR;TYPE=WORK:;;${clinic.address};;;;`, "END:VCARD", "",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([vcf], { type: "text/vcard" }));
  const a = document.createElement("a");
  a.href = url; a.download = "smile-u-love-dental-clinic.vcf"; a.click();
  URL.revokeObjectURL(url);
  show("Contact saved. On a live card this is one tap.");
}

const quick = "flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-2xl bg-white text-[13px] font-semibold shadow-sm ring-1 ring-[#E6E1EA]";

/** Business package style page for a real dental clinic. All links are real. */
export function RealSmileULove() {
  const { notice, show } = useNotice();
  const [tab, setTab] = useState<Tab>("About");

  return (
    <PhoneFrame notice={notice} bg="#FBF9FC">
      <div style={{ color: INK }}>
        <div className="relative h-[250px] overflow-hidden bg-[#13202D]">
          <Image src="/images/smile-storefront.jpg" alt="Smile U Love Dental Clinic building in Porac" fill sizes="400px" className="object-cover" style={{ objectPosition: "50% 52%" }} priority />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-b from-black/5 via-transparent to-[#13202D]" />
          <div className="absolute inset-x-0 bottom-0 flex items-end gap-4 px-5 pb-4">
            <span className="grid h-[72px] w-[72px] shrink-0 place-items-center rounded-2xl bg-white shadow-lg">
              <Image src="/images/smile-icon.png" alt="Smile U Love logo" width={48} height={55} className="h-[52px] w-auto" />
            </span>
            <div className="pb-1 text-white">
              <h1 className="text-[21px] font-bold leading-tight">{clinic.name}</h1>
              <p className="text-[13px] text-white/80">Dental clinic · Porac, Pampanga</p>
            </div>
          </div>
        </div>

        <div className="px-5 pt-4">
          <a href={clinic.booking} target="_blank" rel="noopener noreferrer"
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white" style={{ backgroundColor: PINK }}>
            <Icon d={ICONS.arrow} className="h-4 w-4" />Book an appointment
          </a>
          <div className="mt-3 grid grid-cols-3 gap-2.5">
            <a href={`tel:${clinic.phoneTel}`} className={quick}><Icon d={ICONS.phone} className="h-5 w-5" />Call</a>
            <a href={clinic.facebook} target="_blank" rel="noopener noreferrer" className={quick}><Icon d={ICONS.chat} className="h-5 w-5" />Message</a>
            <a href={clinic.maps} target="_blank" rel="noopener noreferrer" className={quick}><Icon d={ICONS.pin} className="h-5 w-5" />Directions</a>
          </div>
          <button type="button" onClick={() => saveContact(show)}
            className="mt-3 flex min-h-12 w-full items-center justify-center rounded-full border border-[#D8D1DE] text-[15px] font-semibold">
            Save contact
          </button>
        </div>

        <div role="tablist" aria-label="Clinic sections" className="mt-6 flex gap-6 border-b border-[#E6E1EA] px-5">
          {tabs.map((t) => (
            <button key={t} role="tab" id={`su-tab-${t}`} aria-selected={tab === t} aria-controls="su-panel" type="button" onClick={() => setTab(t)}
              className={`min-h-12 border-b-2 text-[15px] font-semibold transition-colors ${tab === t ? "" : "border-transparent text-[#80808F]"}`}
              style={tab === t ? { borderColor: PINK } : undefined}>{t}</button>
          ))}
        </div>

        <div id="su-panel" role="tabpanel" aria-labelledby={`su-tab-${tab}`} className="min-h-[320px] px-5 py-6">
          {tab === "About" && (
            <div>
              <h2 className="text-xl font-bold">Love yourself first.</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4A5666]">A dental clinic in Manibaug Paralaya, Porac. Message us to ask about your options, or book a visit online.</p>
              <div className="mt-5 grid grid-cols-2 gap-3">
                <Image src="/images/smile-reception.jpg" alt="Clinic reception" width={360} height={333} className="h-40 w-full rounded-2xl object-cover" />
                <Image src="/images/smile-treatment-room.jpg" alt="Treatment room" width={360} height={480} className="h-40 w-full rounded-2xl object-cover" />
              </div>
              <a href={clinic.facebook} target="_blank" rel="noopener noreferrer"
                className="mt-5 flex min-h-12 items-center justify-between rounded-2xl px-4 text-[15px] font-semibold text-white" style={{ backgroundColor: TEAL }}>
                <span className="inline-flex items-center gap-2"><Icon d={ICONS.globe} className="h-4 w-4" />See more on our Facebook page</span>
                <Icon d={ICONS.arrow} className="h-4 w-4" />
              </a>
            </div>
          )}

          {tab === "Services" && (
            <div>
              <h2 className="text-xl font-bold">What we do</h2>
              <ul className="mt-2 divide-y divide-[#E6E1EA]">
                {services.map((s) => (
                  <li key={s.name} className="py-3.5">
                    <p className="text-[16px] font-semibold">{s.name}</p>
                    <p className="mt-0.5 text-[14px] leading-snug text-[#4A5666]">{s.detail}</p>
                  </li>
                ))}
              </ul>
              <a href={clinic.booking} target="_blank" rel="noopener noreferrer"
                className="mt-4 flex min-h-12 items-center justify-center rounded-full text-[15px] font-semibold text-white" style={{ backgroundColor: PINK }}>Book an appointment</a>
            </div>
          )}

          {tab === "Location" && (
            <div>
              <h2 className="text-xl font-bold">Visit us</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#4A5666]">{clinic.address}</p>
              <p className="mt-1 text-[13px] text-[#80808F]">Plus code: {clinic.plusCode}</p>
              <a href={clinic.maps} target="_blank" rel="noopener noreferrer"
                className="mt-4 flex min-h-12 items-center justify-center gap-2 rounded-full text-[15px] font-semibold text-white" style={{ backgroundColor: TEAL }}>
                <Icon d={ICONS.pin} className="h-4 w-4" />Open in Google Maps
              </a>
              <dl className="mt-6 space-y-2 text-[15px]">
                <div className="flex justify-between gap-4"><dt className="text-[#4A5666]">Phone</dt><dd className="font-semibold"><a href={`tel:${clinic.phoneTel}`}>{clinic.phoneDisplay}</a></dd></div>
                <div className="flex justify-between gap-4"><dt className="text-[#4A5666]">Hours</dt><dd className="font-semibold">9:00 AM – 5:00 PM</dd></div>
              </dl>
              <p className="mt-4 text-[12px] leading-relaxed text-[#80808F]">Message the clinic to confirm clinic days before you visit.</p>
            </div>
          )}
        </div>
        <PoweredBy color="#9A97A6" />
      </div>
    </PhoneFrame>
  );
}
