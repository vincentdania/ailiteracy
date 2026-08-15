import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "An invitation to the 21-Day AI Challenge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image({ searchParams }: { searchParams: Promise<{ name?: string; ref?: string }> }) {
  const { name = "A friend", ref = "AI21" } = await searchParams;
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 76, color: "white", background: "#123c31", fontFamily: "sans-serif" }}><div style={{ color: "#d9f99d", fontSize: 24, letterSpacing: 4, textTransform: "uppercase" }}>AI Literacy · 21-Day Challenge</div><div style={{ display: "flex", fontSize: 72, fontWeight: 800, lineHeight: 1.05, marginTop: 36, maxWidth: 980 }}>{name} invited you to build practical AI confidence.</div><div style={{ display: "flex", marginTop: 46, fontSize: 28, color: "#d9f99d" }}>Invite code · {ref}</div></div>, size);
}
