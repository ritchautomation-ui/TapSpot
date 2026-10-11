import { createClient } from "@supabase/supabase-js";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import { CLINIC, slotLabel, type Appointment } from "./config";

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL;
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const SERVICE = process.env.SUPABASE_SERVICE_ROLE_KEY;

/** True when Supabase is fully set up. Without it the form still works in demo mode and saves nothing. */
export const bookingConfigured = () => Boolean(URL_ && ANON && SERVICE);

/** Server-only client with full access. Never import this into a client component. */
export function adminClient() {
  return createClient(URL_!, SERVICE!, { auth: { persistSession: false, autoRefreshToken: false } });
}

async function sessionClient() {
  const store = await cookies();
  return createServerClient(URL_!, ANON!, {
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try { list.forEach(({ name, value, options }) => store.set(name, value, options)); } catch { /* called from a Server Component */ }
      },
    },
  });
}

/** The signed-in user (verified with Supabase) and whether their email is on the STAFF_EMAILS allow-list. */
export async function sessionUser(): Promise<{ email: string; isStaff: boolean } | null> {
  if (!bookingConfigured()) return null;
  const sb = await sessionClient();
  const { data } = await sb.auth.getUser(); // verified with Supabase, not just read from the cookie
  const email = data.user?.email?.toLowerCase();
  if (!email) return null;
  const allowed = (process.env.STAFF_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean);
  return { email, isStaff: allowed.includes(email) };
}

export async function currentStaff() {
  const user = await sessionUser();
  return user?.isStaff ? { email: user.email } : null;
}

export function newReference(): string {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // no 0/O/1/I
  const bytes = randomBytes(6);
  return "SUL-" + Array.from(bytes, (b) => alphabet[b % alphabet.length]).join("");
}

type Event = "appointment.requested" | "appointment.status_changed";

/** Sends the event to your Make scenario. A failure never blocks saving the request. */
export async function notifyMake(event: Event, a: Pick<Appointment, "reference" | "name" | "phone" | "email" | "service" | "preferred_date" | "preferred_time" | "status">): Promise<boolean> {
  const hook = process.env.MAKE_WEBHOOK_URL;
  if (!hook) return false;
  try {
    const res = await fetch(hook, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        event,
        ...a,
        preferred_time_label: slotLabel(a.preferred_time),
        clinic_name: CLINIC.name,
        clinic_phone: CLINIC.phone,
        clinic_email: process.env.CLINIC_NOTIFY_EMAIL ?? "",
        dashboard_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/samples/smile-u-love/staff`,
      }),
      signal: AbortSignal.timeout(6000),
    });
    return res.ok;
  } catch {
    return false;
  }
}
