import type { Metadata } from "next";
import { CheckoutForm } from "@/components/CheckoutForm";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Send your order request", robots: { index: false } };

export default function Page() {
  return (
    <Container className="py-14 sm:py-20">
      <h1 className="mb-10 text-4xl font-bold tracking-tight sm:text-5xl">Send your order request.</h1>
      <CheckoutForm />
    </Container>
  );
}
