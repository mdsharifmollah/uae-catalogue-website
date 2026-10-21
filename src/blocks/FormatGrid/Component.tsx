import configPromise from '@payload-config'
import Link from 'next/link'
import { getPayload } from 'payload'
import React from 'react'

import type { FormatGridBlock as Props, Product } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { ArrowUpRight, WhatsAppIcon } from '@/components/site/icons'
import { cardToneClass } from '@/components/site/cardTones'
import { Section, type Tone } from '@/components/site/Section'
import { SectionIntro } from '@/components/site/SectionIntro'
import { WhatsAppAnchor } from '@/components/site/WhatsAppAnchor'
import { docPath } from '@/utilities/routes'
import { cn } from '@/utilities/ui'

export const getProducts = async (selected?: (Product | number)[] | null): Promise<Product[]> => {
  const picked = (selected || []).filter((p): p is Product => typeof p === 'object')
  if (picked.length) return picked
  const payload = await getPayload({ config: configPromise })
  const res = await payload.find({
    collection: 'products',
    sort: 'order',
    limit: 24,
    depth: 1,
    overrideAccess: false,
  })
  return res.docs
}

/** Product card in the style of a premium service tile: two-tone title, object photo, arrow chip. */
export const FormatCard: React.FC<{ product: Product; showWhatsapp?: boolean; className?: string }> = ({
  product,
  showWhatsapp = true,
  className,
}) => {
  const [line1, line2] = (product.cardTitle || product.title).split('|')
  const href = docPath('products', product.slug)
  const image = product.cardImage || product.heroImage
  return (
    <article
      data-reveal
      className={cn(
        'group relative flex min-h-[19rem] overflow-hidden rounded-[var(--radius-panel)] p-7 md:min-h-[21rem] md:p-9',
        cardToneClass(product.cardTone),
        className,
      )}
    >
      <div className="relative z-10 flex max-w-[58%] flex-col">
        <h3 className="text-[1.75rem] font-semibold leading-[1.1] tracking-tight md:text-[2.125rem]">
          <Link href={href} className="after:absolute after:inset-0 after:z-0 after:content-['']">
            {line1}
            {line2 && <span className="block text-muted">{line2}</span>}
          </Link>
        </h3>
        <p className="mt-4 line-clamp-3 text-[1.0625rem] leading-relaxed text-muted">{product.summary}</p>
        <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-3 pt-7">
          <span className="inline-flex items-center gap-3 text-[1rem] font-semibold uppercase tracking-[0.08em]">
            <span className="arrow-chip bg-[color:var(--fg)] text-[color:var(--chip-fg)]">
              <ArrowUpRight size={16} />
            </span>
            Learn more
          </span>
          {showWhatsapp && (
            <WhatsAppAnchor
              message={product.whatsappMessage || `Hello, I'd like a quote for ${product.title}.`}
              className="relative z-10 inline-flex min-h-11 items-center gap-2 rounded-full px-1 text-[1rem] font-semibold text-accent underline-offset-4 hover:underline"
              aria-label={`Ask for a ${product.title} quote on WhatsApp`}
            >
              <WhatsAppIcon size={18} />
              Quote
            </WhatsAppAnchor>
          )}
        </div>
      </div>
      {image && typeof image === 'object' && (
        <div className="pointer-events-none absolute inset-y-0 right-0 w-[52%]">
          <Media
            resource={image}
            fill
            size="(max-width: 768px) 50vw, 26vw"
            imgClassName={cn(
              'transition-transform duration-[900ms] ease-[var(--ease-out-expo)] group-hover:scale-[1.06] group-hover:-rotate-2',
              product.cardImage ? 'object-contain object-right-bottom p-4' : 'object-cover [mask-image:linear-gradient(to_left,black_55%,transparent)]',
            )}
            pictureClassName="absolute inset-0"
            htmlElement={null}
          />
        </div>
      )}
    </article>
  )
}

export const FormatGridBlock: React.FC<Props & { id?: string | null }> = async ({
  id,
  tone,
  eyebrow,
  heading,
  intro,
  products: selected,
  showWhatsapp,
  enableLink,
  link,
}) => {
  const products = await getProducts(selected)
  if (!products.length) return null

  return (
    <Section tone={(tone as Tone) || 'ivory'} id={id ? `block-${id}` : undefined}>
      <div className="shell">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionIntro eyebrow={eyebrow} heading={heading} intro={intro} />
          {enableLink && link && <CMSLink {...link} className="shrink-0" />}
        </div>
        <div className="mt-14 grid gap-5 md:mt-20 md:grid-cols-2 md:gap-6">
          {products.map((product, i) => (
            <FormatCard
              key={product.id}
              product={product}
              showWhatsapp={showWhatsapp !== false}
              // An odd last card spans the full row
              className={products.length % 2 === 1 && i === products.length - 1 ? 'md:col-span-2' : undefined}
            />
          ))}
        </div>
      </div>
    </Section>
  )
}
