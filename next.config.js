/** @type {import('next').NextConfig} */
// eslint-disable-next-line no-undef
const nextTranslate = require("next-translate");

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  webpack5: true,
  webpack: config => {
    config.resolve.fallback = { fs: false };

    return config;
  }
};

// eslint-disable-next-line no-undef
module.exports = nextTranslate(nextConfig);
