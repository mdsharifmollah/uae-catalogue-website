import type {
  CollectionAfterChangeHook,
  CollectionAfterDeleteHook,
  GlobalAfterChangeHook,
} from 'payload'

import { revalidatePath, revalidateTag } from 'next/cache'

/**
 * Content on this site is heavily cross-linked (home shows products, projects,
 * FAQs, settings...). Rather than tracking every dependency, any published
 * change revalidates the whole site layout. The site is small, so this is cheap.
 */
const revalidateEverything = (logger: { info: (msg: string) => void }, reason: string) => {
  logger.info(`Revalidating site: ${reason}`)
  revalidatePath('/', 'layout')
  revalidateTag('sitemap', 'max')
}

export const revalidateCollectionChange: CollectionAfterChangeHook = ({
  collection,
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) return doc

  const hasDrafts = Boolean(collection.versions?.drafts)
  const isPublished = !hasDrafts || doc?._status === 'published'
  const wasPublished = hasDrafts && previousDoc?._status === 'published'

  if (isPublished || wasPublished) {
    revalidateEverything(payload.logger, `${collection.slug} "${doc?.slug ?? doc?.id}" changed`)
  }

  return doc
}

export const revalidateCollectionDelete: CollectionAfterDeleteHook = ({
  collection,
  doc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    revalidateEverything(payload.logger, `${collection.slug} "${doc?.slug ?? doc?.id}" deleted`)
  }
  return doc
}

export const revalidateGlobalChange: GlobalAfterChangeHook = ({
  doc,
  global,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    revalidateTag(`global_${global.slug}`, 'max')
    revalidateEverything(payload.logger, `global ${global.slug} changed`)
  }
  return doc
}
