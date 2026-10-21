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

export const Industries: CollectionConfig<'industries'> = {
  slug: 'industries',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
    summary: true,
    tag: true,
    cardImage: true,
    cardTone: true,
  },
  defaultSort: 'order',
  admin: {
    group: 'Catalogue',
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'order', '_status'],
    description: 'Industries you serve. Each one gets an SEO page at /industries/<slug>.',
    livePreview: {
      url: ({ data, req }) => generatePreviewPath({ slug: data?.slug, collection: 'industries', req }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({ slug: data?.slug as string, collection: 'industries', req }),
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Overview',
          fields: [
            {
              name: 'tag',
              type: 'text',
              localized: true,
              admin: { description: 'Short pill label on the card, e.g. "Sofas & chairs".' },
            },
            { name: 'summary', type: 'textarea', required: true, localized: true },
            {
              type: 'row',
              fields: [
                { name: 'cardImage', type: 'upload', relationTo: 'media', admin: { width: '50%' } },
                {
                  name: 'heroImage',
                  type: 'upload',
                  relationTo: 'media',
                  required: true,
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'needs',
              type: 'array',
              labels: { singular: 'Buyer need', plural: 'Buyer needs' },
              admin: {
                initCollapsed: true,
                description: 'What businesses in this industry need from their sample catalogues.',
              },
              fields: [
                { name: 'title', type: 'text', required: true, localized: true },
                { name: 'text', type: 'textarea', localized: true },
              ],
            },
            { name: 'body', type: 'richText', editor: contentEditor, localized: true },
            { name: 'faqs', type: 'relationship', relationTo: 'faqs', hasMany: true },
          ],
        },
        seoTab,
      ],
    },
    { name: 'order', type: 'number', defaultValue: 10, admin: { position: 'sidebar' } },
    cardToneField('sand'),
    { name: 'publishedAt', type: 'date', admin: { position: 'sidebar' } },
    slugField(),
  ],
  hooks: {
    beforeChange: [populatePublishedAt],
    afterChange: [revalidateCollectionChange],
    afterDelete: [revalidateCollectionDelete],
  },
  versions: {
    drafts: { autosave: { interval: 100 }, schedulePublish: true },
    maxPerDoc: 30,
  },
}
