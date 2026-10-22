/**
 * Site languages. English is served without a prefix (/products), Arabic under
 * /ar (/ar/products). next.config.ts rewrites unprefixed URLs to the [lang]
 * route segment, so every page renders once per locale.
 */
export const locales = ['en', 'ar'] as const
export type Locale = (typeof locales)[number]
export const defaultLocale: Locale = 'en'

export const isLocale = (value: unknown): value is Locale => locales.includes(value as Locale)

export const localeMeta: Record<Locale, { dir: 'ltr' | 'rtl'; og: string; label: string; htmlLang: string }> = {
  en: { dir: 'ltr', og: 'en_AE', label: 'English', htmlLang: 'en' },
  ar: { dir: 'rtl', og: 'ar_AE', label: 'العربية', htmlLang: 'ar' },
}

// Internal paths that are never localized (CMS, API, files, generated routes).
const UNLOCALIZED = /^\/(?:api|admin|next|og|_next|media|brand)(?:\/|$)|^\/[^?#]*\.[a-z0-9]+(?:[?#]|$)/i

/**
 * Splits a pathname into its locale and the locale-free path (always starting
 * with "/"). Also accepts the internal /en prefix that prerendered pages see.
 */
export const splitLocale = (pathname: string): { locale: Locale; path: string } => {
  const match = (pathname || '/').match(/^\/(ar|en)(?=\/|$|[?#])(.*)$/)
  if (!match) return { locale: defaultLocale, path: pathname || '/' }
  const rest = match[2] || ''
  return { locale: match[1] as Locale, path: rest.startsWith('/') ? rest : `/${rest}` }
}

/** The same internal path in `locale`. Leaves external links, anchors and files alone. */
export const localizePath = (locale: Locale, href: string): string => {
  if (!href.startsWith('/') || href.startsWith('//') || UNLOCALIZED.test(href)) return href
  const { path } = splitLocale(href)
  if (locale === defaultLocale) return path
  if (path === '/') return '/ar'
  if (path.startsWith('/?') || path.startsWith('/#')) return `/ar${path.slice(1)}`
  return `/ar${path}`
}
