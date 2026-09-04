import { lookup } from "dns/promises";
import { isIP } from "net";

/**
 * Server-side fetch with SSRF protection.
 *
 * Every URL in the property pipeline is supplied by the customer, so each hop
 * — the initial request and every redirect — is resolved and checked against
 * the host's own network before a connection is made. Redirects are followed
 * manually for exactly that reason: `fetch`'s own redirect handling would
 * follow a public URL into 169.254.169.254 without us ever seeing it.
 */

export type SafeFetchOptions = {
  /** Abort the request after this many milliseconds. */
  timeoutMs?: number;
  /** Reject a body larger than this, without buffering the rest of it. */
  maxBytes?: number;
  maxRedirects?: number;
  headers?: Record<string, string>;
  /** Accept header sent on the first hop. */
  accept?: string;
};

export class UnsafeUrlError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "UnsafeUrlError";
  }
}

const DEFAULT_TIMEOUT_MS = 15_000;
const DEFAULT_MAX_BYTES = 6 * 1024 * 1024; // 6 MB of HTML is already absurd
const DEFAULT_MAX_REDIRECTS = 5;

export const BROWSER_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

/** Hostnames that never belong to a public property listing. */
const BLOCKED_HOSTNAMES = new Set([
  "localhost",
  "localhost.localdomain",
  "metadata.google.internal",
  "metadata.goog",
  "instance-data",
]);

function ipv4IsPrivate(ip: string): boolean {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((n) => !Number.isInteger(n) || n < 0 || n > 255)) return true;
  const [a, b] = parts;
  if (a === 0) return true;                       // "this network"
  if (a === 10) return true;                      // RFC1918
  if (a === 127) return true;                     // loopback
  if (a === 169 && b === 254) return true;        // link-local + cloud metadata
  if (a === 172 && b >= 16 && b <= 31) return true; // RFC1918
  if (a === 192 && b === 168) return true;        // RFC1918
  if (a === 192 && b === 0) return true;          // IETF protocol assignments
  if (a === 100 && b >= 64 && b <= 127) return true; // CGNAT
  if (a === 198 && (b === 18 || b === 19)) return true; // benchmarking
  if (a >= 224) return true;                      // multicast + reserved + broadcast
  return false;
}

function ipv6IsPrivate(ip: string): boolean {
  const addr = ip.toLowerCase().replace(/^\[|\]$/g, "").split("%")[0];
  if (addr === "::" || addr === "::1") return true;          // unspecified, loopback
  if (addr.startsWith("fe80") || addr.startsWith("fe9") ||
      addr.startsWith("fea") || addr.startsWith("feb")) return true; // link-local
  if (/^f[cd]/.test(addr)) return true;                       // unique local
  if (addr.startsWith("ff")) return true;                     // multicast
  // IPv4-mapped / IPv4-compatible (::ffff:169.254.169.254 and friends)
  const mapped = addr.match(/(\d+\.\d+\.\d+\.\d+)$/);
  if (mapped && (addr.startsWith("::ffff:") || addr.startsWith("::"))) {
    return ipv4IsPrivate(mapped[1]);
  }
  return false;
}

export function ipIsPrivate(ip: string): boolean {
  const version = isIP(ip);
  if (version === 4) return ipv4IsPrivate(ip);
  if (version === 6) return ipv6IsPrivate(ip);
  return true; // not an IP we can reason about — treat as unsafe
}

/**
 * Validate a customer-supplied URL and resolve its host.
 *
 * Rejects non-HTTP(S) schemes, credentials in the URL, blocked hostnames and
 * any host that resolves — on any of its A/AAAA records — to a private,
 * loopback, link-local or cloud-metadata address.
 */
export async function assertPublicUrl(rawUrl: string): Promise<URL> {
  let url: URL;
  try {
    url = new URL(rawUrl);
  } catch {
    throw new UnsafeUrlError("Ugyldig URL");
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    throw new UnsafeUrlError("Kun http og https er tilladt");
  }
  if (url.username || url.password) {
    throw new UnsafeUrlError("URL med brugernavn/adgangskode er ikke tilladt");
  }

  const hostname = url.hostname.toLowerCase().replace(/^\[|\]$/g, "");
  if (BLOCKED_HOSTNAMES.has(hostname) || hostname.endsWith(".localhost") || hostname.endsWith(".internal")) {
    throw new UnsafeUrlError("Intern adresse er ikke tilladt");
  }

  // A literal IP needs no DNS round-trip — check it directly.
  if (isIP(hostname)) {
    if (ipIsPrivate(hostname)) throw new UnsafeUrlError("Privat IP-adresse er ikke tilladt");
    return url;
  }

  let records: { address: string }[];
  try {
    records = await lookup(hostname, { all: true });
  } catch {
    throw new UnsafeUrlError("Værtsnavnet kunne ikke slås op");
  }
  if (!records.length) throw new UnsafeUrlError("Værtsnavnet kunne ikke slås op");
  // One private record is enough to make the host unusable — a DNS-rebinding
  // answer that mixes public and private addresses must not squeak through.
  if (records.some((r) => ipIsPrivate(r.address))) {
    throw new UnsafeUrlError("Værtsnavnet peger på en intern adresse");
  }

  return url;
}

export type SafeResponse = {
  url: string;
  status: number;
  contentType: string;
  body: Buffer;
};

/**
 * Fetch a customer-supplied URL, validating every redirect hop, and buffer at
 * most `maxBytes` of the response.
 */
export async function safeFetch(rawUrl: string, options: SafeFetchOptions = {}): Promise<SafeResponse> {
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const maxBytes = options.maxBytes ?? DEFAULT_MAX_BYTES;
  const maxRedirects = options.maxRedirects ?? DEFAULT_MAX_REDIRECTS;

  let current = rawUrl;
  for (let hop = 0; hop <= maxRedirects; hop++) {
    const url = await assertPublicUrl(current);

    const res = await fetch(url, {
      redirect: "manual",
      signal: AbortSignal.timeout(timeoutMs),
      headers: {
        "User-Agent": BROWSER_USER_AGENT,
        Accept: options.accept ?? "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "da-DK,da;q=0.9,en-US;q=0.8,en;q=0.7",
        ...options.headers,
      },
    });

    if (res.status >= 300 && res.status < 400) {
      const location = res.headers.get("location");
      if (!location) throw new UnsafeUrlError("Omdirigering uden destination");
      // Resolved against the *current* URL so a relative Location works, then
      // re-validated at the top of the next iteration.
      current = new URL(location, url).toString();
      continue;
    }

    const contentLength = Number(res.headers.get("content-length") ?? "0");
    if (contentLength > maxBytes) {
      throw new UnsafeUrlError(`Indholdet er for stort (${contentLength} bytes)`);
    }

    const body = await readCapped(res, maxBytes);
    return {
      url: url.toString(),
      status: res.status,
      contentType: (res.headers.get("content-type") ?? "").split(";")[0].trim().toLowerCase(),
      body,
    };
  }

  throw new UnsafeUrlError("For mange omdirigeringer");
}

/** Read a response body, aborting as soon as it exceeds the cap. */
async function readCapped(res: Response, maxBytes: number): Promise<Buffer> {
  if (!res.body) return Buffer.alloc(0);
  const reader = res.body.getReader();
  const chunks: Buffer[] = [];
  let total = 0;
  try {
    for (;;) {
      const { done, value } = await reader.read();
      if (done) break;
      total += value.byteLength;
      if (total > maxBytes) {
        await reader.cancel();
        throw new UnsafeUrlError(`Indholdet er for stort (over ${maxBytes} bytes)`);
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    reader.releaseLock();
  }
  return Buffer.concat(chunks);
}
