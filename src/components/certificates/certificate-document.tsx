import { Document, Page, StyleSheet, Text, View } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: { backgroundColor: "#f8f7f1", color: "#17211d", padding: 48, fontFamily: "Helvetica" },
  frame: { border: "3px solid #123c31", height: "100%", padding: 48, alignItems: "center", justifyContent: "center" },
  eyebrow: { color: "#1d604d", fontSize: 11, letterSpacing: 3, textTransform: "uppercase", marginBottom: 22 },
  title: { fontFamily: "Times-Roman", fontSize: 40, marginBottom: 28 },
  copy: { color: "#5f6f67", fontSize: 13, marginBottom: 12 },
  name: { color: "#123c31", fontFamily: "Times-Bold", fontSize: 32, marginBottom: 16 },
  course: { fontFamily: "Helvetica-Bold", fontSize: 17, marginBottom: 30 },
  signature: { borderTop: "1px solid #b9c6bf", color: "#5f6f67", fontSize: 8, paddingTop: 12, textAlign: "center", width: "85%" },
});

export function CertificateDocument({ learnerName, courseTitle, issueDate, hash }: { learnerName: string; courseTitle: string; issueDate: Date; hash: string }) {
  return <Document title={`${courseTitle} certificate for ${learnerName}`} author="AI Literacy"><Page size="A4" orientation="landscape" style={styles.page}><View style={styles.frame}><Text style={styles.eyebrow}>AI Literacy · Verified Credential</Text><Text style={styles.title}>Certificate of Completion</Text><Text style={styles.copy}>This certifies that</Text><Text style={styles.name}>{learnerName}</Text><Text style={styles.copy}>successfully completed</Text><Text style={styles.course}>{courseTitle}</Text><Text style={styles.copy}>Issued {issueDate.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</Text><Text style={styles.signature}>SHA-256 credential signature · {hash}</Text></View></Page></Document>;
}
