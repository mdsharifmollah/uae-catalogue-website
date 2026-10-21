import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { contentEditor } from '@/fields/contentEditor'
import { seoTab } from '@/fields/seoTab'
import { revalidateCollectionChange, revalidateCollectionDelete } from '@/hooks/revalidateSite'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

export const Projects: CollectionConfig<'projects'> = {
  slug: 'projects',
  labels: { singular: 'Project', plural: 'Our Work' },
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
    coverImage: true,
    clientName: true,
    showClientName: true,
    year: true,
  },
  defaultSort: '-publishedAt',
  admin: {
    group: 'Catalogue',
    useAsTitle: 'title',
    defaultColumns: ['title', 'featured', '_status', 'publishedAt'],
    description: 'Portfolio of real sample catalogues you produced. Real photos convert best.',
    livePreview: {
      url: ({ data, req }) => generatePreviewPath({ slug: data?.slug, collection: 'projects', req }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({ slug: data?.slug as string, collection: 'projects', req }),
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Project',
          fields: [
            { name: 'summary', type: 'textarea', required: true, localized: true },
            { name: 'coverImage', type: 'upload', relationTo: 'media', required: true },
            {
              name: 'gallery',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [
                { name: 'image', type: 'upload', relationTo: 'media', required: true },
                { name: 'caption', type: 'text', localized: true },
              ],
            },
            {
              type: 'row',
              fields: [
                { name: 'clientName', type: 'text', admin: { width: '40%' } },
                {
                  name: 'showClientName',
                  type: 'checkbox',
                  defaultValue: false,
                  label: 'Client gave permission to show their name',
                  admin: { width: '40%', style: { alignSelf: 'flex-end' } },
                },
                { name: 'year', type: 'number', admin: { width: '20%' } },
              ],
            },
            {
              name: 'specs',
              type: 'array',
              admin: { initCollapsed: true, description: 'e.g. Format: A4 sample book · Swatches: 39 · Finish: foil logo' },
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
            { name: 'body', type: 'richText', editor: contentEditor, localized: true },
          ],
        },
        {
          label: 'Relations',
          fields: [
            { name: 'products', type: 'relationship', relationTo: 'products', hasMany: true },
            { name: 'industries', type: 'relationship', relationTo: 'industries', hasMany: true },
          ],
        },
        seoTab,
      ],
    },
    {
      name: 'featured',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', description: 'Show in the home page gallery.' },
    },
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
