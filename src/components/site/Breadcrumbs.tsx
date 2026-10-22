import { Link } from '@/i18n/client'
import React from 'react'

import { JsonLd } from '@/components/seo/JsonLd'
import { breadcrumbSchema } from '@/utilities/schema'
import { localizePath } from '@/i18n/config'
import { getDictionary, getLocale } from '@/i18n/server'

export type Crumb = { name: string; path: string }

/** Visible breadcrumb trail + BreadcrumbList structured data. */
export const Breadcrumbs = async ({ items }: { items: Crumb[] }) => {
  const [t, locale] = await Promise.all([getDictionary(), getLocale()])
  const all = [{ name: t.common.home, path: '/' }, ...items]
  return (
    <>
      <nav aria-label={t.a11y.breadcrumb} className="hero-rise">
        <ol className="flex flex-wrap items-center gap-2 text-[1rem] text-muted">
          {all.map((c, i) => {
            const last = i === all.length - 1
            return (
              <li key={c.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-fg">
                    {c.name}
                  </span>
                ) : (
                  <Link href={c.path} className="hover:text-accent">
                    {c.name}
                  </Link>
                )}
                {!last && <span aria-hidden="true">/</span>}
              </li>
            )
          })}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(all.map((c) => ({ ...c, path: localizePath(locale, c.path) })))} />
    </>
  )
}
