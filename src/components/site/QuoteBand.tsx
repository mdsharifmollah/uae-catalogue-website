import Link from 'next/link'
import React from 'react'

import { AccentText } from './AccentText'
import { ArrowUpRight, WhatsAppIcon } from './icons'
import { Section } from './Section'
import { WhatsAppAnchor } from './WhatsAppAnchor'

/** Closing call-to-action used on detail pages. */
export const QuoteBand: React.FC<{ heading: string; text?: string; message?: string | null }> = ({
  heading,
  text,
  message,
}) => (
  <Section tone="bronze" className="overflow-hidden">
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      <div className="absolute -left-40 top-1/2 size-[40rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(227,199,146,0.35),transparent_65%)] blur-2xl" />
    </div>
    <div className="shell relative flex flex-col items-center gap-7 text-center">
      <h2 className="text-h2 max-w-4xl" data-split>
        <AccentText text={heading} />
      </h2>
      {text && (
        <p className="text-lead max-w-2xl text-muted" data-reveal>
          {text}
        </p>
      )}
      <div className="flex flex-wrap justify-center gap-3" data-reveal>
        <WhatsAppAnchor className="btn btn-primary btn-lg" message={message}>
          <WhatsAppIcon />
          Request a quote on WhatsApp
        </WhatsAppAnchor>
        <Link href="/contact#quote" className="btn btn-glass btn-lg">
          Send project details
          <ArrowUpRight />
        </Link>
      </div>
    </div>
  </Section>
)
