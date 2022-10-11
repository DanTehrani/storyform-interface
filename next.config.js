/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: false,
  swcMinify: true,
  webpack5: true,
  webpack: config => {
    config.resolve.fallback = { fs: false };
    config.experiments = { asyncWebAssembly: true };

    return config;
  }
};

// eslint-disable-next-line no-undef
module.exports = nextConfig;
