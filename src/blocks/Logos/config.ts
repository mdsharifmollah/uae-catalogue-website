import type { Block } from 'payload'

import { sectionToneField } from '@/fields/sectionTone'

export const LogosBlock: Block = {
  slug: 'logos',
  interfaceName: 'LogosBlock',
  labels: { singular: 'Client logos', plural: 'Client logos' },
  fields: [
    sectionToneField('ivory'),
    { name: 'heading', type: 'text', localized: true, defaultValue: 'Trusted by textile brands' },
    {
      name: 'logos',
      type: 'array',
      admin: { description: 'Only add logos you have written permission to display.' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
            {
              name: 'permission',
              type: 'checkbox',
              label: 'Permission confirmed',
              admin: { width: '50%', style: { alignSelf: 'flex-end' } },
            },
          ],
        },
        { name: 'logo', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}
