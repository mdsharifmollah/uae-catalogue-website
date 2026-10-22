'use client'

import NextLink from 'next/link'
import { usePathname } from 'next/navigation'
import React, { createContext, useContext } from 'react'

import { defaultLocale, localizePath, splitLocale, type Locale } from './config'
import { dictionaries, type Dictionary } from './dictionary'

const LocaleContext = createContext<Locale>(defaultLocale)

export const LocaleProvider: React.FC<{ locale: Locale; children: React.ReactNode }> = ({ locale, children }) => (
  <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>
)

export const useLocale = (): Locale => useContext(LocaleContext)

/**
 * Current path without the language prefix ("/products" on /ar/products).
 * Identical on the server (which renders /en/...) and in the browser, so it is
 * safe to render from.
 */
export const useLocalePath = (): string => splitLocale(usePathname() || '/').path

/** UI strings for the current locale. */
export const useDictionary = (): Dictionary => dictionaries[useLocale()]

/** next/link that keeps visitors in their language (adds /ar to internal paths on Arabic pages). */
export const Link: React.FC<React.ComponentProps<typeof NextLink>> = ({ href, ...props }) => {
  const locale = useLocale()
  const localized = typeof href === 'string' ? localizePath(locale, href) : href
  return <NextLink href={localized} {...props} />
}
