"use client";

import { formatPriceKey, type PriceKey } from "@/lib/currency";
import { useCurrency } from "./currency-context";

/**
 * A "Priser" box, rendered from the single price table.
 *
 * Every amount comes from `PRICES`, so changing a price in one place changes
 * it everywhere the customer can see it — including the checkout they are
 * about to be sent to.
 */
export type PriceRow = {
  label: string;
  price: PriceKey;
  /** Appended after the amount, e.g. "/ md." or "/ opslag". */
  suffix?: string;
  /** Force decimals for amounts that are not whole units (the per-post price). */
  decimals?: boolean;
};

export function PriceRows({ rows }: { rows: PriceRow[] }) {
  const currency = useCurrency();

  return (
    <div className="space-y-2">
      {rows.map((row) => (
        <div key={row.label} className="flex items-center justify-between text-sm">
          <span className="text-slate-600">{row.label}</span>
          <span className="font-semibold text-slate-900">
            {formatPriceKey(row.price, currency, row.decimals ? { decimals: true } : undefined)}
            {row.suffix ? ` ${row.suffix}` : ""}
          </span>
        </div>
      ))}
    </div>
  );
}
