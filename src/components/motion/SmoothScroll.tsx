'use client'

import type Lenis from 'lenis'
import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

import { getMotion, loadMotion, prefersReducedMotion } from '@/lib/gsap'
import { whenIdle } from '@/utilities/whenIdle'

declare global {
  interface Window {
    __lenis?: Lenis
    __revealReady?: boolean
  }
}

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger stays in sync.
 * Loaded after the page is idle (native scrolling until then). Disabled for
 * prefers-reduced-motion; touch devices keep native scrolling.
 */
export const SmoothScroll: React.FC = () => {
  const pathname = usePathname()

  useEffect(() => {
    if (prefersReducedMotion()) return
    let live = true
    let cleanup: (() => void) | undefined

    whenIdle()
      .then(() => Promise.all([loadMotion(), import('lenis')]))
      .then(([{ gsap, ScrollTrigger }, { default: Lenis }]) => {
        if (!live) return
        const lenis = new Lenis({ lerp: 0.11, anchors: { offset: -96 }, autoRaf: false })
        window.__lenis = lenis
        lenis.on('scroll', ScrollTrigger.update)

        const tick = (time: number) => lenis.raf(time * 1000)
        gsap.ticker.add(tick)
        gsap.ticker.lagSmoothing(0)

        cleanup = () => {
          gsap.ticker.remove(tick)
          lenis.destroy()
          delete window.__lenis
        }
      })
      .catch(() => {
        // Native scrolling stays if the chunks fail to load.
      })

    return () => {
      live = false
      cleanup?.()
    }
  }, [])

  // New route: let layout settle, then recalculate every trigger. Triggers are
  // created after the page loads, so there is nothing to refresh before that.
  useEffect(() => {
    const id = window.setTimeout(() => getMotion()?.ScrollTrigger.refresh(), 120)
    return () => window.clearTimeout(id)
  }, [pathname])

  return null
}
