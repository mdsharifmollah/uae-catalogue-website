import type { Field, SelectField } from 'payload'

export const sectionTones = [
  { label: 'Ink (near black)', value: 'ink' },
  { label: 'Charcoal', value: 'charcoal' },
  { label: 'Ivory', value: 'ivory' },
  { label: 'Sand', value: 'sand' },
  { label: 'Linen', value: 'linen' },
  { label: 'Bronze gradient', value: 'bronze' },
] as const

export type SectionTone = (typeof sectionTones)[number]['value']

/**
 * Background tone for a section. As visitors scroll, the page background
 * smoothly blends into the tone of the section in view.
 */
export const sectionToneField = (defaultValue: SectionTone = 'ivory'): SelectField => ({
  name: 'tone',
  type: 'select',
  defaultValue,
  options: [...sectionTones],
  admin: {
    description: 'Page background blends to this colour while this section is on screen.',
  },
})

export const headingDescription =
  'Wrap one word in *asterisks* to show it in the elegant italic accent font, e.g. "Crafted *in* the UAE".'

export const sectionIntroFields = ({
  eyebrow = true,
}: { eyebrow?: boolean } = {}): Field[] => [
  ...(eyebrow
    ? ([
        {
          name: 'eyebrow',
          type: 'text',
          localized: true,
          admin: { description: 'Small label shown above the heading.' },
        },
      ] as Field[])
    : []),
  {
    name: 'heading',
    type: 'text',
    localized: true,
    admin: { description: headingDescription },
  },
  {
    name: 'intro',
    type: 'textarea',
    localized: true,
  },
]
