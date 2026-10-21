'use client'

import { usePathname } from 'next/navigation'
import React, { useEffect } from 'react'

import { useMotion } from '@/lib/gsap'

/**
 * Page-wide entrance animations, opt-in via attributes so server components
 * stay server components:
 *   [data-reveal]  fade + rise when scrolled into view (batched/staggered)
 *   [data-split]   heading lines slide up from a mask
 * Everything is skipped for prefers-reduced-motion, and content is visible
 * without JavaScript.
 *
 * Reveals run on an IntersectionObserver + CSS animation from hydration, so
 * they never wait for GSAP (which loads after the page is idle). Split
 * headings need GSAP and only ever target headings still below the fold.
 */
export const RevealOrchestrator: React.FC = () => {
  const pathname = usePathname()

  useEffect(() => {
    const root = document.documentElement
    // Reduced motion, or the 3.5s no-JS fallback already showed everything.
    if (!root.classList.contains('motion-ok')) return
    window.__revealReady = true

    const els = document.querySelectorAll<HTMLElement>('[data-reveal]:not([data-revealed])')
    if (!els.length) return

    // Same trigger point as before ('top 90%'); elements already scrolled past
    // reveal too. Each batch of entries staggers like ScrollTrigger.batch did.
    const io = new IntersectionObserver(
      (entries) => {
        let i = 0
        const reveal = (el: HTMLElement, stagger = true) => {
          if (el.hasAttribute('data-revealed')) return
          el.style.setProperty('--reveal-delay', `${stagger ? i++ * 0.08 : 0}s`)
          el.setAttribute('data-revealed', '')
          io.unobserve(el)
        }
        for (const entry of entries) {
          if (!entry.isIntersecting && entry.boundingClientRect.top > 0) continue
          const el = entry.target as HTMLElement
          // Already scrolled past (e.g. scroll restored on reload): no stagger
          // slot, so elements actually on screen don't wait behind them.
          const onScreen = entry.isIntersecting
          reveal(el, onScreen)
          // Cards in a horizontal scroller (carousels) reveal as one row, not
          // only once each is swiped into view.
          const row = el.parentElement
          if (row && row.scrollWidth > row.clientWidth) {
            row
              .querySelectorAll<HTMLElement>(':scope > [data-reveal]')
              .forEach((card) => reveal(card, onScreen))
          }
        }
      },
      { rootMargin: '0px 0px -10% 0px' },
    )
    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [pathname])

  useMotion(
    ({ gsap, ScrollTrigger, SplitText }, contextSafe) => {
      const mm = gsap.matchMedia()

      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const splits: SplitText[] = []

        // Page components (pins, galleries) create their triggers in contexts
        // set up right after this one. Wait a tick so these triggers are created
        // after them and measured with pin spacing in place.
        // contextSafe keeps the delayed triggers inside this context so they are
        // cleaned up on route change.
        const setup = gsap.delayedCall(
          0.05,
          contextSafe(() => {
            gsap.utils.toArray<HTMLElement>('[data-split]').forEach((el) => {
              const rect = el.getBoundingClientRect()
              // Never hide headings that are already on (or above) the screen.
              if (rect.top < window.innerHeight * 0.9) return
              splits.push(
                SplitText.create(el, {
                  type: 'lines',
                  mask: 'lines',
                  autoSplit: true,
                  onSplit(self) {
                    return gsap.from(self.lines, {
                      yPercent: 110,
                      duration: 1.15,
                      ease: 'expo.out',
                      stagger: 0.09,
                      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
                    })
                  },
                }),
              )
            })

            ScrollTrigger.sort()
            ScrollTrigger.refresh()
          }),
        )

        return () => {
          setup.kill()
          splits.forEach((s) => s.revert())
        }
      })

      mm.add('(prefers-reduced-motion: reduce)', () => {
        document.documentElement.classList.remove('motion-ok')
      })

      return () => mm.revert()
    },
    { dependencies: [pathname] },
  )

  return null
}
