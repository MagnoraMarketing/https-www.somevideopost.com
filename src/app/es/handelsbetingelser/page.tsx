import type { Metadata } from "next";
import { LegalDocument } from "@/components/legal/legal-document";
import { legalMetadata } from "@/lib/legal/metadata";

export const metadata: Metadata = legalMetadata("es", "handelsbetingelser");

export default function Page() {
  return <LegalDocument locale="es" slug="handelsbetingelser" />;
}
