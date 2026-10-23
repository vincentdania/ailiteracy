import { Document, Page, Path, StyleSheet, Svg, Text, View } from "@react-pdf/renderer";
import { HYRAX_MARK_PATH, HYRAX_MARK_VIEWBOX, HYRAX_WORDMARK_PATHS, HYRAX_WORDMARK_VIEWBOX } from "@/components/brand/hyrax-logo";
import { formatIssueDate, ISSUER } from "@/lib/certificates";
import { qrPath } from "@/lib/qr";

const NAVY = "#10294f";
const INK = "#10294f";
const MUTED = "#4d5768";
const GOLD = "#c8742b";
const BLUE = "#10294f";

const styles = StyleSheet.create({
  page: { backgroundColor: "#ffffff", color: INK, fontFamily: "Helvetica", padding: 26 },
  outer: { border: `2.5pt solid ${NAVY}`, borderRadius: 10, height: "100%", padding: 7 },
  inner: { border: `0.8pt solid ${GOLD}`, borderRadius: 7, height: "100%", paddingTop: 34, paddingBottom: 26, paddingHorizontal: 54, alignItems: "center", position: "relative" },
  lockup: { flexDirection: "row", alignItems: "center" },
  academy: { fontFamily: "Helvetica-Bold", fontSize: 13, color: INK, marginLeft: 10, paddingLeft: 10, borderLeft: `0.8pt solid ${NAVY}` },
  eyebrow: { color: BLUE, fontFamily: "Helvetica-Bold", fontSize: 10, letterSpacing: 3.5, textTransform: "uppercase", marginTop: 24 },
  copy: { color: MUTED, fontSize: 11.5, marginTop: 16 },
  name: { color: "#10294f", fontFamily: "Helvetica-Bold", fontSize: 34, marginTop: 8, textAlign: "center" },
  rule: { width: 220, height: 1.2, backgroundColor: GOLD, marginTop: 10 },
  title: { fontFamily: "Helvetica-Bold", fontSize: 16, marginTop: 8, textAlign: "center", color: INK },
  sub: { color: MUTED, fontSize: 11.5, marginTop: 5, textAlign: "center" },
  footer: { position: "absolute", left: 54, right: 54, bottom: 40, flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" },
  sigName: { fontFamily: "Times-Italic", fontSize: 22, color: "#10294f" },
  sigLine: { width: 190, height: 0.8, backgroundColor: "#97a3b6", marginTop: 4, marginBottom: 5 },
  sigTitle: { fontFamily: "Helvetica-Bold", fontSize: 8.5, color: INK },
  small: { fontSize: 7.5, color: MUTED, marginTop: 1.5 },
  label: { fontFamily: "Helvetica-Bold", fontSize: 6.5, letterSpacing: 1.4, textTransform: "uppercase", color: "#677284", textAlign: "right" },
  value: { fontSize: 10, color: INK, textAlign: "right", marginBottom: 6 },
  id: { fontFamily: "Courier-Bold", fontSize: 10, color: INK, textAlign: "right" },
  url: { fontSize: 7, color: BLUE, textAlign: "right", marginTop: 2 },
  tagline: { position: "absolute", bottom: 16, left: 0, right: 0, textAlign: "center", fontFamily: "Helvetica-Bold", fontSize: 6.5, letterSpacing: 2.2, textTransform: "uppercase", color: "#97a3b6" },
});

export type CertificatePdfInput = { learnerName: string; kind: "module" | "course"; courseTitle: string; moduleTitle: string | null; moduleOrder: number | null; issuedAt: Date; credentialLabel: string; url: string };

export function CertificateDocument(input: CertificatePdfInput) {
  const qr = qrPath(input.url);
  const heading = input.kind === "module" ? input.moduleTitle ?? "" : input.courseTitle;
  return <Document title={`${heading} certificate for ${input.learnerName}`} author={ISSUER.name} subject={`Hyrax AI Academy certificate ${input.credentialLabel}`} creator={ISSUER.academy}>
    <Page size="A4" orientation="landscape" style={styles.page}>
      <View style={styles.outer}><View style={styles.inner}>
        <Svg viewBox={HYRAX_MARK_VIEWBOX} style={{ position: "absolute", right: -40, bottom: -50, width: 260, height: 260, opacity: 0.045 }}><Path d={HYRAX_MARK_PATH} fill={NAVY} /></Svg>
        <View style={styles.lockup}><Svg viewBox={HYRAX_WORDMARK_VIEWBOX} style={{ width: 120, height: 29 }}>{HYRAX_WORDMARK_PATHS.map((d, i) => <Path key={i} d={d} fill={NAVY} />)}</Svg><Text style={styles.academy}>AI Academy</Text></View>
        <Text style={styles.eyebrow}>Certificate of completion</Text>
        <Text style={styles.copy}>This certifies that</Text>
        <Text style={styles.name}>{input.learnerName}</Text>
        <View style={styles.rule} />
        <Text style={styles.copy}>{input.kind === "module" ? "has successfully completed the module" : "has successfully completed the course"}</Text>
        <Text style={styles.title}>{heading}</Text>
        {input.kind === "module" && <Text style={styles.sub}>Module {input.moduleOrder} of {input.courseTitle}</Text>}
        <View style={styles.footer}>
          <View>
            <Text style={styles.sigName}>{ISSUER.signatory}</Text>
            <View style={styles.sigLine} />
            <Text style={styles.sigTitle}>{ISSUER.signatory}, {ISSUER.signatoryTitle}</Text>
            <Text style={styles.small}>{ISSUER.name}</Text>
          </View>
          <View style={{ alignItems: "center" }}>
            <Svg viewBox={`0 0 ${qr.viewBox} ${qr.viewBox}`} style={{ width: 70, height: 70 }}><Path d={qr.d} fill={INK} /></Svg>
            <Text style={{ fontSize: 6, letterSpacing: 1.2, color: "#677284", marginTop: 2 }}>SCAN TO VERIFY</Text>
          </View>
          <View>
            <Text style={styles.label}>Date of completion</Text>
            <Text style={styles.value}>{formatIssueDate(input.issuedAt)}</Text>
            <Text style={styles.label}>Credential ID</Text>
            <Text style={styles.id}>{input.credentialLabel}</Text>
            <Text style={styles.url}>{input.url.replace(/^https?:\/\//, "")}</Text>
          </View>
        </View>
        <Text style={styles.tagline}>{ISSUER.tagline}</Text>
      </View></View>
    </Page>
  </Document>;
}
