import React from 'react'

import { type PublicSettings, SiteSettingsProvider } from './SiteSettings'

export const Providers: React.FC<{
  children: React.ReactNode
  settings: PublicSettings
}> = ({ children, settings }) => {
  return <SiteSettingsProvider value={settings}>{children}</SiteSettingsProvider>
}
