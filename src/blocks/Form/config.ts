import type { Block } from 'payload'

import { sectionIntroFields, sectionToneField } from '@/fields/sectionTone'

export const FormBlock: Block = {
  slug: 'formBlock',
  interfaceName: 'FormBlock',
  graphQL: { singularName: 'FormBlock' },
  labels: { plural: 'Quote forms', singular: 'Quote form' },
  fields: [
    sectionToneField('sand'),
    ...sectionIntroFields(),
    { name: 'form', type: 'relationship', relationTo: 'forms', required: true },
    {
      name: 'showContactPanel',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show WhatsApp / phone / email panel beside the form',
    },
  ],
}
