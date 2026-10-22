'use client'

import React, { useRef } from 'react'

import { useMotion } from '@/lib/gsap'

/**
 * Desktop: the section pins and the gallery travels sideways as you scroll down.
 * Phones / reduced motion: a native swipeable row with scroll-snap.
 */
export const HorizontalScroll: React.FC<{ header: React.ReactNode; children: React.ReactNode }> = ({
  header,
  children,
}) => {
  const wrap = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLUListElement>(null)

  useMotion(
    ({ gsap }) => {
      const mm = gsap.matchMedia()
      mm.add('(min-width: 1024px) and (prefers-reduced-motion: no-preference)', () => {
        const el = track.current
        const pinEl = wrap.current
        if (!el || !pinEl) return
        const distance = () => Math.max(el.scrollWidth - window.innerWidth + 48, 0)
        if (distance() < 40) return
        gsap.to(el, {
          // Right-to-left pages overflow to the left, so travel the other way.
          x: () => (getComputedStyle(el).direction === 'rtl' ? 1 : -1) * distance(),
          ease: 'none',
          scrollTrigger: {
            trigger: pinEl,
            start: 'top top',
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
            anticipatePin: 1,
          },
        })
      })
      return () => mm.revert()
    },
    { scope: wrap },
  )

  return (
    <div ref={wrap} className="flex min-h-[100svh] flex-col justify-center gap-12 py-24 lg:gap-10 lg:py-[calc(var(--header-h)*0.6)]">
      {header}
      <ul
        ref={track}
        className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[clamp(1rem,4vw,3rem)] pb-2 md:gap-8 lg:snap-none lg:overflow-visible"
        data-lenis-prevent-touch
      >
        {children}
      </ul>
    </div>
  )
}
