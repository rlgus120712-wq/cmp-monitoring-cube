const REPO_NAME = "cmp-monitoring-cube"
const isGitHubPages = process.env.GITHUB_PAGES === "true"
const basePath = isGitHubPages ? `/${REPO_NAME}` : undefined
const assetPrefix = isGitHubPages ? `/${REPO_NAME}/` : undefined

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    typedRoutes: true
  },
  output: "export",
  images: {
    unoptimized: true
  },
  trailingSlash: true,
  basePath,
  assetPrefix
}

export default nextConfig

