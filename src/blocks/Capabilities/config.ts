import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'
import { sectionIntroFields, sectionToneField } from '@/fields/sectionTone'

export const Capabilities: Block = {
  slug: 'capabilities',
  interfaceName: 'CapabilitiesBlock',
  labels: { singular: 'Features / capabilities', plural: 'Features / capabilities' },
  fields: [
    sectionToneField('linen'),
    ...sectionIntroFields(),
    {
      name: 'layout',
      type: 'select',
      defaultValue: 'cards',
      options: [
        { label: 'Glass cards with 3D icons', value: 'cards' },
        { label: 'Checklist beside an image', value: 'checklist' },
      ],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: { condition: (_, s) => s?.layout === 'checklist' },
    },
    {
      name: 'items',
      type: 'array',
      required: true,
      minRows: 1,
      maxRows: 12,
      admin: { initCollapsed: true },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: { description: '3D icon (transparent PNG/WebP, square).' },
        },
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'text', type: 'textarea', localized: true },
      ],
    },
    linkGroup({ appearances: ['primary', 'glass', 'link'], overrides: { maxRows: 2 } }),
  ],
}
