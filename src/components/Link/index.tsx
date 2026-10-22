import { Button, type ButtonProps } from '@/components/ui/button'
import { WhatsAppAnchor } from '@/components/site/WhatsAppAnchor'
import { ArrowUpRight, WhatsAppIcon } from '@/components/site/icons'
import { cn } from '@/utilities/ui'
import { docPath, type RoutableCollection } from '@/utilities/routes'
import { Link } from '@/i18n/client'
import React from 'react'

type ReferenceValue = { slug?: string | null } | string | number

export type CMSLinkType = {
  appearance?: 'inline' | ButtonProps['variant'] | null
  children?: React.ReactNode
  className?: string
  label?: string | null
  newTab?: boolean | null
  reference?: {
    relationTo: RoutableCollection
    value: ReferenceValue
  } | null
  size?: ButtonProps['size'] | null
  type?: 'custom' | 'reference' | 'whatsapp' | null
  url?: string | null
  whatsappMessage?: string | null
  /** Show a trailing arrow (buttons) — WhatsApp links always show the WhatsApp glyph. */
  icon?: boolean
}

export const resolveHref = (props: Pick<CMSLinkType, 'type' | 'reference' | 'url'>): string | null => {
  const { type, reference, url } = props
  if (type === 'reference' && reference && typeof reference.value === 'object' && reference.value?.slug) {
    return docPath(reference.relationTo, reference.value.slug)
  }
  return url || null
}

const trackFor = (href: string) =>
  href.startsWith('tel:') ? 'phone_click' : href.startsWith('mailto:') ? 'email_click' : undefined

export const CMSLink: React.FC<CMSLinkType> = (props) => {
  const {
    type,
    appearance = 'inline',
    children,
    className,
    label,
    newTab,
    size,
    whatsappMessage,
    icon = true,
  } = props

  const isButton = appearance !== 'inline'
  const variant = (appearance === 'inline' ? undefined : appearance) as ButtonProps['variant']

  if (type === 'whatsapp') {
    const content = (
      <>
        <WhatsAppIcon />
        {label}
        {children}
      </>
    )
    if (!isButton) {
      return (
        <WhatsAppAnchor className={className} message={whatsappMessage}>
          {content}
        </WhatsAppAnchor>
      )
    }
    return (
      <Button asChild className={className} size={size} variant={variant}>
        <WhatsAppAnchor message={whatsappMessage}>{content}</WhatsAppAnchor>
      </Button>
    )
  }

  const href = resolveHref(props)
  if (!href) return null

  const isExternal = /^https?:\/\//.test(href)
  const newTabProps =
    newTab || isExternal ? { rel: 'noopener noreferrer', target: '_blank' } : {}
  const track = trackFor(href)

  const inner = (
    <>
      {label}
      {children}
      {isButton && icon && variant !== 'link' && <ArrowUpRight />}
    </>
  )

  if (!isButton) {
    return (
      <Link className={cn(className)} href={href} data-track={track} {...newTabProps}>
        {label}
        {children}
      </Link>
    )
  }

  return (
    <Button asChild className={className} size={size} variant={variant}>
      <Link href={href} data-track={track} {...newTabProps}>
        {inner}
      </Link>
    </Button>
  )
}
