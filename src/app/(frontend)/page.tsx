import type { Metadata } from 'next'

import PageTemplate, { generateMetadata as generatePageMetadata } from './[slug]/page'

export default PageTemplate

export async function generateMetadata(): Promise<Metadata> {
  const meta = await generatePageMetadata({ params: Promise.resolve({ slug: 'home' }) })
  // Home keeps the full brand title unless an SEO title is set.
  return { ...meta, title: meta.title && typeof meta.title === 'object' ? meta.title : undefined }
}
