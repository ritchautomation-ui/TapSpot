import { faqs } from "@/data/faq";

export function FaqList({ homeOnly = false }: { homeOnly?: boolean }) {
  const items = homeOnly ? faqs.filter((f) => f.home) : faqs;
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((f) => (
        <details key={f.id} className="group py-5">
          <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-4 text-lg font-semibold [&::-webkit-details-marker]:hidden">
            {f.q}
            <span aria-hidden className="text-2xl text-brand transition-transform group-open:rotate-45">+</span>
          </summary>
          <p className="mt-3 max-w-2xl leading-relaxed text-mute">{f.a}</p>
        </details>
      ))}
    </div>
  );
}
