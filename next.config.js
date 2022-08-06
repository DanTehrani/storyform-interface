/** @type {import('next').NextConfig} */

const GITHUB_PAGES_PATH =
  // eslint-disable-next-line no-undef
  process.env.NODE_ENV === "production" ? "/story-form-interface" : "";

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  basePath: GITHUB_PAGES_PATH,

  assetPrefix: GITHUB_PAGES_PATH,
  webpack5: true,
  webpack: config => {
    config.resolve.fallback = { fs: false };

    return config;
  }
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;
