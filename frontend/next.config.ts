import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow images from external sources if needed in future
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  // Required for Railway WebSocket proxying
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Access-Control-Allow-Origin", value: "*" },
        ],
      },
    ];
  },
};

export default nextConfig;
