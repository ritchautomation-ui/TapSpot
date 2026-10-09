/**
 * Central store settings. Edit this file to change brand name, contact details
 * and links. No UI component needs to be touched.
 */
export const storeConfig = {
  brandName: "TapSpot",
  tagline: "NFC solutions for local businesses",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3107",
  serviceArea: process.env.NEXT_PUBLIC_SERVICE_AREA || "",
  currency: { code: "PHP", symbol: "₱", locale: "en-PH" },

  // TODO: replace with your real details
  contact: {
    email: process.env.NEXT_PUBLIC_CONTACT_EMAIL || "",
    phone: process.env.NEXT_PUBLIC_CONTACT_PHONE || "",
    facebookUrl: process.env.NEXT_PUBLIC_FACEBOOK_URL || "",
    messengerUrl: process.env.NEXT_PUBLIC_MESSENGER_URL || "",
    supportHours: "", // e.g. "Mon–Sat, 9:00 AM – 6:00 PM"
  },

  processingTime: "3–5 business days", // shown in FAQ + confirmation. Edit to match reality.
  defectPolicy: "", // leave empty to hide. Example: "Free replacement for defective or wrong items."

  /** Set to true once you have real customer testimonials in data/testimonials.ts */
  showTestimonials: false,
};
