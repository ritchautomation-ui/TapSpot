import { NextResponse } from "next/server";
import { adminClient, currentStaff, notifyMake } from "@/lib/clinic/server";

export const runtime = "nodejs";
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/** Staff only: confirm or decline a request, then tell Make so the patient gets an email. */
export async function PATCH(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const staff = await currentStaff();
  if (!staff) return NextResponse.json({ error: "Not allowed." }, { status: 401 });

  const { id } = await ctx.params;
  if (!UUID.test(id)) return NextResponse.json({ error: "Invalid request." }, { status: 400 });

  let status: unknown;
  try { status = (await req.json()).status; } catch { return NextResponse.json({ error: "Invalid request." }, { status: 400 }); }
  if (status !== "confirmed" && status !== "declined") return NextResponse.json({ error: "Invalid status." }, { status: 400 });

  const { data, error } = await adminClient().from("appointments")
    .update({ status, updated_at: new Date().toISOString() }).eq("id", id).neq("status", status)
    .select("id, reference, name, phone, email, service, preferred_date, preferred_time, status, created_at, notified").maybeSingle();
  if (error) return NextResponse.json({ error: "Could not update." }, { status: 500 });
  if (!data) return NextResponse.json({ error: "Already updated." }, { status: 409 });

  const notified = await notifyMake("appointment.status_changed", data);
  return NextResponse.json({ ok: true, appointment: data, notified });
}
