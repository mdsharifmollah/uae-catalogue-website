import type { Block } from 'payload'

import { contentEditor } from '@/fields/contentEditor'
import { linkGroup } from '@/fields/linkGroup'
import { headingDescription, sectionToneField } from '@/fields/sectionTone'

export const MediaText: Block = {
  slug: 'mediaText',
  interfaceName: 'MediaTextBlock',
  labels: { singular: 'Image + text', plural: 'Image + text' },
  fields: [
    sectionToneField('ivory'),
    { name: 'eyebrow', type: 'text', localized: true },
    { name: 'heading', type: 'text', localized: true, admin: { description: headingDescription } },
    { name: 'richText', type: 'richText', editor: contentEditor, localized: true },
    { name: 'media', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'imagePosition',
      type: 'select',
      defaultValue: 'right',
      options: [
        { label: 'Image right', value: 'right' },
        { label: 'Image left', value: 'left' },
      ],
    },
    {
      name: 'pills',
      type: 'array',
      maxRows: 4,
      admin: { description: 'Small glass labels floating on the image (e.g. "39 swatches").' },
      fields: [{ name: 'text', type: 'text', required: true, localized: true }],
    },
    linkGroup({ appearances: ['primary', 'glass', 'link'], overrides: { maxRows: 2 } }),
  ],
}
