import type { Form as FormType } from '@payloadcms/plugin-form-builder/types'
import React from 'react'

import type { FormBlock as FormBlockProps } from '@/payload-types'

import { ClockIcon, MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from '@/components/site/icons'
import { Section, type Tone } from '@/components/site/Section'
import { SectionIntro } from '@/components/site/SectionIntro'
import { WhatsAppAnchor } from '@/components/site/WhatsAppAnchor'
import { getSiteSettings } from '@/utilities/getSiteSettings'
import { telHref } from '@/utilities/whatsapp'
import { QuoteForm } from './LazyQuoteForm'

export const FormBlock: React.FC<FormBlockProps & { id?: string | null }> = async ({
  id,
  tone,
  eyebrow,
  heading,
  intro,
  form,
  showContactPanel,
}) => {
  if (!form || typeof form !== 'object') return null
  const settings = showContactPanel !== false ? await getSiteSettings() : null
  const a = settings?.address

  return (
    <Section tone={(tone as Tone) || 'sand'} id={id ? `block-${id}` : 'quote'}>
      <div className="shell grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
        <div className="flex flex-col gap-10">
          <SectionIntro eyebrow={eyebrow} heading={heading} intro={intro} />
          {settings && (
            <div className="glass flex flex-col gap-2 rounded-[var(--radius-panel)] p-4 md:p-6">
              <WhatsAppAnchor className="group flex min-h-16 items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-white/10">
                <span className="grid size-12 place-items-center rounded-full bg-[#25d366] text-white">
                  <WhatsAppIcon />
                </span>
                <span>
                  <span className="block text-[1rem] text-muted">Fastest reply</span>
                  <span className="block font-semibold">Chat on WhatsApp</span>
                </span>
              </WhatsAppAnchor>
              {settings.phoneNumber && (
                <a href={telHref(settings.phoneNumber)} data-track="phone_click" className="flex min-h-16 items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-white/10">
                  <span className="grid size-12 place-items-center rounded-full border"><PhoneIcon /></span>
                  <span>
                    <span className="block text-[1rem] text-muted">Call</span>
                    <span className="block font-semibold">{settings.phoneDisplay || `+${settings.phoneNumber}`}</span>
                  </span>
                </a>
              )}
              {settings.email && (
                <a href={`mailto:${settings.email}`} data-track="email_click" className="flex min-h-16 items-center gap-4 rounded-2xl p-3 transition-colors hover:bg-white/10">
                  <span className="grid size-12 place-items-center rounded-full border"><MailIcon /></span>
                  <span>
                    <span className="block text-[1rem] text-muted">Email</span>
                    <span className="block font-semibold break-all">{settings.email}</span>
                  </span>
                </a>
              )}
              {(a?.street || a?.locality) && (
                <div className="flex min-h-16 items-center gap-4 rounded-2xl p-3">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full border"><PinIcon /></span>
                  <span>
                    <span className="block text-[1rem] text-muted">Location</span>
                    <span className="block font-semibold">{[a?.street, a?.locality, 'UAE'].filter(Boolean).join(', ')}</span>
                  </span>
                </div>
              )}
              {settings.openingHours?.[0] && (
                <div className="flex min-h-16 items-center gap-4 rounded-2xl p-3">
                  <span className="grid size-12 shrink-0 place-items-center rounded-full border"><ClockIcon /></span>
                  <span>
                    <span className="block text-[1rem] text-muted">Hours</span>
                    <span className="block font-semibold">
                      {settings.openingHours.map((h) => `${(h.days || []).map((d) => d.slice(0, 3)).join(', ')} ${h.opens}–${h.closes}`).join(' · ')}
                    </span>
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
        <div data-reveal className="glass rounded-[var(--radius-panel)] p-6 md:p-10">
          <QuoteForm form={form as unknown as FormType} />
        </div>
      </div>
    </Section>
  )
}
