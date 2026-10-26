import "./globals.css";
import { Inter } from "next/font/google";
import Providers from "./providers";
import Header from "./Header";
import Footer from "./Footer";
import { SITE, siteUrl } from "@/lib/site";

// next/font downloads Inter at BUILD time and serves it from our own origin: no request to Google at
// runtime, a metric-matched fallback (no layout jump), and only the Latin subset (Day 43).
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

// metadataBase is what turns relative image paths into absolute URLs for social previews (Day 44).
export const metadata = {
  metadataBase: new URL(siteUrl()),
  title: { template: "%s · Addis Eats", default: `${SITE.name} — food delivery in ${SITE.locality}` },
  description: SITE.description,
  applicationName: SITE.name,
  openGraph: { type: "website", siteName: SITE.name, locale: "en_ET" },
  twitter: { card: "summary_large_image" },
};

export const viewport = { width: "device-width", initialScale: 1, themeColor: "#14532d" };

// Server component: it imports nothing client-side except through <Providers>, and it never reads
// cookies — so the public pages stay static (Day 37 / Day 38).
export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>
        <Providers>
          <a className="skip-link" href="#main">Skip to content</a>
          <Header />
          <main id="main" className="site-main">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
