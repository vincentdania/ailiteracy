import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { InstallPrompt } from "@/components/pwa/install-prompt";

// Self-hosted variable fonts (SIL OFL), matching hyrax.ng without a build-time fetch.
const inter = localFont({ src: "../fonts/inter-latin-wght.woff2", variable: "--font-inter", display: "swap", weight: "100 900" });
const spaceGrotesk = localFont({ src: "../fonts/space-grotesk-latin-wght.woff2", variable: "--font-space-grotesk", display: "swap", weight: "300 700" });

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXTAUTH_URL ?? "http://localhost:3000"),
  title: { default: "Hyrax AI Academy · Expand your capabilities. Make AI work for you.", template: "%s · Hyrax AI Academy" },
  description: "A step-by-step, no-code course for working people. Use free AI tools on your phone to finish reports, emails and documents faster, then build your first working agent. Nothing technical assumed.",
  applicationName: "Hyrax AI Academy",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, statusBarStyle: "default", title: "Hyrax AI Academy" },
  category: "education",
  formatDetection: { telephone: false },
  icons: { icon: [{ url: "/icons/icon-source.svg", type: "image/svg+xml" }, { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" }], apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }] },
  alternates: { canonical: "./" },
  openGraph: { url: "./", title: "Hyrax AI Academy · Expand your capabilities. Make AI work for you.", description: "A no-code course for Nigerian working people. Use free AI tools on your phone to get real work done faster, in 10 days.", type: "website", images: [{ url: "/og.png", width: 1200, height: 630, alt: "Hyrax AI Academy · Expand your capabilities. Make AI work for you." }] },
  twitter: { card: "summary_large_image", title: "Hyrax AI Academy · Expand your capabilities. Make AI work for you.", description: "A no-code course for Nigerian working people. Use free AI tools on your phone to get real work done faster, in 10 days.", images: ["/og.png"] },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = { themeColor: "#10294f", colorScheme: "light", width: "device-width", initialScale: 1, viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}><body>{children}<InstallPrompt /></body></html>;
}
