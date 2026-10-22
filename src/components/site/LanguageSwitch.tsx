'use client'

import React from 'react'

import { localeMeta, localizePath } from '@/i18n/config'
import { useDictionary, useLocale, useLocalePath } from '@/i18n/client'
import { cn } from '@/utilities/ui'

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
