import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/clinic/config";
import { adminClient, bookingConfigured, newReference, notifyMake } from "@/lib/clinic/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }

  // Honeypot: real people never fill this hidden field. Pretend it worked.
  if (typeof body.company === "string" && body.company.trim()) return NextResponse.json({ ok: true, reference: "SUL-XXXXXX", notified: false });

  const result = validateRequest(body);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  const data = result.data;

  // Demo mode: Supabase is not connected yet, so nothing is saved. Make can still be tested.
  if (!bookingConfigured()) {
    const reference = "DEMO-" + newReference().slice(4);
    const notified = await notifyMake("appointment.requested", { ...data, reference, status: "pending" });
    return NextResponse.json({ ok: true, demo: true, reference, notified });
  }

  const db = adminClient();

  // Limit: 3 requests per hour for the same email or phone, so the clinic inbox cannot be flooded.
  const since = new Date(Date.now() - 3_600_000).toISOString();
  const recent = (col: "email" | "phone", value: string) =>
    db.from("appointments").select("id", { count: "exact", head: true }).eq(col, value).gte("created_at", since);
  const [byEmail, byPhone] = await Promise.all([recent("email", data.email), recent("phone", data.phone)]);
  const count = Math.max(byEmail.count ?? 0, byPhone.count ?? 0);
  if (count >= 3) return NextResponse.json({ error: "Too many requests. Please call the clinic instead." }, { status: 429 });

  let reference = "";
  let saved = false;
  for (let i = 0; i < 3 && !saved; i++) {
    reference = newReference();
    const { error } = await db.from("appointments").insert({ ...data, reference, consent: true });
    if (!error) saved = true;
    else if (error.code !== "23505") return NextResponse.json({ error: "We could not save your request. Please try again." }, { status: 500 });
  }
  if (!saved) return NextResponse.json({ error: "We could not save your request. Please try again." }, { status: 500 });

  const notified = await notifyMake("appointment.requested", { ...data, reference, status: "pending" });
  if (notified) await db.from("appointments").update({ notified: true }).eq("reference", reference);
  return NextResponse.json({ ok: true, reference, notified });
}
