import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'

import type { FAQ, Industry, Product } from '@/payload-types'

import { FAQList } from '@/blocks/FAQ/Component'
import { FormatCard } from '@/blocks/FormatGrid/Component'
import { IndustryCard } from '@/blocks/IndustriesCarousel/Component'
import { ProjectCard } from '@/blocks/WorkGallery/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { CheckIcon, WhatsAppIcon } from '@/components/site/icons'
import { QuoteBand } from '@/components/site/QuoteBand'
import { Section } from '@/components/site/Section'
import { SectionIntro } from '@/components/site/SectionIntro'
import { WhatsAppAnchor } from '@/components/site/WhatsAppAnchor'
import { PageHero } from '@/heros/PageHero'
import { generateMeta } from '@/utilities/generateMeta'
import { allSlugs, queryBySlug } from '@/utilities/queries'
import { docPath } from '@/utilities/routes'
import { faqSchema, serviceSchema } from '@/utilities/schema'
import { localizePath } from '@/i18n/config'
import { getDictionary, getLocale } from '@/i18n/server'

export async function generateStaticParams() {
  return (await allSlugs('products')).map((slug) => ({ slug }))
}

type Args = { params: Promise<{ slug: string }> }

export default async function ProductPage({ params }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const path = docPath('products', slug)
  const product = (await queryBySlug('products', decodeURIComponent(slug))) as Product | null

  if (!product) return <PayloadRedirects url={path} />

  const payload = await getPayload({ config: configPromise })
  const projects = await payload.find({
    locale: await getLocale(),
    collection: 'projects',
    where: { products: { contains: product.id } },
    limit: 3,
    depth: 1,
    overrideAccess: false,
  })

  const faqs = (product.faqs || []).filter((f): f is FAQ => typeof f === 'object')
  const industries = (product.industries || []).filter((i): i is Industry => typeof i === 'object')
  const related = (product.relatedProducts || []).filter((p): p is Product => typeof p === 'object')
  const [t, locale] = await Promise.all([getDictionary(), getLocale()])
  const waMessage = product.whatsappMessage || t.common.quoteMessageFor(product.title)

  return (
    <article>
      <PayloadRedirects disableNotFound url={path} />
      {draft && <LivePreviewListener />}

      <PageHero
        type="page"
        tone="ink"
        eyebrow={t.product.eyebrow}
        heading={product.title}
        subheading={product.summary}
        media={product.heroImage}
        links={[
          {
            link: {
              type: 'whatsapp',
              label: t.common.getQuoteWhatsApp,
              appearance: 'primary',
              whatsappMessage: waMessage,
            },
          },
          { link: { type: 'custom', url: '/work', label: t.product.seeWork, appearance: 'glass' } },
        ]}
        breadcrumb={
          <Breadcrumbs
            items={[
              { name: t.common.products, path: '/products' },
              { name: product.title, path },
            ]}
          />
        }
      />

      <Section tone="ivory">
        <div className="shell grid gap-14 lg:grid-cols-[1.35fr_0.85fr] lg:gap-20">
          <div className="flex flex-col gap-12">
            {product.body && <RichText data={product.body} enableGutter={false} />}
            {product.useCases && product.useCases.length > 0 && (
              <div className="flex flex-col gap-6">
                <h2 className="text-h3">{t.product.idealFor}</h2>
                <ul className="grid gap-3 sm:grid-cols-2">
                  {product.useCases.map((u, i) => (
                    <li key={i} className="glass flex items-start gap-3 rounded-2xl p-4">
                      <CheckIcon className="mt-1 shrink-0 text-accent" />
                      {u.text}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <div className="glass flex flex-col gap-6 rounded-[var(--radius-panel)] p-7">
              <h2 className="text-[1.375rem] font-semibold">{t.product.specs}</h2>
              {product.specs && product.specs.length > 0 ? (
                <dl className="flex flex-col">
                  {product.specs.map((s, i) => (
                    <div
                      key={i}
                      className="grid grid-cols-[0.9fr_1.1fr] gap-4 border-t py-3.5 first:border-t-0 first:pt-0"
                    >
                      <dt className="text-muted">{s.label}</dt>
                      <dd className="font-medium">{s.value}</dd>
                    </div>
                  ))}
                </dl>
              ) : (
                <p className="text-muted">{t.product.madeToOrder}</p>
              )}
              <WhatsAppAnchor className="btn btn-primary w-full" message={waMessage}>
                <WhatsAppIcon />
                {t.product.askAbout}
              </WhatsAppAnchor>
              <p className="text-[1rem] text-muted">{t.product.sharePhotos}</p>
            </div>
          </aside>
        </div>
      </Section>

      {product.gallery && product.gallery.length > 0 && (
        <Section tone="sand">
          <div className="shell">
            <SectionIntro eyebrow={t.product.gallery} heading={t.product.galleryHeading(product.title)} />
            <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {product.gallery.map((g, i) => (
                <li key={i} data-reveal className="flex flex-col gap-3">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-[var(--radius-card)]">
                    <Media
                      resource={g.image}
                      fill
                      size="(max-width: 640px) 100vw, 33vw"
                      imgClassName="object-cover"
                      pictureClassName="absolute inset-0"
                      htmlElement={null}
                    />
                  </div>
                  {g.caption && <p className="text-[1rem] text-muted">{g.caption}</p>}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {projects.docs.length > 0 && (
        <Section tone="sand">
          <div className="shell">
            <SectionIntro eyebrow={t.product.workEyebrow} heading={t.product.workHeading} />
            <ul className="mt-12 grid gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
              {projects.docs.map((p) => (
                <li key={p.id} data-reveal>
                  <ProjectCard project={p} />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {industries.length > 0 && (
        <Section tone="linen">
          <div className="shell">
            <SectionIntro eyebrow={t.product.industriesEyebrow} heading={t.product.industriesHeading} />
            <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {industries.map((ind) => (
                <li key={ind.id} data-reveal>
                  <IndustryCard industry={ind} />
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {faqs.length > 0 && (
        <Section tone="ivory">
          <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <SectionIntro eyebrow={t.product.faqEyebrow} heading={t.product.faqHeading(product.title)} />
            <FAQList faqs={faqs} />
          </div>
        </Section>
      )}

      {related.length > 0 && (
        <Section tone="ivory">
          <div className="shell">
            <SectionIntro eyebrow={t.product.relatedEyebrow} heading={t.product.relatedHeading} />
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {related.slice(0, 4).map((p) => (
                <FormatCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </Section>
      )}

      <QuoteBand
        heading={t.product.bandHeading(product.title)}
        text={t.product.bandText}
        message={waMessage}
      />

      <JsonLd
        data={[
          serviceSchema({
            name: product.title,
            description: product.summary,
            path: localizePath(locale, path),
            image: product.heroImage,
          }),
          faqSchema(faqs),
        ]}
      />
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const product = (await queryBySlug('products', decodeURIComponent(slug))) as Product | null
  return generateMeta({
    doc: product,
    path: docPath('products', slug),
    fallbackDescription: product?.summary,
  })
}
