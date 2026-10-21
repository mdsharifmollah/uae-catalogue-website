import type { FAQ, Media, Post, Product, SiteSetting } from '@/payload-types'

import { getServerSideURL } from './getURL'
import { telHref } from './whatsapp'

const abs = (path?: string | null) => {
  if (!path) return undefined
  return path.startsWith('http') ? path : `${getServerSideURL()}${path}`
}

const mediaUrl = (m?: Media | number | null, size: 'og' | 'large' = 'large') =>
  m && typeof m === 'object' ? abs(m.sizes?.[size]?.url || m.url) : undefined

export const orgId = () => `${getServerSideURL()}/#organization`

const dayMap: Record<string, string> = {
  Monday: 'https://schema.org/Monday',
  Tuesday: 'https://schema.org/Tuesday',
  Wednesday: 'https://schema.org/Wednesday',
  Thursday: 'https://schema.org/Thursday',
  Friday: 'https://schema.org/Friday',
  Saturday: 'https://schema.org/Saturday',
  Sunday: 'https://schema.org/Sunday',
}

/** Organization + LocalBusiness — only facts entered in Site Settings, nothing invented. */
export const organizationSchema = (s: SiteSetting) => {
  const url = getServerSideURL()
  const a = s.address
  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'LocalBusiness'],
    '@id': orgId(),
    name: s.companyName,
    alternateName: s.shortName,
    url,
    description: s.defaultDescription || s.tagline || undefined,
    logo: mediaUrl(s.logoOnLight) || mediaUrl(s.logoOnDark),
    image: mediaUrl(s.defaultOgImage, 'og'),
    telephone: s.phoneNumber ? telHref(s.phoneNumber).replace('tel:', '') : undefined,
    email: s.email || undefined,
    foundingDate: s.foundingYear ? String(s.foundingYear) : undefined,
    address: {
      '@type': 'PostalAddress',
      streetAddress: a?.street || undefined,
      addressLocality: a?.locality || undefined,
      addressRegion: a?.region || undefined,
      postalCode: a?.postalCode || undefined,
      addressCountry: a?.countryCode || 'AE',
    },
    geo:
      a?.latitude && a?.longitude
        ? { '@type': 'GeoCoordinates', latitude: a.latitude, longitude: a.longitude }
        : undefined,
    hasMap: a?.mapUrl || undefined,
    areaServed: s.serviceArea || undefined,
    openingHoursSpecification: s.openingHours?.length
      ? s.openingHours.map((h) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: (h.days || []).map((d) => dayMap[d]),
          opens: h.opens,
          closes: h.closes,
        }))
      : undefined,
    sameAs: s.socials?.map((x) => x.url).filter(Boolean),
    contactPoint: s.phoneNumber
      ? {
          '@type': 'ContactPoint',
          telephone: telHref(s.phoneNumber).replace('tel:', ''),
          contactType: 'sales',
          availableLanguage: ['English', 'Arabic'],
        }
      : undefined,
  }
}

export const websiteSchema = (s: SiteSetting) => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  '@id': `${getServerSideURL()}/#website`,
  url: getServerSideURL(),
  name: s.companyName,
  publisher: { '@id': orgId() },
  inLanguage: 'en',
})

export const breadcrumbSchema = (items: { name: string; path: string }[]) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: abs(item.path),
  })),
})

export const faqSchema = (faqs: (FAQ | number)[]) => {
  const list = faqs.filter((f): f is FAQ => typeof f === 'object' && !!f?.question)
  if (!list.length) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: list.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  }
}

export const serviceSchema = (args: {
  name: string
  description?: string | null
  path: string
  image?: Media | number | null
  serviceType?: string
}) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: args.name,
  serviceType: args.serviceType || args.name,
  description: args.description || undefined,
  url: abs(args.path),
  image: mediaUrl(args.image),
  provider: { '@id': orgId() },
  areaServed: [
    { '@type': 'Country', name: 'United Arab Emirates' },
    { '@type': 'Place', name: 'GCC' },
  ],
})

export const productCatalogSchema = (products: Product[]) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: products.map((p, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: p.title,
    url: abs(`/products/${p.slug}`),
  })),
})

export const articleSchema = (post: Post, path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: post.title,
  description: post.meta?.description || post.excerpt || undefined,
  image: mediaUrl(post.heroImage as Media) || mediaUrl(post.meta?.image as Media, 'og'),
  datePublished: post.publishedAt || post.createdAt,
  dateModified: post.updatedAt,
  mainEntityOfPage: abs(path),
  author: post.populatedAuthors?.length
    ? post.populatedAuthors.map((a) => ({ '@type': 'Person', name: a.name }))
    : { '@id': orgId() },
  publisher: { '@id': orgId() },
})
