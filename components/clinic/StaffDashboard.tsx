"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";
import { slotLabel, type Appointment, type Status } from "@/lib/clinic/config";

const badge: Record<Status, string> = {
  pending: "bg-[#FFF3D6] text-[#7A5200]",
  confirmed: "bg-[#DDF5E6] text-[#14633A]",
  declined: "bg-[#FDECEC] text-[#9B1C1C]",
};
const when = (d: string) => new Intl.DateTimeFormat("en-PH", { weekday: "short", month: "short", day: "numeric", year: "numeric", timeZone: "UTC" }).format(new Date(`${d}T00:00:00Z`));

export function SignOutButton() {
  const router = useRouter();
  async function signOut() {
    const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    await sb.auth.signOut();
    router.refresh();
  }
  return <button type="button" onClick={signOut} className="min-h-11 rounded-full border border-line px-4 text-sm font-semibold hover:bg-paper">Sign out</button>;
}

export function StaffDashboard({ initial, email }: { initial: Appointment[]; email: string }) {
  const router = useRouter();
  const [rows, setRows] = useState(initial);
  const [filter, setFilter] = useState<"pending" | "all">("pending");
  const [busyId, setBusyId] = useState("");
  const [msg, setMsg] = useState("");

  const shown = useMemo(() => (filter === "pending" ? rows.filter((r) => r.status === "pending") : rows), [rows, filter]);
  const pendingCount = rows.filter((r) => r.status === "pending").length;

  async function setStatus(id: string, status: "confirmed" | "declined") {
    setBusyId(id); setMsg("");
    const res = await fetch(`/api/clinic/appointments/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    const json = await res.json().catch(() => ({}));
    setBusyId("");
    if (!res.ok) { setMsg(json.error ?? "Could not update."); if (res.status === 401) router.refresh(); return; }
    setRows((prev) => prev.map((r) => (r.id === id ? json.appointment : r)));
    setMsg(json.notified ? "Updated. The patient was emailed." : "Updated, but the patient email did not send. Please contact them.");
  }

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-mute">Signed in as <strong className="text-ink">{email}</strong></p>
        <SignOutButton />
      </div>

      <div role="group" aria-label="Filter requests" className="mt-5 flex gap-2">
        {([["pending", `Waiting (${pendingCount})`], ["all", `All (${rows.length})`]] as const).map(([k, l]) => (
          <button key={k} type="button" aria-pressed={filter === k} onClick={() => setFilter(k)}
            className={`min-h-11 rounded-full px-4 text-sm font-semibold ring-1 ${filter === k ? "bg-ink text-white ring-transparent" : "ring-line hover:bg-paper"}`}>{l}</button>
        ))}
      </div>

      {msg && <p role="status" className="mt-4 rounded-xl bg-paper p-3 text-sm font-medium">{msg}</p>}

      {shown.length === 0 ? (
        <p className="mt-8 text-mute">{filter === "pending" ? "No requests waiting for confirmation." : "No requests yet."}</p>
      ) : (
        <ul className="mt-6 space-y-4">
          {shown.map((r) => (
            <li key={r.id} className="rounded-2xl border border-line p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-lg font-bold">{r.name}</p>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${badge[r.status]}`}>{r.status === "pending" ? "Waiting" : r.status}</span>
              </div>
              <p className="mt-1 text-sm text-mute">{r.reference} · {r.service}</p>
              <p className="mt-3 font-semibold">{when(r.preferred_date)} · {slotLabel(r.preferred_time)}</p>
              <p className="mt-2 text-sm"><a className="font-semibold underline" href={`tel:${r.phone}`}>{r.phone}</a> · <a className="underline" href={`mailto:${r.email}`}>{r.email}</a></p>
              {!r.notified && <p className="mt-2 text-xs font-medium text-[#9B1C1C]">The first email did not send. Please contact this patient directly.</p>}
              {r.status === "pending" && (
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" disabled={busyId === r.id} onClick={() => setStatus(r.id, "confirmed")} className="min-h-11 rounded-full bg-ink px-5 text-sm font-semibold text-white disabled:opacity-60">Confirm</button>
                  <button type="button" disabled={busyId === r.id} onClick={() => setStatus(r.id, "declined")} className="min-h-11 rounded-full border border-line px-5 text-sm font-semibold hover:bg-paper disabled:opacity-60">Can’t do this time</button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
