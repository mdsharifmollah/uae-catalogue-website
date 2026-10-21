import type { Block } from 'payload'

import { link } from '@/fields/link'
import { sectionIntroFields, sectionToneField } from '@/fields/sectionTone'

export const ProcessStory: Block = {
  slug: 'processStory',
  interfaceName: 'ProcessStoryBlock',
  labels: { singular: 'Scroll story (process)', plural: 'Scroll stories (process)' },
  admin: {
    // @ts-expect-error description is supported on blocks admin
    description: 'Pinned, numbered steps where the image changes as visitors scroll.',
  },
  fields: [
    sectionToneField('charcoal'),
    ...sectionIntroFields(),
    {
      name: 'steps',
      type: 'array',
      minRows: 2,
      maxRows: 8,
      required: true,
      admin: { initCollapsed: true },
      fields: [
        { name: 'title', type: 'text', required: true, localized: true },
        { name: 'text', type: 'textarea', required: true, localized: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    { name: 'enableLink', type: 'checkbox', label: 'Show a link below the steps' },
    link({
      appearances: ['primary', 'glass', 'link'],
      overrides: { admin: { condition: (_, s) => Boolean(s?.enableLink) } },
    }),
  ],
}
