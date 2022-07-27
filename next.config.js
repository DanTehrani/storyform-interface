/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ["images.unsplash.com"]
  },

  assetPrefix:
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === "production" ? "/story-interface/" : "",
  webpack5: true,
  webpack: config => {
    config.resolve.fallback = { fs: false };

    return config;
  }
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;
