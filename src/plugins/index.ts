import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin } from 'payload'
import { revalidateRedirects } from '@/hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'

import { getServerSideURL } from '@/utilities/getURL'
import { docPath, type RoutableCollection } from '@/utilities/routes'

const generateTitle: GenerateTitle = async ({ doc, req }) => {
  const settings = await req.payload.findGlobal({ slug: 'site-settings', depth: 0 })
  const suffix = settings?.titleSuffix || settings?.shortName || ''
  const title = (doc as { title?: string })?.title
  if (!title) return suffix
  return suffix ? `${title} | ${suffix}` : title
}

const generateURL: GenerateURL = ({ doc, collectionSlug }) => {
  const url = getServerSideURL()
  const slug = (doc as { slug?: string })?.slug
  if (!collectionSlug || !slug) return url
  return `${url}${docPath(collectionSlug as RoutableCollection, slug)}`
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages', 'posts', 'products', 'industries', 'projects'],
    overrides: {
      admin: { group: 'Settings' },
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'Old URL path, e.g. /old-page. Visitors and Google are sent to the new page (301).',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  nestedDocsPlugin({
    collections: ['categories'],
    generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
      state: false,
      country: false,
    },
    formOverrides: {
      admin: { group: 'Leads' },
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'confirmationMessage') {
            return {
              ...field,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    FixedToolbarFeature(),
                    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  ]
                },
              }),
            }
          }
          return field
        })
      },
    },
    formSubmissionOverrides: {
      labels: { singular: 'Inquiry', plural: 'Inquiries' },
      admin: {
        group: 'Leads',
        description: 'Quote requests sent from the website forms.',
      },
    },
  }),
]
