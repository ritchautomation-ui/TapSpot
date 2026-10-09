import { availableProducts } from "@/data/products";
import { ProductCard } from "./ProductCard";

export function ProductGrid({ exclude = [] }: { exclude?: string[] }) {
  const items = availableProducts().filter((p) => !exclude.includes(p.id));
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((p) => <ProductCard key={p.id} product={p} />)}
    </div>
  );
}
