import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { AccentText } from '@/components/site/AccentText'
import { CheckIcon } from '@/components/site/icons'
import { Section, type Tone } from '@/components/site/Section'

type Props = Page['hero'] & {
  breadcrumb?: React.ReactNode
  /** Extra content under the buttons (e.g. spec pills). */
  children?: React.ReactNode
}

/** Inner-page hero: H1 + intro on the left, framed image on the right. */
export const PageHero: React.FC<Props> = ({
  tone,
  eyebrow,
  heading,
  subheading,
  links,
  trustItems,
  media,
  breadcrumb,
  children,
}) => {
  const hasMedia = media && typeof media === 'object'
  return (
    <Section
      tone={(tone as Tone) || 'ink'}
      padded={false}
      className="overflow-hidden pb-16 pt-[calc(var(--header-h)+3rem)] md:pb-24 md:pt-[calc(var(--header-h)+4.5rem)]"
    >
      <div className="shell grid items-center gap-12 lg:grid-cols-[1.05fr_1fr] lg:gap-16">
        <div className="flex flex-col gap-6">
          {breadcrumb}
          {eyebrow && (
            <p className="eyebrow hero-rise">
              <span aria-hidden="true" className="inline-block h-px w-8 bg-current opacity-60" />
              {eyebrow}
            </p>
          )}
          <h1 className="hero-rise text-display" style={{ animationDelay: '60ms' }}>
            <AccentText text={heading} />
          </h1>
          {subheading && (
            <p className="hero-rise text-lead max-w-xl text-muted" style={{ animationDelay: '120ms' }}>
              {subheading}
            </p>
          )}
          {links && links.length > 0 && (
            <div className="hero-rise mt-2 flex flex-wrap gap-3" style={{ animationDelay: '180ms' }}>
              {links.map(({ link }, i) => (
                <CMSLink key={i} {...link} />
              ))}
            </div>
          )}
          {trustItems && trustItems.length > 0 && (
            <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 text-[1rem] text-muted">
              {trustItems.map((t, i) => (
                <li key={i} className="flex items-center gap-2">
                  <CheckIcon size={16} className="text-accent" />
                  {t.text}
                </li>
              ))}
            </ul>
          )}
          {children}
        </div>
        {hasMedia && (
          <div className="hero-rise relative aspect-[4/5] overflow-hidden rounded-[var(--radius-panel)] sm:aspect-[5/4] lg:aspect-[4/5]" style={{ animationDelay: '140ms' }}>
            <Media
              resource={media}
              fill
              priority
              size="(max-width: 1024px) 100vw, 46vw"
              imgClassName="object-cover"
              pictureClassName="absolute inset-0"
              htmlElement={null}
            />
            <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/15" />
          </div>
        )}
      </div>
    </Section>
  )
}
