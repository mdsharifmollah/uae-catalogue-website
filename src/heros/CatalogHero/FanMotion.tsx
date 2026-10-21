'use client'

import React, { useRef } from 'react'

import { useMotion } from '@/lib/gsap'

/** As the hero scrolls away, the catalogue fan opens wider and lifts slightly. */
export const FanMotion: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)

  useMotion(
    ({ gsap }) => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference) and (min-width: 768px)', () => {
        const el = ref.current
        if (!el) return
        gsap.fromTo(
          el,
          { '--spread': 1, y: 0 },
          {
            '--spread': 1.55,
            y: -40,
            ease: 'none',
            scrollTrigger: {
              trigger: el.closest('section'),
              start: 'top top',
              end: 'bottom top',
              scrub: 0.6,
            },
          },
        )
      })
      return () => mm.revert()
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="relative w-full px-4">
      {children}
    </div>
  )
}
