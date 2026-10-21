import { postgresAdapter } from '@payloadcms/db-postgres'
import { resendAdapter } from '@payloadcms/email-resend'
import { s3Storage } from '@payloadcms/storage-s3'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import sharp from 'sharp'
import path from 'path'
import { buildConfig, PayloadRequest, type Plugin } from 'payload'
import { fileURLToPath } from 'url'

import { Categories } from './collections/Categories'
import { FAQs } from './collections/FAQs'
import { Industries } from './collections/Industries'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Products } from './collections/Products'
import { Projects } from './collections/Projects'
import { Testimonials } from './collections/Testimonials'
import { Users } from './collections/Users'
import { Footer } from './Footer/config'
import { Header } from './Header/config'
import { SiteSettings } from './globals/SiteSettings'
import { plugins } from './plugins'
import { defaultLexical } from '@/fields/defaultLexical'
import { getServerSideURL } from './utilities/getURL'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

/**
 * Media storage:
 * - Vercel Blob when BLOB_READ_WRITE_TOKEN is set (Vercel deployments)
 * - Cloudflare R2 / any S3 bucket when S3_BUCKET is set
 * - otherwise the local `public/media` folder (development)
 */
const storagePlugins: Plugin[] = process.env.BLOB_READ_WRITE_TOKEN
  ? [
      vercelBlobStorage({
        // Serve files straight from the Blob CDN instead of through the API.
        collections: { media: { disablePayloadAccessControl: true } },
        token: process.env.BLOB_READ_WRITE_TOKEN,
        // Upload from the browser directly to Blob — Vercel functions cap request bodies at 4.5 MB.
        clientUploads: true,
      }),
    ]
  : process.env.S3_BUCKET
    ? [
        s3Storage({
          collections: { media: true },
          bucket: process.env.S3_BUCKET,
          config: {
            endpoint: process.env.S3_ENDPOINT,
            region: process.env.S3_REGION || 'auto',
            forcePathStyle: true,
            credentials: {
              accessKeyId: process.env.S3_ACCESS_KEY_ID || '',
              secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || '',
            },
          },
        }),
      ]
    : []

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/BeforeLogin'],
      beforeDashboard: ['@/components/BeforeDashboard'],
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: ' — Website dashboard',
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
        { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
        { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
      ],
    },
  },
  editor: defaultLexical,
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  // Arabic-ready: add { label: 'العربية', code: 'ar', rtl: true } once Arabic copy is approved.
  localization: {
    locales: [{ label: 'English', code: 'en' }],
    defaultLocale: 'en',
    fallback: true,
  },
  collections: [Pages, Products, Industries, Projects, Posts, FAQs, Testimonials, Media, Categories, Users],
  cors: [getServerSideURL()].filter(Boolean),
  globals: [SiteSettings, Header, Footer],
  plugins: [...plugins, ...storagePlugins],
  ...(process.env.RESEND_API_KEY
    ? {
        email: resendAdapter({
          defaultFromAddress: process.env.EMAIL_FROM_ADDRESS || 'website@example.com',
          defaultFromName: process.env.EMAIL_FROM_NAME || 'Website',
          apiKey: process.env.RESEND_API_KEY,
        }),
      }
    : {}),
  secret: process.env.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true

        const secret = process.env.CRON_SECRET
        if (!secret) return false

        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${secret}`
      },
    },
    tasks: [],
  },
})
