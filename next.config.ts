import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";

let basePath = "";
let assetPrefix = "";

if (isGithubActions) {
  const repo = process.env.GITHUB_REPOSITORY?.replace(/.*?\//, "") ?? "";
  basePath = `/${repo}`;
  assetPrefix = `/${repo}`;
}

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
