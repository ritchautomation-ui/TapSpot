/**
 * Settings for the /customize design preview.
 * Prices are read from data/products.ts for the sign. The business card price lives here
 * because the card product itself is sold through packages (see data/packages.ts).
 */
export type CustomizeKind = "sign" | "card";

export const customizeKinds: Record<CustomizeKind, {
  label: string;
  productName: string;
  price: number;
  priceNote: string;
  /** Printable area as width / height. */
  areaAspect: number;
  blurb: string;
}> = {
  sign: {
    label: "Custom Sign",
    productName: "NFC Custom Branded Sign",
    price: 1299,
    priceNote: "per sign",
    // Sign face is 3:4. The top 62% is your design, the bottom is the fixed tap zone.
    areaAspect: 3 / (4 * 0.62),
    blurb: "Your artwork goes on the top of the sign. The tap zone stays at the bottom.",
  },
  card: {
    label: "Custom Business Card",
    productName: "NFC Custom Business Card",
    price: 1099,
    priceNote: "per card",
    // 85.5 x 54 mm
    areaAspect: 85.5 / 54,
    blurb: "Your artwork covers the whole front of the card (85.5 × 54 mm).",
  },
};

export type Destination = { id: string; label: string; needsLink: boolean; hosts?: string[]; hostMessage?: string; placeholder: string };

export const destinations: Record<CustomizeKind, Destination[]> = {
  sign: [
    { id: "google", label: "Google Review", needsLink: true, placeholder: "https://g.page/r/…/review", hosts: ["google.", "goo.gl", "g.page", "g.co"], hostMessage: "That doesn't look like a Google link. Paste the review link from your Google Business Profile." },
    { id: "facebook", label: "Facebook", needsLink: true, placeholder: "https://facebook.com/yourpage", hosts: ["facebook.com", "fb.com", "fb.me", "m.me"], hostMessage: "That doesn't look like a Facebook link. Paste your Facebook page address." },
    { id: "other", label: "Other link", needsLink: true, placeholder: "https://…" },
  ],
  card: [
    { id: "profile", label: "TapSpot digital profile", needsLink: false, placeholder: "" },
    { id: "facebook", label: "Facebook", needsLink: true, placeholder: "https://facebook.com/yourpage", hosts: ["facebook.com", "fb.com", "fb.me", "m.me"], hostMessage: "That doesn't look like a Facebook link. Paste your Facebook page address." },
    { id: "other", label: "Other link", needsLink: true, placeholder: "https://…" },
  ],
};

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;
export const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp"];
