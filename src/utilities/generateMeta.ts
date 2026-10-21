import type { Metadata } from 'next'

import type { Media, Config } from '../payload-types'

import { mergeOpenGraph } from './mergeOpenGraph'

type SeoDoc = {
  title?: string | null
  slug?: string | null
  meta?: {
    title?: string | null
    description?: string | null
    image?: Media | Config['db']['defaultIDType'] | null
  } | null
}

const imageFor = (image: Media | Config['db']['defaultIDType'] | null, title: string) => {
  if (image && typeof image === 'object' && image.url) {
    return { url: image.sizes?.og?.url || image.url, width: 1200, height: 630, alt: image.alt || title }
  }
  return { url: `/og?title=${encodeURIComponent(title)}`, width: 1200, height: 630, alt: title }
}

/**
 * Metadata for any CMS document.
 * - meta.title from the SEO tab is used as-is (it already contains the brand suffix);
 *   otherwise the document title goes through the layout's "%s | Brand" template.
 * - Canonical URL is always the clean public path.
 */
export const generateMeta = async (args: {
  doc: SeoDoc | null
  path: string
  fallbackDescription?: string | null
  type?: 'website' | 'article'
}): Promise<Metadata> => {
  const { doc, path, fallbackDescription, type = 'website' } = args

  const plainTitle = (doc?.title || '').replace(/\*/g, '')
  const title: Metadata['title'] = doc?.meta?.title ? { absolute: doc.meta.title } : plainTitle
  const description = doc?.meta?.description || fallbackDescription || undefined
  const ogTitle = doc?.meta?.title || plainTitle

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: mergeOpenGraph({
      type,
      title: ogTitle,
      description,
      url: path,
      images: [imageFor(doc?.meta?.image ?? null, ogTitle)],
    }),
  }
}
