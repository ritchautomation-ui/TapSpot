"use client";

import { downloadVcard, Icon, ICONS, PhoneFrame, PoweredBy, useNotice } from "./SampleShell";

const links = [
  { label: "Facebook", sub: "Marco Reyes Realty", icon: ICONS.chat },
  { label: "Instagram", sub: "@marcoreyes.homes", icon: ICONS.star },
  { label: "Website", sub: "reyesrealty.example", icon: ICONS.globe },
];

/** Starter: one clean page with the essentials. Fictional person. */
export function SampleStarter() {
  const { notice, show } = useNotice();
  return (
    <PhoneFrame notice={notice} bg="#FFFFFF">
      <div className="px-6 pb-4 pt-10 text-[#0A0A0A]">
        <div className="mx-auto grid h-28 w-28 place-items-center rounded-full bg-[#E9E5DF] text-3xl font-bold text-[#0A0A0A] ring-4 ring-white shadow-md">MR</div>
        <h1 className="mt-5 text-center text-[26px] font-bold tracking-tight">Marco Reyes</h1>
        <p className="mt-1 text-center text-[15px] text-[#6B6B6B]">Licensed Real Estate Broker</p>
        <p className="text-center text-[15px] text-[#6B6B6B]">Reyes Realty · Angeles City</p>

        <button type="button" onClick={() => downloadVcard("Marco Reyes (Sample)", "Reyes Realty (Sample)", show)}
          className="mt-7 flex min-h-12 w-full items-center justify-center rounded-full bg-[#FF6903] text-[15px] font-semibold text-[#0A0A0A]">
          Save contact
        </button>
        <div className="mt-3 grid grid-cols-2 gap-3">
          {[{ l: "Call", i: ICONS.phone, m: "On a live card, this dials your number." }, { l: "Email", i: ICONS.mail, m: "On a live card, this opens a new email to you." }].map((b) => (
            <button key={b.l} type="button" onClick={() => show(b.m)}
              className="flex min-h-12 items-center justify-center gap-2 rounded-full border border-[#D6D3D1] text-[15px] font-semibold">
              <Icon d={b.i} className="h-4 w-4" />{b.l}
            </button>
          ))}
        </div>

        <ul className="mt-7 space-y-2.5">
          {links.map((l) => (
            <li key={l.label}>
              <button type="button" onClick={() => show(`On a live card, this opens your ${l.label}.`)}
                className="flex min-h-14 w-full items-center gap-4 rounded-2xl border border-[#E7E5E4] px-4 text-left">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-[#F4F1EC]"><Icon d={l.icon} className="h-4 w-4" /></span>
                <span><span className="block text-[15px] font-semibold">{l.label}</span><span className="block text-[13px] text-[#6B6B6B]">{l.sub}</span></span>
              </button>
            </li>
          ))}
        </ul>
        <PoweredBy color="#A1A1AA" />
      </div>
    </PhoneFrame>
  );
}
