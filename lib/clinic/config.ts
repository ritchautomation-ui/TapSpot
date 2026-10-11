/** Shared settings and validation for the Smile U Love booking demo. */
export const CLINIC = {
  name: "Smile U Love Dental Clinic",
  phone: "0930 460 6787",
  phoneTel: "+639304606787",
  bookingUrl: "https://px.molarsoft.com/_/smile-u-love-dental-clinic-728/booking/jWEaj30VUQ/step1",
};

export const SERVICES = [
  "General dentistry",
  "Orthodontics (braces)",
  "Aesthetic dentistry",
  "Oral surgery",
  "Tooth replacement",
  "Not sure yet",
] as const;

/** Clinic hours are 9:00 AM to 5:00 PM, so the last 30-minute slot starts at 4:30 PM. */
export const TIME_SLOTS = [
  "09:00", "09:30", "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
] as const;

export type Status = "pending" | "confirmed" | "declined";

export type Appointment = {
  id: string;
  reference: string;
  created_at: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  preferred_date: string;
  preferred_time: string;
  status: Status;
  notified: boolean;
};

export function slotLabel(value: string): string {
  const [h, m] = value.split(":").map(Number);
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${hour}:${String(m).padStart(2, "0")} ${h >= 12 ? "PM" : "AM"}`;
}

/** Today's date in the Philippines as YYYY-MM-DD, shifted by `days`. */
export function manilaDate(days = 0): string {
  const base = new Date(Date.now() + days * 86_400_000);
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Manila", year: "numeric", month: "2-digit", day: "2-digit" }).format(base);
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export type RequestInput = { name: string; phone: string; email: string; service: string; preferred_date: string; preferred_time: string };

export function validateRequest(body: Record<string, unknown>): { data: RequestInput } | { error: string } {
  const s = (k: string) => (typeof body[k] === "string" ? (body[k] as string).trim() : "");
  const name = s("name"), phone = s("phone"), email = s("email").toLowerCase();
  const service = s("service"), preferred_date = s("preferred_date"), preferred_time = s("preferred_time");

  if (name.length < 2 || name.length > 80) return { error: "Enter your full name." };
  const digits = phone.replace(/[\s\-()+]/g, "");
  if (!/^\d{7,13}$/.test(digits)) return { error: "Enter a phone number we can reach you on." };
  if (!EMAIL.test(email) || email.length > 120) return { error: "Enter a valid email address." };
  if (!(SERVICES as readonly string[]).includes(service)) return { error: "Choose a service." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferred_date)) return { error: "Choose a date." };
  if (preferred_date < manilaDate(1)) return { error: "Choose a date from tomorrow onward." };
  if (preferred_date > manilaDate(90)) return { error: "Choose a date within the next 90 days." };
  if (!(TIME_SLOTS as readonly string[]).includes(preferred_time)) return { error: "Choose a time between 9:00 AM and 4:30 PM." };
  if (body.consent !== true) return { error: "Please agree before sending your request." };
  return { data: { name, phone, email, service, preferred_date, preferred_time } };
}
