import type { Block } from 'payload'

import { sectionToneField } from '@/fields/sectionTone'

export const StatsBand: Block = {
  slug: 'statsBand',
  interfaceName: 'StatsBandBlock',
  labels: { singular: 'Stats band', plural: 'Stats bands' },
  fields: [
    sectionToneField('charcoal'),
    {
      name: 'items',
      type: 'array',
      minRows: 1,
      maxRows: 4,
      admin: {
        description: 'Only publish numbers you can prove (years in business, swatches per day...).',
      },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'text', required: true, admin: { width: '35%', description: 'e.g. 12+' } },
            { name: 'label', type: 'text', required: true, localized: true, admin: { width: '65%' } },
          ],
        },
      ],
    },
  ],
}
