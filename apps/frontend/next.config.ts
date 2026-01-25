import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  reactStrictMode: true,
  devIndicators: {
    position: 'bottom-right',
  },
  images: {
    remotePatterns: [new URL('https://tone-personal.oss-cn-chengdu.aliyuncs.com/**')]
  },
};

export default nextConfig;
