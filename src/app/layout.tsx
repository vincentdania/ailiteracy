import type { Metadata, Viewport } from "next";
import "./globals.css";
import { InstallPrompt } from "@/components/pwa/install-prompt";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: { default: "AI Literacy — Personalized AI Certificate Program", template: "%s · AI Literacy" },
  description: "Build practical AI confidence through a 21-day learning journey designed for African professionals.",
  applicationName: "AI Literacy",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "AI Literacy" },
  category: "education",
  formatDetection: { telephone: false },
  icons: { icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }], apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }] },
  openGraph: { title: "AI Literacy — Practical AI capability", description: "A personalised 21-day certificate programme built around your outcome and African context.", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "AI Literacy — Learn AI for the outcome you care about" }] },
  twitter: { card: "summary_large_image", title: "AI Literacy — Practical AI capability", description: "A personalised 21-day certificate programme built around your outcome and African context.", images: ["/og.png"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#00261d", colorScheme: "light", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<InstallPrompt /></body></html>;
}
