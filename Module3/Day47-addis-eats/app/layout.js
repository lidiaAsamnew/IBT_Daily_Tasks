import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";
import { SITE_NAME, SITE_URL, LOCALE, DEFAULT_TITLE, SITE_DESCRIPTION } from "@/lib/site";

// Day 43: downloaded once at build time and served from our own origin - no request to Google,
// no flash of invisible text, and next/font adds a size-matched fallback so the swap barely moves anything.
// `variable` exposes it as --font-inter, which globals.css puts at the front of --font-sans.
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

// Day 44: site-wide defaults. Every page below inherits these and overrides only what is its own.
export const metadata = {
  // Makes every relative URL in metadata absolute (og:image, canonical). Without it, shared links lose their picture.
  metadataBase: new URL(SITE_URL),
  // Pages supply only their own part: "Menu" becomes "Menu · Addis Eats". "/" has no title of its own and gets the default.
  title: { template: `%s · ${SITE_NAME}`, default: DEFAULT_TITLE },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  openGraph: { title: DEFAULT_TITLE, description: SITE_DESCRIPTION, siteName: SITE_NAME, locale: LOCALE, type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="flex min-h-screen flex-col">
        <Providers>
          <NavBar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
