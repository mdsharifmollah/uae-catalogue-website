import type { MetadataRoute } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { localizePath, locales } from '@/i18n/config'
import { getServerSideURL } from '@/utilities/getURL'
import { docPath, type RoutableCollection } from '@/utilities/routes'

export const revalidate = 3600

type Doc = {
  slug?: string | null
  updatedAt?: string
  heroImage?: unknown
  coverImage?: unknown
  meta?: { image?: unknown } | null
}

const imageUrl = (base: string, img: unknown) => {
  if (img && typeof img === 'object' && 'url' in img && (img as { url?: string }).url) {
    const url = (img as { url: string }).url
    return url.startsWith('http') ? url : `${base}${url}`
  }
  return null
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getServerSideURL()
  const payload = await getPayload({ config: configPromise })

  const fetchAll = async (collection: RoutableCollection) =>
    (
      await payload.find({
        collection,
        draft: false,
        depth: 1,
        limit: 1000,
        pagination: false,
        overrideAccess: false,
        where: { _status: { equals: 'published' } },
      })
    ).docs as Doc[]

  const [pages, products, industries, projects, posts] = await Promise.all([
    fetchAll('pages'),
    fetchAll('products'),
    fetchAll('industries'),
    fetchAll('projects'),
    fetchAll('posts'),
  ])

  // English URL plus hreflang alternates; the Arabic copies are added below.
  const localized = (path: string) => ({
    url: `${base}${localizePath('en', path)}`,
    alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${base}${localizePath(l, path)}`])) },
  })

  const entry = (
    collection: RoutableCollection,
    doc: Doc,
    priority: number,
    changeFrequency: MetadataRoute.Sitemap[number]['changeFrequency'],
  ): MetadataRoute.Sitemap[number] => {
    const images = [imageUrl(base, doc.heroImage), imageUrl(base, doc.coverImage), imageUrl(base, doc.meta?.image)].filter(
      Boolean,
    ) as string[]
    return {
      ...localized(docPath(collection, doc.slug)),
      lastModified: doc.updatedAt ? new Date(doc.updatedAt) : undefined,
      changeFrequency,
      priority,
      ...(images.length ? { images } : {}),
    }
  }

  const hubSlugs = new Set(['products', 'industries', 'work', 'guides'])
  const hubs: MetadataRoute.Sitemap = ['/products', '/industries', '/work', '/guides'].map((p) => ({
    ...localized(p),
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  const english: MetadataRoute.Sitemap = [
    ...pages
      .filter((p) => p.slug && !hubSlugs.has(p.slug))
      .map((p) => entry('pages', p, p.slug === 'home' ? 1 : 0.7, 'monthly')),
    ...hubs,
    ...products.map((p) => entry('products', p, 0.9, 'monthly')),
    ...industries.map((p) => entry('industries', p, 0.8, 'monthly')),
    ...projects.map((p) => entry('projects', p, 0.6, 'monthly')),
    ...posts.map((p) => entry('posts', p, 0.6, 'monthly')),
  ]

  // Same pages in Arabic (/ar/...), sharing the English entry's alternates.
  const arabic = english.map((e) => ({ ...e, url: e.alternates?.languages?.ar || e.url }))
  return [...english, ...arabic]
}
