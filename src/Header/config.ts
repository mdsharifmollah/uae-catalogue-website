import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateGlobalChange } from '@/hooks/revalidateSite'

export const Header: GlobalConfig = {
  slug: 'header',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'navItems',
      type: 'array',
      fields: [
        link({
          appearances: false,
        }),
      ],
      maxRows: 7,
      admin: {
        initCollapsed: true,
        components: {
          RowLabel: '@/Header/RowLabel#RowLabel',
        },
      },
    },
    {
      name: 'actions',
      type: 'array',
      maxRows: 2,
      admin: {
        description: 'Buttons on the right of the menu (e.g. Contact and WhatsApp).',
        initCollapsed: true,
      },
      fields: [link({ appearances: ['primary', 'glass', 'link'] })],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobalChange],
  },
}
