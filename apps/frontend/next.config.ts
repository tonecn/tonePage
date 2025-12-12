import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  devIndicators: {
    position: 'bottom-right',
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:3001/:path*',
      }
    ]
  },
  images: {
    remotePatterns: [new URL('https://tone-personal.oss-cn-chengdu.aliyuncs.com/**')]
  }
};

export default nextConfig;
