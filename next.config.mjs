/** @type {import('next').NextConfig} */
const nextConfig = {
  // Linting runs as its own CI step (`npm run lint`); accessibility is gated by
  // `npm run test:a11y`. Next 16 no longer runs ESLint during `next build`.
  reactStrictMode: true,
};

export default nextConfig;

// Enable the OpenNext Cloudflare bindings/dev shim when running `next dev`.
// Wrapped so a plain `next build` (and CI without the adapter installed) never fails.
if (process.env.NODE_ENV === "development") {
  try {
    const { initOpenNextCloudflareForDev } = await import("@opennextjs/cloudflare");
    await initOpenNextCloudflareForDev();
  } catch {
    // Adapter not installed yet — safe to ignore during early setup.
  }
}
