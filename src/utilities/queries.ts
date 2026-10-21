import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import { cache } from 'react'

type SluggedCollection = 'pages' | 'posts' | 'products' | 'industries' | 'projects'

/** Fetch one published (or draft, in preview) document by slug. Deduped per request. */
export const queryBySlug = cache(async <T extends SluggedCollection>(collection: T, slug: string, depth = 2) => {
  const { isEnabled: draft } = await draftMode()
  const payload = await getPayload({ config: configPromise })
  const result = await payload.find({
    collection,
    draft,
    depth,
    limit: 1,
    pagination: false,
    overrideAccess: draft,
    where: { slug: { equals: slug } },
  })
  return result.docs?.[0] || null
})

/** Slugs for generateStaticParams. */
export const allSlugs = async (collection: SluggedCollection) => {
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection,
    draft: false,
    limit: 1000,
    overrideAccess: false,
    pagination: false,
    select: { slug: true },
  })
  return res.docs.map((d) => d.slug).filter(Boolean) as string[]
}
