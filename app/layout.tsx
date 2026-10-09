import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { storeConfig } from "@/config/store";
import { CartProvider } from "@/components/CartProvider";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Navbar } from "@/components/Navbar";

const title = "TapSpot | NFC Solutions for Local Businesses";
const description = "Smart NFC review cards, business cards, and digital connection solutions for local businesses in the Philippines.";

export const metadata: Metadata = {
  metadataBase: new URL(storeConfig.siteUrl),
  title: { default: title, template: "%s | TapSpot" },
  description,
  openGraph: {
    title, description, type: "website", locale: "en_PH", siteName: "TapSpot",
    images: [{ url: "/images/hero-scene.jpg", width: 1175, height: 725, alt: "TapSpot NFC displays" }],
  },
  twitter: { card: "summary_large_image", title, description },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0A0A0A" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body>
        <CartProvider>
          <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">Skip to content</a>
          <Navbar />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
