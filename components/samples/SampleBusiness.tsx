"use client";

import { useState } from "react";
import { downloadVcard, Icon, ICONS, PhoneFrame, PoweredBy, useNotice } from "./SampleShell";

const tabs = ["About", "Menu", "Location"] as const;
type Tab = (typeof tabs)[number];

const menu = [
  { group: "Coffee", items: [["Kapeng Barako (hot)", "120"], ["Spanish Latte", "165"], ["Iced Brown Sugar Oat", "175"]] },
  { group: "Pastries", items: [["Ensaymada", "85"], ["Basque Cheesecake slice", "190"], ["Pandesal & Kesong Puti", "110"]] },
];
const hours = [["Mon to Fri", "7:00 AM – 9:00 PM"], ["Sat and Sun", "8:00 AM – 10:00 PM"]];

/** Business: a showcase page with sections. Fictional café. */
export function SampleBusiness() {
  const { notice, show } = useNotice();
  const [tab, setTab] = useState<Tab>("About");
  const live = (what: string) => () => show(`On a live page, this ${what}.`);

  return (
    <PhoneFrame notice={notice} bg="#FBF6EE">
      <div className="text-[#2B1D14]">
        <div className="relative overflow-hidden bg-[#3A281C] px-6 pb-8 pt-10 text-[#FBF6EE]">
          <div aria-hidden className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-[#E8A24A]/25" />
          <div aria-hidden className="absolute -right-2 top-14 h-24 w-24 rounded-full bg-[#E8A24A]/20" />
          <div className="relative">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-[#E8A24A] text-xl font-black text-[#3A281C]">BK</div>
            <h1 className="mt-5 text-[28px] font-bold leading-tight tracking-tight">Bahay Kape</h1>
            <p className="mt-1 text-[15px] text-[#EBDCC6]">Neighborhood café · Angeles City, Pampanga</p>
            <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-[#FBF6EE]/10 px-3 py-1.5 text-[13px] font-medium">
              <span className="h-2 w-2 rounded-full bg-[#7BD389]" aria-hidden />Open today until 9:00 PM
            </p>
          </div>
        </div>

        <div className="px-5 pt-5">
          <div className="grid grid-cols-3 gap-2.5 text-[13px] font-semibold">
            {[{ l: "Call", i: ICONS.phone, w: "dials the café" }, { l: "Message", i: ICONS.chat, w: "opens Messenger" }, { l: "Directions", i: ICONS.pin, w: "opens the map" }].map((b) => (
              <button key={b.l} type="button" onClick={live(b.w)} className="flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-2xl bg-white shadow-sm ring-1 ring-[#EADFCF]">
                <Icon d={b.i} className="h-5 w-5 text-[#B5651D]" />{b.l}
              </button>
            ))}
          </div>
          <button type="button" onClick={live("opens your Google review page, ready for customers to write a review")}
            className="mt-3 flex min-h-12 w-full items-center justify-center gap-2 rounded-full bg-[#2B1D14] text-[15px] font-semibold text-[#FBF6EE]">
            <Icon d={ICONS.star} className="h-4 w-4 text-[#E8A24A]" />Leave us a Google review
          </button>
          <button type="button" onClick={() => downloadVcard("Bahay Kape (Sample)", "Bahay Kape (Sample)", show)}
            className="mt-2 flex min-h-12 w-full items-center justify-center rounded-full border border-[#D9C9B1] text-[15px] font-semibold">
            Save contact
          </button>
        </div>

        <div role="tablist" aria-label="Café sections" className="mt-7 flex gap-6 border-b border-[#EADFCF] px-5">
          {tabs.map((t) => (
            <button key={t} role="tab" id={`bk-tab-${t}`} aria-selected={tab === t} aria-controls="bk-panel" type="button" onClick={() => setTab(t)}
              className={`min-h-12 border-b-2 text-[15px] font-semibold transition-colors ${tab === t ? "border-[#E8A24A] text-[#2B1D14]" : "border-transparent text-[#8A7867]"}`}>{t}</button>
          ))}
        </div>

        <div id="bk-panel" role="tabpanel" aria-labelledby={`bk-tab-${tab}`} className="min-h-[300px] px-5 py-6">
          {tab === "About" && (
            <div>
              <h2 className="text-xl font-bold">Slow mornings, strong coffee.</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#5C4A3B]">Bahay Kape started as a one-table corner shop. We roast Benguet and Sagada beans, bake in small batches and keep the Wi-Fi fast for the remote workers who made us their second home.</p>
              <div className="mt-5 rounded-2xl bg-[#3A281C] p-4 text-[#FBF6EE]">
                <p className="text-[12px] font-semibold text-[#E8A24A]">Today’s special</p>
                <p className="mt-1 text-[17px] font-bold">Ube Cheese Pandesal + any hot coffee</p>
                <p className="mt-1 text-[14px] text-[#EBDCC6]">₱165 until 11 AM</p>
              </div>
            </div>
          )}
          {tab === "Menu" && (
            <div className="space-y-6">
              {menu.map((g) => (
                <div key={g.group}>
                  <h2 className="text-lg font-bold">{g.group}</h2>
                  <ul className="mt-2 divide-y divide-[#EADFCF]">
                    {g.items.map(([n, p]) => (
                      <li key={n} className="flex items-baseline justify-between gap-4 py-3 text-[15px]"><span>{n}</span><span className="font-semibold tabular-nums">₱{p}</span></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
          {tab === "Location" && (
            <div>
              <h2 className="text-xl font-bold">Come say hello</h2>
              <p className="mt-3 text-[15px] leading-relaxed text-[#5C4A3B]">123 Sample Street, Angeles City, Pampanga<br />Across the plaza, beside the bakery</p>
              <div aria-hidden className="mt-4 grid h-32 place-items-center rounded-2xl bg-[#EFE4D2] text-[13px] font-medium text-[#8A7867]">Map appears here</div>
              <dl className="mt-5 space-y-2 text-[15px]">
                {hours.map(([d, h]) => (<div key={d} className="flex justify-between gap-4"><dt className="text-[#5C4A3B]">{d}</dt><dd className="font-semibold">{h}</dd></div>))}
              </dl>
            </div>
          )}
        </div>
        <PoweredBy color="#A8978A" />
      </div>
    </PhoneFrame>
  );
}
