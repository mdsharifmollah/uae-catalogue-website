'use client'

import React from 'react'

import { ArrowRight } from '@/components/site/icons'

export const CarouselControls: React.FC<{ targetId: string }> = ({ targetId }) => {
  const scroll = (dir: 1 | -1) => {
    const el = document.getElementById(targetId)
    if (!el) return
    const card = el.querySelector('li')
    const step = card ? card.getBoundingClientRect().width + 24 : el.clientWidth * 0.8
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }
  return (
    <div className="flex shrink-0 gap-3">
      <button type="button" className="btn btn-glass btn-sm !px-0 w-[3.25rem]" aria-controls={targetId} aria-label="Previous" onClick={() => scroll(-1)}>
        <ArrowRight className="rotate-180" />
      </button>
      <button type="button" className="btn btn-glass btn-sm !px-0 w-[3.25rem]" aria-controls={targetId} aria-label="Next" onClick={() => scroll(1)}>
        <ArrowRight />
      </button>
    </div>
  )
}
