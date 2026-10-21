'use client'

import React from 'react'

import { useSiteSettings } from '@/providers/SiteSettings'
import { whatsappHref } from '@/utilities/whatsapp'

type Props = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
  message?: string | null
}

/** Anchor that opens WhatsApp with the business number from Site Settings. */
export const WhatsAppAnchor: React.FC<Props> = ({ message, children, ...rest }) => {
  const { whatsappNumber, whatsappDefaultMessage } = useSiteSettings()
  return (
    <a
      href={whatsappHref(whatsappNumber, message || whatsappDefaultMessage)}
      target="_blank"
      rel="noopener noreferrer"
      data-track="whatsapp_click"
      {...rest}
    >
      {children}
    </a>
  )
}
