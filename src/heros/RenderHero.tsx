import React from 'react'

import type { Page } from '@/payload-types'

import { CatalogHero } from '@/heros/CatalogHero'
import { MinimalHero } from '@/heros/MinimalHero'
import { PageHero } from '@/heros/PageHero'

const heroes = {
  catalog: CatalogHero,
  page: PageHero,
  minimal: MinimalHero,
}

export const RenderHero: React.FC<Page['hero'] & { fallbackTitle?: string }> = (props) => {
  const { type } = props || {}

  if (!type || type === 'none') return null

  const HeroToRender = heroes[type as keyof typeof heroes]

  if (!HeroToRender) return null

  return <HeroToRender {...props} />
}
