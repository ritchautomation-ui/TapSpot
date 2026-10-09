import { storeConfig } from "@/config/store";
import { ButtonLink, Container } from "./ui";

export function ResellerCTA() {
  return (
    <section className="bg-white py-16">
      <Container>
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-ink p-8 text-white sm:flex-row sm:items-center sm:p-12">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Interested in bulk orders or reselling TapSpot?</h2>
            <p className="mt-2 text-white/70">Let's talk.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <ButtonLink href={storeConfig.contact.messengerUrl} external variant="primary">Message us</ButtonLink>
            <ButtonLink href="/resellers" variant="onDark">Learn more</ButtonLink>
          </div>
        </div>
      </Container>
    </section>
  );
}
