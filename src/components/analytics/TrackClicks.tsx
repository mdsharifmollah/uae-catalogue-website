'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[]
    gtag?: (...args: unknown[]) => void
  }
}

/**
 * One delegated listener sends conversion events (whatsapp_click, phone_click,
 * email_click) to GTM/GA4 for any element with data-track — or any wa.me / tel: /
 * mailto: link added in rich text.
 */
export const TrackClicks: React.FC = () => {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement | null)?.closest('a')
      if (!target) return
      const href = target.getAttribute('href') || ''
      const event =
        target.dataset.track ||
        (href.includes('wa.me/')
          ? 'whatsapp_click'
          : href.startsWith('tel:')
            ? 'phone_click'
            : href.startsWith('mailto:')
              ? 'email_click'
              : null)
      if (!event) return
      const payload = { link_url: href, page_path: window.location.pathname }
      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event, ...payload })
      window.gtag?.('event', event, payload)
    }
    document.addEventListener('click', onClick, { capture: true })
    return () => document.removeEventListener('click', onClick, { capture: true })
  }, [])

  return null
}
