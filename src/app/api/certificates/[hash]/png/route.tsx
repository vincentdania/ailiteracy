import { readFile } from "node:fs/promises";
import path from "node:path";
import { ImageResponse } from "next/og";
import { HYRAX_MARK_PATH, HYRAX_MARK_VIEWBOX, HYRAX_WORDMARK_PATHS, HYRAX_WORDMARK_VIEWBOX } from "@/components/brand/hyrax-logo";
import { certificateFileName, credentialLabel, downloadableCertificate } from "@/lib/certificate-records";
import { formatIssueDate, ISSUER } from "@/lib/certificates";
import { qrPath } from "@/lib/qr";

export const dynamic = "force-dynamic";

// A4 landscape at about 200 dpi: sharp enough to print and light enough to share.
const WIDTH = 2339;
const HEIGHT = 1654;
const NAVY = "#10294f";
const INK = "#10294f";
const MUTED = "#4d5768";
const GOLD = "#c8742b";
const BLUE = "#10294f";

let fonts: Promise<{ name: string; data: Buffer; weight: 400 | 600 | 700; style: "normal" | "italic" }[]> | undefined;
function loadFonts() {
  const file = (name: string) => readFile(path.join(process.cwd(), "public", "fonts", "certificate", name));
  fonts ??= Promise.all([
    file("Inter-Regular.ttf").then((data) => ({ name: "Inter", data, weight: 400 as const, style: "normal" as const })),
    file("Inter-SemiBold.ttf").then((data) => ({ name: "Inter", data, weight: 600 as const, style: "normal" as const })),
    file("SpaceGrotesk-Bold.ttf").then((data) => ({ name: "Space Grotesk", data, weight: 700 as const, style: "normal" as const })),
    file("LiberationSerif-Italic.ttf").then((data) => ({ name: "Signature", data, weight: 400 as const, style: "italic" as const })),
  ]);
  return fonts;
}

export async function GET(_request: Request, { params }: { params: Promise<{ hash: string }> }) {
  const { hash } = await params;
  const result = await downloadableCertificate(hash);
  if ("error" in result) return result.error;
  const { record } = result;
  const qr = qrPath(record.url);
  const heading = record.kind === "module" ? record.moduleTitle ?? "" : record.courseTitle;
  const label = { display: "flex", fontSize: 20, fontWeight: 600, letterSpacing: 4, textTransform: "uppercase", color: "#677284" } as const;

  const image = new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", padding: 70, background: "#ffffff", fontFamily: "Inter", color: INK }}>
    <div style={{ flex: 1, display: "flex", padding: 20, border: `7px solid ${NAVY}`, borderRadius: 28 }}>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", position: "relative", overflow: "hidden", padding: "96px 150px 70px", border: `2px solid ${GOLD}`, borderRadius: 20 }}>
        <svg viewBox={HYRAX_MARK_VIEWBOX} width={700} height={700} style={{ position: "absolute", right: -110, bottom: -140, opacity: 0.045 }}><path d={HYRAX_MARK_PATH} fill={NAVY} /></svg>
        <div style={{ display: "flex", alignItems: "center" }}>
          <svg viewBox={HYRAX_WORDMARK_VIEWBOX} width={330} height={81}><g fill={NAVY}>{HYRAX_WORDMARK_PATHS.map((d, i) => <path key={i} d={d} />)}</g></svg>
          <div style={{ display: "flex", marginLeft: 28, paddingLeft: 28, borderLeft: `3px solid ${NAVY}`, fontFamily: "Space Grotesk", fontSize: 40, fontWeight: 700 }}>AI Academy</div>
        </div>
        <div style={{ display: "flex", marginTop: 66, fontSize: 28, fontWeight: 600, letterSpacing: 10, textTransform: "uppercase", color: BLUE }}>Certificate of completion</div>
        <div style={{ display: "flex", marginTop: 44, fontSize: 32, color: MUTED }}>This certifies that</div>
        <div style={{ display: "flex", marginTop: 18, fontFamily: "Space Grotesk", fontSize: 104, fontWeight: 700, color: "#10294f", textAlign: "center" }}>{record.learnerName}</div>
        <div style={{ display: "flex", marginTop: 26, width: 620, height: 4, background: GOLD }} />
        <div style={{ display: "flex", marginTop: 40, fontSize: 32, color: MUTED }}>{record.kind === "module" ? "has successfully completed the module" : "has successfully completed the course"}</div>
        <div style={{ display: "flex", marginTop: 22, fontFamily: "Space Grotesk", fontSize: 62, fontWeight: 700, textAlign: "center" }}>{heading}</div>
        {record.kind === "module" && <div style={{ display: "flex", marginTop: 14, fontSize: 32, color: MUTED }}>{`Module ${record.moduleOrder} of ${record.courseTitle}`}</div>}
        <div style={{ display: "flex", marginTop: "auto", width: "100%", justifyContent: "space-between", alignItems: "flex-end" }}>
          <div style={{ display: "flex", flexDirection: "column", width: 640 }}>
            <div style={{ display: "flex", fontFamily: "Signature", fontStyle: "italic", fontSize: 62, color: "#10294f" }}>{ISSUER.signatory}</div>
            <div style={{ display: "flex", marginTop: 8, marginBottom: 14, width: 520, height: 2, background: "#97a3b6" }} />
            <div style={{ display: "flex", fontSize: 24, fontWeight: 600 }}>{`${ISSUER.signatory}, ${ISSUER.signatoryTitle}`}</div>
            <div style={{ display: "flex", marginTop: 6, fontSize: 20, color: MUTED }}>{ISSUER.name}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <svg viewBox={`0 0 ${qr.viewBox} ${qr.viewBox}`} width={200} height={200}><path d={qr.d} fill={INK} /></svg>
            <div style={{ ...label, marginTop: 6, fontSize: 17 }}>Scan to verify</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", width: 640 }}>
            <div style={label}>Date of completion</div>
            <div style={{ display: "flex", marginTop: 6, fontSize: 32, fontWeight: 600 }}>{formatIssueDate(record.issuedAt)}</div>
            <div style={{ ...label, marginTop: 24 }}>Credential ID</div>
            <div style={{ display: "flex", marginTop: 6, fontSize: 30, fontWeight: 600, letterSpacing: 2 }}>{credentialLabel(record)}</div>
            <div style={{ display: "flex", marginTop: 6, fontSize: 20, color: BLUE }}>{record.url.replace(/^https?:\/\//, "")}</div>
          </div>
        </div>
        <div style={{ display: "flex", marginTop: 40, fontSize: 18, fontWeight: 600, letterSpacing: 6, textTransform: "uppercase", color: "#97a3b6" }}>{ISSUER.tagline}</div>
      </div>
    </div>
  </div>, { width: WIDTH, height: HEIGHT, fonts: await loadFonts() });

  return new Response(image.body, { headers: { "content-type": "image/png", "content-disposition": `attachment; filename="${certificateFileName(record)}.png"`, "cache-control": "private, max-age=300" } });
}
