import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: { default: "AI Literacy — Personalized AI Certificate Program", template: "%s · AI Literacy" },
  description: "Build practical AI confidence in 20 focused minutes a day.",
  applicationName: "AI Literacy",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "AI Literacy" },
  openGraph: { title: "Personalized AI Certificate Program", description: "Master practical AI through a 21-day path built around your outcome and context.", type: "website", images: ["/api/og?name=Future%20AI%20Leader"] },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = { themeColor: "#123c31", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
