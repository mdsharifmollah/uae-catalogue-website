import { cn } from '@/utilities/ui'
import React from 'react'
import RichText from '@/components/RichText'

import type { ContentBlock as ContentBlockProps } from '@/payload-types'

import { CMSLink } from '../../components/Link'
import { Section, type Tone } from '@/components/site/Section'

const colsSpanClasses = {
  full: 'lg:col-span-12',
  half: 'lg:col-span-6',
  oneThird: 'lg:col-span-4',
  twoThirds: 'lg:col-span-8',
}

export const ContentBlock: React.FC<ContentBlockProps & { id?: string | null }> = ({ id, tone, columns }) => {
  if (!columns?.length) return null
  return (
    <Section tone={(tone as Tone) || 'ivory'} id={id ? `block-${id}` : undefined}>
      <div className="shell grid grid-cols-4 gap-x-16 gap-y-10 lg:grid-cols-12">
        {columns.map((col, index) => {
          const { enableLink, link, richText, size } = col
          return (
            <div
              className={cn('col-span-4', colsSpanClasses[(size || 'full') as keyof typeof colsSpanClasses], {
                'md:col-span-2': size !== 'full',
                'max-w-3xl': size === 'full',
              })}
              key={index}
              data-reveal
            >
              {richText && <RichText data={richText} enableGutter={false} />}
              {enableLink && link && <CMSLink {...link} className="mt-6" />}
            </div>
          )
        })}
      </div>
    </Section>
  )
}
