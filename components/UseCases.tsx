import Link from "next/link";
import { useCases } from "@/data/useCases";
import { Container } from "./ui";

export function UseCases() {
  return (
    <section className="bg-paper py-20 sm:py-24">
      <Container>
        <h2 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">Built for businesses that deal with people face to face.</h2>
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {useCases.map((u) => (
            <Link key={u.who} href={`/products/${u.product}`} className="rounded-3xl bg-white p-7 shadow-card ring-1 ring-line transition-shadow hover:shadow-lift">
              <h3 className="text-xl font-bold">{u.who}</h3>
              <p className="mt-2 leading-relaxed text-mute">{u.line}</p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
