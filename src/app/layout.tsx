import type { Metadata, Viewport } from "next";
import "./globals.css";
import { InstallPrompt } from "@/components/pwa/install-prompt";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: { default: "AI Literacy — Build Your Personal AI Agent and Make AI Work for You", template: "%s · AI Literacy" },
  description: "A hands-on, low-bandwidth course that turns the open-source Hermes Agent into a personal agent that works for you — install it anywhere, teach it your tools, connect Telegram & WhatsApp, and automate your day.",
  applicationName: "AI Literacy",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "AI Literacy" },
  category: "education",
  formatDetection: { telephone: false },
  icons: { icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }], apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }] },
  openGraph: { title: "AI Literacy — Build Your Personal AI Agent and Make AI Work for You", description: "A hands-on course to build a personal AI agent with Hermes Agent — mobile-first, low bandwidth, global.", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Build Your Personal AI Agent and Make AI Work for You" }] },
  twitter: { card: "summary_large_image", title: "AI Literacy — Build Your Personal AI Agent and Make AI Work for You", description: "A hands-on course to build a personal AI agent with Hermes Agent — mobile-first, low bandwidth, global.", images: ["/og.png"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#00261d", colorScheme: "light", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<InstallPrompt /></body></html>;
}
