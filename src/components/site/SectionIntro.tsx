import React from 'react'

import { cn } from '@/utilities/ui'
import { AccentText } from './AccentText'

type Props = {
  eyebrow?: string | null
  heading?: string | null
  intro?: string | null
  align?: 'left' | 'center'
  as?: 'h1' | 'h2'
  className?: string
  children?: React.ReactNode
}

export const SectionIntro: React.FC<Props> = ({
  eyebrow,
  heading,
  intro,
  align = 'left',
  as: H = 'h2',
  className,
  children,
}) => {
  if (!eyebrow && !heading && !intro && !children) return null
  return (
    <div
      className={cn(
        'flex flex-col gap-5',
        align === 'center' ? 'items-center text-center mx-auto max-w-4xl' : 'max-w-3xl',
        className,
      )}
    >
      {eyebrow && (
        <p className="eyebrow" data-reveal>
          <span aria-hidden="true" className="inline-block h-px w-8 bg-current opacity-60" />
          {eyebrow}
        </p>
      )}
      {heading && (
        <H className={H === 'h1' ? 'text-display' : 'text-h2'} data-split>
          <AccentText text={heading} />
        </H>
      )}
      {intro && (
        <p className="text-lead text-muted max-w-2xl" data-reveal>
          {intro}
        </p>
      )}
      {children}
    </div>
  )
}
