import type { Metadata } from 'next'

import configPromise from '@payload-config'
import { draftMode } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'

import type { FAQ, Industry } from '@/payload-types'

import { FAQList } from '@/blocks/FAQ/Component'
import { FormatCard } from '@/blocks/FormatGrid/Component'
import { ProjectCard } from '@/blocks/WorkGallery/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { JsonLd } from '@/components/seo/JsonLd'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { QuoteBand } from '@/components/site/QuoteBand'
import { Section } from '@/components/site/Section'
import { SectionIntro } from '@/components/site/SectionIntro'
import { PageHero } from '@/heros/PageHero'
import { generateMeta } from '@/utilities/generateMeta'
import { allSlugs, queryBySlug } from '@/utilities/queries'
import { docPath } from '@/utilities/routes'
import { faqSchema, serviceSchema } from '@/utilities/schema'
import { localizePath } from '@/i18n/config'
import { getDictionary, getLocale } from '@/i18n/server'

export async function generateStaticParams() {
  return (await allSlugs('industries')).map((slug) => ({ slug }))
}

type Args = { params: Promise<{ slug: string }> }

export default async function IndustryPage({ params }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const path = docPath('industries', slug)
  const industry = (await queryBySlug('industries', decodeURIComponent(slug))) as Industry | null
  if (!industry) return <PayloadRedirects url={path} />

  const payload = await getPayload({ config: configPromise })
  const [products, projects] = await Promise.all([
    payload.find({
      locale: await getLocale(),
      collection: 'products',
      where: { industries: { contains: industry.id } },
      sort: 'order',
      depth: 1,
      limit: 6,
      overrideAccess: false,
    }),
    payload.find({
      locale: await getLocale(),
      collection: 'projects',
      where: { industries: { contains: industry.id } },
      depth: 1,
      limit: 3,
      overrideAccess: false,
    }),
  ])
  const faqs = (industry.faqs || []).filter((f): f is FAQ => typeof f === 'object')
  const [t, locale] = await Promise.all([getDictionary(), getLocale()])
  const message = t.industry.message(industry.title)

  return (
    <article>
      <PayloadRedirects disableNotFound url={path} />
      {draft && <LivePreviewListener />}
      <PageHero
        type="page"
        tone="ink"
        eyebrow={industry.tag || t.industry.eyebrow}
        heading={industry.title}
        subheading={industry.summary}
        media={industry.heroImage}
        links={[
          {
            link: {
              type: 'whatsapp',
              label: t.industry.discuss,
              appearance: 'primary',
              whatsappMessage: message,
            },
          },
          { link: { type: 'custom', url: '/products', label: t.industry.allFormats, appearance: 'glass' } },
        ]}
        breadcrumb={
          <Breadcrumbs
            items={[
              { name: t.common.industries, path: '/industries' },
              { name: industry.title, path },
            ]}
          />
        }
      />

      {industry.needs && industry.needs.length > 0 && (
        <Section tone="ivory">
          <div className="shell">
            <SectionIntro
              eyebrow={t.industry.needsEyebrow}
              heading={t.industry.needsHeading}
            />
            <ul className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
              {industry.needs.map((n, i) => (
                <li
                  key={i}
                  data-reveal
                  className="glass flex flex-col gap-3 rounded-[var(--radius-card)] p-7"
                >
                  <span className="text-[1rem] font-semibold text-accent">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <h3 className="text-[1.375rem] font-semibold">{n.title}</h3>
                  {n.text && <p className="text-muted">{n.text}</p>}
                </li>
              ))}
            </ul>
          </div>
        </Section>
      )}

      {industry.body && (
        <Section tone="ivory" className="!pt-0">
          <div className="shell max-w-4xl">
            <RichText data={industry.body} enableGutter={false} />
          </div>
        </Section>
      )}

      {products.docs.length > 0 && (
        <Section tone="sand">
          <div className="shell">
            <SectionIntro
              eyebrow={t.industry.formatsEyebrow}
              heading={t.industry.formatsHeading(industry.title)}
            />
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {products.docs.map((p) => (
                <FormatCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </Section>
      )}

      {projects.docs.length > 0 && (
        <Section tone="linen">
          <div className="shell">
            <SectionIntro eyebrow={t.industry.workEyebrow} heading={t.industry.workHeading} />
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

      {faqs.length > 0 && (
        <Section tone="ivory">
          <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
            <SectionIntro eyebrow={t.industry.faqEyebrow} heading={t.industry.faqHeading} />
            <FAQList faqs={faqs} />
          </div>
        </Section>
      )}

      <QuoteBand
        heading={t.industry.bandHeading(industry.title)}
        message={message}
      />
      <JsonLd
        data={[
          serviceSchema({
            name: t.industry.serviceName(industry.title),
            description: industry.summary,
            path: localizePath(locale, path),
            image: industry.heroImage,
            serviceType: t.industry.serviceType,
          }),
          faqSchema(faqs),
        ]}
      />
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const industry = (await queryBySlug('industries', decodeURIComponent(slug))) as Industry | null
  return generateMeta({
    doc: industry,
    path: docPath('industries', slug),
    fallbackDescription: industry?.summary,
  })
}
