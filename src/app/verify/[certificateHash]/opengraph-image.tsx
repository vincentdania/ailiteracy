import { ImageResponse } from "next/og";
import { HYRAX_WORDMARK_PATHS, HYRAX_WORDMARK_VIEWBOX } from "@/components/brand/hyrax-logo";
import { findCertificate } from "@/lib/certificate-records";
import { formatIssueDate } from "@/lib/certificates";

export const alt = "A verified Hyrax AI Academy certificate";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ params }: { params: Promise<{ certificateHash: string }> }) {
  const { certificateHash } = await params;
  const record = await findCertificate(certificateHash);
  const who = record?.showName ? record.learnerName : "A Hyrax learner";
  const what = record ? (record.kind === "module" ? record.moduleTitle : record.courseTitle) : "Hyrax AI Academy";
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", padding: 64, color: "#0b1c30", background: "linear-gradient(135deg, #ffffff 0%, #eef4fd 100%)", fontFamily: "sans-serif", border: "14px solid #214889" }}>
    <div style={{ display: "flex", alignItems: "center", gap: 20 }}><svg viewBox={HYRAX_WORDMARK_VIEWBOX} width={200} height={49} fill="#214889">{HYRAX_WORDMARK_PATHS.map((d, i) => <path key={i} d={d} />)}</svg><div style={{ fontSize: 30, fontWeight: 600, color: "#0b1c30" }}>AI Academy</div></div>
    <div style={{ display: "flex", marginTop: 56, fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: "#0058be", fontWeight: 700 }}>Verified certificate of completion</div>
    <div style={{ display: "flex", marginTop: 20, fontSize: 68, fontWeight: 800, lineHeight: 1.05 }}>{who}</div>
    <div style={{ display: "flex", marginTop: 18, fontSize: 38, color: "#26324a", maxWidth: 1000 }}>{what}</div>
    {record?.kind === "module" && <div style={{ display: "flex", marginTop: 10, fontSize: 26, color: "#4d5768" }}>{record.courseTitle}</div>}
    <div style={{ display: "flex", marginTop: "auto", justifyContent: "space-between", alignItems: "flex-end", fontSize: 24, color: "#4d5768" }}><div style={{ display: "flex" }}>{record ? formatIssueDate(record.issuedAt) : ""}</div><div style={{ display: "flex", color: "#214889", fontWeight: 700 }}>HYRAX — The AI Enablement Company</div></div>
  </div>, size);
}
