'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useCallback, useEffect, useId, useRef, useState } from 'react'

import type { Header, Media as MediaType } from '@/payload-types'

import { CMSLink, resolveHref } from '@/components/Link'
import { CloseIcon, MenuIcon, WhatsAppIcon } from '@/components/site/icons'
import { Wordmark } from '@/components/site/Wordmark'
import { WhatsAppAnchor } from '@/components/site/WhatsAppAnchor'
import { cn } from '@/utilities/ui'

interface HeaderClientProps {
  data: Header
  name: string
  logo?: MediaType | number | null
  logoLight?: MediaType | number | null
}

/**
 * Sticky glass header. Hides while scrolling down, reappears as soon as the
 * visitor scrolls up, and stays fully visible at the top of the page.
 */
export const HeaderClient: React.FC<HeaderClientProps> = ({ data, name, logo }) => {
  const pathname = usePathname()
  const [hidden, setHidden] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const lastY = useRef(0)
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
        const delta = y - lastY.current
        setScrolled(y > 24)
        if (y < 120) setHidden(false)
        else if (delta > 6) setHidden(true)
        else if (delta < -6) setHidden(false)
        lastY.current = y
        ticking = false
      })
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const close = useCallback(() => {
    setOpen(false)
    toggleRef.current?.focus()
  }, [])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

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
          'fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[var(--ease-out-expo)] motion-reduce:transition-none',
          hidden && !open ? '-translate-y-[calc(100%+3rem)]' : 'translate-y-0',
        )}
      >
        <div className="shell pt-3 md:pt-4">
          <div
            className={cn(
              'flex items-center justify-between gap-4 rounded-full px-3 py-2 max-[359px]:gap-2 max-[359px]:px-2 md:px-4 transition-[background-color,box-shadow,backdrop-filter] duration-500',
              scrolled || open ? 'glass-strong' : 'bg-transparent',
            )}
            style={{ color: 'var(--page-fg)' }}
          >
            <Link
              href="/"
              className="flex min-h-12 items-center rounded-full px-3 max-[359px]:px-1.5"
              aria-label={`${name} — home`}
            >
              <Wordmark name={name} logo={logo} />
            </Link>

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
              <WhatsAppAnchor
                className="btn btn-primary btn-sm !px-0 w-[3.25rem] md:hidden"
                aria-label="Chat with us on WhatsApp"
              >
                <WhatsAppIcon />
              </WhatsAppAnchor>
              <button
                ref={toggleRef}
                type="button"
                className="btn btn-glass btn-sm !px-0 w-[3.25rem] xl:hidden"
                aria-expanded={open}
                aria-controls={menuId}
                aria-label={open ? 'Close menu' : 'Open menu'}
                onClick={() => setOpen((o) => !o)}
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
          <div className="shell pt-3">
            <div className="glass-strong rounded-[var(--radius-panel)] p-4" style={{ color: 'var(--page-fg)' }}>
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
