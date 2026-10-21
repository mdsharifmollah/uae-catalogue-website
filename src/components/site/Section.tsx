import React from 'react'

import { cn } from '@/utilities/ui'

export type Tone = 'ink' | 'charcoal' | 'ivory' | 'sand' | 'linen' | 'bronze'

type Props = React.HTMLAttributes<HTMLElement> & {
  tone?: Tone | null
  as?: 'section' | 'div' | 'footer' | 'header' | 'article'
  /** Keep this section's own colours even while the scroll engine is active. */
  lockTone?: boolean
  padded?: boolean
}

/**
 * Full-width section. `data-tone` drives the scroll background engine:
 * the page backdrop blends to this tone while the section is in view.
 */
export const Section: React.FC<Props> = ({
  tone = 'ivory',
  as: Tag = 'section',
  lockTone,
  padded = true,
  className,
  children,
  ...rest
}) => (
  <Tag
    data-tone={tone || 'ivory'}
    {...(lockTone ? { 'data-tone-lock': '' } : {})}
    className={cn('relative w-full', padded && 'section-pad', className)}
    {...rest}
  >
    {children}
  </Tag>
)
