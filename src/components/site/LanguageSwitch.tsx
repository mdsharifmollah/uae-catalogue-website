'use client'

import React, { useState } from 'react'

import { type Locale, localeMeta, localizePath, locales } from '@/i18n/config'
import { useDictionary, useLocale, useLocalePath } from '@/i18n/client'
import { cn } from '@/utilities/ui'

const SHORT: Record<Locale, string> = { en: 'EN', ar: 'عربي' }

/**
 * Link to the same page in the other language. A full page load, since the
 * document direction and fonts change.
 */
export const LanguageSwitch: React.FC<{ className?: string }> = ({ className }) => {
  const locale = useLocale()
  const path = useLocalePath()
  const t = useDictionary()
  const target = locale === 'ar' ? 'en' : 'ar'
  return (
    <a
      href={localizePath(target, path)}
      hrefLang={target}
      lang={target}
      title={t.a11y.switchLanguage}
      className={cn('lang-switch', className)}
    >
      {localeMeta[target].label}
    </a>
  )
}

/**
 * EN | عربي segmented switch for the header. The highlight slides across
 * before the other language loads. Always laid out left-to-right so the two
 * options stay in the same place in both languages.
 */
export const LanguageToggle: React.FC<{ className?: string }> = ({ className }) => {
  const locale = useLocale()
  const path = useLocalePath()
  const t = useDictionary()
  const [shown, setShown] = useState<Locale>(locale)

  return (
    <div
      role="group"
      aria-label={t.a11y.language}
      dir="ltr"
      className={cn('glass relative inline-flex h-11 shrink-0 items-center rounded-full p-1', className)}
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-[color:var(--page-fg)] shadow-sm transition-transform duration-500 ease-[var(--ease-out-expo)] motion-reduce:transition-none"
        style={{ transform: shown === 'ar' ? 'translateX(100%)' : undefined }}
      />
      {locales.map((l) => {
        const on = l === shown
        const label = cn(
          'lang-switch relative z-10 grid h-9 min-w-11 place-items-center rounded-full px-2.5 text-[0.9375rem] font-semibold transition-colors duration-500 max-[359px]:min-w-10 max-[359px]:px-2',
          on ? 'text-[color:var(--page-bg)]' : 'opacity-80 hover:opacity-100',
        )
        return l === locale ? (
          <span key={l} lang={l} aria-current="true" aria-label={localeMeta[l].label} className={label}>
            {SHORT[l]}
          </span>
        ) : (
          <a
            key={l}
            href={localizePath(l, path)}
            hrefLang={l}
            lang={l}
            aria-label={localeMeta[l].label}
            title={t.a11y.switchLanguage}
            className={label}
            onClick={(e) => {
              if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
              setShown(l)
            }}
          >
            {SHORT[l]}
          </a>
        )
      })}
    </div>
  )
}
