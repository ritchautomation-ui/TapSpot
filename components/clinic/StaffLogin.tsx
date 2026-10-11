"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createBrowserClient } from "@supabase/ssr";

export function StaffLogin() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true); setError("");
    const sb = createBrowserClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!);
    const { error: err } = await sb.auth.signInWithPassword({ email: String(f.get("email") ?? "").trim(), password: String(f.get("password") ?? "") });
    setBusy(false);
    if (err) { setError("Wrong email or password."); return; }
    router.refresh();
  }

  const input = "mt-1.5 block min-h-12 w-full rounded-xl border border-line bg-white px-3.5 text-[16px] text-ink outline-none focus:border-brand";
  return (
    <form onSubmit={submit} className="mx-auto mt-8 max-w-sm space-y-4">
      <div><label htmlFor="staff-email" className="block text-sm font-semibold">Email</label>
        <input id="staff-email" name="email" type="email" autoComplete="username" required className={input} /></div>
      <div><label htmlFor="staff-pass" className="block text-sm font-semibold">Password</label>
        <input id="staff-pass" name="password" type="password" autoComplete="current-password" required className={input} /></div>
      {error && <p role="alert" className="rounded-xl bg-[#FDECEC] p-3 text-sm font-medium text-[#9B1C1C]">{error}</p>}
      <button type="submit" disabled={busy} className="flex min-h-12 w-full items-center justify-center rounded-full bg-ink text-sm font-semibold text-white disabled:opacity-60">{busy ? "Signing in..." : "Sign in"}</button>
    </form>
  );
}
