import type { Config } from 'src/payload-types'

import configPromise from '@payload-config'
import { type DataFromGlobalSlug, getPayload } from 'payload'
import { unstable_cache } from 'next/cache'

import type { Locale } from '@/i18n/config'
import { getLocale } from '@/i18n/server'

type Global = keyof Config['globals']

async function getGlobal<T extends Global>(slug: T, depth: number, locale: Locale): Promise<DataFromGlobalSlug<T>> {
  const payload = await getPayload({ config: configPromise })

  const global = await payload.findGlobal({
    slug,
    depth,
    locale,
  })

  return global
}

/**
 * Returns a function that loads the global in the current locale, cached
 * (unstable_cache) under the tag `global_${slug}` for every locale.
 */
export const getCachedGlobal =
  <T extends Global>(slug: T, depth = 0) =>
  async (): Promise<DataFromGlobalSlug<T>> => {
    const locale = await getLocale()
    return unstable_cache(async () => getGlobal<T>(slug, depth, locale), [slug, String(depth), locale], {
      tags: [`global_${slug}`],
    })()
  }
