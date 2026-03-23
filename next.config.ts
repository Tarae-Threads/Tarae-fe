import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "http",
        hostname: "t1.daumcdn.net",
      },
      {
        protocol: "https",
        hostname: "t1.daumcdn.net",
      },
    ],
  },
};

export default nextConfig;
