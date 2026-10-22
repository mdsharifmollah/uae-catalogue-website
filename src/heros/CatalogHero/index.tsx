import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { Media as MediaType, Page, Product } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { AccentText } from '@/components/site/AccentText'
import { Section, type Tone } from '@/components/site/Section'
import { CatalogFan } from './CatalogFan'
import { FabricCanvasLoader } from './FabricCanvasLoader'
import { getLocale } from '@/i18n/server'
import { getDictionary } from '@/i18n/server'

const pickTextureUrl = (media?: MediaType | number | null) => {
  if (!media || typeof media !== 'object') return null
  return media.sizes?.xlarge?.url || media.sizes?.large?.url || media.url || null
}

/** Home hero: animated WebGL fabric, headline, CTAs and a fan of catalogue cards. */
export const CatalogHero: React.FC<Page['hero']> = async ({
  tone,
  eyebrow,
  heading,
  subheading,
  links,
  trustItems,
  media,
  fanProducts,
}) => {
  const t = await getDictionary()
  let products = (fanProducts || []).filter((p): p is Product => typeof p === 'object')

  if (!products.length) {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      locale: await getLocale(),
      collection: 'products',
      limit: 5,
      sort: 'order',
      depth: 1,
      overrideAccess: false,
    })
    products = res.docs
  }

  const textureUrl = pickTextureUrl(media)

  return (
    <Section
      tone={(tone as Tone) || 'ink'}
      padded={false}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Static image = instant LCP + no-WebGL fallback; the canvas fades in above it. */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {media && typeof media === 'object' && (
          <Media
            resource={media}
            fill
            priority
            quality={70}
            imgClassName="object-cover opacity-55"
            pictureClassName="absolute inset-0"
            htmlElement={null}
          />
        )}
        {textureUrl && <FabricCanvasLoader src={textureUrl} />}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_35%,rgba(18,19,17,0.35)_0%,rgba(18,19,17,0.82)_62%,#121311_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#121311] via-[#121311]/70 to-transparent" />
      </div>

      {/* Floating swatch tags (decorative, echoes numbered shade cards) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 hidden lg:block">
        <span
          className="hero-tag absolute left-[9%] top-[30%] -rotate-6"
          style={{ ['--tag' as string]: '#5e8f86' }}
        >
          {t.common.heroTags[0]}
        </span>
        <span
          className="hero-tag absolute right-[10%] top-[44%] rotate-3"
          style={{ ['--tag' as string]: '#c46b5f' }}
        >
          {t.common.heroTags[1]}
        </span>
      </div>

      <div className="shell relative flex flex-1 flex-col items-center pt-[calc(var(--header-h)+3.5rem)] text-center md:pt-[calc(var(--header-h)+5rem)]">
        {eyebrow && (
          <p className="hero-rise glass inline-flex min-h-11 max-w-full items-center gap-3 rounded-full px-5 py-2 text-[1rem] font-medium">
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#c9a66b] opacity-60 motion-reduce:hidden" />
              <span className="relative inline-flex size-2.5 rounded-full bg-[#c9a66b]" />
            </span>
            {eyebrow}
          </p>
        )}
        {/* The H1 is the LCP element: it paints immediately, no entrance animation. */}
        <h1 id="hero-title" className="text-display mt-7 max-w-[16ch] md:max-w-[18ch]">
          <AccentText text={heading} />
        </h1>
        {subheading && (
          <p
            className="hero-rise text-lead mt-6 max-w-2xl text-muted"
            style={{ animationDelay: '120ms' }}
          >
            {subheading}
          </p>
        )}
        {links && links.length > 0 && (
          <div
            className="hero-rise mt-9 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center"
            style={{ animationDelay: '180ms' }}
          >
            {links.map(({ link }, i) => (
              <CMSLink key={i} {...link} size="lg" />
            ))}
          </div>
        )}
        {trustItems && trustItems.length > 0 && (
          <ul
            className="hero-rise mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[1rem] text-muted"
            style={{ animationDelay: '240ms' }}
          >
            {trustItems.map((t, i) => (
              <li key={i} className="flex items-center gap-2">
                <span aria-hidden="true" className="size-1.5 rounded-full bg-[#c9a66b]" />
                {t.text}
              </li>
            ))}
          </ul>
        )}
      </div>

      {products.length > 0 && <CatalogFan products={products} />}
    </Section>
  )
}
