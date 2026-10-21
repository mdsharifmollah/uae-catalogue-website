import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { cardToneField } from '@/fields/cardTone'
import { contentEditor } from '@/fields/contentEditor'
import { seoTab } from '@/fields/seoTab'
import { revalidateCollectionChange, revalidateCollectionDelete } from '@/hooks/revalidateSite'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

export const Products: CollectionConfig<'products'> = {
  slug: 'products',
  labels: { singular: 'Product format', plural: 'Product formats' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    cardTitle: true,
    slug: true,
    summary: true,
    cardImage: true,
    heroImage: true,
    cardTone: true,
    whatsappMessage: true,
  },
  defaultSort: 'order',
  admin: {
    group: 'Catalogue',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', '_status', 'updatedAt'],
    description: 'Each sample format you manufacture gets its own SEO page at /products/<slug>.',
    livePreview: {
      url: ({ data, req }) => generatePreviewPath({ slug: data?.slug, collection: 'products', req }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({ slug: data?.slug as string, collection: 'products', req }),
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: 'Use the words buyers search for, e.g. "Fabric Sample Books".' },
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            {
              name: 'cardTitle',
              type: 'text',
              localized: true,
              admin: {
                description:
                  'Optional two-line card title. Use | to split lines, e.g. "Sample|Books". Second line appears muted.',
              },
            },
            {
              name: 'summary',
              type: 'textarea',
              required: true,
              localized: true,
              admin: { description: 'One or two sentences. Shown on cards and as the page intro.' },
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'cardImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    width: '50%',
                    description: 'Product cut-out (transparent PNG/WebP works best) for cards.',
                  },
                },
                {
                  name: 'heroImage',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  admin: { width: '50%', description: 'Large photo at the top of the product page.' },
                },
              ],
            },
            {
              name: 'gallery',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text', localized: true },
              ],
            },
          ],
        },
        {
          label: 'Details',
          fields: [
            {
              name: 'body',
              type: 'richText',
              editor: contentEditor,
              localized: true,
              admin: {
                description:
                  'Main page content. Use H2/H3 headings and explain formats, materials and options — this is what Google reads.',
              },
            },
            {
              name: 'specs',
              type: 'array',
              labels: { singular: 'Spec', plural: 'Specs' },
              admin: {
                initCollapsed: true,
                description: 'Shown as a clean spec table (sizes, binding, materials, finishes...).',
              },
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'label', type: 'text', required: true, localized: true, admin: { width: '40%' } },
                    { name: 'value', type: 'text', required: true, localized: true, admin: { width: '60%' } },
                  ],
                },
              ],
            },
            {
              name: 'useCases',
              type: 'array',
              labels: { singular: 'Use case', plural: 'Use cases' },
              admin: { initCollapsed: true },
              fields: [{ name: 'text', type: 'text', required: true, localized: true }],
            },
            {
              name: 'whatsappMessage',
              type: 'text',
              localized: true,
              admin: {
                description: 'Pre-filled WhatsApp message for this product, e.g. "Hello, I need a quote for fabric sample books."',
              },
            },
          ],
        },
        {
          label: 'Relations',
          fields: [
            {
              name: 'industries',
              type: 'relationship',
              relationTo: 'industries',
              hasMany: true,
              admin: { description: 'Industries this format is popular with.' },
            },
            {
              name: 'faqs',
              type: 'relationship',
              relationTo: 'faqs',
              hasMany: true,
            },
            {
              name: 'relatedProducts',
              type: 'relationship',
              relationTo: 'products',
              hasMany: true,
              filterOptions: ({ id }) => ({ id: { not_in: [id] } }),
            },
          ],
        },
        seoTab,
      ],
    },
    {
      name: 'order',
      type: 'number',
      defaultValue: 10,
      admin: { position: 'sidebar', description: 'Lower numbers show first.' },
    },
    cardToneField('ivory'),
    {
      name: 'publishedAt',
      type: 'date',
      admin: { position: 'sidebar' },
    },
    slugField(),
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidateCollectionChange],
    afterDelete: [revalidateCollectionDelete],
  },
  versions: {
    drafts: {
      autosave: { interval: 100 },
      schedulePublish: true,
    },
    maxPerDoc: 30,
  },
}
