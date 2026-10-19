import { createHash, randomInt } from "node:crypto";

export const ISSUER = {
  name: "Hyrax Information Technology Solutions and Consultancy Ltd.",
  brand: "HYRAX",
  academy: "Hyrax AI Academy",
  tagline: "HYRAX · The AI Enablement Company.",
  signatory: "Vincent Dania",
  signatoryTitle: "Chief Executive Officer",
} as const;

export function certificateHash(userId: string, courseId: string, completedAt: Date, secret = process.env.AUTH_SECRET) {
  if (!secret) throw new Error("Certificate signing is not configured");
  return createHash("sha256").update(`${userId}:${courseId}:${completedAt.toISOString()}:${secret}`).digest("hex");
}

// Crockford base32 without I, L, O, U: easy to read aloud and type from a printed certificate.
const ALPHABET = "0123456789ABCDEFGHJKMNPQRSTVWXYZ";

/** A random, unguessable credential id such as HYX-7K3M-Q9TD-2XWB (60 bits). */
export function newCredentialId() {
  const chars = Array.from({ length: 12 }, () => ALPHABET[randomInt(ALPHABET.length)]).join("");
  return `HYX-${chars.slice(0, 4)}-${chars.slice(4, 8)}-${chars.slice(8, 12)}`;
}

export function isCredentialId(value: string) {
  return /^HYX-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}-[0-9A-HJKMNP-TV-Z]{4}$/.test(value);
}

export function siteOrigin() {
  return (process.env.NEXTAUTH_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export function verificationUrl(id: string) {
  return `${siteOrigin()}/verify/${id}`;
}

/**
 * LinkedIn's documented "Add to profile" link pre-fills Licences & Certifications.
 * https://addtoprofile.linkedin.com/ — the learner still confirms on LinkedIn.
 */
export function linkedInAddToProfileUrl(input: { name: string; issuedAt: Date; credentialId: string; url: string }) {
  const params = new URLSearchParams({
    startTask: "CERTIFICATION_NAME",
    name: input.name,
    organizationName: "Hyrax",
    issueYear: String(input.issuedAt.getUTCFullYear()),
    issueMonth: String(input.issuedAt.getUTCMonth() + 1),
    certUrl: input.url,
    certId: input.credentialId,
  });
  return `https://www.linkedin.com/profile/add?${params.toString()}`;
}

export function shareLinks(url: string, text: string) {
  return {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${text} ${url}`)}`,
  };
}

export function formatIssueDate(date: Date) {
  return date.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}
