import { renderToBuffer } from "@react-pdf/renderer";
import { CertificateDocument } from "@/components/certificates/certificate-document";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const certificate = await db.certificate.findUnique({ where: { uniqueHash: hash }, include: { user: true, course: true } });
  if (!certificate) return new Response("Certificate not found", { status: 404 });
  const pdf = await renderToBuffer(<CertificateDocument learnerName={certificate.user.name ?? certificate.user.email} courseTitle={certificate.course.title} issueDate={certificate.issueDate} hash={certificate.uniqueHash} />);
  return new Response(new Uint8Array(pdf), { headers: { "content-type": "application/pdf", "content-disposition": `inline; filename="ai-literacy-${hash.slice(0, 10)}.pdf"`, "cache-control": "public, max-age=3600" } });
}
