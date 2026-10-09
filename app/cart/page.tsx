import type { Metadata } from "next";
import { CartPage } from "@/components/CartPage";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Cart", robots: { index: false } };

export default function Page() {
  return (
    <Container className="py-14 sm:py-20">
      <h1 className="mb-10 text-5xl font-bold tracking-tight">Your cart</h1>
      <CartPage />
    </Container>
  );
}
