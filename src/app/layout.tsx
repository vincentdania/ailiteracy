import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { InstallPrompt } from "@/components/pwa/install-prompt";

// Self-hosted variable fonts (SIL OFL), matching hyrax.ng without a build-time fetch.
const inter = localFont({ src: "../fonts/inter-latin-wght.woff2", variable: "--font-inter", display: "swap", weight: "100 900" });
const spaceGrotesk = localFont({ src: "../fonts/space-grotesk-latin-wght.woff2", variable: "--font-space-grotesk", display: "swap", weight: "300 700" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: { default: "Hyrax AI Academy · Build an AI team for your business or practice", template: "%s · Hyrax AI Academy" },
  description: "Choose a practical AI track for business owners or professionals. Build useful assistants with guided setup, templates and human approval. ₦20,000 per track, with three months access.",
  applicationName: "Hyrax AI Academy",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Hyrax AI Academy" },
  category: "education",
  formatDetection: { telephone: false },
  icons: { icon: [{ url: "/icons/icon-source.svg", type: "image/svg+xml" }, { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }], apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] },
  alternates: { canonical: "./" },
  openGraph: { url: "./", title: "Hyrax AI Academy · Build an AI team for your business or practice", description: "Two practical paid tracks. Build AI assistants for your business or professional work with guided setup and human approval.", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Hyrax AI Academy tracks" }] },
  twitter: { card: "summary_large_image", title: "Hyrax AI Academy · Build an AI team for your business or practice", description: "Choose a track and build useful AI assistants with guided setup and human approval.", images: ["/og.png"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#10294f", colorScheme: "light", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}><body>{children}<InstallPrompt /></body></html>;
}
