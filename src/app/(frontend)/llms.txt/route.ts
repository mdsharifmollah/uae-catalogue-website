import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { getServerSideURL } from '@/utilities/getURL'
import { docPath } from '@/utilities/routes'

export const revalidate = 3600

/** Plain-text summary for AI assistants (llms.txt convention). Facts come only from the CMS. */
export async function GET() {
  const base = getServerSideURL()
  const payload = await getPayload({ config: configPromise })
  const [settings, products, industries, faqs] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', depth: 0 }),
    payload.find({ collection: 'products', sort: 'order', limit: 50, depth: 0, overrideAccess: false }),
    payload.find({ collection: 'industries', sort: 'order', limit: 50, depth: 0, overrideAccess: false }),
    payload.find({ collection: 'faqs', sort: 'order', limit: 20, depth: 0 }),
  ])

  const lines = [
    `# ${settings.companyName}`,
    '',
    `> ${settings.defaultDescription || settings.tagline || ''}`,
    '',
    `Location: ${[settings.address?.locality, 'United Arab Emirates'].filter(Boolean).join(', ')}`,
    settings.serviceArea ? `Service area: ${settings.serviceArea}` : '',
    settings.email ? `Email: ${settings.email}` : '',
    settings.phoneDisplay ? `Phone / WhatsApp: ${settings.phoneDisplay}` : '',
    '',
    '## Products (sample formats)',
    ...products.docs.map((p) => `- [${p.title}](${base}${docPath('products', p.slug)}): ${p.summary}`),
    '',
    '## Industries served',
    ...industries.docs.map((i) => `- [${i.title}](${base}${docPath('industries', i.slug)}): ${i.summary}`),
    '',
    '## Frequently asked questions',
    ...faqs.docs.flatMap((f) => [`### ${f.question}`, f.answer, '']),
    '## More',
    `- [Our work](${base}/work)`,
    `- [Guides](${base}/guides)`,
    `- [Contact / request a quote](${base}/contact)`,
  ].filter((l) => l !== undefined)

  return new Response(lines.join('\n'), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  })
}
