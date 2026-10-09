import { storeConfig } from "@/config/store";
import { testimonials } from "@/data/testimonials";
import { Container } from "./ui";

/** Renders nothing until real testimonials are added and showTestimonials is true. */
export function Testimonials() {
  if (!storeConfig.showTestimonials || testimonials.length === 0) return null;
  return (
    <section className="bg-paper py-20">
      <Container>
        <h2 className="text-4xl font-bold tracking-tight">What customers say</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {testimonials.map((t) => (
            <figure key={t.name} className="rounded-3xl bg-white p-7 shadow-card ring-1 ring-line">
              <blockquote className="leading-relaxed">“{t.quote}”</blockquote>
              <figcaption className="mt-4 text-sm text-mute">{t.name}, {t.business}</figcaption>
            </figure>
          ))}
        </div>
      </Container>
    </section>
  );
}
