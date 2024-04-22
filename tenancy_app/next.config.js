/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{ hostname: "lh3.googleusercontent.com" }],
  },
  output: "standalone",
};

module.exports = nextConfig;
