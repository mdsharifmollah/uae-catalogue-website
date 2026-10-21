import type { Block } from 'payload'

import { sectionIntroFields, sectionToneField } from '@/fields/sectionTone'

export const IndustriesCarousel: Block = {
  slug: 'industriesCarousel',
  interfaceName: 'IndustriesCarouselBlock',
  labels: { singular: 'Industries carousel', plural: 'Industries carousels' },
  fields: [
    sectionToneField('ivory'),
    ...sectionIntroFields(),
    {
      name: 'industries',
      type: 'relationship',
      relationTo: 'industries',
      hasMany: true,
      admin: { description: 'Leave empty to show all published industries.' },
    },
  ],
}
