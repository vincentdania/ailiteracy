import { renderToBuffer } from "@react-pdf/renderer";
import { CertificateDocument } from "@/components/certificates/certificate-document";
import { certificateFileName, credentialLabel, downloadableCertificate } from "@/lib/certificate-records";

export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const result = await downloadableCertificate(hash);
  if ("error" in result) return result.error;
  const { record } = result;
  const pdf = await renderToBuffer(<CertificateDocument learnerName={record.learnerName} kind={record.kind} courseTitle={record.courseTitle} moduleTitle={record.moduleTitle} moduleOrder={record.moduleOrder} issuedAt={record.issuedAt} credentialLabel={credentialLabel(record)} url={record.url} />);
  return new Response(new Uint8Array(pdf), { headers: { "content-type": "application/pdf", "content-disposition": `attachment; filename="${certificateFileName(record)}.pdf"`, "cache-control": "private, max-age=300" } });
}
