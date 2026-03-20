import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      { source: "/dashboard", destination: "/?tab=dashboard", permanent: false },
      { source: "/transcribe", destination: "/?tab=dashboard", permanent: false },
    ];
  },
};

export default nextConfig;
