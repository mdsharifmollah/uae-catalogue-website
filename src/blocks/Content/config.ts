import type { Block, Field } from 'payload'

import { contentEditor } from '@/fields/contentEditor'
import { link } from '@/fields/link'
import { sectionToneField } from '@/fields/sectionTone'

const columnFields: Field[] = [
  {
    name: 'size',
    type: 'select',
    defaultValue: 'full',
    options: [
      { label: 'One Third', value: 'oneThird' },
      { label: 'Half', value: 'half' },
      { label: 'Two Thirds', value: 'twoThirds' },
      { label: 'Full', value: 'full' },
    ],
  },
  { name: 'richText', type: 'richText', editor: contentEditor, localized: true, label: false },
  { name: 'enableLink', type: 'checkbox' },
  link({
    overrides: { admin: { condition: (_data, siblingData) => Boolean(siblingData?.enableLink) } },
  }),
]

export const Content: Block = {
  slug: 'content',
  interfaceName: 'ContentBlock',
  labels: { singular: 'Text content', plural: 'Text content' },
  fields: [
    sectionToneField('ivory'),
    {
      name: 'columns',
      type: 'array',
      admin: { initCollapsed: true },
      fields: columnFields,
    },
  ],
}
