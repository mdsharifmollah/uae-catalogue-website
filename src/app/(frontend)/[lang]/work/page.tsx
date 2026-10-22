import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { ProjectCard } from '@/blocks/WorkGallery/Component'
import { HubPage } from '@/components/site/HubPage'
import { QuoteBand } from '@/components/site/QuoteBand'
import { Section } from '@/components/site/Section'
import { getDictionary, getLocale } from '@/i18n/server'
import { generateMeta } from '@/utilities/generateMeta'
import { queryBySlug } from '@/utilities/queries'

export default async function WorkPage() {
  const [payload, t, locale] = await Promise.all([getPayload({ config: configPromise }), getDictionary(), getLocale()])
  const projects = await payload.find({
    collection: 'projects',
    locale,
    sort: '-publishedAt',
    limit: 60,
    depth: 1,
    overrideAccess: false,
  })
  const hub = t.hubs.work
  return (
    <HubPage
      slug="work"
      name={t.common.work}
      fallbackHero={{ eyebrow: hub.eyebrow, heading: hub.heading, subheading: hub.subheading }}
      after={<QuoteBand heading={hub.bandHeading} />}
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
  const [page, t] = await Promise.all([queryBySlug('pages', 'work'), getDictionary()])
  return generateMeta({
    doc: page || { title: t.hubs.work.metaTitle },
    path: '/work',
    fallbackDescription: t.hubs.work.metaDescription,
  })
}
