import type { Metadata } from 'next'
import React from 'react'

import { getIndustries, IndustryCard } from '@/blocks/IndustriesCarousel/Component'
import { HubPage } from '@/components/site/HubPage'
import { QuoteBand } from '@/components/site/QuoteBand'
import { Section } from '@/components/site/Section'
import { getDictionary } from '@/i18n/server'
import { generateMeta } from '@/utilities/generateMeta'
import { queryBySlug } from '@/utilities/queries'

export default async function IndustriesPage() {
  const [industries, t] = await Promise.all([getIndustries(), getDictionary()])
  const hub = t.hubs.industries
  return (
    <HubPage
      slug="industries"
      name={t.common.industries}
      fallbackHero={{ eyebrow: hub.eyebrow, heading: hub.heading, subheading: hub.subheading }}
      after={<QuoteBand heading={hub.bandHeading} />}
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
  const [page, t] = await Promise.all([queryBySlug('pages', 'industries'), getDictionary()])
  return generateMeta({
    doc: page || { title: t.hubs.industries.metaTitle },
    path: '/industries',
    fallbackDescription: t.hubs.industries.metaDescription,
  })
}
