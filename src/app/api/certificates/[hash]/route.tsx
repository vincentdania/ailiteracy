import { renderToBuffer } from "@react-pdf/renderer";
import { auth } from "@/lib/auth";
import { CertificateDocument } from "@/components/certificates/certificate-document";
import { credentialLabel, findCertificate } from "@/lib/certificate-records";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const record = await findCertificate(hash);
  if (!record || record.revoked) return new Response("Certificate not found", { status: 404 });
  // A learner who hides their name keeps the PDF to themselves.
  if (!record.showName) {
    const session = await auth();
    if (session?.user.id !== record.userId) return new Response("This certificate's holder has chosen not to share it publicly.", { status: 403 });
  }
  const pdf = await renderToBuffer(<CertificateDocument learnerName={record.learnerName} kind={record.kind} courseTitle={record.courseTitle} moduleTitle={record.moduleTitle} moduleOrder={record.moduleOrder} issuedAt={record.issuedAt} credentialLabel={credentialLabel(record)} url={record.url} />);
  const slug = (record.moduleTitle ?? record.courseTitle).toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40);
  return new Response(new Uint8Array(pdf), { headers: { "content-type": "application/pdf", "content-disposition": `attachment; filename="hyrax-certificate-${slug}-${credentialLabel(record).toLowerCase()}.pdf"`, "cache-control": "private, max-age=300" } });
}
