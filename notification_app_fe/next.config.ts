import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /** Proxy API calls to the evaluation server to avoid CORS issues */
  async rewrites() {
    return [
      {
        source: "/api/proxy/:path*",
        destination: "http://20.207.122.201/evaluation-service/:path*",
      },
    ];
  },
};

export default nextConfig;
