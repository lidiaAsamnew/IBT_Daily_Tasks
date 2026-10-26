/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  reactStrictMode: true,

  // All dish photos are local files in /public, so no remotePatterns are needed.
  // If photos ever move to a CDN, list its hostname here (Day 43):
  //   images: { remotePatterns: [{ protocol: "https", hostname: "cdn.example.com" }] }
  images: { formats: ["image/avif", "image/webp"] },

  // Static rules live in config, not middleware (Day 43) — keeps middleware fast.
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
};

export default nextConfig;
