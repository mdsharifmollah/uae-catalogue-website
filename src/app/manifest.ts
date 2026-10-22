import type { MetadataRoute } from 'next'

import { getSiteSettings } from '@/utilities/getSiteSettings'

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSiteSettings()
  return {
    name: settings.companyName,
    short_name: settings.shortName,
    description: settings.defaultDescription || undefined,
    start_url: '/',
    display: 'browser',
    background_color: '#121311',
    theme_color: '#121311',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
  }
}
