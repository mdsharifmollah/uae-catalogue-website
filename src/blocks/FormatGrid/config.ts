import type { Block } from 'payload'

import { link } from '@/fields/link'
import { sectionIntroFields, sectionToneField } from '@/fields/sectionTone'

export const FormatGrid: Block = {
  slug: 'formatGrid',
  interfaceName: 'FormatGridBlock',
  labels: { singular: 'Product formats grid', plural: 'Product formats grids' },
  fields: [
    sectionToneField('ivory'),
    ...sectionIntroFields(),
    {
      name: 'products',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      admin: { description: 'Leave empty to show all published product formats in order.' },
    },
    {
      name: 'showWhatsapp',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show a WhatsApp quote link on each card',
    },
    {
      name: 'enableLink',
      type: 'checkbox',
      label: 'Show a "view all" link',
    },
    link({
      appearances: ['glass', 'outline', 'link'],
      overrides: { admin: { condition: (_, s) => Boolean(s?.enableLink) } },
    }),
  ],
}
