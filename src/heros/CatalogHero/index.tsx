import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { Media as MediaType, Page, Product } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { AccentText } from '@/components/site/AccentText'
import { Section, type Tone } from '@/components/site/Section'
import { getDictionary, getLocale } from '@/i18n/server'
import { docPath } from '@/utilities/routes'
import { FabricCanvasLoader } from './FabricCanvasLoader'
import { HeroShowcase } from './HeroShowcase'

const pickTextureUrl = (media?: MediaType | number | null) => {
  if (!media || typeof media !== 'object') return null
  return media.sizes?.xlarge?.url || media.sizes?.large?.url || media.url || null
}

/**
 * Home hero: animated WebGL fabric behind the value proposition and quote
 * buttons, with a photo showcase of the services beside it (below it on phones,
 * so the headline stays the first thing to paint).
 */
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
  const slides = products
    .filter((p) => p.heroImage && typeof p.heroImage === 'object')
    .map((p, i) => ({
      id: p.id,
      title: p.title,
      summary: p.summary,
      href: docPath('products', p.slug),
      quoteMessage: p.whatsappMessage,
      image: (
        <Media
          resource={p.heroImage}
          fill
          // The first photo is in view on large screens; the rest load as they come up.
          loading={i === 0 ? 'eager' : 'lazy'}
          quality={75}
          size="(max-width: 1024px) 92vw, 40vw"
          imgClassName="object-cover"
          pictureClassName="absolute inset-0"
          htmlElement={null}
        />
      ),
    }))

  return (
    <Section
      tone={(tone as Tone) || 'ink'}
      padded={false}
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden"
      aria-labelledby="hero-title"
    >
      {/* Static image = instant paint + no-WebGL fallback; the canvas fades in above it. */}
      <div className="absolute inset-0 -z-10" aria-hidden="true">
        {media && typeof media === 'object' && (
          <Media
            resource={media}
            fill
            priority
            quality={70}
            imgClassName="object-cover opacity-45"
            pictureClassName="absolute inset-0"
            htmlElement={null}
          />
        )}
        {textureUrl && <FabricCanvasLoader src={textureUrl} />}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_35%,rgba(18,19,17,0.4)_0%,rgba(18,19,17,0.84)_60%,#121311_100%)] rtl:bg-[radial-gradient(ellipse_at_70%_35%,rgba(18,19,17,0.4)_0%,rgba(18,19,17,0.84)_60%,#121311_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[#121311] via-[#121311]/70 to-transparent" />
      </div>

      <div className="shell relative grid flex-1 items-center gap-12 pb-16 pt-[calc(var(--header-h)+2.5rem)] md:pb-20 md:pt-[calc(var(--header-h)+4rem)] lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:gap-12 xl:gap-20">
        <div className="flex flex-col items-center text-center lg:items-start lg:text-start">
          {eyebrow && (
            <p className="hero-rise glass inline-flex min-h-11 max-w-full items-center gap-3 rounded-full px-5 py-2 text-[1rem] font-medium">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#c9a66b] opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2.5 rounded-full bg-[#c9a66b]" />
              </span>
              {eyebrow}
            </p>
          )}
          {/* The H1 is the LCP element on phones: it paints immediately, no entrance animation. */}
          <h1
            id="hero-title"
            className="text-display mt-7 max-w-[16ch] lg:max-w-[14ch] lg:text-[clamp(3.25rem,1.2rem+3.4vw,5rem)]"
          >
            <AccentText text={heading} />
          </h1>
          {subheading && (
            <p className="hero-rise text-lead mt-6 max-w-2xl text-muted lg:max-w-xl" style={{ animationDelay: '120ms' }}>
              {subheading}
            </p>
          )}
          {links && links.length > 0 && (
            <div
              className="hero-rise mt-9 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:flex-wrap sm:items-center lg:justify-start"
              style={{ animationDelay: '180ms' }}
            >
              {links.map(({ link }, i) => (
                <CMSLink key={i} {...link} size="lg" />
              ))}
            </div>
          )}
          {trustItems && trustItems.length > 0 && (
            <ul
              className="hero-rise mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-[1rem] text-muted lg:justify-start"
              style={{ animationDelay: '240ms' }}
            >
              {trustItems.map((item, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span aria-hidden="true" className="size-1.5 rounded-full bg-[#c9a66b]" />
                  {item.text}
                </li>
              ))}
            </ul>
          )}
        </div>

        {slides.length > 0 && (
          <div className="hero-rise w-full" style={{ animationDelay: '200ms' }}>
            <HeroShowcase items={slides} tags={t.common.heroTags} />
          </div>
        )}
      </div>
    </Section>
  )
}
