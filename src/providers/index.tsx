import React from 'react'

import type { Locale } from '@/i18n/config'
import { LocaleProvider } from '@/i18n/client'
import { type PublicSettings, SiteSettingsProvider } from './SiteSettings'

export const Providers: React.FC<{
  children: React.ReactNode
  locale: Locale
  settings: PublicSettings
}> = ({ children, locale, settings }) => {
  return (
    <LocaleProvider locale={locale}>
      <SiteSettingsProvider value={settings}>{children}</SiteSettingsProvider>
    </LocaleProvider>
  )
}
