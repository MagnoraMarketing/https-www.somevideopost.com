import { createHash } from "crypto";

/**
 * Image validation without a native image library.
 *
 * The pipeline only needs the format and the pixel dimensions, both of which
 * live in the file header. Reading them here keeps `sharp` (a large native
 * dependency) out of a serverless bundle, and validating the magic bytes means
 * a downloaded file is trusted for what it *is*, not for the content-type its
 * server claimed.
 */

export type ImageFormat = "jpeg" | "png" | "webp";

export type ImageInfo = {
  format: ImageFormat;
  width: number;
  height: number;
  byteLength: number;
  /** SHA-256 of the bytes — exact-duplicate detection after download. */
  hash: string;
  contentType: string;
};

const CONTENT_TYPES: Record<ImageFormat, string> = {
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
};

export const IMAGE_EXTENSIONS: Record<ImageFormat, string> = {
  jpeg: "jpg",
  png: "png",
  webp: "webp",
};

function readPng(buf: Buffer): { width: number; height: number } | null {
  // 8-byte signature, then the IHDR chunk: length(4) type(4) width(4) height(4)
  if (buf.length < 24) return null;
  if (buf.toString("ascii", 12, 16) !== "IHDR") return null;
  return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
}

function readJpeg(buf: Buffer): { width: number; height: number } | null {
  // Walk the marker segments to the first SOF (start of frame), which carries
  // the dimensions. EXIF/ICC segments before it are skipped by their length.
  let offset = 2;
  while (offset + 9 < buf.length) {
    if (buf[offset] !== 0xff) { offset++; continue; }
    const marker = buf[offset + 1];
    if (marker === 0xd8 || marker === 0x01 || (marker >= 0xd0 && marker <= 0xd7)) {
      offset += 2;
      continue;
    }
    const length = buf.readUInt16BE(offset + 2);
    // SOF0..SOF15, excluding the DHT/JPG/DAC markers interleaved in that range.
    const isSof = marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc;
    if (isSof) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    if (length < 2) return null;
    offset += 2 + length;
  }
  return null;
}

function readWebp(buf: Buffer): { width: number; height: number } | null {
  if (buf.length < 30) return null;
  const chunk = buf.toString("ascii", 12, 16);
  if (chunk === "VP8X") {
    return {
      width: 1 + buf.readUIntLE(24, 3),
      height: 1 + buf.readUIntLE(27, 3),
    };
  }
  if (chunk === "VP8 ") {
    // Lossy: dimensions follow the 3-byte start code 0x9d012a.
    const start = buf.indexOf(Buffer.from([0x9d, 0x01, 0x2a]), 20);
    if (start < 0 || start + 7 > buf.length) return null;
    return {
      width: buf.readUInt16LE(start + 3) & 0x3fff,
      height: buf.readUInt16LE(start + 5) & 0x3fff,
    };
  }
  if (chunk === "VP8L") {
    // Lossless: 14 bits width then 14 bits height, after the 0x2f signature.
    if (buf[20] !== 0x2f) return null;
    const bits = buf.readUInt32LE(21);
    return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
  }
  return null;
}

function detectFormat(buf: Buffer): ImageFormat | null {
  if (buf.length < 16) return null;
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "jpeg";
  if (buf.toString("hex", 0, 8) === "89504e470d0a1a0a") return "png";
  if (buf.toString("ascii", 0, 4) === "RIFF" && buf.toString("ascii", 8, 12) === "WEBP") return "webp";
  return null;
}

/**
 * Identify a downloaded image from its bytes. Returns null when the file is
 * not a supported image or its header is unreadable — the caller drops it
 * rather than handing an unknown blob to storage and then to WAN.
 */
export function readImageInfo(buf: Buffer): ImageInfo | null {
  const format = detectFormat(buf);
  if (!format) return null;

  const size =
    format === "png" ? readPng(buf) :
    format === "jpeg" ? readJpeg(buf) :
    readWebp(buf);

  if (!size || !Number.isFinite(size.width) || !Number.isFinite(size.height)) return null;
  if (size.width <= 0 || size.height <= 0) return null;

  return {
    format,
    width: size.width,
    height: size.height,
    byteLength: buf.byteLength,
    hash: createHash("sha256").update(buf).digest("hex"),
    contentType: CONTENT_TYPES[format],
  };
}
