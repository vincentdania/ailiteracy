import type { Metadata, Viewport } from "next";
import "./globals.css";
import { InstallPrompt } from "@/components/pwa/install-prompt";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: { default: "AI Literacy — AI for Your Work in 10 Days", template: "%s · AI Literacy" },
  description: "A step-by-step, no-code course for working people: use free AI tools on your phone to finish reports, emails and documents faster, then build your first working agent. Nothing technical assumed.",
  applicationName: "AI Literacy",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "AI Literacy" },
  category: "education",
  formatDetection: { telephone: false },
  icons: { icon: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }], apple: [{ url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }] },
  openGraph: { title: "AI Literacy — AI for Your Work in 10 Days", description: "A no-code, mobile-first AI-for-work course built for Nigerian working people — free tools, 10 days, real outputs.", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "AI for Your Work in 10 Days" }] },
  twitter: { card: "summary_large_image", title: "AI Literacy — AI for Your Work in 10 Days", description: "A no-code, mobile-first AI-for-work course built for Nigerian working people — free tools, 10 days, real outputs.", images: ["/og.png"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#00261d", colorScheme: "light", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<InstallPrompt /></body></html>;
}
