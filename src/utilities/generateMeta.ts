import type { Metadata } from 'next'

import type { Media, Config } from '../payload-types'

import { localeMeta, localizePath, locales } from '@/i18n/config'
import { getLocale } from '@/i18n/server'
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

const imageFor = (image: Media | Config['db']['defaultIDType'] | null, title: string, lang: string) => {
  if (image && typeof image === 'object' && image.url) {
    return { url: image.sizes?.og?.url || image.url, width: 1200, height: 630, alt: image.alt || title }
  }
  return { url: `/og?title=${encodeURIComponent(title)}&lang=${lang}`, width: 1200, height: 630, alt: title }
}

/** Canonical URL for the current locale plus hreflang links to every language version. */
export const localeAlternates = (locale: (typeof locales)[number], path: string): Metadata['alternates'] => ({
  canonical: localizePath(locale, path),
  languages: {
    ...Object.fromEntries(locales.map((l) => [l, localizePath(l, path)])),
    'x-default': localizePath('en', path),
  },
})

/**
 * Metadata for any CMS document.
 * - meta.title from the SEO tab is used as-is (it already contains the brand suffix);
 *   otherwise the document title goes through the layout's "%s | Brand" template.
 * - Canonical URL is the clean public path in the current language, with
 *   hreflang alternates for the other language.
 */
export const generateMeta = async (args: {
  doc: SeoDoc | null
  path: string
  fallbackDescription?: string | null
  type?: 'website' | 'article'
}): Promise<Metadata> => {
  const { doc, path, fallbackDescription, type = 'website' } = args
  const locale = await getLocale()
  const url = localizePath(locale, path)

  const plainTitle = (doc?.title || '').replace(/\*/g, '')
  const title: Metadata['title'] = doc?.meta?.title ? { absolute: doc.meta.title } : plainTitle
  const description = doc?.meta?.description || fallbackDescription || undefined
  const ogTitle = doc?.meta?.title || plainTitle

  return {
    title,
    description,
    alternates: localeAlternates(locale, path),
    openGraph: mergeOpenGraph({
      type,
      title: ogTitle,
      description,
      url,
      locale: localeMeta[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeMeta[l].og),
      images: [imageFor(doc?.meta?.image ?? null, ogTitle, locale)],
    }),
  }
}
