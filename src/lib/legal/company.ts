/**
 * The legal entity behind somevideopost.com, as identified to users in the
 * privacy policy, the cookie policy and the terms of sale.
 *
 * GDPR art. 13 requires the data controller to be identifiable, and the Danish
 * e-commerce rules (e-handelsloven § 7) require the trader's name, address,
 * email and CVR number on a site that sells to consumers.
 *
 * `cvr` and the address fields are rendered only when non-empty — a wrong
 * registration number is far worse than an absent one, so these are left blank
 * rather than guessed. Fill them in here and every localised document picks
 * them up; nothing else needs to change.
 */
export const COMPANY = {
  /** Trading name shown throughout the site. */
  name: "somevideopost.com",
  /** Registered legal entity. Set this to the full company name. */
  legalName: "Magnora Marketing",
  /** Danish CVR number, digits only, e.g. "12345678". Leave "" if unknown. */
  cvr: "",
  /** Street address of the registered office. Leave "" if not published. */
  address: "",
  postcode: "",
  city: "",
  country: "Danmark",
  email: "mail@somevideopost.com",
  site: "https://www.somevideopost.com",
} as const;

/** True when there is enough address data to render a postal address block. */
export function hasPostalAddress(): boolean {
  return COMPANY.address !== "" && COMPANY.city !== "";
}

/** Single-line postal address, or "" when not enough is known. */
export function postalAddress(): string {
  if (!hasPostalAddress()) return "";
  return [COMPANY.address, `${COMPANY.postcode} ${COMPANY.city}`.trim(), COMPANY.country]
    .filter(Boolean)
    .join(", ");
}
