import type { Locale } from "@/lib/i18n";

/** The three legal documents the footer links to. */
export type LegalSlug = "privatlivspolitik" | "cookiepolitik" | "handelsbetingelser";

export const LEGAL_SLUGS: LegalSlug[] = [
  "privatlivspolitik",
  "cookiepolitik",
  "handelsbetingelser",
];

export type LegalTable = {
  headers: string[];
  rows: string[][];
};

export type LegalSection = {
  heading: string;
  /** Paragraphs, rendered in order. */
  body?: string[];
  bullets?: string[];
  table?: LegalTable;
};

export type LegalDoc = {
  /** <h1> and the label used in the footer. */
  title: string;
  metaTitle: string;
  metaDescription: string;
  /** Lead paragraph under the heading. */
  intro: string;
  /** Rendered as "Last updated <date>" — already localised. */
  updated: string;
  sections: LegalSection[];
};

export type LegalContent = Record<LegalSlug, LegalDoc>;

export type LegalChrome = {
  /** Heading above the in-page table of contents. */
  contents: string;
  /** Heading of the closing "questions?" block. */
  questionsHeading: string;
  questionsBody: string;
  /** Label before the controller/company block. */
  companyHeading: string;
  otherDocs: string;
};

export type LocalisedLegal = {
  chrome: LegalChrome;
  docs: LegalContent;
};

export type LegalByLocale = Record<Locale, LocalisedLegal>;
