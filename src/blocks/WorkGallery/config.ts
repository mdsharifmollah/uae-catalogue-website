import type { Block } from 'payload'

import { link } from '@/fields/link'
import { sectionIntroFields, sectionToneField } from '@/fields/sectionTone'

export const WorkGallery: Block = {
  slug: 'workGallery',
  interfaceName: 'WorkGalleryBlock',
  labels: { singular: 'Work gallery', plural: 'Work galleries' },
  fields: [
    sectionToneField('sand'),
    ...sectionIntroFields(),
    {
      name: 'projects',
      type: 'relationship',
      relationTo: 'projects',
      hasMany: true,
      admin: { description: 'Leave empty to show the latest featured projects.' },
    },
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'horizontal',
      options: [
        { label: 'Horizontal scroll (pinned)', value: 'horizontal' },
        { label: 'Grid', value: 'grid' },
      ],
    },
    { name: 'limit', type: 'number', defaultValue: 8, min: 1, max: 24 },
    { name: 'enableLink', type: 'checkbox', label: 'Show a "view all work" link' },
    link({
      appearances: ['glass', 'outline', 'link'],
      overrides: { admin: { condition: (_, s) => Boolean(s?.enableLink) } },
    }),
  ],
}
