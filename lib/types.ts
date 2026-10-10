export type SetupFieldType = "text" | "url" | "email" | "tel" | "textarea";

export interface SetupField {
  key: string;
  label: string;
  type: SetupFieldType;
  required: boolean;
  placeholder?: string;
  help?: string;
  /** For url fields: host fragments the URL should contain (soft check). */
  hostHints?: string[];
  hostHintMessage?: string;
}

export type ProductVisualKey = "google" | "facebook" | "bundle" | "business-card" | "custom-sign";

export interface Product {
  id: string;
  slug: string;
  name: string;
  shortName: string;
  category: "review" | "social" | "bundle" | "profile" | "menu" | "services" | "booking" | "custom";
  tagline: string;
  description: string;
  /** null = pricing not set yet. The product page then shows an enquiry CTA instead of Add to cart. */
  price: number | null;
  priceNote?: string;
  badge?: "Best value" | "Most popular";
  available: boolean;
  featured: boolean;
  visual: ProductVisualKey;
  /** Tile in the original six-product artwork, used only by the showcase. */
  showcaseTile?: number;
  images: { src: string; alt: string; width: number; height: number }[];
  includes: string[];
  benefits: { title: string; body: string }[];
  howItWorks: string[];
  useCases: string[];
  setupFields: SetupField[];
  setupNote?: string;
  related: string[];
  faqIds?: string[];
}

export interface DiscountCode {
  code: string;
  type: "percent" | "fixed";
  value: number;
  description: string;
  minSubtotal?: number;
  active: boolean;
}

export interface PaymentMethod {
  id: string;
  label: string;
  enabled: boolean;
  description: string;
  instructions: string;
}

export interface CartLine {
  lineId: string;
  productId: string;
  quantity: number;
  setup: Record<string, string>;
}

export interface CartState {
  lines: CartLine[];
  discountCode: string | null;
}

export interface Totals {
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  discountLabel: string | null;
}

export interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
}

export interface ShippingAddress {
  unit: string;
  street: string;
  barangay: string;
  city: string;
  province: string;
  postalCode: string;
}

export interface OrderItem {
  productId: string;
  name: string;
  unitPrice: number;
  quantity: number;
  setupDetails: Record<string, string>;
}

export type OrderStatus = "pending-review" | "awaiting-payment" | "paid" | "programming" | "shipped" | "completed" | "cancelled";

export interface Order {
  id: string;
  orderNumber: string;
  customer: CustomerInfo;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  discountCode: string | null;
  total: number;
  paymentMethod: string;
  shippingAddress: ShippingAddress;
  notes: string;
  status: OrderStatus;
  createdAt: string;
  /** true only when a server/webhook actually accepted the order */
  delivered: boolean;
}
