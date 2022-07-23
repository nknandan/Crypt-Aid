/** @type {import('next').NextConfig} */
const nextConfig = {
  exportTrailingSlash: true,
  reactStrictMode: true,
  future: {
    webpack5: false,
  },
};

module.exports = nextConfig;
