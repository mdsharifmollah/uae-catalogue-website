import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)
import { redirects } from './redirects'

const NEXT_PUBLIC_SERVER_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.__NEXT_PRIVATE_ORIGIN || 'http://localhost:3000'

const nextConfig: NextConfig = {
  // Temporarily required on Windows until Next.js fixes Turbopack Sass resolution.
  // See: https://github.com/vercel/next.js/issues/86431
  sassOptions: {
    loadPaths: ['./node_modules/@payloadcms/ui/dist/scss/'],
  },
  images: {
    localPatterns: [
      {
        pathname: '/api/media/file/**',
      },
    ],
    qualities: [70, 80, 90],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      { protocol: 'https', hostname: '*.public.blob.vercel-storage.com' },
      ...[NEXT_PUBLIC_SERVER_URL /* 'https://example.com' */].map((item) => {
        const url = new URL(item)

        return {
          hostname: url.hostname,
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
        }
      }),
    ],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  reactStrictMode: true,
  // The root layout sits under [lang], so 404s use app/global-not-found.tsx.
  experimental: {
    globalNotFound: true,
  },
  // Until the client's real content and domain go live, keep every page out of search results.
  async headers() {
    if (process.env.SITE_INDEXABLE === 'true') return []
    return [{ source: '/:path*', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }] }]
  },
  redirects,
  // Pages live under app/(frontend)/[lang]. English URLs carry no prefix, so map
  // them onto the "en" segment; /ar/... matches [lang] directly. afterFiles runs
  // after static routes (og, llms.txt, next/*) and public files, but before
  // dynamic ones, so the CMS catch-alls (/admin, /api) are excluded explicitly.
  async rewrites() {
    return {
      beforeFiles: [],
      afterFiles: [
        { source: '/', destination: '/en' },
        { source: '/:path((?!(?:ar|en|admin|api)(?:/|$)).+)', destination: '/en/:path' },
      ],
      fallback: [],
    }
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
