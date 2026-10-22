'use client'

import React from 'react'

import { ArrowUp } from './icons'
import { useDictionary } from '@/i18n/client'
import { cn } from '@/utilities/ui'

/**
 * Footer "back to top" link. Glides up through Lenis when it's running,
 * jumps straight there for reduced motion, and moves keyboard focus to the
 * start of the page.
 */
export const BackToTop: React.FC<{ className?: string }> = ({ className }) => {
  const t = useDictionary()
  const onClick = () => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (window.__lenis && !reduce) window.__lenis.scrollTo(0, { duration: 1.4 })
    else window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' })
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn('group inline-flex min-h-11 items-center gap-3 hover:text-accent', className)}
    >
      {t.common.backToTop}
      <span className="grid size-11 place-items-center rounded-full border transition-transform duration-500 ease-[var(--ease-out-expo)] group-hover:-translate-y-1 motion-reduce:transition-none">
        <ArrowUp />
      </span>
    </button>
  )
}
