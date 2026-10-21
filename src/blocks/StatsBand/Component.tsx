import React from 'react'

import type { StatsBandBlock as Props } from '@/payload-types'

import { Section, type Tone } from '@/components/site/Section'

export const StatsBandBlock: React.FC<Props & { id?: string | null }> = ({ id, tone, items }) => {
  if (!items?.length) return null
  return (
    <Section tone={(tone as Tone) || 'charcoal'} id={id ? `block-${id}` : undefined} className="!py-16 md:!py-24">
      <dl className="shell grid grid-cols-2 gap-y-10 md:grid-cols-4">
        {items.map((item, i) => (
          <div key={i} data-reveal className="flex flex-col gap-2 border-l pl-6">
            <dt className="order-2 text-muted">{item.label}</dt>
            <dd className="order-1 text-[clamp(2.5rem,1.6rem+3vw,4.5rem)] font-semibold leading-none tracking-tight">{item.value}</dd>
          </div>
        ))}
      </dl>
    </Section>
  )
}
