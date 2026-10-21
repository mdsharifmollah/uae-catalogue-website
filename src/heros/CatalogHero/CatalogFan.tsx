import Link from 'next/link'
import React from 'react'

import type { Product } from '@/payload-types'

import { Media } from '@/components/Media'
import { ArrowUpRight } from '@/components/site/icons'
import { cardToneClass } from '@/components/site/cardTones'
import { cn } from '@/utilities/ui'
import { docPath } from '@/utilities/routes'
import { FanMotion } from './FanMotion'

// Fan layout for up to 5 cards, centre card in front.
const LAYOUT = [
  { r: -14, x: -118, y: 16, z: 1 },
  { r: -7, x: -60, y: 5, z: 2 },
  { r: 0, x: 0, y: 0, z: 5 },
  { r: 7, x: 60, y: 5, z: 2 },
  { r: 14, x: 118, y: 16, z: 1 },
]

const orderForFan = (items: Product[]) => {
  // Put the first product in the centre: [3rd, 2nd, 1st, 4th, 5th]
  const list = items.slice(0, 5)
  if (list.length < 3) return list
  const [first, second, third, ...rest] = list
  return [third, second, first, ...rest].filter(Boolean) as Product[]
}

export const CatalogFan: React.FC<{ products: Product[] }> = ({ products }) => {
  const cards = orderForFan(products)
  const offset = Math.floor((5 - cards.length) / 2)

  return (
    <FanMotion>
      <ul
        className="relative mx-auto mt-12 h-[18rem] w-full max-w-[64rem] sm:h-[22rem] md:mt-16 md:h-[27rem]"
        aria-label="Sample formats we manufacture"
      >
        {cards.map((product, i) => {
          const pos = LAYOUT[i + offset]
          const isCenter = pos.r === 0
          const [line1, line2] = (product.cardTitle || product.title).split('|')
          return (
            <li
              key={product.id}
              data-fan-card
              className={cn(
                'absolute bottom-0 left-1/2 w-[11.5rem] sm:w-[13.5rem] md:w-[17rem]',
                Math.abs(pos.r) === 14 && 'max-lg:hidden',
              )}
              style={
                {
                  '--r': `${pos.r}deg`,
                  '--x': `${pos.x}%`,
                  '--y': `${pos.y}%`,
                  '--i': i,
                  zIndex: pos.z,
                  transform:
                    'translateX(calc(-50% + var(--x) * var(--spread, 1))) translateY(calc(var(--y) * var(--spread, 1))) rotate(calc(var(--r) * var(--spread, 1)))',
                  transformOrigin: '50% 120%',
                } as React.CSSProperties
              }
            >
              <Link
                href={docPath('products', product.slug)}
                className={cn(
                  'fan-card group relative flex h-[16rem] flex-col overflow-hidden rounded-[var(--radius-card)] p-4 text-left sm:h-[19rem] sm:p-5 md:h-[24rem] md:p-6',
                  cardToneClass(product.cardTone),
                )}
              >
                <span className="relative z-10 text-[1.125rem] font-semibold leading-tight sm:text-[1.375rem] md:text-[1.625rem]">
                  {line1}
                  {line2 && <span className="block opacity-60">{line2}</span>}
                </span>
                {isCenter && (
                  <span className="relative z-10 mt-3 inline-flex w-fit items-center gap-2 rounded-full bg-white px-3 py-1.5 text-[1rem] font-semibold text-[#121311] shadow-lg sm:px-4 sm:py-2">
                    View format
                    <span className="grid size-6 place-items-center rounded-full bg-[#c9a66b]">
                      <ArrowUpRight size={14} />
                    </span>
                  </span>
                )}
                {product.cardImage && typeof product.cardImage === 'object' ? (
                  <Media
                    resource={product.cardImage}
                    fill
                    size="(max-width: 768px) 60vw, 280px"
                    imgClassName="object-contain object-bottom p-3 pt-16 transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.06]"
                    pictureClassName="absolute inset-0"
                    htmlElement={null}
                  />
                ) : (
                  product.heroImage &&
                  typeof product.heroImage === 'object' && (
                    <div className="relative mt-auto h-[58%] overflow-hidden rounded-[calc(var(--radius-card)-0.5rem)]">
                      <Media
                        resource={product.heroImage}
                        fill
                        size="(max-width: 768px) 60vw, 280px"
                        imgClassName="object-cover transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[1.08]"
                        pictureClassName="absolute inset-0"
                        htmlElement={null}
                      />
                    </div>
                  )
                )}
              </Link>
            </li>
          )
        })}
      </ul>
    </FanMotion>
  )
}
