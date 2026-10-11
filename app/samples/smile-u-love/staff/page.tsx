import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/ui";
import { StaffLogin } from "@/components/clinic/StaffLogin";
import { StaffDashboard, SignOutButton } from "@/components/clinic/StaffDashboard";
import { adminClient, bookingConfigured, sessionUser } from "@/lib/clinic/server";
import type { Appointment } from "@/lib/clinic/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Staff · Smile U Love demo", robots: { index: false, follow: false } };

export default async function StaffPage() {
  const configured = bookingConfigured();
  const user = configured ? await sessionUser() : null;
  const staff = user?.isStaff ? user : null;

  let rows: Appointment[] = [];
  if (staff) {
    const { data } = await adminClient().from("appointments")
      .select("id, reference, created_at, name, phone, email, service, preferred_date, preferred_time, status, notified")
      .order("created_at", { ascending: false }).limit(200);
    rows = (data ?? []) as Appointment[];
  }

  return (
    <Container className="py-12 sm:py-16">
      <Link href="/samples/smile-u-love" className="text-sm font-semibold">← Back to the clinic page</Link>
      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">Appointment requests</h1>
      <p className="mt-2 text-mute">Staff only. Demo for Smile U Love Dental Clinic.</p>

      {!configured ? (
        <p className="mt-8 max-w-md rounded-2xl bg-paper p-5 text-sm leading-relaxed">The booking system is not connected yet. Add the Supabase settings in Vercel, then redeploy. The steps are in docs/CLINIC_BOOKING_SETUP.md.</p>
      ) : staff ? (
        <StaffDashboard initial={rows} email={staff.email} />
      ) : user ? (
        <div className="mt-8 max-w-md">
          <p className="rounded-2xl bg-paper p-5 text-sm leading-relaxed">You are signed in as <strong>{user.email}</strong>, but this account is not on the staff list. Ask the admin to add it.</p>
          <div className="mt-4"><SignOutButton /></div>
        </div>
      ) : (
        <StaffLogin />
      )}
    </Container>
  );
}
