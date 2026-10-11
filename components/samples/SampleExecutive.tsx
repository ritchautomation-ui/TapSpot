"use client";

import { useEffect, useState } from "react";
import { downloadVcard, Icon, ICONS, PhoneFrame, PoweredBy, useNotice } from "./SampleShell";

const serif = { fontFamily: "Georgia, 'Times New Roman', serif" } as const;

/** Code-drawn "photos" so the sample needs no image files. */
const shots = [
  { title: "Golden hour, Subic", tag: "Wedding", bg: "linear-gradient(160deg,#E9B872 0%,#8E4B3A 55%,#2A1A2E 100%)" },
  { title: "First look", tag: "Wedding", bg: "linear-gradient(200deg,#F2E3D0 0%,#B9A58A 60%,#4B3F36 100%)" },
  { title: "Studio portrait", tag: "Portrait", bg: "linear-gradient(140deg,#4C5C68 0%,#1E2830 70%)" },
  { title: "Baguio mist", tag: "Engagement", bg: "linear-gradient(180deg,#C7D4C3 0%,#5E7767 60%,#20302A 100%)" },
  { title: "Reception lights", tag: "Wedding", bg: "radial-gradient(circle at 30% 30%,#F5D58B 0%,#7A4B2A 45%,#150F0C 100%)" },
  { title: "Family, Sunday", tag: "Portrait", bg: "linear-gradient(150deg,#D9A38E 0%,#8C5A57 60%,#2B1B1D 100%)" },
];
const packages = [
  { name: "Portrait", price: "₱6,500", note: "1 hr · 20 edited photos" },
  { name: "Engagement", price: "₱12,000", note: "2 hrs · 40 edited photos · 1 location" },
  { name: "Wedding", price: "₱48,000", note: "Full day · 2 photographers · online gallery" },
];
const quotes = [
  { q: "She made two hundred guests forget there was a camera. Every photo feels like us.", by: "Jessa & Paolo, Subic" },
  { q: "The gallery arrived in ten days and we cried going through it.", by: "Camille D., Clark" },
  { q: "Calm, kind and unbelievably good with my camera-shy parents.", by: "Mark A., Angeles City" },
];

/** Executive: a fully custom, branded experience. Fictional studio. */
export function SampleExecutive() {
  const { notice, show } = useNotice();
  const [active, setActive] = useState(0);
  const [quote, setQuote] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setQuote((i) => (i + 1) % quotes.length), 5000);
    return () => clearInterval(id);
  }, []);

  const shot = shots[active];
  const gold = "#C9A66B";

  return (
    <PhoneFrame notice={notice} bg="#0C0B0A">
      <div className="relative text-[#F4EFE8]">
        {/* Hero: one orchestrated entrance */}
        <div className="relative overflow-hidden px-6 pb-12 pt-14">
          <div aria-hidden className="sample-drift absolute inset-0" style={{ background: "radial-gradient(120% 80% at 20% 0%, rgba(201,166,107,.30) 0%, rgba(12,11,10,0) 60%), radial-gradient(90% 70% at 100% 40%, rgba(142,75,58,.35) 0%, rgba(12,11,10,0) 65%)" }} />
          <div className="relative">
            <p className="sample-rise text-[12px] tracking-[.28em]" style={{ color: gold, animationDelay: ".1s" }}>WEDDING & PORTRAIT PHOTOGRAPHY</p>
            <h1 className="sample-rise mt-5 text-[44px] leading-[1.02]" style={{ ...serif, animationDelay: ".3s" }}>Aria Reyes<br /><span className="italic" style={{ color: gold }}>Studio</span></h1>
            <p className="sample-rise mt-5 max-w-[26ch] text-[15px] leading-relaxed text-[#CFC7BC]" style={{ animationDelay: ".6s" }}>Honest, unhurried photographs of the days you’ll want to remember. Pampanga, Manila and wherever you say yes.</p>
            <div className="sample-rise mt-8 flex gap-3" style={{ animationDelay: ".9s" }}>
              <button type="button" onClick={() => show("On a live page, this opens your booking form or Messenger.")} className="min-h-12 rounded-full px-6 text-[15px] font-semibold text-[#0C0B0A]" style={{ background: gold }}>Book a shoot</button>
              <button type="button" onClick={() => downloadVcard("Aria Reyes Studio (Sample)", "Aria Reyes Studio (Sample)", show)} className="min-h-12 rounded-full border border-[#F4EFE8]/25 px-5 text-[15px] font-semibold">Save contact</button>
            </div>
          </div>
        </div>

        {/* Gallery */}
        <section className="px-5 pb-10" aria-label="Selected work">
          <h2 className="px-1 text-[26px]" style={serif}>Selected work</h2>
          <div className="mt-4 overflow-hidden rounded-3xl" aria-live="polite">
            <div key={active} className="sample-fade relative grid aspect-[4/5] place-items-end p-5" style={{ background: shot.bg }}>
              <div className="w-full">
                <p className="text-[12px] tracking-[.2em] text-white/70">{shot.tag.toUpperCase()}</p>
                <p className="mt-1 text-[24px] italic text-white" style={serif}>{shot.title}</p>
              </div>
            </div>
          </div>
          <div className="mt-3 grid grid-cols-6 gap-2">
            {shots.map((s, i) => (
              <button key={s.title} type="button" aria-label={`Show ${s.title}`} aria-pressed={i === active} onClick={() => setActive(i)}
                className={`aspect-square rounded-xl transition-all ${i === active ? "scale-105 ring-2 ring-[#C9A66B] ring-offset-2 ring-offset-[#0C0B0A]" : "opacity-60 hover:opacity-100"}`} style={{ background: s.bg }} />
            ))}
          </div>
        </section>

        {/* Packages */}
        <section className="border-t border-[#F4EFE8]/10 px-6 py-10" aria-label="Packages">
          <h2 className="text-[26px]" style={serif}>Packages</h2>
          <ul className="mt-5 divide-y divide-[#F4EFE8]/10">
            {packages.map((p) => (
              <li key={p.name} className="flex items-baseline justify-between gap-4 py-4">
                <div><p className="text-[18px]" style={serif}>{p.name}</p><p className="mt-0.5 text-[13px] text-[#A59D92]">{p.note}</p></div>
                <p className="text-[18px] tabular-nums" style={{ ...serif, color: gold }}>{p.price}</p>
              </li>
            ))}
          </ul>
        </section>

        {/* Testimonials */}
        <section className="border-t border-[#F4EFE8]/10 px-6 py-10" aria-label="Kind words">
          <div aria-live="off" className="min-h-[150px]">
            <p key={quote} className="sample-fade text-[20px] italic leading-snug" style={serif}>“{quotes[quote].q}”</p>
            <p key={`b${quote}`} className="sample-fade mt-4 text-[13px] text-[#A59D92]">{quotes[quote].by}</p>
          </div>
          <div className="mt-2 flex gap-2">
            {quotes.map((_, i) => (
              <button key={i} type="button" aria-label={`Show testimonial ${i + 1}`} aria-pressed={i === quote} onClick={() => setQuote(i)} className="grid h-8 w-6 place-items-center">
                <span className={`h-1.5 rounded-full transition-all ${i === quote ? "w-6 bg-[#C9A66B]" : "w-1.5 bg-[#F4EFE8]/30"}`} />
              </button>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="border-t border-[#F4EFE8]/10 px-6 pb-4 pt-10 text-center">
          <h2 className="text-[26px]" style={serif}>Let’s talk about your day.</h2>
          <div className="mt-6 grid grid-cols-3 gap-2.5 text-[13px] font-semibold">
            {[{ l: "Call", i: ICONS.phone }, { l: "Message", i: ICONS.chat }, { l: "Email", i: ICONS.mail }].map((b) => (
              <button key={b.l} type="button" onClick={() => show(`On a live page, ${b.l.toLowerCase()} reaches the studio.`)} className="flex min-h-16 flex-col items-center justify-center gap-1.5 rounded-2xl border border-[#F4EFE8]/15">
                <Icon d={b.i} className="h-5 w-5" />{b.l}
              </button>
            ))}
          </div>
        </section>
        <PoweredBy color="#6F675D" />
      </div>
    </PhoneFrame>
  );
}
