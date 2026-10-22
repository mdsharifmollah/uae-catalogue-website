'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'

import { ArrowUpRight, WhatsAppIcon } from '@/components/site/icons'
import { WhatsAppAnchor } from '@/components/site/WhatsAppAnchor'
import { Link, useDictionary } from '@/i18n/client'
import { cn } from '@/utilities/ui'

export type ShowcaseItem = {
  id: number | string
  title: string
  summary?: string | null
  href: string
  quoteMessage?: string | null
  /** The photo, rendered on the server (fills its slide). */
  image: React.ReactNode
}

/** How long each service stays on screen, in ms (also drives the progress bars). */
const INTERVAL = 6000

/**
 * Home hero photo showcase: the services crossfade with a slow zoom, a glass
 * caption carries the quote button, and tabs under the frame show progress.
 * It pauses on hover, on keyboard focus, off screen and with the pause button;
 * with reduced motion nothing moves on its own (the tabs still switch).
 */
export const HeroShowcase: React.FC<{ items: ShowcaseItem[]; tags?: [string, string] }> = ({ items, tags }) => {
  const t = useDictionary()
  const rootRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [playing, setPlaying] = useState(true)
  const [held, setHeld] = useState(false)
  const [visible, setVisible] = useState(true)
  const [still, setStill] = useState(false)
  // The slow zoom starts after hydration, so the first photo zooms too.
  const [ready, setReady] = useState(false)

  // The other photos wait until the page has loaded, so they never compete with it.
  const [loadRest, setLoadRest] = useState(false)
  const count = items.length

  useEffect(() => {
    const id = requestAnimationFrame(() => setReady(true))
    const start = () => setLoadRest(true)
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('load', start)
    }
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setStill(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  // Off screen (or in a background tab) the slideshow waits.
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), { threshold: 0.2 })
    io.observe(el)
    const onVisibility = () => setVisible(document.visibilityState === 'visible')
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [])

  // Pointer parallax: the frame tilts a little and the tags drift the other way.
  useEffect(() => {
    const el = rootRef.current
    if (!el || still || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    let frame = 0
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect()
        const x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1))
        const y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1))
        el.style.setProperty('--px', x.toFixed(3))
        el.style.setProperty('--py', y.toFixed(3))
      })
    }
    const onLeave = () => {
      cancelAnimationFrame(frame)
      el.style.setProperty('--px', '0')
      el.style.setProperty('--py', '0')
    }
    const section = el.closest('section') || el
    section.addEventListener('pointermove', onMove as EventListener, { passive: true })
    section.addEventListener('pointerleave', onLeave)
    return () => {
      cancelAnimationFrame(frame)
      section.removeEventListener('pointermove', onMove as EventListener)
      section.removeEventListener('pointerleave', onLeave)
    }
  }, [still])

  const go = useCallback((i: number) => setActive(((i % count) + count) % count), [count])
  const running = playing && !held && visible && !still && count > 1
  const item = items[active]

  if (!count) return null

  return (
    <div
      ref={rootRef}
      className={cn('hero-showcase relative mx-auto w-full max-w-[34rem] lg:max-w-none', ready && 'is-ready')}
      role="region"
      aria-roledescription="carousel"
      aria-label={t.a11y.showcase}
      onMouseEnter={() => setHeld(true)}
      onMouseLeave={() => setHeld(false)}
      onFocus={() => setHeld(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setHeld(false)
      }}
    >
      {tags && (
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-20 hidden md:block">
          <span className="showcase-tag hero-tag absolute -start-7 top-[7%] -rotate-6" style={{ ['--tag' as string]: '#5e8f86' }}>
            {tags[0]}
          </span>
          <span className="showcase-tag hero-tag absolute -end-5 top-[24%] rotate-3" style={{ ['--tag' as string]: '#c46b5f', animationDelay: '-3s' }}>
            {tags[1]}
          </span>
        </div>
      )}

      <div className="showcase-frame relative aspect-[4/5] overflow-hidden lg:aspect-auto lg:h-[clamp(26rem,calc(100svh-16rem),40rem)] rounded-[var(--radius-panel)] bg-[#1b1c19] shadow-[0_40px_90px_-40px_rgba(0,0,0,0.85)] ring-1 ring-white/10">
        {items.map((it, i) => (
          <div
            key={it.id}
            className={cn('showcase-slide absolute inset-0', i === active && 'is-active')}
            aria-hidden={i !== active}
          >
            {(i === 0 || i === active || loadRest) && it.image}
          </div>
        ))}
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_top,rgba(18,19,17,0.92)_0%,rgba(18,19,17,0.35)_38%,transparent_62%)]" />

        <div key={item.id} className="showcase-caption glass-strong absolute inset-x-3 bottom-3 rounded-[calc(var(--radius-panel)-0.5rem)] p-4 sm:inset-x-4 sm:bottom-4 sm:p-5">
          <p className="text-[0.9375rem] font-medium tabular-nums text-muted">
            <span dir="ltr">
              {String(active + 1).padStart(2, '0')} / {String(count).padStart(2, '0')}
            </span>
          </p>
          <p className="mt-1 text-[1.375rem] font-semibold leading-tight tracking-tight sm:text-[1.625rem]">{item.title}</p>
          {item.summary && (
            <p className="mt-2 line-clamp-2 text-[1rem] leading-relaxed text-muted max-sm:hidden">{item.summary}</p>
          )}
          <div className="mt-4 grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:items-center">
            <WhatsAppAnchor
              message={item.quoteMessage || t.common.quoteMessageFor(item.title)}
              className="btn btn-primary btn-sm !whitespace-nowrap max-sm:w-full max-sm:!gap-1.5 max-sm:!px-3 max-sm:!text-[1rem]"
              aria-label={t.common.askQuoteFor(item.title)}
            >
              <WhatsAppIcon size={18} className="shrink-0" />
              {t.common.getAQuote}
            </WhatsAppAnchor>
            <Link href={item.href} className="btn btn-glass btn-sm !whitespace-nowrap max-sm:w-full max-sm:!px-3 max-sm:!text-[1rem]">
              {t.common.viewFormat}
              <ArrowUpRight size={16} className="max-sm:hidden" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-start gap-3">
        <ul className="grid flex-1 gap-3" style={{ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` }}>
          {items.map((it, i) => (
            <li key={it.id}>
              <button
                type="button"
                onClick={() => go(i)}
                aria-pressed={i === active}
                aria-label={t.a11y.showSlide(it.title)}
                className={cn(
                  'group flex min-h-11 w-full flex-col gap-2 rounded-lg pt-1 text-start text-[0.9375rem] leading-snug transition-opacity duration-300',
                  i === active ? 'opacity-100' : 'opacity-60 hover:opacity-90',
                )}
              >
                <span className="relative block h-[3px] w-full overflow-hidden rounded-full bg-white/15">
                  <span
                    className={cn(
                      'showcase-progress absolute inset-0 origin-[left_center] rounded-full bg-[#c9a66b] rtl:origin-[right_center]',
                      i < active && 'is-done',
                      i === active && (still || count < 2 ? 'is-done' : 'is-running'),
                    )}
                    style={{ animationDuration: `${INTERVAL}ms`, animationPlayState: running ? 'running' : 'paused' }}
                    onAnimationEnd={() => go(active + 1)}
                  />
                </span>
                <span className="line-clamp-2 font-medium max-sm:hidden">{it.title}</span>
              </button>
            </li>
          ))}
        </ul>
        {count > 1 && !still && (
          <button
            type="button"
            onClick={() => setPlaying((p) => !p)}
            aria-label={playing ? t.a11y.pause : t.a11y.play}
            className="btn btn-glass btn-sm !min-h-11 !px-0 w-11 shrink-0"
          >
            {playing ? (
              <svg width={14} height={14} viewBox="0 0 14 14" fill="currentColor" aria-hidden="true">
                <rect x="2" y="1" width="3.5" height="12" rx="1" />
                <rect x="8.5" y="1" width="3.5" height="12" rx="1" />
              </svg>
            ) : (
              <svg width={14} height={14} viewBox="0 0 14 14" fill="currentColor" aria-hidden="true" className="rtl:-scale-x-100">
                <path d="M3 1.5v11a.8.8 0 0 0 1.2.7l9-5.5a.8.8 0 0 0 0-1.4l-9-5.5A.8.8 0 0 0 3 1.5Z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  )
}
