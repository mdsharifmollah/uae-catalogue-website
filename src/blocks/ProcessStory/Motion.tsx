'use client'

import React, { useRef } from 'react'

import { useMotion } from '@/lib/gsap'

/** Drives the sticky media frame, step counter and progress rail. */
export const ProcessStoryMotion: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null)

  useMotion(
    ({ gsap, ScrollTrigger }) => {
      const root = ref.current
      if (!root) return
      const steps = gsap.utils.toArray<HTMLElement>('[data-story-step]', root)
      const media = gsap.utils.toArray<HTMLElement>('[data-story-media]', root)
      const nums = gsap.utils.toArray<HTMLElement>('[data-story-num]', root)
      const counter = root.querySelector<HTMLElement>('[data-story-counter]')
      const progress = root.querySelector<HTMLElement>('[data-story-progress]')
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      let active = 0

      const setActive = (index: number) => {
        if (index === active) return
        const forward = index > active
        media.forEach((m, i) => {
          if (i === index) {
            gsap.fromTo(
              m,
              { clipPath: forward ? 'inset(100% 0% 0% 0%)' : 'inset(0% 0% 100% 0%)', zIndex: 2 },
              { clipPath: 'inset(0% 0% 0% 0%)', duration: reduce ? 0 : 1.05, ease: 'expo.out', overwrite: true },
            )
            const img = m.querySelector('img')
            if (img && !reduce) gsap.fromTo(img, { scale: 1.14 }, { scale: 1.04, duration: 1.4, ease: 'expo.out' })
          } else {
            gsap.set(m, { zIndex: i === active ? 1 : 0 })
            if (i !== active) gsap.set(m, { clipPath: 'inset(100% 0% 0% 0%)' })
          }
        })
        active = index
        if (counter) counter.textContent = String(index + 1).padStart(2, '0')
        nums.forEach((n, i) => n.classList.toggle('is-active', i <= index))
      }

      nums[0]?.classList.add('is-active')

      steps.forEach((step, i) => {
        ScrollTrigger.create({
          trigger: step,
          start: 'top 55%',
          end: 'bottom 55%',
          onToggle: (self) => self.isActive && setActive(i),
        })
        // GSAP arrives after load: never re-hide steps that are already in view.
        if (!reduce && step.getBoundingClientRect().top > window.innerHeight * 0.8) {
          gsap.from(step.querySelectorAll('h3, p'), {
            y: 30,
            opacity: 0,
            duration: 1,
            ease: 'expo.out',
            stagger: 0.08,
            scrollTrigger: { trigger: step, start: 'top 80%', once: true },
          })
        }
      })

      if (progress) {
        gsap.to(progress, {
          scaleY: 1,
          ease: 'none',
          scrollTrigger: {
            trigger: steps[0],
            endTrigger: steps[steps.length - 1],
            start: 'top 55%',
            end: 'bottom 55%',
            scrub: true,
          },
        })
      }
    },
    { scope: ref },
  )

  return (
    <div ref={ref} className="process-story">
      {children}
    </div>
  )
}
