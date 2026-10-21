import type { Block } from 'payload'

import { sectionIntroFields, sectionToneField } from '@/fields/sectionTone'

export const TestimonialsBlock: Block = {
  slug: 'testimonials',
  interfaceName: 'TestimonialsBlock',
  labels: { singular: 'Testimonials', plural: 'Testimonials' },
  fields: [
    sectionToneField('sand'),
    ...sectionIntroFields(),
    {
      name: 'testimonials',
      type: 'relationship',
      relationTo: 'testimonials',
      hasMany: true,
      admin: { description: 'Leave empty to show all verified testimonials. Unverified ones are never shown.' },
    },
  ],
}
