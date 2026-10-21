import type { Block } from 'payload'

import { sectionIntroFields, sectionToneField } from '@/fields/sectionTone'

export const Archive: Block = {
  slug: 'archive',
  interfaceName: 'ArchiveBlock',
  labels: { plural: 'Guides lists', singular: 'Guides list' },
  fields: [
    sectionToneField('ivory'),
    ...sectionIntroFields(),
    {
      name: 'populateBy',
      type: 'select',
      defaultValue: 'collection',
      options: [
        { label: 'Latest guides', value: 'collection' },
        { label: 'Individual selection', value: 'selection' },
      ],
    },
    {
      name: 'relationTo',
      type: 'select',
      admin: { condition: () => false },
      defaultValue: 'posts',
      options: [{ label: 'Guides', value: 'posts' }],
    },
    {
      name: 'categories',
      type: 'relationship',
      admin: { condition: (_, siblingData) => siblingData.populateBy === 'collection' },
      hasMany: true,
      label: 'Categories to show',
      relationTo: 'categories',
    },
    {
      name: 'limit',
      type: 'number',
      admin: {
        condition: (_, siblingData) => siblingData.populateBy === 'collection',
        step: 1,
      },
      defaultValue: 3,
      label: 'Limit',
    },
    {
      name: 'selectedDocs',
      type: 'relationship',
      admin: { condition: (_, siblingData) => siblingData.populateBy === 'selection' },
      hasMany: true,
      label: 'Selection',
      relationTo: ['posts'],
    },
  ],
}
