'use client'

import { usePathname } from 'next/navigation'
import React from 'react'

import { prefersReducedMotion, useMotion } from '@/lib/gsap'

const VARS = ['bg', 'fg', 'muted', 'line', 'accent', 'surface', 'surface-line', 'blob-a', 'blob-b'] as const

const readTone = (el: HTMLElement) => {
  const cs = getComputedStyle(el)
  const out: Record<string, string> = {}
  for (const v of VARS) {
    const value = cs.getPropertyValue(`--tone-${v}`).trim()
    if (value) out[`--page-${v}`] = value
  }
  return out
}

/**
 * Scroll-driven background transitions. A fixed backdrop sits behind the page;
 * as each [data-tone] section crosses the middle of the viewport, the backdrop
 * and text colours blend to that section's tone. Until GSAP arrives (after
 * load), each section simply paints its own tone.
 */
export const BackgroundEngine: React.FC = () => {
  const pathname = usePathname()

  useMotion(
    ({ gsap, ScrollTrigger }) => {
      const root = document.documentElement
      const sections = gsap.utils.toArray<HTMLElement>(
        '#main-content [data-tone]:not([data-tone-lock]), footer[data-tone]',
      )
      if (!sections.length) return

      // Only top-level tone sections drive the engine (ignore nested ones).
      const drivers = sections.filter(
        (el) => !el.parentElement?.closest('#main-content [data-tone], footer[data-tone]'),
      )

      root.classList.add('bg-engine')
      const reduce = prefersReducedMotion()
      let current: HTMLElement | null = null

      const apply = (el: HTMLElement, instant = false) => {
        if (el === current) return
        current = el
        gsap.to(root, {
          ...readTone(el),
          duration: instant || reduce ? 0 : 0.95,
          ease: 'power2.out',
          overwrite: 'auto',
        })
      }

      // Pick the last section whose top has crossed 55% of the viewport.
      // Reading live positions (rather than toggle callbacks) stays correct
      // through refreshes, pins and late-loading images.
      const check = (instant = false) => {
        const mid = window.innerHeight * 0.55
        let target = drivers[0]
        for (const s of drivers) {
          if (s.getBoundingClientRect().top <= mid) target = s
          else break
        }
        if (target) apply(target, instant)
      }

      ScrollTrigger.create({ start: 0, end: 'max', onUpdate: () => check() })
      const onRefresh = () => check()
      ScrollTrigger.addEventListener('refresh', onRefresh)
      check(true)

      if (!reduce) {
        gsap.to('.page-backdrop .blob-a', {
          xPercent: -18,
          yPercent: 14,
          duration: 18,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
        gsap.to('.page-backdrop .blob-b', {
          xPercent: 16,
          yPercent: -12,
          duration: 22,
          ease: 'sine.inOut',
          repeat: -1,
          yoyo: true,
        })
      }

      return () => {
        ScrollTrigger.removeEventListener('refresh', onRefresh)
        root.classList.remove('bg-engine')
      }
    },
    { dependencies: [pathname] },
  )

  return (
    <div className="page-backdrop grain" aria-hidden="true">
      <div className="blob blob-a" />
      <div className="blob blob-b" />
    </div>
  )
}
