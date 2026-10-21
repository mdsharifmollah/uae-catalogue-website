import type { Field } from 'payload'

import { linkGroup } from '@/fields/linkGroup'
import { headingDescription, sectionToneField } from '@/fields/sectionTone'

export const hero: Field = {
  name: 'hero',
  type: 'group',
  label: false,
  fields: [
    {
      name: 'type',
      type: 'select',
      defaultValue: 'page',
      label: 'Hero style',
      required: true,
      options: [
        { label: 'None', value: 'none' },
        { label: 'Catalogue (home — WebGL fabric + fanned cards)', value: 'catalog' },
        { label: 'Page (heading + image)', value: 'page' },
        { label: 'Minimal (heading only)', value: 'minimal' },
      ],
    },
    {
      ...sectionToneField('ink'),
      admin: {
        condition: (_, { type } = {}) => type !== 'none',
        description: 'Background tone behind the hero.',
      },
    },
    {
      name: 'eyebrow',
      type: 'text',
      localized: true,
      admin: { condition: (_, { type } = {}) => type !== 'none' },
    },
    {
      name: 'heading',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, { type } = {}) => type !== 'none',
        description: `This is the page H1 — include your main keyword. ${headingDescription}`,
      },
    },
    {
      name: 'subheading',
      type: 'textarea',
      localized: true,
      admin: { condition: (_, { type } = {}) => type !== 'none' },
    },
    linkGroup({
      appearances: ['primary', 'glass', 'outline', 'link'],
      overrides: {
        maxRows: 2,
        admin: { condition: (_, { type } = {}) => type !== 'none' },
      },
    }),
    {
      name: 'trustItems',
      type: 'array',
      maxRows: 4,
      admin: {
        condition: (_, { type } = {}) => type === 'catalog' || type === 'page',
        description: 'Short reassurance points under the buttons.',
      },
      fields: [{ name: 'text', type: 'text', required: true, localized: true }],
    },
    {
      name: 'media',
      type: 'upload',
      relationTo: 'media',
      admin: {
        condition: (_, { type } = {}) => type === 'catalog' || type === 'page',
        description:
          'Catalogue hero: fabric close-up used as the animated WebGL texture (also the instant-loading fallback). Page hero: side image.',
      },
    },
    {
      name: 'fanProducts',
      type: 'relationship',
      relationTo: 'products',
      hasMany: true,
      maxRows: 5,
      admin: {
        condition: (_, { type } = {}) => type === 'catalog',
        description: 'Up to 5 products shown as fanned catalogue cards. Leave empty to use the first five.',
      },
    },
  ],
}
