"use client";

import { useEffect, useId, useState, type FormEvent } from "react";
import { CLINIC, SERVICES, TIME_SLOTS, manilaDate, slotLabel } from "@/lib/clinic/config";

const PINK = "#D93F78";
const field = "mt-1.5 block min-h-12 w-full rounded-xl border border-[#D8D1DE] bg-white px-3.5 text-[16px] text-[#1C2B3A] outline-none focus:border-[#D93F78] focus:ring-2 focus:ring-[#D93F78]/20";
const label = "block text-[14px] font-semibold";

type Done = { reference: string; email: string; demo: boolean; notified: boolean };

/** Appointment request form. Sends to /api/clinic/appointments, which saves it and triggers the emails through Make. */
export function BookingForm() {
  const uid = useId();
  const [minDate, setMinDate] = useState("");
  const [maxDate, setMaxDate] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState<Done | null>(null);

  useEffect(() => { setMinDate(manilaDate(1)); setMaxDate(manilaDate(90)); }, []);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const form = e.currentTarget;
    const f = new FormData(form);
    const payload = {
      name: String(f.get("name") ?? ""), phone: String(f.get("phone") ?? ""), email: String(f.get("email") ?? ""),
      service: String(f.get("service") ?? ""), preferred_date: String(f.get("preferred_date") ?? ""),
      preferred_time: String(f.get("preferred_time") ?? ""), consent: f.get("consent") === "on", company: String(f.get("company") ?? ""),
    };
    setBusy(true); setError("");
    try {
      const res = await fetch("/api/clinic/appointments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) { setError(json.error ?? "Something went wrong. Please try again."); return; }
      setDone({ reference: json.reference, email: payload.email.trim(), demo: Boolean(json.demo), notified: Boolean(json.notified) });
    } catch {
      setError("No connection. Please check your internet and try again.");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return (
      <div role="status" className="rounded-2xl bg-white p-5 ring-1 ring-[#E6E1EA]">
        <p className="text-[13px] font-semibold uppercase tracking-wide" style={{ color: PINK }}>Request received</p>
        <h2 className="mt-1 text-xl font-bold">Waiting for confirmation</h2>
        <p className="mt-3 text-[15px] leading-relaxed text-[#4A5666]">
          Your reference is <strong className="text-[#1C2B3A]">{done.reference}</strong>.{" "}
          {done.notified
            ? <>We sent an email to <strong className="text-[#1C2B3A]">{done.email}</strong>. The clinic will confirm your time, or suggest another one.</>
            : <>We could not send the confirmation email just now, but the clinic has your request and will contact you.</>}
        </p>
        {done.demo && <p className="mt-3 text-[12px] leading-relaxed text-[#80808F]">Demo mode: this request was not saved, and no clinic was notified.</p>}
        <button type="button" onClick={() => setDone(null)} className="mt-5 flex min-h-12 w-full items-center justify-center rounded-full border border-[#D8D1DE] text-[15px] font-semibold">Send another request</button>
      </div>
    );
  }

  return (
    <div>
      <p className="rounded-2xl bg-[#FFF4F8] p-3.5 text-[13px] leading-relaxed text-[#6B2A44] ring-1 ring-[#F3C9D8]">
        <strong>Demo form.</strong> This is a sample of what TapSpot can build. Requests sent here are not delivered to the clinic. To book for real, call{" "}
        <a href={`tel:${CLINIC.phoneTel}`} className="font-semibold underline">{CLINIC.phone}</a> or use the{" "}
        <a href={CLINIC.bookingUrl} target="_blank" rel="noopener noreferrer" className="font-semibold underline">clinic’s own booking page</a>.
      </p>

      <form onSubmit={submit} noValidate className="mt-5 space-y-4">
        {/* Honeypot for bots. Hidden from people and screen readers. */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>Company<input name="company" tabIndex={-1} autoComplete="off" /></label>
        </div>

        <div><label htmlFor={`${uid}-name`} className={label}>Full name</label>
          <input id={`${uid}-name`} name="name" autoComplete="name" required maxLength={80} className={field} /></div>
        <div><label htmlFor={`${uid}-phone`} className={label}>Mobile number</label>
          <input id={`${uid}-phone`} name="phone" type="tel" inputMode="tel" autoComplete="tel" required className={field} placeholder="09XX XXX XXXX" /></div>
        <div><label htmlFor={`${uid}-email`} className={label}>Email</label>
          <input id={`${uid}-email`} name="email" type="email" inputMode="email" autoComplete="email" required maxLength={120} className={field} placeholder="you@example.com" /></div>
        <div><label htmlFor={`${uid}-service`} className={label}>Service</label>
          <select id={`${uid}-service`} name="service" required defaultValue="" className={field}>
            <option value="" disabled>Choose a service</option>
            {SERVICES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select></div>
        <div className="grid grid-cols-2 gap-3">
          <div><label htmlFor={`${uid}-date`} className={label}>Preferred date</label>
            <input id={`${uid}-date`} name="preferred_date" type="date" required min={minDate} max={maxDate} className={field} /></div>
          <div><label htmlFor={`${uid}-time`} className={label}>Time</label>
            <select id={`${uid}-time`} name="preferred_time" required defaultValue="" className={field}>
              <option value="" disabled>Choose</option>
              {TIME_SLOTS.map((t) => <option key={t} value={t}>{slotLabel(t)}</option>)}
            </select></div>
        </div>
        <p className="-mt-1 text-[12px] text-[#80808F]">Clinic hours are 9:00 AM to 5:00 PM. Your time is a request until the clinic confirms it.</p>

        <label className="flex items-start gap-3 text-[13px] leading-snug text-[#4A5666]">
          <input name="consent" type="checkbox" required className="mt-0.5 h-5 w-5 shrink-0 accent-[#D93F78]" />
          <span>I agree that my name, number and email are used only to send my confirmation emails and to arrange this appointment. Please do not include any medical details.</span>
        </label>

        {error && <p role="alert" className="rounded-xl bg-[#FDECEC] p-3 text-[14px] font-medium text-[#9B1C1C]">{error}</p>}

        <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center rounded-full text-[15px] font-semibold text-white disabled:opacity-60" style={{ backgroundColor: PINK }}>
          {busy ? "Sending..." : "Request appointment"}
        </button>
      </form>
    </div>
  );
}
