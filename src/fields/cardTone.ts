import type { Field } from 'payload'

export const cardTones = [
  { label: 'Bronze', value: 'bronze' },
  { label: 'Charcoal', value: 'charcoal' },
  { label: 'Ivory', value: 'ivory' },
  { label: 'Sand', value: 'sand' },
  { label: 'Clay', value: 'clay' },
  { label: 'Sage', value: 'sage' },
  { label: 'Midnight', value: 'midnight' },
] as const

export type CardTone = (typeof cardTones)[number]['value']

export const cardToneField = (defaultValue: CardTone = 'ivory'): Field => ({
  name: 'cardTone',
  type: 'select',
  defaultValue,
  options: [...cardTones],
  admin: {
    position: 'sidebar',
    description: 'Colour of this item’s card in grids and carousels.',
  },
})
