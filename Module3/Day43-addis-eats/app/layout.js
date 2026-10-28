import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "./providers";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import Analytics from "@/components/Analytics";

// Day 43: downloaded once at build time and served from our own origin - no request to Google,
// no flash of invisible text, and next/font adds a size-matched fallback so the swap barely moves anything.
// `variable` exposes it as --font-inter, which globals.css puts at the front of --font-sans.
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });

export const metadata = {
  title: "Addis Eats",
  description: "Ethiopian food delivered across Addis Ababa.",
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
