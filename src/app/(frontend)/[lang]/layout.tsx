import type { Metadata, Viewport } from 'next'

import { Amiri, IBM_Plex_Sans_Arabic, Instrument_Serif, Manrope } from 'next/font/google'
import { draftMode } from 'next/headers'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Analytics } from '@/components/analytics/Analytics'
import { TrackClicks } from '@/components/analytics/TrackClicks'
import { BackgroundEngine } from '@/components/motion/BackgroundEngine'
import { RevealOrchestrator } from '@/components/motion/RevealOrchestrator'
import { SmoothScroll } from '@/components/motion/SmoothScroll'
import { JsonLd } from '@/components/seo/JsonLd'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { defaultLocale, isLocale, localeMeta, locales } from '@/i18n/config'
import { getDictionary, getLocale } from '@/i18n/server'
import { Providers } from '@/providers'
import { getServerSideURL } from '@/utilities/getURL'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { organizationSchema, websiteSchema } from '@/utilities/schema'
import { cn } from '@/utilities/ui'

import '../globals.css'

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

// Arabic faces are not preloaded: browsers fetch them only when Arabic text is
// on the page (unicode-range), so English pages never download them.
const arabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-arabic',
  display: 'swap',
  preload: false,
})

const arabicAccent = Amiri({
  subsets: ['arabic'],
  weight: '400',
  variable: '--font-arabic-accent',
  display: 'swap',
  preload: false,
})

/**
 * Runs before first paint: opts into entrance animations only when motion is
 * allowed, and falls back to fully visible content if scripts fail to start.
 */
const motionBootstrap = `(function(){try{var d=document.documentElement;if(!matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('motion-ok');setTimeout(function(){if(!window.__revealReady)d.classList.remove('motion-ok')},3500)}}catch(e){}})();`

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }))
}

type Props = { children: React.ReactNode; params: Promise<{ lang: string }> }

export default async function RootLayout({ children, params }: Props) {
  // Next renders 404s through this layout too, sometimes without a lang param,
  // so fall back to English rather than throwing.
  const { lang: param } = await params
  const lang = isLocale(param) ? param : defaultLocale
  const [{ isEnabled }, settings] = await Promise.all([draftMode(), getSiteSettings()])
  const { dir, htmlLang } = localeMeta[lang]

  return (
    <html
      className={cn(manrope.variable, instrument.variable, arabic.variable, arabicAccent.variable)}
      lang={htmlLang}
      dir={dir}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBootstrap }} />
        <JsonLd data={[organizationSchema(settings), websiteSchema(settings, lang)]} />
      </head>
      <body>
        <Providers
          locale={lang}
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
  const [settings, t, locale] = await Promise.all([getSiteSettings(), getDictionary(), getLocale()])
  const suffix = settings.titleSuffix || settings.shortName
  return {
    metadataBase: new URL(getServerSideURL()),
    title: {
      default: t.meta.defaultTitle(settings.companyName),
      template: `%s | ${suffix}`,
    },
    description: settings.defaultDescription || undefined,
    applicationName: settings.companyName,
    openGraph: mergeOpenGraph({ siteName: settings.companyName, locale: localeMeta[locale].og }),
    twitter: { card: 'summary_large_image' },
    verification: settings.googleSiteVerification
      ? { google: settings.googleSiteVerification }
      : undefined,
    formatDetection: { telephone: false },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: '48x48' },
        { url: '/favicon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-touch-icon.png',
    },
  }
}
