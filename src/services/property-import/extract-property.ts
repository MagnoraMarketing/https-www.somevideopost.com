/**
 * Property information extraction.
 *
 * Deliberately selector-agnostic: every field is attempted from several
 * independent sources (JSON-LD, meta tags, hydration payloads, plain text), so
 * a portal redesign degrades a field rather than breaking the import.
 */

export type PropertyFeatures = {
  guests?: number;
  bedrooms?: number;
  bathrooms?: number;
  squareMeters?: number;
  pool?: boolean;
  privatePool?: boolean;
  communalPool?: boolean;
  garden?: boolean;
  terrace?: boolean;
  seaView?: boolean;
  beachDistanceMeters?: number;
  parking?: boolean;
  airConditioning?: boolean;
  wifi?: boolean;
  amenities: string[];
};

export type ExtractedProperty = {
  title?: string;
  description?: string;
  location?: string;
  price?: string;
  currency?: string;
  features: PropertyFeatures;
};

function decodeEntities(value: string): string {
  return value
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"').replace(/&#0?39;/g, "'").replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ").trim();
}

function stripTags(html: string): string {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<[^>]+>/g, " "),
  );
}

function meta(html: string, ...keys: string[]): string | undefined {
  for (const key of keys) {
    const escaped = key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const patterns = [
      new RegExp(`<meta[^>]+(?:property|name)=["']${escaped}["'][^>]+content=["']([^"']*)["']`, "i"),
      new RegExp(`<meta[^>]+content=["']([^"']*)["'][^>]+(?:property|name)=["']${escaped}["']`, "i"),
    ];
    for (const re of patterns) {
      const value = html.match(re)?.[1];
      if (value?.trim()) return decodeEntities(value);
    }
  }
}

type JsonRecord = Record<string, unknown>;

function parseJsonBlocks(html: string): unknown[] {
  const blocks: unknown[] = [];
  const patterns = [
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    /<script[^>]*id=["']__NEXT_DATA__["'][^>]*>([\s\S]*?)<\/script>/gi,
    /<script[^>]+type=["']application\/json["'][^>]*>([\s\S]*?)<\/script>/gi,
  ];
  for (const re of patterns) {
    let m: RegExpExecArray | null;
    while ((m = re.exec(html)) !== null) {
      try { blocks.push(JSON.parse(m[1].trim())); } catch { /* malformed block */ }
    }
  }
  return blocks;
}

/** Depth-first search for the first usable value under any of `keys`. */
function findInJson(blocks: unknown[], keys: string[], depth = 0): string | undefined {
  for (const block of blocks) {
    const found = search(block, depth);
    if (found) return found;
  }
  return undefined;

  function search(value: unknown, d: number): string | undefined {
    if (d > 10 || !value || typeof value !== "object") return undefined;
    if (Array.isArray(value)) {
      for (const item of value) { const r = search(item, d + 1); if (r) return r; }
      return undefined;
    }
    const record = value as JsonRecord;
    for (const key of keys) {
      const v = record[key];
      if (typeof v === "string" && v.trim()) return decodeEntities(v);
      if (typeof v === "number" && Number.isFinite(v)) return String(v);
      // { "address": { "addressLocality": "Estepona" } }
      if (v && typeof v === "object" && !Array.isArray(v)) {
        const nested = search(v, d + 1);
        if (nested) return nested;
      }
    }
    for (const v of Object.values(record)) { const r = search(v, d + 1); if (r) return r; }
    return undefined;
  }
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  "€": "EUR", "$": "USD", "£": "GBP", "kr": "DKK", "kr.": "DKK",
};

function extractPrice(html: string, text: string, blocks: unknown[]): { price?: string; currency?: string } {
  const jsonPrice = findInJson(blocks, ["price", "lowPrice", "priceFrom", "basePrice", "amount"]);
  const jsonCurrency = findInJson(blocks, ["priceCurrency", "currency", "currencyCode"]);
  const metaPrice = meta(html, "product:price:amount", "og:price:amount");
  const metaCurrency = meta(html, "product:price:currency", "og:price:currency");

  if (jsonPrice || metaPrice) {
    return {
      price: (jsonPrice ?? metaPrice)?.slice(0, 40),
      currency: (jsonCurrency ?? metaCurrency)?.slice(0, 8),
    };
  }

  const m = text.match(/(?:(€|\$|£)\s*([\d.,]{2,12})|([\d.,]{2,12})\s*(€|\$|£|kr\.?|DKK|EUR|USD|GBP))/i);
  if (!m) return {};
  const symbol = (m[1] ?? m[4] ?? "").toLowerCase().replace(/\.$/, "");
  return {
    price: m[0].trim().slice(0, 40),
    currency: CURRENCY_SYMBOLS[symbol] ?? (symbol ? symbol.toUpperCase() : undefined),
  };
}

/** Keyword sets are multilingual: these portals serve da/en/es/de from one CMS. */
const FEATURE_KEYWORDS: Record<Exclude<keyof PropertyFeatures, "amenities" | "guests" | "bedrooms" | "bathrooms" | "squareMeters" | "beachDistanceMeters">, RegExp> = {
  privatePool: /\b(privat\s?pool|private pool|piscina privada|privatpool|eigener pool)\b/i,
  communalPool: /\b(f(æ|ae)lles\s?pool|communal pool|shared pool|piscina comunitaria|gemeinschaftspool)\b/i,
  pool: /\b(pool|piscina|swimmingpool|schwimmbad)\b/i,
  garden: /\b(have|garden|jard[ií]n|garten)\b/i,
  terrace: /\b(terrasse|terrace|terraza|balkon|balcony)\b/i,
  seaView: /\b(havudsigt|sea ?view|ocean ?view|vista al mar|meerblick|udsigt over havet)\b/i,
  parking: /\b(parkering|parking|garage|carport|aparcamiento|stellplatz)\b/i,
  airConditioning: /\b(aircondition|air ?condition(ing)?|klimaanl(æ|ae)g|aire acondicionado|klimaanlage|a\/c)\b/i,
  wifi: /\b(wi-?fi|tr(å|a)dl(ø|o)st internet|internet|wlan)\b/i,
};

const AMENITY_KEYWORDS: [string, RegExp][] = [
  ["Pool", /\b(pool|piscina)\b/i],
  ["Havudsigt", /\b(havudsigt|sea ?view|vista al mar)\b/i],
  ["Terrasse", /\b(terrasse|terrace|terraza)\b/i],
  ["Have", /\b(have|garden|jard[ií]n)\b/i],
  ["Aircondition", /\b(aircondition|air ?condition|klimaanl(æ|ae)g)\b/i],
  ["WiFi", /\b(wi-?fi|wlan)\b/i],
  ["Parkering", /\b(parkering|parking|garage)\b/i],
  ["Opvaskemaskine", /\b(opvaskemaskine|dishwasher|lavavajillas)\b/i],
  ["Vaskemaskine", /\b(vaskemaskine|washing machine|lavadora)\b/i],
  ["Grill", /\b(grill|barbecue|bbq|barbacoa)\b/i],
  ["Elevator", /\b(elevator|lift|ascensor)\b/i],
  ["Kæledyr tilladt", /\b(k(æ|ae)ledyr tilladt|pets allowed|se admiten mascotas)\b/i],
  ["Strandnær", /\b(strandn(æ|ae)r|beachfront|primera l[ií]nea)\b/i],
];

function num(text: string, ...patterns: RegExp[]): number | undefined {
  for (const re of patterns) {
    const m = text.match(re);
    const value = Number(m?.[1]?.replace(",", "."));
    if (Number.isFinite(value) && value > 0 && value < 10_000) return value;
  }
}

export function extractPropertyFeatures(html: string, text: string, blocks: unknown[]): PropertyFeatures {
  const haystack = `${text} ${findInJson(blocks, ["amenities", "facilities", "features"]) ?? ""}`;

  const features: PropertyFeatures = {
    guests: num(haystack,
      /(\d{1,2})\s*(?:personer|pers\.?|g(æ|ae)ster|guests|hu(é|e)spedes|personen)\b/i,
      /(?:sover|sleeps|plazas)\s*(\d{1,2})\b/i),
    bedrooms: num(haystack,
      /(\d{1,2})\s*(?:sovev(æ|ae)relser?|bedrooms?|dormitorios?|schlafzimmer)\b/i,
      /(?:sovev(æ|ae)relser?|bedrooms?|dormitorios?)\s*[:\s]\s*(\d{1,2})\b/i),
    bathrooms: num(haystack,
      /(\d{1,2})\s*(?:badev(æ|ae)relser?|bathrooms?|ba(ñ|n)os?|badezimmer)\b/i,
      /(?:badev(æ|ae)relser?|bathrooms?|ba(?:ñ|n)os?)\s*[:\s]\s*(\d{1,2})\b/i),
    // No trailing \b: "²" is not a word character, so a word boundary after it
    // never matches and "120 m²." would be missed entirely.
    squareMeters: num(haystack, /(\d{2,4}(?:[.,]\d)?)\s*m\s?[²2](?![\w])/i),
    beachDistanceMeters: (() => {
      const m = haystack.match(/(?:strand|beach|playa)[^.]{0,30}?(\d{1,4})\s*(m|meter|metros)\b/i)
        ?? haystack.match(/(\d{1,4})\s*(?:m|meter|metros)\s*(?:til|to|from|fra|a la)\s*(?:strand|beach|playa)/i);
      const value = Number(m?.[1]);
      return Number.isFinite(value) ? value : undefined;
    })(),
    amenities: AMENITY_KEYWORDS.filter(([, re]) => re.test(haystack)).map(([label]) => label),
  };

  for (const [key, re] of Object.entries(FEATURE_KEYWORDS)) {
    if (re.test(haystack)) features[key as keyof typeof FEATURE_KEYWORDS] = true;
  }
  // A private or communal pool implies a pool; the reverse is not true.
  if (features.privatePool || features.communalPool) features.pool = true;

  return features;
}

export function extractProperty(html: string): ExtractedProperty {
  const blocks = parseJsonBlocks(html);
  const text = stripTags(html).slice(0, 60_000);

  const title =
    meta(html, "og:title", "twitter:title") ??
    findInJson(blocks, ["name", "headline", "title"]) ??
    html.match(/<h1[^>]*>([\s\S]{2,200}?)<\/h1>/i)?.[1]?.replace(/<[^>]+>/g, "").trim() ??
    html.match(/<title[^>]*>([^<]{2,200})<\/title>/i)?.[1]?.trim();

  const description =
    meta(html, "og:description", "description", "twitter:description") ??
    findInJson(blocks, ["description", "summary", "about"]);

  const location =
    meta(html, "og:locality", "geo.placename", "place:location:locality") ??
    findInJson(blocks, ["addressLocality", "addressRegion", "streetAddress", "location", "city", "region"]);

  const { price, currency } = extractPrice(html, text, blocks);

  return {
    title: title ? decodeEntities(title).slice(0, 200) : undefined,
    description: description ? decodeEntities(description).slice(0, 3000) : undefined,
    location: location ? decodeEntities(location).slice(0, 200) : undefined,
    price,
    currency,
    features: extractPropertyFeatures(html, text, blocks),
  };
}
