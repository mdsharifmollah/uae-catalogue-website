import type { Post, ArchiveBlock as ArchiveBlockProps } from '@/payload-types'

import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import { GuideCard } from '@/components/site/GuideCard'
import { Section, type Tone } from '@/components/site/Section'
import { SectionIntro } from '@/components/site/SectionIntro'
import { getLocale } from '@/i18n/server'

export const ArchiveBlock: React.FC<ArchiveBlockProps & { id?: string | null }> = async (props) => {
  const {
    id,
    tone,
    eyebrow,
    heading,
    intro,
    categories,
    limit: limitFromProps,
    populateBy,
    selectedDocs,
  } = props

  const limit = limitFromProps || 3
  let posts: Post[] = []

  if (populateBy === 'collection') {
    const payload = await getPayload({ config: configPromise })
    const flattenedCategories = categories?.map((category) =>
      typeof category === 'object' ? category.id : category,
    )
    const fetched = await payload.find({
      locale: await getLocale(),
      collection: 'posts',
      depth: 1,
      limit,
      sort: '-publishedAt',
      overrideAccess: false,
      ...(flattenedCategories && flattenedCategories.length > 0
        ? { where: { categories: { in: flattenedCategories } } }
        : {}),
    })
    posts = fetched.docs
  } else if (selectedDocs?.length) {
    posts = selectedDocs
      .map((post) => (typeof post.value === 'object' ? post.value : null))
      .filter(Boolean) as Post[]
  }

  if (!posts.length) return null

  return (
    <Section tone={(tone as Tone) || 'ivory'} id={id ? `block-${id}` : undefined}>
      <div className="shell">
        <SectionIntro eyebrow={eyebrow} heading={heading} intro={intro} />
        <ul className="mt-14 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <li key={post.id} data-reveal>
              <GuideCard post={post} />
            </li>
          ))}
        </ul>
      </div>
    </Section>
  )
}
