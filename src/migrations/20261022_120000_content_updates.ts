import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

import { privacyPolicy } from '../endpoints/seed/content'

// Copy as it was when this migration was written (the seed has moved on since;
// migration 20261022_150000_business_content replaces it on every site).
const homeHero = {
  eyebrow: 'Catalogue Manufacturer · Sharjah, UAE',
  subheading:
    'Fabric sample books, waterfall hangers, shade cards, presentation boxes and catalogues of every kind — made for textile, upholstery, curtain and interior brands.',
}

const otherCataloguesFaq = {
  category: 'general' as const,
  question: 'Do you make other kinds of catalogues, not only fabric?',
  answer:
    'Yes. Besides fabric, we make sample books and catalogues for wallpaper, carpets and rugs, blinds and other materials. Send us your samples and how you plan to present them, and we will suggest a suitable format.',
}

// Skip the site-wide revalidation hooks; they need a Next.js request and the
// deploy rebuilds every page anyway.
const context = { disableRevalidate: true }

/**
 * Content: "all kinds of catalogues" homepage hero copy, the full privacy
 * policy, and an FAQ about non-fabric catalogues. Safe to run more than once.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  const page = async (slug: string) =>
    (
      await payload.find({
        collection: 'pages',
        where: { slug: { equals: slug } },
        limit: 1,
        depth: 0,
        locale: 'en',
        req,
      })
    ).docs[0]

  const home = await page('home')
  if (home) {
    await payload.update({
      collection: 'pages',
      id: home.id,
      locale: 'en',
      depth: 0,
      req,
      context,
      data: { hero: { ...home.hero, ...homeHero }, _status: 'published' },
    })
  }

  const privacy = await page('privacy-policy')
  if (privacy) {
    const layout = (privacy.layout || []).map((block) =>
      block.blockType === 'content'
        ? { ...block, columns: [{ ...(block.columns?.[0] || {}), size: 'full' as const, richText: privacyPolicy }] }
        : block,
    )
    await payload.update({
      collection: 'pages',
      id: privacy.id,
      locale: 'en',
      depth: 0,
      req,
      context,
      data: { layout, _status: 'published' },
    })
  }

  const existing = await payload.find({
    collection: 'faqs',
    where: { question: { equals: otherCataloguesFaq.question } },
    limit: 1,
    locale: 'en',
    req,
  })
  if (!existing.totalDocs) {
    await payload.create({
      collection: 'faqs',
      locale: 'en',
      req,
      context,
      data: {
        question: otherCataloguesFaq.question,
        answer: otherCataloguesFaq.answer,
        category: otherCataloguesFaq.category,
        order: 15,
      },
    })
  }
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Content change only; edit in the dashboard to change it back.
}
