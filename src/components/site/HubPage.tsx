import { draftMode } from 'next/headers'
import React from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { MinimalHero } from '@/heros/MinimalHero'
import { RenderHero } from '@/heros/RenderHero'
import type { Page } from '@/payload-types'
import { queryBySlug } from '@/utilities/queries'

/**
 * Listing pages (/products, /industries, /work, /guides). If a Page with the
 * same slug exists in the CMS, its hero + sections are used (editable intro);
 * the listing itself is always rendered by `children`.
 */
export const HubPage = async ({
  slug,
  name,
  fallbackHero,
  children,
  after,
}: {
  slug: string
  name: string
  fallbackHero: { eyebrow?: string; heading: string; subheading?: string }
  children: React.ReactNode
  after?: React.ReactNode
}) => {
  const { isEnabled: draft } = await draftMode()
  const page = (await queryBySlug('pages', slug)) as Page | null
  const crumbs = <Breadcrumbs items={[{ name, path: `/${slug}` }]} />

  return (
    <article>
      {draft && <LivePreviewListener />}
      {page && page.hero?.type && page.hero.type !== 'none' ? (
        page.hero.type === 'minimal' ? (
          <MinimalHero {...page.hero} breadcrumb={crumbs} />
        ) : (
          <RenderHero {...page.hero} />
        )
      ) : (
        <MinimalHero type="minimal" tone="ink" {...fallbackHero} breadcrumb={crumbs} />
      )}
      {children}
      {page?.layout && <RenderBlocks blocks={page.layout} />}
      {after}
    </article>
  )
}
