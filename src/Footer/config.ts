import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateGlobalChange } from '@/hooks/revalidateSite'

export const Footer: GlobalConfig = {
  slug: 'footer',
  admin: { group: 'Settings' },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'ctaHeading',
      type: 'text',
      localized: true,
      defaultValue: "Let's build your fabric *sample* catalogue",
    },
    {
      name: 'columns',
      type: 'array',
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        {
          name: 'links',
          type: 'array',
          admin: { initCollapsed: true },
          fields: [link({ appearances: false })],
        },
      ],
    },
    {
      name: 'legalLinks',
      type: 'array',
      maxRows: 4,
      admin: { initCollapsed: true },
      fields: [link({ appearances: false })],
    },
    {
      name: 'showWordmark',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show large company name at the bottom',
    },
  ],
  hooks: {
    afterChange: [revalidateGlobalChange],
  },
}
