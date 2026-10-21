'use client'

import type { gsap as GSAP } from 'gsap'
import type { ScrollTrigger as ScrollTriggerType } from 'gsap/ScrollTrigger'
import type { SplitText as SplitTextType } from 'gsap/SplitText'
import { type DependencyList, type RefObject, useEffect } from 'react'

import { whenIdle } from '@/utilities/whenIdle'

export type Motion = {
  gsap: typeof GSAP
  ScrollTrigger: typeof ScrollTriggerType
  SplitText: typeof SplitTextType
}

let pending: Promise<Motion> | undefined
let loaded: Motion | undefined

/**
 * GSAP + plugins as a lazy chunk, fetched only after the page has loaded and
 * gone idle, so they stay out of the critical path (and out of LCP).
 */
export const loadMotion = (): Promise<Motion> => {
  pending ??= whenIdle()
    .then(() =>
      Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('gsap/SplitText')]),
    )
    .then(([{ gsap }, { ScrollTrigger }, { SplitText }]) => {
      gsap.registerPlugin(ScrollTrigger, SplitText)
      loaded = { gsap, ScrollTrigger, SplitText }
      return loaded
    })
    .catch((error) => {
      pending = undefined // allow a retry on the next route
      throw error
    })
  return pending
}

/** The libraries if they have already arrived, without triggering a load. */
export const getMotion = () => loaded

type ContextSafe = <T extends (...args: never[]) => unknown>(fn: T) => T

/**
 * useGSAP() for the lazily loaded GSAP. Runs `setup` inside a gsap.context()
 * once the libraries arrive and reverts that context on unmount or when a
 * dependency changes (e.g. the route), so every tween, ScrollTrigger, SplitText
 * and matchMedia created in it is cleaned up. Return a function from `setup`
 * for extra cleanup; wrap delayed callbacks in `contextSafe`.
 */
export const useMotion = (
  setup: (motion: Motion, contextSafe: ContextSafe) => void | (() => void),
  { scope, dependencies = [] }: { scope?: RefObject<Element | null>; dependencies?: DependencyList } = {},
) => {
  useEffect(() => {
    let live = true
    let timer: number | undefined
    let ctx: gsap.Context | undefined
    loadMotion()
      .then((motion) => {
        // Each component sets up in its own task, so the work after GSAP
        // arrives is a few short tasks instead of one long one.
        timer = window.setTimeout(() => {
          if (!live) return
          ctx = motion.gsap.context(
            (_self, contextSafe) => setup(motion, contextSafe as unknown as ContextSafe),
            scope?.current ?? undefined,
          )
        })
      })
      .catch(() => {
        // No motion if the chunk fails to load; content is already visible.
      })
    return () => {
      live = false
      window.clearTimeout(timer)
      ctx?.revert()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, dependencies)
}

export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches
