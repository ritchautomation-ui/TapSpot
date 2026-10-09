import { storeConfig } from "@/config/store";

export function formatPrice(amount: number): string {
  return `${storeConfig.currency.symbol}${amount.toLocaleString(storeConfig.currency.locale, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })}`;
}

export function makeOrderNumber(date = new Date()): string {
  const yy = String(date.getFullYear()).slice(-2);
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TS-${yy}${mm}${dd}-${rand}`;
}
