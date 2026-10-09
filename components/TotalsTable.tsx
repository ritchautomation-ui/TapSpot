import { shippingConfig } from "@/config/shipping";
import { formatPrice } from "@/lib/format";
import type { Totals } from "@/lib/types";

export function TotalsTable({ totals }: { totals: Totals }) {
  return (
    <dl className="space-y-2.5 text-[15px]">
      <Row label="Subtotal" value={formatPrice(totals.subtotal)} />
      {totals.discount > 0 && <Row label={`Discount${totals.discountLabel ? ` · ${totals.discountLabel.split(" ")[0]}` : ""}`} value={`−${formatPrice(totals.discount)}`} accent />}
      <Row label="Shipping" value={totals.shipping === 0 ? (shippingConfig.enabled ? "Free" : "Confirm by message") : formatPrice(totals.shipping)} />
      <div className="flex items-baseline justify-between border-t border-line pt-3 text-lg font-bold">
        <dt>Product total</dt>
        <dd className="tabular-nums">{formatPrice(totals.total)}</dd>
      </div>
    </dl>
  );
}

function Row({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className="flex justify-between">
      <dt className="text-mute">{label}</dt>
      <dd className={`tabular-nums ${accent ? "font-semibold text-brand-dark" : ""}`}>{value}</dd>
    </div>
  );
}

