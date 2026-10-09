import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FaqList } from "@/components/FaqList";
import { ProductDetail } from "@/components/ProductDetail";
import { ProductCard } from "@/components/ProductCard";
import { Container } from "@/components/ui";
import { storeConfig } from "@/config/store";
import { availableProducts, getProduct } from "@/data/products";

export function generateStaticParams() {
  return availableProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getProduct(slug);
  if (!p || !p.available) return {};
  return {
    title: p.name,
    description: p.description,
    openGraph: { title: `${p.name} | TapSpot`, description: p.tagline, images: p.images[0] ? [p.images[0].src] : undefined },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product || !product.available) notFound();

  const related = product.related.map(getProduct).filter((p): p is NonNullable<typeof p> => !!p && p.available);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    brand: { "@type": "Brand", name: storeConfig.brandName },
    ...(product.price !== null && {
      offers: { "@type": "Offer", priceCurrency: storeConfig.currency.code, price: product.price, availability: "https://schema.org/InStock" },
    }),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Container className="py-10 sm:py-14">
        <ProductDetail product={product} />
      </Container>

      <section className="bg-paper py-16 sm:py-20">
        <Container className="grid gap-12 lg:grid-cols-3">
          <div>
            <h2 className="text-2xl font-bold">Why TapSpot</h2>
            <dl className="mt-5 space-y-5">
              {product.benefits.map((b) => (
                <div key={b.title}><dt className="font-semibold">{b.title}</dt><dd className="mt-1 text-mute">{b.body}</dd></div>
              ))}
            </dl>
          </div>
          <div>
            <h2 className="text-2xl font-bold">How it works</h2>
            <ol className="mt-5 space-y-4">
              {product.howItWorks.map((s, i) => (
                <li key={s} className="flex gap-4"><span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink text-sm font-bold text-white">{i + 1}</span><span className="pt-1 text-mute">{s}</span></li>
              ))}
            </ol>
          </div>
          <div>
            <h2 className="text-2xl font-bold">Great for</h2>
            <ul className="mt-5 flex flex-wrap gap-2">
              {product.useCases.map((u) => <li key={u} className="rounded-full bg-white px-4 py-2 text-sm font-medium ring-1 ring-line">{u}</li>)}
            </ul>
          </div>
        </Container>
      </section>

      <Container className="py-16 sm:py-20">
        <h2 className="text-3xl font-bold tracking-tight">Frequently asked questions</h2>
        <div className="mt-8 max-w-3xl"><FaqList homeOnly /></div>
      </Container>

      {related.length > 0 && (
        <section className="bg-paper py-16 sm:py-20">
          <Container>
            <h2 className="text-3xl font-bold tracking-tight">You might also like</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => <ProductCard key={p.id} product={p} />)}
            </div>
          </Container>
        </section>
      )}
    </>
  );
}
