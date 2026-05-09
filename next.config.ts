import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  devIndicators: false,
  turbopack: {
    root: __dirname
  }
};

export default nextConfig;
