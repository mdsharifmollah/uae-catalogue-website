import type { Metadata } from 'next'
import React from 'react'

import { FormatCard, getProducts } from '@/blocks/FormatGrid/Component'
import { JsonLd } from '@/components/seo/JsonLd'
import { HubPage } from '@/components/site/HubPage'
import { QuoteBand } from '@/components/site/QuoteBand'
import { Section } from '@/components/site/Section'
import { getDictionary, getLocale } from '@/i18n/server'
import { generateMeta } from '@/utilities/generateMeta'
import { queryBySlug } from '@/utilities/queries'
import { productCatalogSchema } from '@/utilities/schema'

export default async function ProductsPage() {
  const [products, t, locale] = await Promise.all([getProducts(), getDictionary(), getLocale()])
  const hub = t.hubs.products
  return (
    <HubPage
      slug="products"
      name={t.common.products}
      fallbackHero={{ eyebrow: hub.eyebrow, heading: hub.heading, subheading: hub.subheading }}
      after={<QuoteBand heading={hub.bandHeading} text={hub.bandText} />}
    >
      <Section tone="ivory">
        <div className="shell grid gap-5 md:grid-cols-2 md:gap-6">
          {products.map((p) => (
            <FormatCard key={p.id} product={p} />
          ))}
        </div>
      </Section>
      <JsonLd data={productCatalogSchema(products, locale)} />
    </HubPage>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const [page, t] = await Promise.all([queryBySlug('pages', 'products'), getDictionary()])
  return generateMeta({
    doc: page || { title: t.hubs.products.metaTitle },
    path: '/products',
    fallbackDescription: t.hubs.products.metaDescription,
  })
}
