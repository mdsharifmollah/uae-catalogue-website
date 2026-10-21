import type { Block } from 'payload'

import { linkGroup } from '@/fields/linkGroup'
import { headingDescription, sectionToneField } from '@/fields/sectionTone'

export const CallToAction: Block = {
  slug: 'cta',
  interfaceName: 'CallToActionBlock',
  labels: { plural: 'Calls to Action', singular: 'Call to Action' },
  fields: [
    sectionToneField('bronze'),
    { name: 'eyebrow', type: 'text', localized: true },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      admin: { description: headingDescription },
    },
    { name: 'text', type: 'textarea', localized: true },
    linkGroup({ appearances: ['primary', 'glass', 'outline'], overrides: { maxRows: 2 } }),
    {
      name: 'showContactDetails',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show phone, email and location from Site Settings',
    },
  ],
}
