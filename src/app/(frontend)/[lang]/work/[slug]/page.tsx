import type { Metadata } from 'next'

import { draftMode } from 'next/headers'
import React from 'react'

import type { Product, Project } from '@/payload-types'

import { FormatCard } from '@/blocks/FormatGrid/Component'
import { LivePreviewListener } from '@/components/LivePreviewListener'
import { Media } from '@/components/Media'
import { PayloadRedirects } from '@/components/PayloadRedirects'
import RichText from '@/components/RichText'
import { Breadcrumbs } from '@/components/site/Breadcrumbs'
import { QuoteBand } from '@/components/site/QuoteBand'
import { Section } from '@/components/site/Section'
import { SectionIntro } from '@/components/site/SectionIntro'
import { PageHero } from '@/heros/PageHero'
import { generateMeta } from '@/utilities/generateMeta'
import { allSlugs, queryBySlug } from '@/utilities/queries'
import { docPath } from '@/utilities/routes'
import { getDictionary } from '@/i18n/server'

export async function generateStaticParams() {
  return (await allSlugs('projects')).map((slug) => ({ slug }))
}

type Args = { params: Promise<{ slug: string }> }

export default async function ProjectPage({ params }: Args) {
  const { isEnabled: draft } = await draftMode()
  const { slug } = await params
  const path = docPath('projects', slug)
  const project = (await queryBySlug('projects', decodeURIComponent(slug))) as Project | null
  if (!project) return <PayloadRedirects url={path} />

  const t = await getDictionary()
  const products = (project.products || []).filter((p): p is Product => typeof p === 'object')

  return (
    <article>
      <PayloadRedirects disableNotFound url={path} />
      {draft && <LivePreviewListener />}
      <PageHero
        type="page"
        tone="ink"
        eyebrow={project.showClientName && project.clientName ? project.clientName : t.project.eyebrow}
        heading={project.title}
        subheading={project.summary}
        media={project.coverImage}
        breadcrumb={<Breadcrumbs items={[{ name: t.common.work, path: '/work' }, { name: project.title, path }]} />}
      >
        {project.specs && project.specs.length > 0 && (
          <dl className="mt-2 grid grid-cols-2 gap-3">
            {project.specs.map((s, i) => (
              <div key={i} className="glass rounded-2xl p-4">
                <dt className="text-[1rem] text-muted">{s.label}</dt>
                <dd className="font-semibold">{s.value}</dd>
              </div>
            ))}
          </dl>
        )}
      </PageHero>

      {(project.body || (project.gallery && project.gallery.length > 0)) && (
        <Section tone="ivory">
          <div className="shell flex flex-col gap-14">
            {project.body && (
              <div className="max-w-3xl">
                <RichText data={project.body} enableGutter={false} />
              </div>
            )}
            {project.gallery && project.gallery.length > 0 && (
              <ul className="grid gap-4 sm:grid-cols-2">
                {project.gallery.map((g, i) => (
                  <li key={i} data-reveal className={i % 3 === 0 ? 'sm:col-span-2' : ''}>
                    <figure className="flex flex-col gap-3">
                      <div className={`relative overflow-hidden rounded-[var(--radius-card)] ${i % 3 === 0 ? 'aspect-[16/9]' : 'aspect-[4/3]'}`}>
                        <Media resource={g.image} fill size={i % 3 === 0 ? '100vw' : '50vw'} imgClassName="object-cover" pictureClassName="absolute inset-0" htmlElement={null} />
                      </div>
                      {g.caption && <figcaption className="text-[1rem] text-muted">{g.caption}</figcaption>}
                    </figure>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Section>
      )}

      {products.length > 0 && (
        <Section tone="sand">
          <div className="shell">
            <SectionIntro eyebrow={t.project.formatsEyebrow} heading={t.project.formatsHeading} />
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {products.map((p) => (
                <FormatCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        </Section>
      )}

      <QuoteBand heading={t.project.bandHeading} />
    </article>
  )
}

export async function generateMetadata({ params }: Args): Promise<Metadata> {
  const { slug } = await params
  const project = (await queryBySlug('projects', decodeURIComponent(slug))) as Project | null
  return generateMeta({ doc: project, path: docPath('projects', slug), fallbackDescription: project?.summary })
}
