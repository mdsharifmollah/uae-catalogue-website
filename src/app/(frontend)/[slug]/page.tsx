import type { Metadata } from 'next'

import { draftMode } from 'next/headers'
import React from 'react'

import { RenderBlocks } from '@/blocks/RenderBlocks'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import { allSlugs, queryBySlug } from '@/utilities/queries'

/** Slugs reserved by dedicated routes (their Page docs only provide intros). */
const RESERVED = new Set(['home', 'products', 'industries', 'work', 'guides'])

export async function generateStaticParams() {
  const slugs = await allSlugs('pages')
  return slugs.filter((slug) => !RESERVED.has(slug)).map((slug) => ({ slug }))
}

type Args = {
  params: Promise<{ slug?: string }>
}

export default async function Page({ params: paramsPromise }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const url = decodedSlug === 'home' ? '/' : '/' + decodedSlug

  const page = await queryBySlug('pages', decodedSlug)

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  return (
    <article>
      <PayloadRedirects disableNotFound url={url} />
      {draft && <LivePreviewListener />}
      <RenderHero {...page.hero} />
      <RenderBlocks blocks={page.layout} />
    </article>
  )
}

export async function generateMetadata({ params: paramsPromise }: Args): Promise<Metadata> {
  const { slug = 'home' } = await paramsPromise
  const decodedSlug = decodeURIComponent(slug)
  const page = await queryBySlug('pages', decodedSlug)
  return generateMeta({
    doc: page,
    path: decodedSlug === 'home' ? '/' : `/${decodedSlug}`,
    fallbackDescription: page?.hero?.subheading,
  })
}
