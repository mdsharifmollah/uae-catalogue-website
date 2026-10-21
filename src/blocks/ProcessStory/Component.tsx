import React from 'react'

import type { ProcessStoryBlock as Props } from '@/payload-types'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Section, type Tone } from '@/components/site/Section'
import { SectionIntro } from '@/components/site/SectionIntro'
import { ProcessStoryMotion } from './Motion'

/**
 * Scrollytelling: numbered steps scroll past while a sticky frame swaps the
 * photo for each step. On phones each step simply shows its own photo.
 */
export const ProcessStoryBlock: React.FC<Props & { id?: string | null }> = ({
  id,
  tone,
  eyebrow,
  heading,
  intro,
  steps,
  enableLink,
  link,
}) => {
  if (!steps?.length) return null
  const total = String(steps.length).padStart(2, '0')

  return (
    <Section tone={(tone as Tone) || 'charcoal'} id={id ? `block-${id}` : undefined}>
      <div className="shell">
        <SectionIntro eyebrow={eyebrow} heading={heading} intro={intro} />

        <ProcessStoryMotion>
          <div className="mt-14 grid gap-10 md:mt-20 lg:grid-cols-[1.08fr_1fr] lg:gap-20">
            {/* Sticky media frame (desktop) */}
            <div className="relative hidden lg:block">
              <div className="sticky top-[calc(var(--header-h)+2rem)] h-[calc(100svh-var(--header-h)-4rem)] max-h-[46rem]">
                <div className="relative h-full overflow-hidden rounded-[var(--radius-panel)]">
                  {steps.map((step, i) => (
                    <div
                      key={i}
                      data-story-media={i}
                      className="absolute inset-0"
                      style={{ clipPath: i === 0 ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)' }}
                    >
                      {step.image && typeof step.image === 'object' && (
                        <Media
                          resource={step.image}
                          fill
                          size="50vw"
                          imgClassName="object-cover scale-[1.04]"
                          pictureClassName="absolute inset-0"
                          htmlElement={null}
                        />
                      )}
                    </div>
                  ))}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
                  <div className="glass absolute bottom-5 left-5 flex items-center gap-4 rounded-full py-2 pl-2 pr-5 text-[#f4f1ea]">
                    <span className="grid size-11 place-items-center rounded-full bg-[#c9a66b] font-semibold text-[#121311]">
                      <span data-story-counter>01</span>
                    </span>
                    <span className="text-[1rem] font-medium">of {total} steps</span>
                  </div>
                  <div className="pointer-events-none absolute inset-0 rounded-[inherit] ring-1 ring-inset ring-white/15" />
                </div>
              </div>
            </div>

            {/* Steps */}
            <ol className="relative flex flex-col">
              <span aria-hidden="true" className="absolute left-[1.6rem] top-4 bottom-4 hidden w-px bg-[color:var(--line)] md:block">
                <span data-story-progress className="absolute inset-x-0 top-0 h-full origin-top scale-y-0 bg-[color:var(--accent)]" />
              </span>
              {steps.map((step, i) => (
                <li
                  key={i}
                  data-story-step={i}
                  className="relative grid gap-5 py-8 md:grid-cols-[3.25rem_1fr] md:gap-8 lg:min-h-[62vh] lg:content-center lg:py-16"
                >
                  <span
                    data-story-num
                    className="relative z-10 grid size-[3.25rem] place-items-center rounded-full border bg-[color:var(--page-bg,#121311)] text-[1.125rem] font-semibold text-accent transition-[background-color,color,box-shadow] duration-500 [&.is-active]:border-transparent [&.is-active]:bg-[color:var(--accent)] [&.is-active]:text-[#121311] [&.is-active]:shadow-[0_0_0_6px_color-mix(in_srgb,var(--accent)_22%,transparent)]"
                  >
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div className="flex flex-col gap-4">
                    <h3 className="text-h3">{step.title}</h3>
                    <p className="text-body max-w-xl text-muted">{step.text}</p>
                    {step.image && typeof step.image === 'object' && (
                      <div className="relative mt-3 aspect-[4/3] overflow-hidden rounded-[var(--radius-card)] lg:hidden">
                        <Media
                          resource={step.image}
                          fill
                          size="100vw"
                          imgClassName="object-cover"
                          pictureClassName="absolute inset-0"
                          htmlElement={null}
                        />
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </ProcessStoryMotion>

        {enableLink && link && (
          <div className="mt-10 flex justify-center">
            <CMSLink {...link} size="lg" />
          </div>
        )}
      </div>
    </Section>
  )
}
