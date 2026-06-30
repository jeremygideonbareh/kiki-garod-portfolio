import type { NextConfig } from "next";

const repo = "kiki-garod-portfolio";
const nextConfig: NextConfig = {
  output: "export",
  distDir: "docs",
  basePath: `/${repo}`,
  assetPrefix: `/${repo}`,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
