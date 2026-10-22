import configPromise from '@payload-config'
import { Link } from '@/i18n/client'
import { getPayload } from 'payload'
import React from 'react'

import type { Project, WorkGalleryBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { ArrowUpRight } from '@/components/site/icons'
import { Section, type Tone } from '@/components/site/Section'
import { SectionIntro } from '@/components/site/SectionIntro'
import { docPath } from '@/utilities/routes'
import { cn } from '@/utilities/ui'
import { HorizontalScroll } from './HorizontalScroll'
import { getLocale } from '@/i18n/server'

export const getProjects = async (selected?: (Project | number)[] | null, limit = 8) => {
  const picked = (selected || []).filter((p): p is Project => typeof p === 'object')
  if (picked.length) return picked
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    locale: await getLocale(),
    collection: 'projects',
    where: { featured: { equals: true } },
    sort: '-publishedAt',
    limit,
    depth: 1,
    overrideAccess: false,
  })
  return res.docs
}

export const ProjectCard: React.FC<{ project: Project; className?: string; sizes?: string }> = ({
  project,
  className,
  sizes = '(max-width: 768px) 85vw, 34vw',
}) => (
  <article className={cn('group relative flex flex-col gap-5', className)}>
    <div className="relative aspect-[4/5] overflow-hidden rounded-[var(--radius-panel)] bg-black/10">
      {project.coverImage && typeof project.coverImage === 'object' && (
        <Media
          resource={project.coverImage}
          fill
          size={sizes}
          imgClassName="object-cover transition-transform duration-[1200ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
          pictureClassName="absolute inset-0"
          htmlElement={null}
        />
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
      {project.showClientName && project.clientName && (
        <span className="glass absolute start-4 top-4 rounded-full px-4 py-1.5 text-[1rem] font-medium text-white">
          {project.clientName}
        </span>
      )}
      <span className="arrow-chip absolute bottom-4 end-4 bg-white text-[#121311]">
        <ArrowUpRight size={16} />
      </span>
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/10" />
    </div>
    <div>
      <h3 className="text-[1.375rem] font-semibold leading-snug md:text-[1.5rem]">
        <Link
          href={docPath('projects', project.slug)}
          className="after:absolute after:inset-0 after:content-['']"
        >
          {project.title}
        </Link>
      </h3>
      <p className="mt-2 line-clamp-2 text-muted">{project.summary}</p>
    </div>
  </article>
)

export const WorkGalleryBlock: React.FC<Props & { id?: string | null }> = async ({
  id,
  tone,
  eyebrow,
  heading,
  intro,
  projects: selected,
  layout,
  limit,
  enableLink,
  link,
}) => {
  const projects = await getProjects(selected, limit || 8)
  if (!projects.length) return null

  const header = (
    <div className="shell flex flex-col justify-between gap-8 md:flex-row md:items-end">
      <SectionIntro eyebrow={eyebrow} heading={heading} intro={intro} />
      {enableLink && link && <CMSLink {...link} className="shrink-0" />}
    </div>
  )

  if (layout === 'grid') {
    return (
      <Section tone={(tone as Tone) || 'sand'} id={id ? `block-${id}` : undefined}>
        {header}
        <div className="shell mt-14 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((p) => (
            <ProjectCard
              key={p.id}
              project={p}
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 30vw"
            />
          ))}
        </div>
      </Section>
    )
  }

  return (
    <Section
      tone={(tone as Tone) || 'sand'}
      id={id ? `block-${id}` : undefined}
      padded={false}
      className="overflow-hidden"
    >
      <HorizontalScroll header={header}>
        {projects.map((p) => (
          <li
            key={p.id}
            className="w-[82vw] shrink-0 snap-start sm:w-[24rem] lg:w-[clamp(18rem,38vh,28rem)]"
          >
            <ProjectCard project={p} />
          </li>
        ))}
      </HorizontalScroll>
    </Section>
  )
}
