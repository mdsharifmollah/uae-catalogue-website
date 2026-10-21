import Link from 'next/link'
import React from 'react'

import { Section } from '@/components/site/Section'

export default function NotFound() {
  return (
    <Section tone="ink" className="flex min-h-[80svh] items-center pt-[calc(var(--header-h)+4rem)]">
      <div className="shell flex flex-col items-start gap-6">
        <p className="eyebrow">Error 404</p>
        <h1 className="text-display max-w-3xl">
          This swatch is <em className="accent-word">missing</em> from the book.
        </h1>
        <p className="text-lead max-w-xl text-muted">The page you are looking for has moved or no longer exists.</p>
        <div className="flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            Back to home
          </Link>
          <Link href="/products" className="btn btn-glass">
            Browse formats
          </Link>
        </div>
      </div>
    </Section>
  )
}
