import type { Metadata } from 'next'

import { draftMode } from 'next/headers'
import React from 'react'

import type { Post, Product } from '@/payload-types'

import { FormatCard } from '@/blocks/FormatGrid/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { GuideCard } from '@/components/site/GuideCard'
import { QuoteBand } from '@/components/site/QuoteBand'
import { Section } from '@/components/site/Section'
import { SectionIntro } from '@/components/site/SectionIntro'
import { MinimalHero } from '@/heros/MinimalHero'
import { formatDateTime } from '@/utilities/formatDateTime'
import { generateMeta } from '@/utilities/generateMeta'
import { allSlugs, queryBySlug } from '@/utilities/queries'
import { docPath } from '@/utilities/routes'
import { articleSchema } from '@/utilities/schema'
import { localizePath } from '@/i18n/config'
import { getDictionary, getLocale } from '@/i18n/server'

export async function generateStaticParams() {
  return (await allSlugs('posts')).map((slug) => ({ slug }))
}

type Args = { params: Promise<{ slug: string }> }

export default async function GuidePage({ params }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const path = docPath('posts', slug)
  const post = (await queryBySlug('posts', decodeURIComponent(slug))) as Post | null
  if (!post) return <PayloadRedirects url={path} />

  const [t, locale] = await Promise.all([getDictionary(), getLocale()])
  const relatedPosts = (post.relatedPosts || []).filter((p): p is Post => typeof p === 'object')
  const relatedProducts = (post.relatedProducts || []).filter((p): p is Product => typeof p === 'object')

  return (
    <article>
      <PayloadRedirects disableNotFound url={path} />
      {draft && <LivePreviewListener />}
      <MinimalHero
        type="minimal"
        tone="ink"
        eyebrow={post.publishedAt ? t.guide.eyebrowDated(formatDateTime(post.publishedAt, locale)) : t.guide.eyebrow}
        heading={post.title}
        subheading={post.excerpt}
        breadcrumb={<Breadcrumbs items={[{ name: t.common.guides, path: '/guides' }, { name: post.title, path }]} />}
      />
      <Section tone="ivory" className="!pt-12">
        <div className="shell flex max-w-4xl flex-col gap-12">
          {post.heroImage && typeof post.heroImage === 'object' && (
            <div className="relative aspect-[16/9] overflow-hidden rounded-[var(--radius-panel)]">
              <Media resource={post.heroImage} fill priority size="(max-width: 1024px) 100vw, 56rem" imgClassName="object-cover" pictureClassName="absolute inset-0" htmlElement={null} />
            </div>
          )}
          <RichText data={post.content} enableGutter={false} />
        </div>
      </Section>

      {relatedProducts.length > 0 && (
        <Section tone="sand">
          <div className="shell">
            <SectionIntro eyebrow={t.guide.formatsEyebrow} heading={t.guide.formatsHeading} />
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {relatedProducts.map((p) => (
                <FormatCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {relatedPosts.length > 0 && (
        <Section tone="ivory">
          <div className="shell">
            <SectionIntro eyebrow={t.guide.moreEyebrow} heading={t.guide.moreHeading} />
            <ul className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-3">
              {relatedPosts.map((p) => (
                <li key={p.id}>
                  <GuideCard post={p} />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      <QuoteBand heading={t.guide.bandHeading} />
      <JsonLd data={articleSchema(post, localizePath(locale, path))} />
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const post = (await queryBySlug('posts', decodeURIComponent(slug))) as Post | null
  return generateMeta({ doc: post, path: docPath('posts', slug), fallbackDescription: post?.excerpt, type: 'article' })
}
