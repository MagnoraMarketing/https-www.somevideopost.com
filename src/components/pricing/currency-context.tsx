"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Currency } from "@/lib/currency";

/**
 * The signed-in account's billing currency, made available to client
 * components.
 *
 * Currency lives in a cookie that only the server can read, so every client
 * screen that showed a price used to hardcode one — which is how the studio
 * and the two "Priser" boxes ended up quoting a video price the checkout no
 * longer charged. The layout reads the cookie once and passes it down here;
 * the value comes from the server render, so there is no hydration mismatch.
 */
const CurrencyContext = createContext<Currency>("dkk");

export function CurrencyProvider({ currency, children }: { currency: Currency; children: ReactNode }) {
  return <CurrencyContext.Provider value={currency}>{children}</CurrencyContext.Provider>;
}

export function useCurrency(): Currency {
  return useContext(CurrencyContext);
}
