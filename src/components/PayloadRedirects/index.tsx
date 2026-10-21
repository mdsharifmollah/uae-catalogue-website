import type React from 'react'

import configPromise from '@payload-config'
import { notFound, redirect } from 'next/navigation'
import { getPayload } from 'payload'

import { getCachedRedirects } from '@/utilities/getRedirects'
import { docPath, type RoutableCollection } from '@/utilities/routes'

interface Props {
  disableNotFound?: boolean
  url: string
}

/* SSR-based dynamic redirects managed in Settings → Redirects (301). */
export const PayloadRedirects: React.FC<Props> = async ({ disableNotFound, url }) => {
  const redirects = await getCachedRedirects()()
  const redirectItem = redirects.find((r) => r.from === url || r.from === `${url}/`)

  if (redirectItem) {
    if (redirectItem.to?.url) redirect(redirectItem.to.url)

    const ref = redirectItem.to?.reference
    if (ref) {
      const collection = ref.relationTo as RoutableCollection
      let slug: string | null | undefined
      if (typeof ref.value === 'object') {
        slug = (ref.value as { slug?: string | null })?.slug
      } else {
        const payload = await getPayload({ config: configPromise })
        const doc = await payload.findByID({ collection, id: ref.value, depth: 0, disableErrors: true })
        slug = (doc as { slug?: string | null } | null)?.slug
      }
      if (slug) redirect(docPath(collection, slug))
    }
  }

  if (disableNotFound) return null

  notFound()
}
