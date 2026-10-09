import type { CustomerInfo, Product, SetupField, ShippingAddress } from "./types";

export type Errors = Record<string, string>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidUrl(value: string): boolean {
  try {
    const u = new URL(value.trim());
    return (u.protocol === "https:" || u.protocol === "http:") && u.hostname.includes(".");
  } catch {
    return false;
  }
}

/** Accepts PH mobile numbers: 09XXXXXXXXX, +639XXXXXXXXX, 639XXXXXXXXX (spaces/dashes allowed). */
export function isValidPhone(value: string): boolean {
  const digits = value.replace(/[\s\-()]/g, "");
  return /^(\+?63|0)9\d{9}$/.test(digits);
}

export function validateSetupField(field: SetupField, raw: string | undefined): string | null {
  const value = (raw ?? "").trim();
  if (!value) return field.required ? `Enter your ${field.label.toLowerCase()}.` : null;
  if (field.type === "url") {
    if (!isValidUrl(value)) return `${field.label} must be a full link starting with https://`;
    if (field.hostHints?.length) {
      const host = new URL(value).hostname.toLowerCase();
      if (!field.hostHints.some((h) => host.includes(h)))
        return field.hostHintMessage ?? `${field.label} doesn't look right. Check the link and try again.`;
    }
  }
  if (field.type === "email" && !EMAIL.test(value)) return "Enter a valid email, like name@example.com.";
  if (field.type === "tel" && !isValidPhone(value)) return "Enter a PH mobile number, like 0917 123 4567.";
  return null;
}

export function validateSetup(product: Product, values: Record<string, string>): Errors {
  const errors: Errors = {};
  for (const f of product.setupFields) {
    const e = validateSetupField(f, values[f.key]);
    if (e) errors[f.key] = e;
  }
  return errors;
}

export function validateCustomer(c: CustomerInfo): Errors {
  const e: Errors = {};
  if (c.fullName.trim().length < 2) e.fullName = "Enter your full name.";
  if (!c.email.trim()) e.email = "Enter your email so we can send your order details.";
  else if (!EMAIL.test(c.email.trim())) e.email = "Enter a valid email, like name@example.com.";
  if (!c.phone.trim()) e.phone = "Enter a mobile number so the courier can reach you.";
  else if (!isValidPhone(c.phone)) e.phone = "Enter a PH mobile number, like 0917 123 4567.";
  return e;
}

export function validateAddress(a: ShippingAddress): Errors {
  const e: Errors = {};
  if (!a.unit.trim()) e.unit = "Enter your house, unit or building.";
  if (!a.street.trim()) e.street = "Enter your street.";
  if (!a.barangay.trim()) e.barangay = "Enter your barangay.";
  if (!a.city.trim()) e.city = "Enter your city or municipality.";
  if (!a.province.trim()) e.province = "Enter your province.";
  if (!/^\d{4}$/.test(a.postalCode.trim())) e.postalCode = "Enter the 4-digit postal code.";
  return e;
}
