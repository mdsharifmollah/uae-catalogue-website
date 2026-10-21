import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { ProjectCard } from '@/blocks/WorkGallery/Component'
import { HubPage } from '@/components/site/HubPage'
import { QuoteBand } from '@/components/site/QuoteBand'
import { Section } from '@/components/site/Section'
import { generateMeta } from '@/utilities/generateMeta'
import { queryBySlug } from '@/utilities/queries'

export default async function WorkPage() {
  const payload = await getPayload({ config: configPromise })
  const projects = await payload.find({ collection: 'projects', sort: '-publishedAt', limit: 60, depth: 1, overrideAccess: false })
  return (
    <HubPage
      slug="work"
      name="Our Work"
      fallbackHero={{
        eyebrow: 'Portfolio',
        heading: 'Real samples. *Professional* presentation.',
        subheading: 'Sample books, hanging swatches and numbered fabric collections we have produced.',
      }}
      after={<QuoteBand heading="Want something *like* this?" />}
    >
      <Section tone="ivory">
        <ul className="shell grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {projects.docs.map((p) => (
            <li key={p.id} data-reveal>
              <ProjectCard project={p} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw" />
            </li>
          ))}
        </ul>
      </Section>
    </HubPage>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryBySlug('pages', 'work')
  return generateMeta({
    doc: page || { title: 'Our Work — Fabric Sample Books & Swatch Displays' },
    path: '/work',
    fallbackDescription: 'Portfolio of fabric sample books, waterfall hangers and numbered swatch cards made in Sharjah, UAE.',
  })
}
