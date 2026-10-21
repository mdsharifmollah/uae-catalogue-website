import type { MetadataRoute } from 'next'

import { getServerSideURL } from '@/utilities/getURL'

export default function robots(): MetadataRoute.Robots {
  const base = getServerSideURL()
  // Indexing is opt-in: set SITE_INDEXABLE=true on the production domain at launch.
  const indexable = process.env.SITE_INDEXABLE === 'true'
  return {
    rules: indexable
      ? [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/next/'] }]
      : [{ userAgent: '*', disallow: '/' }],
    sitemap: `${base}/sitemap.xml`,
    host: base,
  }
}
