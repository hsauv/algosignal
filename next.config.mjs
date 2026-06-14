/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Produce a self-contained server bundle (.next/standalone) so the app ships
  // as a small Docker image runnable on any sovereign cloud — no Vercel needed.
  output: "standalone",
};

export default nextConfig;
