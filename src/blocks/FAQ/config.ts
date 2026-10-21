import type { Block } from 'payload'

import { link } from '@/fields/link'
import { sectionIntroFields, sectionToneField } from '@/fields/sectionTone'

export const FAQBlock: Block = {
  slug: 'faq',
  interfaceName: 'FAQBlock',
  labels: { singular: 'FAQ', plural: 'FAQs' },
  fields: [
    sectionToneField('ivory'),
    ...sectionIntroFields(),
    {
      name: 'faqs',
      type: 'relationship',
      relationTo: 'faqs',
      hasMany: true,
      admin: { description: 'Leave empty to show all FAQs (optionally filtered by category).' },
    },
    {
      name: 'category',
      type: 'select',
      defaultValue: 'all',
      options: [
        { label: 'All categories', value: 'all' },
        { label: 'General', value: 'general' },
        { label: 'Products & formats', value: 'products' },
        { label: 'Ordering & quotes', value: 'ordering' },
        { label: 'Production & delivery', value: 'delivery' },
      ],
    },
    { name: 'enableLink', type: 'checkbox', label: 'Show a link beside the questions' },
    link({
      appearances: ['primary', 'glass', 'link'],
      overrides: { admin: { condition: (_, s) => Boolean(s?.enableLink) } },
    }),
  ],
}
