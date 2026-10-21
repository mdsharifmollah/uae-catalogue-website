import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateCollectionChange, revalidateCollectionDelete } from '@/hooks/revalidateSite'

export const FAQs: CollectionConfig<'faqs'> = {
  slug: 'faqs',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  typescript: { interface: 'FAQ' },
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  defaultSort: 'order',
  admin: {
    group: 'Content',
    useAsTitle: 'question',
    defaultColumns: ['question', 'category', 'order'],
    description: 'Answers appear on pages and in Google structured data. Keep them factual.',
  },
  fields: [
    { name: 'question', type: 'text', required: true, localized: true },
    {
      name: 'answer',
      type: 'textarea',
      required: true,
      localized: true,
      admin: { description: 'Plain text, 1–4 sentences.' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          defaultValue: 'general',
          admin: { width: '50%' },
          options: [
            { label: 'General', value: 'general' },
            { label: 'Products & formats', value: 'products' },
            { label: 'Ordering & quotes', value: 'ordering' },
            { label: 'Production & delivery', value: 'delivery' },
          ],
        },
        { name: 'order', type: 'number', defaultValue: 10, admin: { width: '50%' } },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateCollectionChange],
    afterDelete: [revalidateCollectionDelete],
  },
}
