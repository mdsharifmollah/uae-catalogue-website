import type { CardTone } from '@/fields/cardTone'

/** Class for a product/industry card colour (styles in globals.css). */
export const cardToneClass = (tone?: CardTone | string | null) => `card-tone card-tone-${tone || 'ivory'}`
