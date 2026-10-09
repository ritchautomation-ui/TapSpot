import { storeConfig } from "@/config/store";

export interface FaqItem {
  id: string;
  q: string;
  a: string;
  /** Show on the home page */
  home?: boolean;
}

/** Edit answers freely. Only state policies you actually follow. */
export const faqs: FaqItem[] = [
  { id: "how", home: true, q: "How does TapSpot work?", a: "Each TapSpot product has an NFC chip programmed with one destination, like your Google review page or your Facebook page. A customer taps their phone on it and the page opens." },
  { id: "app", home: true, q: "Do customers need an app?", a: "No. Most modern smartphones read NFC tags directly from the lock screen or the browser. Nothing to download." },
  { id: "phones", q: "What phones support NFC?", a: "Most recent iPhones (iPhone XS and newer) and most Android phones support NFC. Android users may need to switch NFC on in settings." },
  { id: "custom", home: true, q: "Can you customize the product with my business?", a: "Yes. When you order, you tell us your business name and the link to program. We review your setup details, program the NFC chip, and test it before delivery." },
  { id: "logo", q: "Can I use my own logo?", a: "Send us your logo through Messenger after ordering and we'll let you know what's possible for your product." },
  { id: "change", q: "Can I change the destination later?", a: "Message us. Whether a destination can be changed depends on how your product was programmed. We'll tell you before you order if that matters for your setup." },
  { id: "processing", home: true, q: "How long does processing take?", a: `Usually ${storeConfig.processingTime} to review, program, test and pack your order. Courier delivery time is separate.` },
  { id: "shipping", q: "How does shipping work?", a: "Message us with your location. We confirm delivery options and the delivery cost before you order." },
  { id: "multiple", q: "Can I order multiple units?", a: "Yes. Change the quantity on the product page. Units in the same line share the same setup. If you need different links, add the product again with a different setup." },
  { id: "branches", q: "Can I order for multiple branches?", a: "Yes. Add one line per branch with that branch's Google or Facebook link, then send us the combined order request." },
  { id: "wholesale", q: "Can I order wholesale or resell TapSpot?", a: "We're open to bulk orders and resellers. Message us on Messenger and tell us what you have in mind." },
  { id: "google", q: "Can the NFC be programmed to my Google review link?", a: "Yes. That's what NFC Google Review does. You provide your Google review link and we program it. TapSpot makes leaving a review easier for happy customers. It doesn't guarantee reviews or rankings." },
  { id: "facebook", q: "Can I use it for Facebook?", a: "Yes. NFC Facebook opens your Facebook page when a customer taps." },
  { id: "landing", q: "Can I get a custom landing page?", a: "The NFC Digital Business Card opens a mobile profile page with your details. For other custom pages, message us." },
  { id: "payment", home: true, q: "How do I pay?", a: "Send your request through Messenger, email or phone. We confirm your setup, delivery and payment details directly. No payment is collected on this website." },
];

