import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  reactStrictMode: true,
  devIndicators: {
    position: 'bottom-right',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.API_BASE}/api/:path*`,
      }
    ]
  },
  images: {
    remotePatterns: [new URL('https://tone-personal.oss-cn-chengdu.aliyuncs.com/**')]
  },
};

export default nextConfig;
