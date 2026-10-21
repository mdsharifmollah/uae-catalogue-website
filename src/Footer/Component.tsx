import React from 'react'

import { CMSLink } from '@/components/Link'
import { AccentText } from '@/components/site/AccentText'
import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/site/icons'
import { Section } from '@/components/site/Section'
import { WhatsAppAnchor } from '@/components/site/WhatsAppAnchor'
import { Wordmark } from '@/components/site/Wordmark'
import { getCachedGlobal } from '@/utilities/getGlobals'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { telHref } from '@/utilities/whatsapp'

const formatDays = (days: string[]) => {
  if (days.length > 2) return `${days[0].slice(0, 3)} – ${days[days.length - 1].slice(0, 3)}`
  return days.map((d) => d.slice(0, 3)).join(', ')
}

export async function Footer() {
  const [footer, settings] = await Promise.all([getCachedGlobal('footer', 1)(), getSiteSettings()])
  const { address } = settings
  const addressLine = [address?.street, address?.locality, 'United Arab Emirates']
    .filter(Boolean)
    .join(', ')
  const year = new Date().getFullYear()

  return (
    <Section as="footer" tone="ink" padded={false} className="mt-auto overflow-hidden">
      <div className={footer.ctaHeading ? "shell pt-24 md:pt-32" : "shell pt-16 md:pt-20"}>
        {footer.ctaHeading && (
        <div className="mb-20 grid gap-12 lg:grid-cols-[1.3fr_1fr] lg:items-end">
          <h2 className="text-h2 max-w-3xl" data-split>
            <AccentText text={footer.ctaHeading} />
          </h2>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <WhatsAppAnchor className="btn btn-primary btn-lg">
              <WhatsAppIcon />
              Chat on WhatsApp
            </WhatsAppAnchor>
            {settings.phoneNumber && (
              <a className="btn btn-glass btn-lg" href={telHref(settings.phoneNumber)} data-track="phone_click">
                <PhoneIcon />
                Call us
              </a>
            )}
          </div>
        </div>
        )}

        <div className="grid gap-12 border-t pt-14 md:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
          <div className="flex flex-col gap-6">
            <Wordmark name={settings.shortName} logo={settings.logoOnDark} />
            {settings.tagline && <p className="max-w-sm text-muted">{settings.tagline}</p>}
            <ul className="flex flex-col gap-3 text-[1.0625rem]">
              {addressLine && (
                <li className="flex gap-3">
                  <PinIcon className="mt-1 text-accent" />
                  {address?.mapUrl ? (
                    <a href={address.mapUrl} target="_blank" rel="noopener noreferrer" className="hover:text-accent">
                      {addressLine}
                    </a>
                  ) : (
                    <span>{addressLine}</span>
                  )}
                </li>
              )}
              {settings.phoneNumber && (
                <li className="flex gap-3">
                  <PhoneIcon className="mt-1 text-accent" />
                  <a href={telHref(settings.phoneNumber)} className="hover:text-accent" data-track="phone_click">
                    {settings.phoneDisplay || `+${settings.phoneNumber}`}
                  </a>
                </li>
              )}
              {settings.email && (
                <li className="flex gap-3">
                  <MailIcon className="mt-1 text-accent" />
                  <a href={`mailto:${settings.email}`} className="hover:text-accent" data-track="email_click">
                    {settings.email}
                  </a>
                </li>
              )}
              {settings.openingHours?.map((h, i) => (
                <li key={i} className="flex gap-3 text-muted">
                  <ClockIcon className="mt-1 text-accent" />
                  <span>
                    {formatDays(h.days || [])} · {h.opens}–{h.closes}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {footer.columns?.map((col, i) => (
            <nav key={i} aria-label={col.title}>
              <p className="eyebrow mb-5">{col.title}</p>
              <ul className="flex flex-col gap-1">
                {col.links?.map(({ link }, j) => (
                  <li key={j}>
                    <CMSLink
                      {...link}
                      appearance="inline"
                      className="inline-flex min-h-11 items-center opacity-80 transition-opacity hover:opacity-100 hover:text-accent"
                    />
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t py-8 text-[1rem] text-muted md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {settings.companyName}. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            {settings.socials?.map((s, i) => (
              <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="capitalize hover:text-accent">
                {s.platform}
              </a>
            ))}
            {footer.legalLinks?.map(({ link }, i) => (
              <CMSLink key={i} {...link} appearance="inline" className="hover:text-accent" />
            ))}
          </div>
        </div>
      </div>

      {footer.showWordmark !== false && (
        <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
          <p
            className="shell whitespace-nowrap text-center font-semibold leading-[0.8] tracking-[-0.06em]"
            style={{
              // Scales with the name's length so any short name fits edge to edge.
              fontSize: `min(18rem, 17vw, ${(176 / Math.max(settings.shortName.length, 1)).toFixed(2)}vw)`,
              backgroundImage: 'linear-gradient(180deg, rgba(201,166,107,0.55), rgba(201,166,107,0) 85%)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              color: 'transparent',
              marginBottom: '-0.12em',
            }}
          >
            {settings.shortName}
          </p>
        </div>
      )}
    </Section>
  )
}
