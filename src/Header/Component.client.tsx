'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useId, useRef, useState } from 'react'

import type { Header, Media as MediaType } from '@/payload-types'

import { CMSLink, resolveHref } from '@/components/Link'
import { CloseIcon, MenuIcon, PhoneIcon, WhatsAppIcon } from '@/components/site/icons'
import { Wordmark } from '@/components/site/Wordmark'
import { WhatsAppAnchor } from '@/components/site/WhatsAppAnchor'
import { useSiteSettings } from '@/providers/SiteSettings'
import { cn } from '@/utilities/ui'
import { telHref } from '@/utilities/whatsapp'

interface HeaderClientProps {
  data: Header
  name: string
  logo?: MediaType | number | null
  logoLight?: MediaType | number | null
  /** Label for the phone quote button in the docked bar; null hides it. */
  quoteLabel?: string | null
}

/**
 * Glass header. At the top of the page it sits at the top; once the visitor
 * scrolls it docks as a floating bar at the bottom of the screen (and slides
 * back up at the top). On phones the docked bar also carries the WhatsApp
 * quote and call buttons.
 */
export const HeaderClient: React.FC<HeaderClientProps> = ({ data, name, logo, quoteLabel }) => {
  const pathname = usePathname()
  const { phoneNumber } = useSiteSettings()
  const [scrolled, setScrolled] = useState(false)
  const [docked, setDocked] = useState(false)
  // Only animate real top <-> bottom moves, not the initial render.
  const [moved, setMoved] = useState(false)
  // The menu belongs to the route it was opened on, so navigating closes it.
  const [openOn, setOpenOn] = useState<string | null>(null)
  const open = openOn === pathname
  const dockedRef = useRef(false)
  const menuId = useId()
  const toggleRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  const navItems = data?.navItems || []
  const actions = data?.actions || []

  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (ticking) return
      ticking = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        setScrolled(y > 24)
        // A little hysteresis so it doesn't flicker around the threshold.
        const next = dockedRef.current ? y > 80 : y > 160
        if (next !== dockedRef.current) {
          dockedRef.current = next
          setDocked(next)
          setMoved(true)
        }
        ticking = false
      })
    }
    // Start in place (no slide-in) when the page loads already scrolled.
    dockedRef.current = window.scrollY > 160
    setDocked(dockedRef.current)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = useCallback(() => {
    setOpenOn(null)
    toggleRef.current?.focus()
  }, [])

  useEffect(() => {
    if (!open) {
      window.__lenis?.start()
      return
    }
    window.__lenis?.stop()
    panelRef.current?.querySelector<HTMLElement>('a, button')?.focus()
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, close])

  const isActive = (href: string | null) =>
    !!href && (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))

  return (
    <>
      <a
        href="#main-content"
        className="btn btn-primary btn-sm fixed left-4 top-4 z-[70] -translate-y-24 focus:translate-y-0"
      >
        Skip to content
      </a>
      <header
        className={cn(
          'fixed inset-x-0 z-50 flex',
          docked ? 'bottom-0 flex-col-reverse' : 'top-0 flex-col',
          moved && (docked ? 'header-dock-in' : 'header-top-in'),
        )}
      >
        <div className={cn('shell', docked ? 'pb-[max(0.75rem,env(safe-area-inset-bottom))]' : 'pt-3 md:pt-4')}>
          <div
            className={cn(
              'flex items-center justify-between gap-4 rounded-full px-3 py-2 max-[359px]:gap-2 max-[359px]:px-2 md:px-4 transition-[background-color,box-shadow,backdrop-filter] duration-500',
              scrolled || open || docked ? 'glass-strong' : 'bg-transparent',
              docked && quoteLabel && 'max-md:gap-2 max-md:p-2',
            )}
            style={{ color: 'var(--page-fg)' }}
          >
            <Link
              href="/"
              className={cn(
                'flex min-h-12 items-center rounded-full px-3 max-[359px]:px-1.5',
                docked && quoteLabel && 'max-md:hidden',
              )}
              aria-label={`${name} — home`}
            >
              <Wordmark name={name} logo={logo} />
            </Link>

            {docked && quoteLabel && (
              <WhatsAppAnchor className="btn btn-primary btn-sm min-w-0 flex-1 !whitespace-nowrap !px-4 max-[359px]:!gap-1.5 max-[359px]:!px-2.5 md:hidden">
                <WhatsAppIcon />
                <span className="truncate">{quoteLabel}</span>
              </WhatsAppAnchor>
            )}

            <nav aria-label="Main" className="hidden xl:block">
              <ul className="glass flex items-center gap-1 rounded-full p-1.5">
                {navItems.map(({ link }, i) => {
                  const href = resolveHref(link)
                  const active = isActive(href)
                  return (
                    <li key={i}>
                      <CMSLink
                        {...link}
                        appearance="inline"
                        className={cn(
                          'flex min-h-11 items-center whitespace-nowrap rounded-full px-5 text-[1.125rem] font-medium transition-colors duration-300',
                          active
                            ? 'bg-[color:var(--page-fg)] text-[color:var(--page-bg)]'
                            : 'hover:bg-white/10 opacity-85 hover:opacity-100',
                        )}
                        aria-current={active ? 'page' : undefined}
                      />
                    </li>
                  )
                })}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
              <div className="hidden items-center gap-2 md:flex">
                {actions.map(({ link }, i) => (
                  <CMSLink key={i} {...link} size="sm" icon={false} />
                ))}
              </div>
              {docked && quoteLabel ? (
                phoneNumber && (
                  <a
                    href={telHref(phoneNumber)}
                    className="btn btn-glass btn-sm !px-0 w-[3.25rem] md:hidden"
                    aria-label="Call us"
                    data-track="phone_click"
                  >
                    <PhoneIcon />
                  </a>
                )
              ) : (
                <WhatsAppAnchor
                  className="btn btn-primary btn-sm !px-0 w-[3.25rem] md:hidden"
                  aria-label="Chat with us on WhatsApp"
                >
                  <WhatsAppIcon />
                </WhatsAppAnchor>
              )}
              <button
                ref={toggleRef}
                type="button"
                className="btn btn-glass btn-sm !px-0 w-[3.25rem] xl:hidden"
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpenOn(open ? null : pathname)}
              >
                {open ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>

        <div
          id={menuId}
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
          hidden={!open}
          className="xl:hidden"
        >
          <div className={cn('shell', docked ? 'pb-3' : 'pt-3')}>
            <div
              className="glass-strong max-h-[calc(100svh-7rem)] overflow-y-auto rounded-[var(--radius-panel)] p-4"
              style={{ color: 'var(--page-fg)' }}
            >
              <ul className="flex flex-col">
                {navItems.map(({ link }, i) => (
                  <li key={i} className="border-b border-[color:var(--page-line)] last:border-0">
                    <CMSLink
                      {...link}
                      appearance="inline"
                      className="flex min-h-14 items-center px-3 text-[1.375rem] font-medium"
                    />
                  </li>
                ))}
              </ul>
              <div className="mt-4 flex flex-col gap-3">
                {actions.map(({ link }, i) => (
                  <CMSLink key={i} {...link} className="w-full" />
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>
      {open && (
        <button
          type="button"
          aria-hidden="true"
          tabIndex={-1}
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm xl:hidden"
          onClick={close}
        />
      )}
    </>
  )
}
