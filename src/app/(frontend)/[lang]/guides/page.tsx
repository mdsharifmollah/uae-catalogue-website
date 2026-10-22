import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { GuideCard } from '@/components/site/GuideCard'
import { HubPage } from '@/components/site/HubPage'
import { Section } from '@/components/site/Section'
import { getDictionary, getLocale } from '@/i18n/server'
import { generateMeta } from '@/utilities/generateMeta'
import { queryBySlug } from '@/utilities/queries'

export default async function GuidesPage() {
  const [payload, t, locale] = await Promise.all([getPayload({ config: configPromise }), getDictionary(), getLocale()])
  const posts = await payload.find({
    collection: 'posts',
    locale,
    sort: '-publishedAt',
    limit: 60,
    depth: 1,
    overrideAccess: false,
  })
  const hub = t.hubs.guides
  return (
    <HubPage
      slug="guides"
      name={t.common.guides}
      fallbackHero={{ eyebrow: hub.eyebrow, heading: hub.heading, subheading: hub.subheading }}
    >
      <Section tone="ivory">
        <ul className="shell grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {posts.docs.map((post) => (
            <li key={post.id} data-reveal>
              <GuideCard post={post} headingLevel="h2" />
            </li>
          ))}
        </ul>
      </Section>
    </HubPage>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const [page, t] = await Promise.all([queryBySlug('pages', 'guides'), getDictionary()])
  return generateMeta({
    doc: page || { title: t.hubs.guides.metaTitle },
    path: '/guides',
    fallbackDescription: t.hubs.guides.metaDescription,
  })
}
