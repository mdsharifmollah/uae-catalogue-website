import Link from 'next/link'
import React from 'react'

import type { Post } from '@/payload-types'

import { Media } from '@/components/Media'
import { formatDateTime } from '@/utilities/formatDateTime'
import { docPath } from '@/utilities/routes'

export const GuideCard: React.FC<{ post: Post; headingLevel?: 'h2' | 'h3' }> = ({ post, headingLevel: H = 'h3' }) => {
  const image = post.heroImage || post.meta?.image
  return (
    <article className="group relative flex h-full flex-col gap-5">
      <div className="relative aspect-[3/2] overflow-hidden rounded-[var(--radius-card)] bg-black/10">
        {image && typeof image === 'object' && (
          <Media resource={image} fill size="(max-width: 768px) 100vw, 33vw" imgClassName="object-cover transition-transform duration-[1000ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.05]" pictureClassName="absolute inset-0" htmlElement={null} />
        )}
      </div>
      <div className="flex flex-col gap-3">
        {post.publishedAt && (
          <time dateTime={post.publishedAt} className="text-[1rem] text-muted">
            {formatDateTime(post.publishedAt)}
          </time>
        )}
        <H className="text-[1.375rem] font-semibold leading-snug">
          <Link href={docPath('posts', post.slug)} className="after:absolute after:inset-0 after:content-[''] group-hover:text-accent">
            {post.title}
          </Link>
        </H>
        {(post.excerpt || post.meta?.description) && (
          <p className="line-clamp-3 text-muted">{post.excerpt || post.meta?.description}</p>
        )}
      </div>
    </article>
  )
}
