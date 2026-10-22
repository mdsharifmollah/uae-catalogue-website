import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'

import type { FAQ, FAQBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { JsonLd } from '@/components/seo/JsonLd'
import { PlusIcon } from '@/components/site/icons'
import { Section, type Tone } from '@/components/site/Section'
import { SectionIntro } from '@/components/site/SectionIntro'
import { faqSchema } from '@/utilities/schema'
import { getLocale } from '@/i18n/server'

export const FAQList: React.FC<{ faqs: FAQ[] }> = ({ faqs }) => (
  <div className="flex flex-col gap-3">
    {faqs.map((faq, i) => (
      <details
        key={faq.id}
        data-reveal
        className="faq-item glass group rounded-[var(--radius-card)] px-6 md:px-8"
        {...(i === 0 ? { open: true } : {})}
      >
        <summary className="flex min-h-[4.5rem] cursor-pointer list-none items-center justify-between gap-6 py-5 text-[1.1875rem] font-semibold md:text-[1.25rem] [&::-webkit-details-marker]:hidden">
          {faq.question}
          <span className="grid size-10 shrink-0 place-items-center rounded-full border transition-transform duration-500 ease-[var(--ease-out-expo)] group-open:rotate-45 group-open:bg-[color:var(--accent)] group-open:text-[color:var(--page-bg)] group-open:border-transparent">
            <PlusIcon size={18} />
          </span>
        </summary>
        <p className="max-w-3xl pb-7 text-muted">{faq.answer}</p>
      </details>
    ))}
  </div>
)

export const FAQBlockComponent: React.FC<Props & { id?: string | null }> = async ({
  id,
  tone,
  eyebrow,
  heading,
  intro,
  faqs: selected,
  category,
  enableLink,
  link,
}) => {
  let faqs = (selected || []).filter((f): f is FAQ => typeof f === 'object')
  if (!faqs.length) {
    const payload = await getPayload({ config: configPromise })
    const res = await payload.find({
      locale: await getLocale(),
      collection: 'faqs',
      sort: 'order',
      limit: 30,
      ...(category && category !== 'all' ? { where: { category: { equals: category } } } : {}),
    })
    faqs = res.docs
  }
  if (!faqs.length) return null

  return (
    <Section tone={(tone as Tone) || 'ivory'} id={id ? `block-${id}` : undefined}>
      <div className="shell grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="flex flex-col gap-8 lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
          <SectionIntro eyebrow={eyebrow} heading={heading} intro={intro} />
          {enableLink && link && <CMSLink {...link} className="w-fit" />}
        </div>
        <FAQList faqs={faqs} />
      </div>
      <JsonLd data={faqSchema(faqs)} />
    </Section>
  )
}
