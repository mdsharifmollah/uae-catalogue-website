import type { CollectionConfig } from 'payload'
import { slugField } from 'payload'

import { authenticated } from '../../access/authenticated'
import { authenticatedOrPublished } from '../../access/authenticatedOrPublished'
import { Archive } from '../../blocks/ArchiveBlock/config'
import { CallToAction } from '../../blocks/CallToAction/config'
import { Capabilities } from '../../blocks/Capabilities/config'
import { Content } from '../../blocks/Content/config'
import { FAQBlock } from '../../blocks/FAQ/config'
import { FormBlock } from '../../blocks/Form/config'
import { FormatGrid } from '../../blocks/FormatGrid/config'
import { IndustriesCarousel } from '../../blocks/IndustriesCarousel/config'
import { LogosBlock } from '../../blocks/Logos/config'
import { MediaBlock } from '../../blocks/MediaBlock/config'
import { MediaText } from '../../blocks/MediaText/config'
import { ProcessStory } from '../../blocks/ProcessStory/config'
import { StatsBand } from '../../blocks/StatsBand/config'
import { TestimonialsBlock } from '../../blocks/Testimonials/config'
import { WorkGallery } from '../../blocks/WorkGallery/config'
import { seoTab } from '@/fields/seoTab'
import { hero } from '@/heros/config'
import { revalidateCollectionChange, revalidateCollectionDelete } from '@/hooks/revalidateSite'
import { populatePublishedAt } from '../../hooks/populatePublishedAt'
import { generatePreviewPath } from '../../utilities/generatePreviewPath'

export const Pages: CollectionConfig<'pages'> = {
  slug: 'pages',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  defaultPopulate: {
    title: true,
    slug: true,
  },
  admin: {
    group: 'Content',
    defaultColumns: ['title', 'slug', '_status', 'updatedAt'],
    description:
      'Pages built from sections. The page with slug "home" is the homepage; "products", "industries", "work" and "guides" add an intro to those listing pages.',
    livePreview: {
      url: ({ data, req }) => generatePreviewPath({ slug: data?.slug, collection: 'pages', req }),
    },
    preview: (data, { req }) =>
      generatePreviewPath({ slug: data?.slug as string, collection: 'pages', req }),
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [hero],
          label: 'Hero',
        },
        {
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              localized: true,
              blocks: [
                FormatGrid,
                ProcessStory,
                WorkGallery,
                IndustriesCarousel,
                Capabilities,
                MediaText,
                StatsBand,
                TestimonialsBlock,
                LogosBlock,
                FAQBlock,
                CallToAction,
                Content,
                MediaBlock,
                Archive,
                FormBlock,
              ],
              admin: {
                initCollapsed: true,
                description: 'Add, remove and drag sections to reorder them.',
              },
            },
          ],
          label: 'Sections',
        },
        seoTab,
      ],
    },
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },
    slugField(),
  ],
  hooks: {
    afterChange: [revalidateCollectionChange],
    beforeChange: [populatePublishedAt],
    afterDelete: [revalidateCollectionDelete],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
    maxPerDoc: 50,
  },
}
