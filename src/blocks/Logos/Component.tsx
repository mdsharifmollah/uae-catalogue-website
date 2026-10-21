import React from 'react'

import type { LogosBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'
import { Section, type Tone } from '@/components/site/Section'

/** Client logos — only rows with permission confirmed are shown. */
export const LogosBlockComponent: React.FC<Props & { id?: string | null }> = ({ id, tone, heading, logos }) => {
  const allowed = (logos || []).filter((l) => l.permission && l.logo && typeof l.logo === 'object')
  if (!allowed.length) return null
  return (
    <Section tone={(tone as Tone) || 'ivory'} id={id ? `block-${id}` : undefined} className="!py-16">
      <div className="shell flex flex-col items-center gap-10">
        {heading && <p className="eyebrow">{heading}</p>}
        <ul className="flex flex-wrap items-center justify-center gap-x-14 gap-y-8">
          {allowed.map((l, i) => (
            <li key={i} className="relative h-12 w-36 opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0">
              <Media resource={l.logo} fill size="144px" alt={l.name} imgClassName="object-contain" pictureClassName="absolute inset-0" htmlElement={null} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
