import { ImageResponse } from "next/og";
import { HYRAX_MARK_PATH, HYRAX_MARK_VIEWBOX, HYRAX_WORDMARK_PATHS, HYRAX_WORDMARK_VIEWBOX } from "@/components/brand/hyrax-logo";

export const runtime = "edge";
export const alt = "An invitation to learn AI for your work in 10 days";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Share images are built per route, not per URL, so the invite card is the same for every referral link.
export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", position: "relative", overflow: "hidden", padding: "64px 76px", color: "white", background: "linear-gradient(150deg, #214889 0%, #10294f 65%, #0b1c30 100%)", fontFamily: "sans-serif" }}>
    <svg viewBox={HYRAX_MARK_VIEWBOX} width={560} height={560} style={{ position: "absolute", right: -110, bottom: -150, opacity: 0.08 }}><path d={HYRAX_MARK_PATH} fill="#ffffff" /></svg>
    <div style={{ display: "flex", alignItems: "center", gap: 18 }}><svg viewBox={HYRAX_WORDMARK_VIEWBOX} width={170} height={41}><g fill="#ffffff">{HYRAX_WORDMARK_PATHS.map((d, i) => <path key={i} d={d} />)}</g></svg><div style={{ display: "flex", height: 34, width: 2, background: "rgba(255,255,255,.5)" }} /><div style={{ display: "flex", fontSize: 30, fontWeight: 700 }}>AI Academy</div></div>
    <div style={{ display: "flex", fontSize: 68, fontWeight: 800, lineHeight: 1.06, marginTop: 64, maxWidth: 960 }}>You’re invited to put AI to work on your job.</div>
    <div style={{ display: "flex", marginTop: "auto", justifyContent: "space-between", alignItems: "flex-end" }}><div style={{ display: "flex", padding: "12px 24px", borderRadius: 999, background: "#0058be", fontSize: 28, fontWeight: 700 }}>Start at learn.hyrax.ng</div><div style={{ display: "flex", fontSize: 20, letterSpacing: 3, textTransform: "uppercase", color: "#bcd6ff" }}>HYRAX — The AI Enablement Company.</div></div>
  </div>, size);
}
