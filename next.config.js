/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  reactStrictMode: true,
  future: {
    webpack5: false,
  },
};

module.exports = nextConfig;
