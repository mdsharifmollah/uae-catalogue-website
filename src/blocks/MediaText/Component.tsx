import React from 'react'

import type { MediaTextBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { AccentText } from '@/components/site/AccentText'
import { Section, type Tone } from '@/components/site/Section'
import { cn } from '@/utilities/ui'

export const MediaTextBlock: React.FC<Props & { id?: string | null }> = ({
  id,
  tone,
  eyebrow,
  heading,
  richText,
  media,
  imagePosition,
  pills,
  links,
}) => (
  <Section tone={(tone as Tone) || 'ivory'} id={id ? `block-${id}` : undefined}>
    <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
      <div className={cn('relative', imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2')} data-reveal>
        <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-panel)] sm:aspect-[5/4] lg:aspect-[4/5]">
          {media && typeof media === 'object' && (
            <Media resource={media} fill size="(max-width: 1024px) 100vw, 45vw" imgClassName="object-cover" pictureClassName="absolute inset-0" htmlElement={null} />
          )}
          <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
        </div>
        {pills && pills.length > 0 && (
          <ul className="absolute inset-x-4 bottom-4 flex flex-wrap gap-2">
            {pills.map((p, i) => (
              <li key={i} className="glass rounded-full px-4 py-2 text-[1rem] font-medium text-white" style={{ ['--surface' as string]: 'rgba(18,19,17,0.35)' }}>
                {p.text}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className={cn('flex flex-col gap-6', imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1')}>
        {eyebrow && (
          <p className="eyebrow" data-reveal>
            <span aria-hidden="true" className="inline-block h-px w-8 bg-current opacity-60" />
            {eyebrow}
          </p>
        )}
        {heading && (
          <h2 className="text-h2" data-split>
            <AccentText text={heading} />
          </h2>
        )}
        {richText && (
          <div data-reveal>
            <RichText data={richText} enableGutter={false} className="text-muted" />
          </div>
        )}
        {links && links.length > 0 && (
          <div className="flex flex-wrap gap-3" data-reveal>
            {links.map(({ link }, i) => (
              <CMSLink key={i} {...link} />
            ))}
          </div>
        )}
      </div>
    </div>
  </Section>
)
