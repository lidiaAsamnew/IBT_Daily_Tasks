/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Day 43: a remote host is only optimised if it is listed here. An unlisted host fails, on purpose,
    // so our optimiser cannot be used to resize other people's images. Today every dish image is local
    // (public/dishes/); this is where a CDN goes the moment dish photos move off the server.
    remotePatterns: [{ protocol: "https", hostname: "cdn.addiseats.et" }],
    // Serve AVIF/WebP to browsers that support them (the Next.js default order, written out so it is visible).
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
