import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import type { Industry, IndustriesCarouselBlock as Props } from '@/payload-types'

import { Media } from '@/components/Media'
import { ArrowUpRight } from '@/components/site/icons'
import { cardToneClass } from '@/components/site/cardTones'
import { Section, type Tone } from '@/components/site/Section'
import { SectionIntro } from '@/components/site/SectionIntro'
import { docPath } from '@/utilities/routes'
import { cn } from '@/utilities/ui'
import { CarouselControls } from './CarouselControls'

export const getIndustries = async (selected?: (Industry | number)[] | null) => {
  const picked = (selected || []).filter((p): p is Industry => typeof p === 'object')
  if (picked.length) return picked
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({ collection: 'industries', sort: 'order', limit: 20, depth: 1, overrideAccess: false })
  return res.docs
}

export const IndustryCard: React.FC<{ industry: Industry; className?: string }> = ({ industry, className }) => (
  <article className={cn('group relative flex h-full flex-col overflow-hidden rounded-[var(--radius-panel)] bg-[color:var(--surface)] ring-1 ring-[color:var(--line)]', className)}>
    <div className="flex flex-1 flex-col gap-4 p-6 md:p-7">
      <div className="flex items-center justify-between gap-4">
        {industry.tag && (
          <span className="rounded-full bg-[color:var(--line)] px-3.5 py-1.5 text-[1rem] font-medium">{industry.tag}</span>
        )}
        <span className="arrow-chip ml-auto border border-[color:var(--line)]">
          <ArrowUpRight size={16} />
        </span>
      </div>
      <h3 className="text-[1.75rem] font-semibold leading-[1.1] tracking-tight md:text-[2rem]">
        <Link href={docPath('industries', industry.slug)} className="after:absolute after:inset-0 after:content-['']">
          {industry.title}
        </Link>
      </h3>
      <p className="line-clamp-3 text-[1.0625rem] text-muted">{industry.summary}</p>
    </div>
    <div className={cn('relative m-2 mt-0 aspect-[5/4] overflow-hidden rounded-[calc(var(--radius-panel)-0.5rem)]', cardToneClass(industry.cardTone))}>
      {(industry.cardImage || industry.heroImage) && (
        <Media
          resource={(industry.cardImage || industry.heroImage) as Industry['heroImage']}
          fill
          size="(max-width: 768px) 80vw, 26rem"
          imgClassName={cn(
            'transition-transform duration-[1000ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]',
            industry.cardImage ? 'object-contain p-6' : 'object-cover',
          )}
          pictureClassName="absolute inset-0"
          htmlElement={null}
        />
      )}
    </div>
  </article>
)

export const IndustriesCarouselBlock: React.FC<Props & { id?: string | null }> = async ({
  id,
  tone,
  eyebrow,
  heading,
  intro,
  industries: selected,
}) => {
  const industries = await getIndustries(selected)
  if (!industries.length) return null
  const listId = `industries-${id || 'list'}`

  return (
    <Section tone={(tone as Tone) || 'ivory'} id={id ? `block-${id}` : undefined}>
      <div className="shell flex flex-col justify-between gap-8 md:flex-row md:items-end">
        <SectionIntro eyebrow={eyebrow} heading={heading} intro={intro} />
        <CarouselControls targetId={listId} />
      </div>
      <ul
        id={listId}
        className="no-scrollbar mt-14 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-px-[clamp(1rem,4vw,3rem)] px-[clamp(1rem,4vw,3rem)] pb-4 md:mt-16 md:gap-6"
        data-lenis-prevent-touch
      >
        {industries.map((industry) => (
          <li key={industry.id} data-reveal className="w-[82vw] shrink-0 snap-start sm:w-[22rem] lg:w-[26rem]">
            <IndustryCard industry={industry} />
          </li>
        ))}
      </ul>
    </Section>
  )
}
