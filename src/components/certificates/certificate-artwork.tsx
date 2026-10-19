import { HyraxMark, HyraxWordmark } from "@/components/brand/hyrax-logo";
import { formatIssueDate, ISSUER } from "@/lib/certificates";
import { credentialLabel, type CertificateRecord } from "@/lib/certificate-records";
import { qrPath } from "@/lib/qr";

/** On-screen and printable certificate. The PDF route draws the same design. */
export function CertificateArtwork({ record, displayName }: { record: CertificateRecord; displayName: string }) {
  const qr = qrPath(record.url);
  return <div className="print-sheet relative mx-auto aspect-[1.414/1] w-full max-w-[60rem] overflow-hidden rounded-[1.25rem] bg-white text-[#0b1c30] shadow-[0_30px_60px_-30px_rgba(16,41,79,.45)] ring-1 ring-[#dfe5ee] [container-type:inline-size]">
    <div className="absolute inset-[2.2cqw] rounded-[1cqw] border-[.25cqw] border-[#214889]" />
    <div className="absolute inset-[3cqw] rounded-[.7cqw] border-[.1cqw] border-[#f2b01e]" />
    <HyraxMark className="pointer-events-none absolute -bottom-[8cqw] -right-[6cqw] w-[38cqw] text-[#214889] opacity-[.045]" title="" />
    <div className="relative flex h-full flex-col items-center px-[8cqw] pb-[5.5cqw] pt-[6cqw] text-center">
      <div className="flex items-center gap-[1.6cqw] text-[#214889]"><HyraxWordmark className="h-[3.4cqw] w-auto" /><span className="h-[3cqw] w-[.15cqw] bg-[#214889]/30" /><span className="font-display text-[2cqw] font-semibold text-[#0b1c30]">AI Academy</span></div>
      <p className="mt-[3.2cqw] text-[1.3cqw] font-bold uppercase tracking-[.35em] text-[#0058be]">Certificate of completion</p>
      <p className="mt-[2.2cqw] text-[1.6cqw] text-[#4d5768]">This certifies that</p>
      <p className="mt-[.8cqw] font-display text-[4.6cqw] font-bold leading-none tracking-[-.02em] text-[#10294f]">{displayName}</p>
      <div className="mt-[1.4cqw] h-[.18cqw] w-[30cqw] bg-gradient-to-r from-transparent via-[#f2b01e] to-transparent" />
      <p className="mt-[1.6cqw] text-[1.6cqw] text-[#4d5768]">{record.kind === "module" ? "has successfully completed and demonstrated the learning outcomes of" : "has successfully completed the course"}</p>
      <p className="mt-[.8cqw] font-display text-[2.8cqw] font-bold leading-tight text-[#0b1c30]">{record.kind === "module" ? record.moduleTitle : record.courseTitle}</p>
      {record.kind === "module" && <p className="mt-[.6cqw] text-[1.6cqw] text-[#4d5768]">Module {record.moduleOrder} of <strong className="font-semibold text-[#0b1c30]">{record.courseTitle}</strong></p>}
      <div className="mt-auto grid w-full grid-cols-[1fr_auto_1fr] items-end gap-[3cqw] text-left">
        <div>
          <p className="font-['Georgia',serif] text-[2.6cqw] italic leading-none text-[#10294f]">{ISSUER.signatory}</p>
          <div className="mt-[.8cqw] h-[.12cqw] w-full max-w-[24cqw] bg-[#97a3b6]" />
          <p className="mt-[.7cqw] text-[1.15cqw] font-bold text-[#0b1c30]">{ISSUER.signatory}, {ISSUER.signatoryTitle}</p>
          <p className="text-[1cqw] leading-snug text-[#4d5768]">{ISSUER.name}</p>
        </div>
        <div className="grid justify-items-center">
          <svg viewBox={`0 0 ${qr.viewBox} ${qr.viewBox}`} className="w-[9.5cqw] rounded-[.5cqw] bg-white" role="img" aria-label={`QR code linking to ${record.url}`}><path d={qr.d} fill="#0b1c30" /></svg>
          <p className="mt-[.4cqw] text-[.9cqw] font-semibold uppercase tracking-[.14em] text-[#677284]">Scan to verify</p>
        </div>
        <div className="text-right">
          <p className="text-[1cqw] font-bold uppercase tracking-[.16em] text-[#677284]">Date of completion</p>
          <p className="text-[1.5cqw] font-semibold text-[#0b1c30]">{formatIssueDate(record.issuedAt)}</p>
          <p className="mt-[1cqw] text-[1cqw] font-bold uppercase tracking-[.16em] text-[#677284]">Credential ID</p>
          <p className="font-mono text-[1.35cqw] font-semibold text-[#0b1c30]">{credentialLabel(record)}</p>
          <p className="mt-[.4cqw] break-all text-[.95cqw] text-[#0058be]">{record.url.replace(/^https?:\/\//, "")}</p>
        </div>
      </div>
      <p className="mt-[2cqw] text-[.95cqw] font-semibold uppercase tracking-[.2em] text-[#97a3b6]">{ISSUER.tagline}</p>
    </div>
  </div>;
}
