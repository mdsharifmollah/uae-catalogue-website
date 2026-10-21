import type { Metadata } from 'next'
import React from 'react'

import { getIndustries, IndustryCard } from '@/blocks/IndustriesCarousel/Component'
import { HubPage } from '@/components/site/HubPage'
import { QuoteBand } from '@/components/site/QuoteBand'
import { Section } from '@/components/site/Section'
import { generateMeta } from '@/utilities/generateMeta'
import { queryBySlug } from '@/utilities/queries'

export default async function IndustriesPage() {
  const industries = await getIndustries()
  return (
    <HubPage
      slug="industries"
      name="Industries"
      fallbackHero={{
        eyebrow: 'Industries we serve',
        heading: 'Sample catalogues built for *how* your industry sells',
        subheading:
          'Upholstery, curtains, carpets, blinds and wallpaper — each market presents materials differently. We make the format that fits yours.',
      }}
      after={<QuoteBand heading="Tell us about *your* collection" />}
    >
      <Section tone="ivory">
        <ul className="shell grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {industries.map((ind) => (
            <li key={ind.id} data-reveal>
              <IndustryCard industry={ind} />
            </li>
          ))}
        </ul>
      </Section>
    </HubPage>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryBySlug('pages', 'industries')
  return generateMeta({
    doc: page || { title: 'Industries — Upholstery, Curtain, Carpet & Blind Sample Books' },
    path: '/industries',
    fallbackDescription:
      'Fabric sample books and catalogues for upholstery, curtain, carpet, blind and wallpaper businesses in the UAE and GCC.',
  })
}
