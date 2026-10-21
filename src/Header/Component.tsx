import React from 'react'

import { getCachedGlobal } from '@/utilities/getGlobals'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { HeaderClient } from './Component.client'

export async function Header() {
  const [headerData, settings] = await Promise.all([getCachedGlobal('header', 1)(), getSiteSettings()])

  return (
    <HeaderClient
      data={headerData}
      name={settings.shortName}
      logo={settings.logoOnDark}
      logoLight={settings.logoOnLight}
      quoteLabel={settings.mobileBarEnabled !== false ? settings.mobileBarLabel || 'Get a quote' : null}
    />
  )
}
