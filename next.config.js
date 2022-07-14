/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com"]
  },
  assetPrefix:
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === "production" ? "/story-interface/" : ""
};

module.exports = nextConfig;
