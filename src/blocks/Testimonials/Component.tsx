import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { Testimonial, TestimonialsBlock as Props } from '@/payload-types'

import { Section, type Tone } from '@/components/site/Section'
import { SectionIntro } from '@/components/site/SectionIntro'

/** Only verified testimonials are ever rendered. */
export const TestimonialsBlockComponent: React.FC<Props & { id?: string | null }> = async ({
  id,
  tone,
  eyebrow,
  heading,
  intro,
  testimonials: selected,
}) => {
  let items = (selected || []).filter((t): t is Testimonial => typeof t === 'object')
  if (!items.length) {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({ collection: 'testimonials', where: { verified: { equals: true } }, limit: 12 })
    items = res.docs
  }
  items = items.filter((t) => t.verified)
  if (!items.length) return null

  return (
    <Section tone={(tone as Tone) || 'sand'} id={id ? `block-${id}` : undefined}>
      <div className="shell">
        <SectionIntro eyebrow={eyebrow} heading={heading} intro={intro} />
        <ul className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <li key={t.id} data-reveal className="glass flex flex-col gap-6 rounded-[var(--radius-card)] p-7">
              <blockquote className="text-[1.1875rem] leading-relaxed">“{t.quote}”</blockquote>
              <p className="mt-auto text-[1rem]">
                <span className="block font-semibold">{t.name}</span>
                <span className="text-muted">{[t.role, t.company].filter(Boolean).join(', ')}</span>
              </p>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
