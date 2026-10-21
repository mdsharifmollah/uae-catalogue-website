import type { CollectionConfig } from 'payload'

import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { revalidateCollectionChange, revalidateCollectionDelete } from '@/hooks/revalidateSite'

export const Testimonials: CollectionConfig<'testimonials'> = {
  slug: 'testimonials',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    group: 'Content',
    useAsTitle: 'name',
    defaultColumns: ['name', 'company', 'verified'],
    description: 'Only testimonials marked as verified are shown on the website.',
  },
  fields: [
    { name: 'quote', type: 'textarea', required: true, localized: true },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '33%' } },
        { name: 'role', type: 'text', localized: true, admin: { width: '33%' } },
        { name: 'company', type: 'text', admin: { width: '34%' } },
      ],
    },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'verified',
      type: 'checkbox',
      defaultValue: false,
      label: 'Real customer, permission given to publish',
    },
  ],
  hooks: {
    afterChange: [revalidateCollectionChange],
    afterDelete: [revalidateCollectionDelete],
  },
}
