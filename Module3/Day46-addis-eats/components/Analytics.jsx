import Script from "next/script";

// The only third-party script in the app, and it is optional: nothing loads unless
// NEXT_PUBLIC_ANALYTICS_SRC is set (see .env.example). It is public by design - the browser has to
// download that URL anyway - so it is fine for it to be NEXT_PUBLIC_. It is inlined at build time.
//
// strategy="lazyOnload" waits for the browser to be idle, after the page is usable. Analytics is
// the textbook case: nobody is waiting for it, so it must never compete with the hero image (LCP)
// or with taps (INP). Day 43 slide 13: beforeInteractive blocks, afterInteractive is the default,
// lazyOnload is for chat widgets and analytics.
export default function Analytics() {
  const src = process.env.NEXT_PUBLIC_ANALYTICS_SRC;
  if (!src) return null;
  return <Script src={src} strategy="lazyOnload" />;
}
