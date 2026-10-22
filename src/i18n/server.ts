import 'server-only'

import { lang } from 'next/root-params'
import { cache } from 'react'

import { defaultLocale, isLocale, type Locale } from './config'
import { dictionaries, type Dictionary } from './dictionary'

/**
 * Current locale for any Server Component, read from the root [lang] segment
 * (no prop drilling). Outside the [lang] tree (route handlers, sitemap,
 * manifest) it falls back to English.
 */
export const getLocale = cache(async (): Promise<Locale> => {
  try {
    const value = await lang()
    return isLocale(value) ? value : defaultLocale
  } catch {
    return defaultLocale
  }
})

/** UI strings for the current locale. */
export const getDictionary = async (): Promise<Dictionary> => dictionaries[await getLocale()]
