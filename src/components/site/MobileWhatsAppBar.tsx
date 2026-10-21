'use client'

import React, { useEffect, useState } from 'react'

import { PhoneIcon, WhatsAppIcon } from './icons'
import { WhatsAppAnchor } from './WhatsAppAnchor'
import { useSiteSettings } from '@/providers/SiteSettings'
import { telHref } from '@/utilities/whatsapp'
import { cn } from '@/utilities/ui'

/** Persistent WhatsApp + call bar on phones. Appears after the hero. */
export const MobileWhatsAppBar: React.FC<{ label: string }> = ({ label }) => {
  const { phoneNumber } = useSiteSettings()
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > window.innerHeight * 0.6)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] md:hidden transition-transform duration-500 ease-[var(--ease-out-expo)] motion-reduce:transition-none',
        show ? 'translate-y-0' : 'translate-y-[130%]',
      )}
    >
      <div className="glass-strong flex items-center gap-2 rounded-full p-2" style={{ color: 'var(--page-fg)' }}>
        <WhatsAppAnchor className="btn btn-primary btn-sm flex-1 !whitespace-nowrap !px-4" tabIndex={show ? 0 : -1}>
          <WhatsAppIcon />
          {label}
        </WhatsAppAnchor>
        {phoneNumber && (
          <a
            href={telHref(phoneNumber)}
            className="btn btn-glass btn-sm !px-0 w-[3.25rem]"
            aria-label="Call us"
            data-track="phone_click"
            tabIndex={show ? 0 : -1}
          >
            <PhoneIcon />
          </a>
        )}
      </div>
    </div>
  )
}
