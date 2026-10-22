import React from 'react'

import type { CallToActionBlock as CTABlockProps } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { AccentText } from '@/components/site/AccentText'
import { MailIcon, PhoneIcon, PinIcon } from '@/components/site/icons'
import { Section, type Tone } from '@/components/site/Section'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { telHref } from '@/utilities/whatsapp'
import { getDictionary } from '@/i18n/server'

export const CallToActionBlock: React.FC<CTABlockProps & { id?: string | null }> = async ({
  id,
  tone,
  eyebrow,
  heading,
  text,
  links,
  showContactDetails,
}) => {
  const [settings, t] = await Promise.all([showContactDetails !== false ? getSiteSettings() : null, getDictionary()])

  return (
    <Section tone={(tone as Tone) || 'bronze'} id={id ? `block-${id}` : undefined} className="overflow-hidden">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-0">
        <div className="absolute -left-40 top-1/2 size-[42rem] -translate-y-1/2 rounded-full bg-[radial-gradient(circle,rgba(227,199,146,0.35),transparent_65%)] blur-2xl" />
        <div className="absolute -right-40 -top-20 size-[36rem] rounded-full bg-[radial-gradient(circle,rgba(18,19,17,0.35),transparent_65%)] blur-2xl" />
      </div>
      <div className="shell relative flex flex-col items-center gap-8 text-center">
        {eyebrow && (
          <p className="eyebrow" data-reveal>
            {eyebrow}
          </p>
        )}
        <h2 className="text-h2 max-w-4xl" data-split>
          <AccentText text={heading} />
        </h2>
        {text && (
          <p className="text-lead max-w-2xl text-muted" data-reveal>
            {text}
          </p>
        )}
        {links && links.length > 0 && (
          <div className="mt-2 flex flex-wrap justify-center gap-3" data-reveal>
            {links.map(({ link }, i) => (
              <CMSLink key={i} {...link} size="lg" />
            ))}
          </div>
        )}
        {settings && (
          <ul className="mt-6 flex flex-wrap justify-center gap-x-8 gap-y-3 text-[1.0625rem]" data-reveal>
            {settings.phoneNumber && (
              <li>
                <a href={telHref(settings.phoneNumber)} className="inline-flex min-h-11 items-center gap-2 hover:underline" data-track="phone_click">
                  <PhoneIcon /> <span dir="ltr">{settings.phoneDisplay || `+${settings.phoneNumber}`}</span>
                </a>
              </li>
            )}
            {settings.email && (
              <li>
                <a href={`mailto:${settings.email}`} className="inline-flex min-h-11 items-center gap-2 hover:underline" data-track="email_click">
                  <MailIcon /> {settings.email}
                </a>
              </li>
            )}
            {settings.address?.locality && (
              <li className="inline-flex min-h-11 items-center gap-2">
                <PinIcon /> {settings.address.locality}
                {t.common.listSep}
                {t.common.uae}
              </li>
            )}
          </ul>
        )}
      </div>
    </Section>
  )
}
