import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { isCredentialId, verificationUrl } from "@/lib/certificates";

export type CertificateRecord = {
  kind: "module" | "course";
  id: string;
  userId: string;
  learnerName: string;
  showName: boolean;
  courseTitle: string;
  courseSlug: string;
  moduleTitle: string | null;
  moduleOrder: number | null;
  issuedAt: Date;
  revoked: boolean;
  url: string;
  /** What the learner demonstrated, shown on the verification page. */
  evidence: string[];
  reviewHref: string;
};

function evidenceLines(value: unknown) {
  if (!value || typeof value !== "object") return [];
  const e = value as { lessons?: { day: number; title: string }[]; knowledgeCheckAverage?: number | null; missionsSolved?: number; practicalBest?: number };
  return [
    e.lessons?.length ? `Completed ${e.lessons.length} lessons: ${e.lessons.map((l) => l.title).join("; ")}` : null,
    typeof e.knowledgeCheckAverage === "number" ? `Mastered every knowledge check (average ${e.knowledgeCheckAverage}%)` : null,
    e.missionsSolved ? `Solved ${e.missionsSolved} applied missions` : null,
    e.practicalBest ? `Practical work assessed against the Hyrax rubric (best score ${e.practicalBest}/100)` : null,
  ].filter((line): line is string => !!line);
}

/** Looks up a module certificate (HYX-…) or a course certificate (64-hex hash). */
export async function findCertificate(id: string): Promise<CertificateRecord | null> {
  if (isCredentialId(id)) {
    const c = await db.moduleCertificate.findUnique({ where: { credentialId: id }, include: { course: { select: { slug: true } }, module: { include: { lessons: { orderBy: { dayNumber: "asc" }, take: 1, select: { slug: true } } } } } });
    if (!c) return null;
    return { kind: "module", id: c.credentialId, userId: c.userId, learnerName: c.learnerName, showName: c.showName, courseTitle: c.courseTitle, courseSlug: c.course.slug, moduleTitle: c.moduleTitle, moduleOrder: c.moduleOrder, issuedAt: c.issuedAt, revoked: !!c.revokedAt, url: verificationUrl(c.credentialId), evidence: evidenceLines(c.evidence), reviewHref: c.module.lessons[0] ? `/challenge/${c.module.lessons[0].slug}` : "/challenge" };
  }
  if (!/^[a-f0-9]{64}$/.test(id)) return null;
  const c = await db.certificate.findUnique({ where: { uniqueHash: id }, include: { user: { select: { name: true } }, course: { select: { title: true, slug: true } } } });
  if (!c) return null;
  return { kind: "course", id: c.uniqueHash, userId: c.userId, learnerName: c.user.name?.trim() || "Hyrax AI Academy learner", showName: c.showName, courseTitle: c.course.title, courseSlug: c.course.slug, moduleTitle: null, moduleOrder: null, issuedAt: c.issueDate, revoked: false, url: verificationUrl(c.uniqueHash), evidence: ["Completed every lesson in the course", "Passed the capstone assessment (70 or more)"], reviewHref: `/challenge?course=${c.course.slug}` };
}

export function certificateTitle(record: Pick<CertificateRecord, "kind" | "moduleTitle" | "courseTitle">) {
  return record.kind === "module" ? `${record.moduleTitle} (${record.courseTitle})` : record.courseTitle;
}

export function credentialLabel(record: Pick<CertificateRecord, "kind" | "id">) {
  return record.kind === "module" ? record.id : `HYX-C-${record.id.slice(0, 12).toUpperCase()}`;
}

/** The certificate behind a download link, or the response to send instead. A learner who hides their name keeps their files to themselves. */
export async function downloadableCertificate(id: string): Promise<{ record: CertificateRecord } | { error: Response }> {
  const record = await findCertificate(id);
  if (!record || record.revoked) return { error: new Response("Certificate not found", { status: 404 }) };
  if (!record.showName) {
    const session = await auth();
    if (session?.user.id !== record.userId) return { error: new Response("This certificate's holder has chosen not to share it publicly.", { status: 403 }) };
  }
  return { record };
}

/** File name for a downloaded certificate, without the extension. */
export function certificateFileName(record: CertificateRecord) {
  const slug = (record.moduleTitle ?? record.courseTitle).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  return `hyrax-certificate-${slug}-${credentialLabel(record).toLowerCase()}`;
}
