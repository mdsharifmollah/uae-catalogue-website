import React from 'react'

import type { Media as MediaType } from '@/payload-types'
import { getMediaUrl } from '@/utilities/getMediaUrl'
import { cn } from '@/utilities/ui'

type Props = {
  name: string
  logo?: MediaType | number | null
  className?: string
}

/** Uploaded logo when available, otherwise a typographic wordmark with a swatch mark. */
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
  return (
    <span className={cn('inline-flex items-center gap-2.5 whitespace-nowrap font-semibold tracking-tight', className)}>
      <span aria-hidden="true" className="grid grid-cols-2 gap-[3px] rotate-12">
        <span className="size-2.5 rounded-[3px] bg-[#c9a66b]" />
        <span className="size-2.5 rounded-[3px] bg-current opacity-80" />
        <span className="size-2.5 rounded-[3px] bg-current opacity-40" />
        <span className="size-2.5 rounded-[3px] bg-[#a78659]" />
      </span>
      {/* Slightly smaller on the narrowest phones so the header still fits. */}
      <span className="text-[1.25rem] leading-none max-[359px]:text-[1.0625rem]">{name}</span>
    </span>
  )
}
