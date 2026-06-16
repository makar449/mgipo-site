/** @type {import('next').NextConfig} */
const isGithubPages = process.env.GITHUB_PAGES === 'true' || process.env.NEXT_PUBLIC_STATIC_EXPORT === 'true';

const nextConfig = {
  reactStrictMode: true,
  typedRoutes: false,
  output: isGithubPages ? 'export' : undefined,
  trailingSlash: isGithubPages,
  basePath: isGithubPages ? '/mgipo-site' : '',
  assetPrefix: isGithubPages ? '/mgipo-site/' : '',
  images: {
    unoptimized: true,
    remotePatterns: []
  },
  typescript: {
    ignoreBuildErrors: isGithubPages
  },
  experimental: {
    optimizePackageImports: ['lucide-react']
  }
};

export default nextConfig;
