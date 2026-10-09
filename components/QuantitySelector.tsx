"use client";

export function QuantitySelector({ value, onChange, min = 1, max = 99, label = "Quantity" }: {
  value: number; onChange: (n: number) => void; min?: number; max?: number; label?: string;
}) {
  const btn = "grid h-11 w-11 place-items-center rounded-full text-xl font-semibold hover:bg-black/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand disabled:opacity-30";
  return (
    <div role="group" aria-label={label} className="inline-flex items-center rounded-full border border-neutral-300 bg-white">
      <button type="button" className={btn} aria-label="Decrease quantity" disabled={value <= min} onClick={() => onChange(value - 1)}>−</button>
      <span aria-live="polite" className="w-9 text-center text-base font-semibold tabular-nums">{value}</span>
      <button type="button" className={btn} aria-label="Increase quantity" disabled={value >= max} onClick={() => onChange(value + 1)}>+</button>
    </div>
  );
}
