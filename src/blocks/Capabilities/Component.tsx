import React from 'react'

import type { CapabilitiesBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { CheckIcon } from '@/components/site/icons'
import { Section, type Tone } from '@/components/site/Section'
import { SectionIntro } from '@/components/site/SectionIntro'

export const CapabilitiesBlock: React.FC<Props & { id?: string | null }> = ({
  id,
  tone,
  eyebrow,
  heading,
  intro,
  layout,
  media,
  items,
  links,
}) => {
  if (!items?.length) return null
  const sectionId = id ? `block-${id}` : undefined

  if (layout === 'checklist') {
    return (
      <Section tone={(tone as Tone) || 'charcoal'} id={sectionId}>
        <div className="shell grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
          {media && typeof media === 'object' && (
            <div data-reveal className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-panel)] max-lg:order-2 sm:aspect-[5/4] lg:aspect-[4/5]">
              <Media resource={media} fill size="(max-width: 1024px) 100vw, 45vw" imgClassName="object-cover" pictureClassName="absolute inset-0" htmlElement={null} />
              <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
            </div>
          )}
          <div className="flex flex-col gap-10">
            <SectionIntro eyebrow={eyebrow} heading={heading} intro={intro} />
            <ul className="flex flex-col">
              {items.map((item, i) => (
                <li key={i} data-reveal className="flex gap-5 border-t py-6 first:border-t-0 first:pt-0">
                  <span className="mt-0.5 grid size-9 shrink-0 place-items-center rounded-full bg-[color:var(--accent)] text-[#121311]">
                    <CheckIcon size={18} />
                  </span>
                  <div>
                    <h3 className="text-[1.25rem] font-semibold">{item.title}</h3>
                    {item.text && <p className="mt-1.5 text-muted">{item.text}</p>}
                  </div>
                </li>
              ))}
            </ul>
            {links && links.length > 0 && (
              <div className="flex flex-wrap gap-3">
                {links.map(({ link }, i) => (
                  <CMSLink key={i} {...link} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>
    )
  }

  return (
    <Section tone={(tone as Tone) || 'linen'} id={sectionId}>
      <div className="shell">
        <SectionIntro eyebrow={eyebrow} heading={heading} intro={intro} align="center" />
        <ul className="mt-14 grid gap-5 sm:grid-cols-2 md:mt-20 lg:grid-cols-3 lg:gap-6">
          {items.map((item, i) => (
            <li
              key={i}
              data-reveal
              className="glass group relative flex flex-col gap-4 overflow-hidden rounded-[var(--radius-card)] p-7 transition-transform duration-700 ease-[var(--ease-out-expo)] hover:-translate-y-1.5"
            >
              {item.icon && typeof item.icon === 'object' ? (
                <div className="relative size-24 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:-translate-y-1 group-hover:rotate-[-6deg] group-hover:scale-110">
                  <Media resource={item.icon} fill size="96px" imgClassName="object-contain drop-shadow-[0_18px_22px_rgba(0,0,0,0.25)]" pictureClassName="absolute inset-0" htmlElement={null} />
                </div>
              ) : (
                <span className="grid size-14 place-items-center rounded-2xl bg-[color:var(--accent)] text-[1.25rem] font-semibold text-[#121311]">
                  {String(i + 1).padStart(2, '0')}
                </span>
              )}
              <h3 className="text-[1.375rem] font-semibold leading-snug">{item.title}</h3>
              {item.text && <p className="text-muted">{item.text}</p>}
              <span aria-hidden="true" className="pointer-events-none absolute -end-16 -top-16 size-40 rounded-full bg-[color:var(--accent)] opacity-0 blur-3xl transition-opacity duration-700 group-hover:opacity-30" />
            </li>
          ))}
        </ul>
        {links && links.length > 0 && (
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {links.map(({ link }, i) => (
              <CMSLink key={i} {...link} />
            ))}
          </div>
        )}
      </div>
    </Section>
  )
}
