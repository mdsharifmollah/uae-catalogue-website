import { PreviewSearchParams } from '@/app/(frontend)/next/preview/route'
import { PayloadRequest } from 'payload'

import { docPath, type RoutableCollection } from './routes'

type Props = {
  collection: RoutableCollection
  slug: string
  req: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug }: Props) => {
  if (slug === undefined || slug === null) {
    return null
  }

  // Encode to support slugs with special characters
  const encodedParams = new URLSearchParams({
    path: docPath(collection, encodeURIComponent(slug)),
    previewSecret: process.env.PREVIEW_SECRET || '',
  } satisfies PreviewSearchParams)

  return `/next/preview?${encodedParams.toString()}`
}
