import React from 'react'

import type { Page } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { AccentText } from '@/components/site/AccentText'
import { Section, type Tone } from '@/components/site/Section'

export const MinimalHero: React.FC<Page['hero'] & { breadcrumb?: React.ReactNode }> = ({
  tone,
  eyebrow,
  heading,
  subheading,
  links,
  breadcrumb,
}) => (
  <Section
    tone={(tone as Tone) || 'ink'}
    padded={false}
    className="pb-14 pt-[calc(var(--header-h)+3rem)] md:pb-20 md:pt-[calc(var(--header-h)+5rem)]"
  >
    <div className="shell flex max-w-5xl flex-col gap-6">
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
        <p className="hero-rise text-lead max-w-2xl text-muted" style={{ animationDelay: '120ms' }}>
          {subheading}
        </p>
      )}
      {links && links.length > 0 && (
        <div className="hero-rise flex flex-wrap gap-3" style={{ animationDelay: '180ms' }}>
          {links.map(({ link }, i) => (
            <CMSLink key={i} {...link} />
          ))}
        </div>
      )}
    </div>
  </Section>
)
