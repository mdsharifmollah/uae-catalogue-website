import type { Metadata } from 'next'
import React from 'react'

import { FormatCard, getProducts } from '@/blocks/FormatGrid/Component'
import { JsonLd } from '@/components/seo/JsonLd'
import { HubPage } from '@/components/site/HubPage'
import { QuoteBand } from '@/components/site/QuoteBand'
import { Section } from '@/components/site/Section'
import { generateMeta } from '@/utilities/generateMeta'
import { queryBySlug } from '@/utilities/queries'
import { productCatalogSchema } from '@/utilities/schema'

export default async function ProductsPage() {
  const products = await getProducts()
  return (
    <HubPage
      slug="products"
      name="Products"
      fallbackHero={{
        eyebrow: 'What we manufacture',
        heading: 'Fabric sample *formats* for every collection',
        subheading:
          'Sample books, waterfall hangers, numbered shade cards, swatch cards and presentation boxes — made in Sharjah for textile and interior brands.',
      }}
      after={<QuoteBand heading="Not sure which *format* fits your range?" text="Tell us about your fabrics and how you sell them — we'll recommend a format." />}
    >
      <Section tone="ivory">
        <div className="shell grid gap-5 md:grid-cols-2 md:gap-6">
          {products.map((p) => (
            <FormatCard key={p.id} product={p} />
          ))}
        </div>
      </Section>
      <JsonLd data={productCatalogSchema(products)} />
    </HubPage>
  )
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await queryBySlug('pages', 'products')
  return generateMeta({
    doc: page || { title: 'Fabric Sample Books, Hangers & Shade Cards' },
    path: '/products',
    fallbackDescription:
      'Fabric sample books, waterfall hangers, numbered shade cards, swatch cards and sample boxes manufactured in Sharjah, UAE.',
  })
}
