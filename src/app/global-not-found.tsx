// 404 page for the whole site. The root layout lives under the [lang] segment,
// so Next renders this standalone page (own <html>) for every missing URL.
// Its links are plain <a>s on purpose: a full load picks up the right layout,
// language and text direction.
/* eslint-disable @next/next/no-html-link-for-pages */
import './(frontend)/globals.css'

import type { Metadata } from 'next'
import { Instrument_Serif, Manrope } from 'next/font/google'
import React from 'react'

import { AccentText } from '@/components/site/AccentText'
import { Wordmark } from '@/components/site/Wordmark'
import { dictionaries } from '@/i18n/dictionary'
import { cn } from '@/utilities/ui'

const manrope = Manrope({ subsets: ['latin'], variable: '--font-manrope', display: 'swap' })
const instrument = Instrument_Serif({
  subsets: ['latin'],
  weight: '400',
  style: 'italic',
  variable: '--font-instrument',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '404 — Page not found | Al Hejlah',
  description: 'The page you are looking for has moved or no longer exists.',
  robots: { index: false },
}

export default function GlobalNotFound() {
  const { en, ar } = dictionaries
  return (
    <html lang="en" dir="ltr" className={cn(manrope.variable, instrument.variable)}>
      <body>
        <main
          data-tone="ink"
          className="flex min-h-[100svh] flex-col justify-center gap-14 px-[clamp(1rem,4vw,3rem)] py-16"
          style={{ background: 'var(--page-bg)', color: 'var(--page-fg)' }}
        >
          <a href="/" className="w-fit" aria-label={en.a11y.home('Al Hejlah')}>
            <Wordmark name="Al Hejlah" />
          </a>
          <div className="grid gap-12 md:grid-cols-2">
            <section className="flex flex-col items-start gap-6">
              <p className="eyebrow">{en.notFound.eyebrow}</p>
              <h1 className="text-h2 max-w-xl">
                <AccentText text={en.notFound.heading} />
              </h1>
              <p className="text-lead max-w-md opacity-75">{en.notFound.text}</p>
              <div className="flex flex-wrap gap-3">
                <a href="/" className="btn btn-primary">
                  {en.notFound.home}
                </a>
                <a href="/products" className="btn btn-glass">
                  {en.notFound.formats}
                </a>
              </div>
            </section>
            <section lang="ar" dir="rtl" className="flex flex-col items-start gap-6">
              <p className="eyebrow">{ar.notFound.eyebrow}</p>
              <p className="text-h2 max-w-xl">{ar.notFound.heading.replace(/\*/g, '')}</p>
              <p className="text-lead max-w-md opacity-75">{ar.notFound.text}</p>
              <div className="flex flex-wrap gap-3">
                <a href="/ar" className="btn btn-primary">
                  {ar.notFound.home}
                </a>
                <a href="/ar/products" className="btn btn-glass">
                  {ar.notFound.formats}
                </a>
              </div>
            </section>
          </div>
        </main>
      </body>
    </html>
  )
}
