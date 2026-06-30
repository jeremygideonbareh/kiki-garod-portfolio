import type { NextConfig } from "next";

const repo = "kiki-garod-portfolio";
const isActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
  output: "export",
  distDir: "docs",
  basePath: isActions ? `/${repo}` : "",
  assetPrefix: isActions ? `/${repo}` : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
