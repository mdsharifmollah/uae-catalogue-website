import * as React from 'react'

import { cn } from '@/utilities/ui'

/** Form-builder width (%) → flex basis, so two 50% fields sit side by side. */
export const Width: React.FC<{
  children: React.ReactNode
  className?: string
  width?: number | string
}> = ({ children, className, width }) => {
  const w = Number(width) || 100
  return (
    <div
      className={cn('min-w-[min(100%,14rem)] grow', className)}
      style={{ flexBasis: w >= 100 ? '100%' : `calc(${w}% - 0.75rem)` }}
    >
      {children}
    </div>
  )
}
