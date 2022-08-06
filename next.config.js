/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: "/story-form-interface",

  assetPrefix:
    // eslint-disable-next-line no-undef
    process.env.NODE_ENV === "production" ? "/story-form-interface/" : "",
  webpack5: true,
  webpack: config => {
    config.resolve.fallback = { fs: false };

    return config;
  }
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;
