import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { Container } from "@/components/ui";

export const metadata: Metadata = { title: "Order confirmation", robots: { index: false } };

export default function Page() {
  return (
    <Container className="py-14 sm:py-20">
      <Suspense fallback={<p className="py-20 text-center text-mute">Loading…</p>}>
        <OrderConfirmation />
      </Suspense>
    </Container>
  );
}
