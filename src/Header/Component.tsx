import React from 'react'

import { getDictionary } from '@/i18n/server'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { HeaderClient } from './Component.client'

export async function Header() {
  const [headerData, settings, t] = await Promise.all([getCachedGlobal('header', 1)(), getSiteSettings(), getDictionary()])

  return (
    <HeaderClient
      data={headerData}
      name={settings.shortName}
      logo={settings.logoOnDark}
      logoLight={settings.logoOnLight}
      quoteLabel={settings.mobileBarEnabled !== false ? settings.mobileBarLabel || t.common.getAQuote : null}
    />
  )
}
