import type { Metadata, Viewport } from 'next'

import { Instrument_Serif, Manrope } from 'next/font/google'
import { draftMode } from 'next/headers'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Analytics } from '@/components/analytics/Analytics'
import { TrackClicks } from '@/components/analytics/TrackClicks'
import { BackgroundEngine } from '@/components/motion/BackgroundEngine'
import { RevealOrchestrator } from '@/components/motion/RevealOrchestrator'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { JsonLd } from '@/components/seo/JsonLd'
import { MobileWhatsAppBar } from '@/components/site/MobileWhatsAppBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { Providers } from '@/providers'
import { getServerSideURL } from '@/utilities/getURL'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { organizationSchema, websiteSchema } from '@/utilities/schema'
import { cn } from '@/utilities/ui'

import './globals.css'

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
})

const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  // Only the italic accent words (.accent-word) use the serif; loading the
  // upright face too cost an extra preloaded font file on every page.
  style: 'italic',
  variable: '--font-instrument',
  display: 'swap',
})

/**
 * Runs before first paint: opts into entrance animations only when motion is
 * allowed, and falls back to fully visible content if scripts fail to start.
 */
const motionBootstrap = `(function(){try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion-ok');setTimeout(function(){if(!window.__revealReady)d.classList.remove('motion-ok')},3500)}}catch(e){}})();`

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const [{ isEnabled }, settings] = await Promise.all([draftMode(), getSiteSettings()])

  return (
    <html
      className={cn(manrope.variable, instrument.variable)}
      lang="en"
      dir="ltr"
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
        <JsonLd data={[organizationSchema(settings), websiteSchema(settings)]} />
      </head>
      <body>
        <Providers
          settings={{
            companyName: settings.companyName,
            shortName: settings.shortName,
            whatsappNumber: settings.whatsappNumber,
            whatsappDefaultMessage: settings.whatsappDefaultMessage || '',
            phoneNumber: settings.phoneNumber,
            phoneDisplay: settings.phoneDisplay,
            email: settings.email,
          }}
        >
          <BackgroundEngine />
          <SmoothScroll />
          <RevealOrchestrator />
          <TrackClicks />
          <AdminBar adminBarProps={{ preview: isEnabled }} />
          <Header />
          <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
            {children}
          </main>
          <Footer />
          {settings.mobileBarEnabled !== false && (
            <MobileWhatsAppBar label={settings.mobileBarLabel || 'Get a quote on WhatsApp'} />
          )}
        </Providers>
        <Analytics gtmId={settings.gtmId} ga4Id={settings.ga4Id} />
      </body>
    </html>
  )
}

export const viewport: Viewport = {
  themeColor: '#121311',
  width: 'device-width',
  initialScale: 1,
}

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings()
  const suffix = settings.titleSuffix || settings.shortName
  return {
    metadataBase: new URL(getServerSideURL()),
    title: {
      default: `${settings.companyName} — Fabric Sample Books & Catalogues, UAE`,
      template: `%s | ${suffix}`,
    },
    description: settings.defaultDescription || undefined,
    applicationName: settings.companyName,
    openGraph: mergeOpenGraph({ siteName: settings.companyName }),
    twitter: { card: 'summary_large_image' },
    verification: settings.googleSiteVerification
      ? { google: settings.googleSiteVerification }
      : undefined,
    formatDetection: { telephone: false },
  }
}
