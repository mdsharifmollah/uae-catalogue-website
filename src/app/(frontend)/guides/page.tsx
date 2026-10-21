import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { GuideCard } from '@/components/site/GuideCard'
import { HubPage } from '@/components/site/HubPage'
import { Section } from '@/components/site/Section'
import { generateMeta } from '@/utilities/generateMeta'
import { queryBySlug } from '@/utilities/queries'

export default async function GuidesPage() {
  const payload = await getPayload({ config: configPromise })
  const posts = await payload.find({ collection: 'posts', sort: '-publishedAt', limit: 60, depth: 1, overrideAccess: false })
  return (
    <HubPage
      slug="guides"
      name="Guides"
      fallbackHero={{
        eyebrow: 'Guides',
        heading: 'Fabric sample books, *explained*',
        subheading: 'Practical guidance on formats, sizes, numbering and costs — for brands planning their next sample catalogue.',
      }}
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
  const page = await queryBySlug('pages', 'guides')
  return generateMeta({
    doc: page || { title: 'Guides — Fabric Sample Books, Hangers & Shade Cards' },
    path: '/guides',
    fallbackDescription: 'Guides to fabric sample book formats, sizes, numbering and costs for textile and interior brands.',
  })
}
