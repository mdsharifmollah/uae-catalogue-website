import React from 'react'

import type { Media as MediaType } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

type Props = {
  name: string
  logo?: MediaType | number | null
  className?: string
}

/** The scissors-and-cut-line symbol from the Al Hejlah logo (full files in /public/brand). */
export const ScissorsMark: React.FC<{ className?: string; cutLine?: boolean }> = ({ className, cutLine = true }) => (
  <svg viewBox="5 13 60 38" aria-hidden="true" className={className} fill="currentColor">
    {cutLine && (
      <path d="M47 32h3.5M54 32h3.5M61 32h3" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
    )}
    <path d="M28.6 30.6C38 26.6 46 21.6 55.5 14.6 47.6 23.6 40.8 30.2 33.4 35.2Z" />
    <path d="M28.6 33.4C38 37.4 46 42.4 55.5 49.4 47.6 40.4 40.8 33.8 33.4 28.8Z" />
    <path d="M19.4 25.4 30.2 31.1M19.4 38.6 30.2 32.9" stroke="currentColor" strokeWidth="4" strokeLinecap="round" />
    <ellipse cx="13.2" cy="21.6" rx="7" ry="6.2" fill="none" stroke="currentColor" strokeWidth="3.6" />
    <ellipse cx="13.2" cy="42.4" rx="7" ry="6.2" fill="none" stroke="currentColor" strokeWidth="3.6" />
    <circle cx="31" cy="32" r="2.4" />
  </svg>
)

/**
 * Uploaded logo when available, otherwise the Al Hejlah wordmark: scissors mark
 * plus the name, with its last word in the italic serif accent (as in the logo).
 */
export const Wordmark: React.FC<Props> = ({ name, logo, className }) => {
  if (logo && typeof logo === 'object' && logo.url) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={getMediaUrl(logo.url, logo.updatedAt)}
        alt={logo.alt || name}
        width={logo.width || 160}
        height={logo.height || 40}
        className={cn('h-9 w-auto', className)}
        decoding="async"
      />
    )
  }
  const words = name.trim().split(/\s+/)
  const accent = words.length > 1 ? words.pop() : undefined
  return (
    // The lockup reads left-to-right in every language, exactly like the logo file.
    <span dir="ltr" className={cn('inline-flex items-center gap-2.5 whitespace-nowrap font-semibold tracking-tight', className)}>
      <ScissorsMark className="h-[1.6rem] w-auto text-[color:var(--accent)] max-[359px]:h-[1.35rem]" />
      {/* Slightly smaller on the narrowest phones so the header still fits. */}
      <span className="text-[1.25rem] leading-none max-[359px]:text-[1.0625rem]">
        {words.join(' ')}
        {accent && (
          <>
            {' '}
            <span className="accent-word text-[1.18em]">{accent}</span>
          </>
        )}
      </span>
    </span>
  )
}
