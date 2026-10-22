import React from 'react'

import { AccentText } from '@/components/site/AccentText'
import { Section } from '@/components/site/Section'
import { Link } from '@/i18n/client'
import { getDictionary } from '@/i18n/server'

export default async function NotFound() {
  const t = await getDictionary()
  return (
    <Section tone="ink" className="flex min-h-[80svh] items-center pt-[calc(var(--header-h)+4rem)]">
      <div className="shell flex flex-col items-start gap-6">
        <p className="eyebrow">{t.notFound.eyebrow}</p>
        <h1 className="text-display max-w-3xl">
          <AccentText text={t.notFound.heading} />
        </h1>
        <p className="text-lead max-w-xl text-muted">{t.notFound.text}</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            {t.notFound.home}
          </Link>
          <Link href="/products" className="btn btn-glass">
            {t.notFound.formats}
          </Link>
        </div>
      </div>
    </Section>
  )
}
