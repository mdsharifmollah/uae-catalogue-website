import type { GlobalConfig } from 'payload'

import { revalidateGlobalChange } from '@/hooks/revalidateSite'

const digitsOnly = (value: unknown) => {
  if (!value) return true
  return /^\d{8,15}$/.test(String(value))
    ? true
    : 'Use digits only in international format, without +, spaces or leading zeros (e.g. 971501234567).'
}

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site Settings',
  admin: {
    group: 'Settings',
    description:
      'Company details used across the whole website: header, footer, WhatsApp buttons, contact page and Google structured data.',
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Company',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'companyName',
                  type: 'text',
                  required: true,
                  defaultValue: 'Al Hejlah Catalogue Manufacture',
                  admin: { width: '60%' },
                },
                {
                  name: 'shortName',
                  type: 'text',
                  required: true,
                  defaultValue: 'Al Hejlah',
                  admin: {
                    width: '40%',
                    description: 'Used for the logo wordmark and the large footer word.',
                  },
                },
              ],
            },
            {
              name: 'tagline',
              type: 'textarea',
              localized: true,
              defaultValue:
                'Specialists in all kinds of catalogues: fabric sample books, waterfall hangers, shade cards and presentation boxes for textile and interior businesses.',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'logoOnDark',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    width: '50%',
                    description: 'Light logo for dark backgrounds (SVG or PNG). Optional — the name is shown if empty.',
                  },
                },
                {
                  name: 'logoOnLight',
                  type: 'upload',
                  relationTo: 'media',
                  admin: { width: '50%', description: 'Dark logo for light backgrounds.' },
                },
              ],
            },
            {
              name: 'foundingYear',
              type: 'number',
              admin: { description: 'Only fill in if verified. Used in structured data.' },
            },
          ],
        },
        {
          label: 'Contact & WhatsApp',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'whatsappNumber',
                  type: 'text',
                  required: true,
                  defaultValue: '971558493932',
                  validate: digitsOnly,
                  admin: {
                    width: '50%',
                    description: 'International format, digits only (e.g. 971501234567).',
                  },
                },
                {
                  name: 'phoneDisplay',
                  type: 'text',
                  defaultValue: '+971 55 849 3932',
                  admin: { width: '50%', description: 'How the phone number is shown on the site.' },
                },
              ],
            },
            {
              name: 'whatsappDefaultMessage',
              type: 'text',
              localized: true,
              defaultValue: "Hello, I'd like a quotation for catalogues.",
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'phoneNumber',
                  type: 'text',
                  validate: digitsOnly,
                  defaultValue: '971558493932',
                  admin: { width: '50%', description: 'For click-to-call. Digits only.' },
                },
                {
                  name: 'email',
                  type: 'email',
                  defaultValue: 'saifuliths92@gmail.com',
                  admin: { width: '50%' },
                },
              ],
            },
            {
              name: 'address',
              type: 'group',
              fields: [
                {
                  type: 'row',
                  fields: [
                    { name: 'street', type: 'text', localized: true, admin: { width: '50%' } },
                    {
                      name: 'locality',
                      type: 'text',
                      localized: true,
                      defaultValue: 'Sharjah',
                      admin: { width: '25%' },
                    },
                    {
                      name: 'region',
                      type: 'text',
                      localized: true,
                      defaultValue: 'Sharjah',
                      admin: { width: '25%' },
                    },
                  ],
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'postalCode', type: 'text', admin: { width: '25%' } },
                    {
                      name: 'countryCode',
                      type: 'text',
                      defaultValue: 'AE',
                      admin: { width: '25%' },
                    },
                    {
                      name: 'latitude',
                      type: 'number',
                      admin: { width: '25%', step: 0.000001 },
                    },
                    {
                      name: 'longitude',
                      type: 'number',
                      admin: { width: '25%', step: 0.000001 },
                    },
                  ],
                },
                {
                  name: 'mapUrl',
                  type: 'text',
                  admin: { description: 'Google Maps link to your business (opens in a new tab).' },
                },
              ],
            },
            {
              name: 'serviceArea',
              type: 'text',
              localized: true,
              defaultValue: 'Sharjah, Dubai, Ajman, Abu Dhabi and export across the GCC',
            },
            {
              name: 'openingHours',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [
                {
                  name: 'days',
                  type: 'select',
                  hasMany: true,
                  required: true,
                  options: [
                    'Monday',
                    'Tuesday',
                    'Wednesday',
                    'Thursday',
                    'Friday',
                    'Saturday',
                    'Sunday',
                  ].map((d) => ({ label: d, value: d })),
                },
                {
                  type: 'row',
                  fields: [
                    { name: 'opens', type: 'text', defaultValue: '08:00', admin: { width: '50%' } },
                    { name: 'closes', type: 'text', defaultValue: '18:00', admin: { width: '50%' } },
                  ],
                },
              ],
            },
            {
              name: 'socials',
              type: 'array',
              admin: { initCollapsed: true },
              fields: [
                {
                  type: 'row',
                  fields: [
                    {
                      name: 'platform',
                      type: 'select',
                      required: true,
                      admin: { width: '30%' },
                      options: ['Instagram', 'Facebook', 'LinkedIn', 'TikTok', 'YouTube', 'Pinterest', 'X'].map(
                        (p) => ({ label: p, value: p.toLowerCase() }),
                      ),
                    },
                    { name: 'url', type: 'text', required: true, admin: { width: '70%' } },
                  ],
                },
              ],
            },
          ],
        },
        {
          label: 'SEO & Analytics',
          fields: [
            {
              name: 'titleSuffix',
              type: 'text',
              defaultValue: 'Al Hejlah',
              admin: { description: 'Appended to page titles, e.g. "Fabric Sample Books | Al Hejlah".' },
            },
            {
              name: 'defaultDescription',
              type: 'textarea',
              localized: true,
              defaultValue:
                'All kinds of catalogues, made in Sharjah, UAE: fabric sample books, waterfall hangers, numbered shade cards and sample boxes for textile and interior brands.',
            },
            { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
            {
              type: 'row',
              fields: [
                {
                  name: 'gtmId',
                  type: 'text',
                  admin: { width: '33%', description: 'Google Tag Manager, e.g. GTM-XXXXXXX' },
                },
                {
                  name: 'ga4Id',
                  type: 'text',
                  admin: { width: '33%', description: 'GA4 measurement ID, e.g. G-XXXXXXX (skip if using GTM)' },
                },
                {
                  name: 'googleSiteVerification',
                  type: 'text',
                  admin: { width: '34%', description: 'Search Console HTML-tag verification code' },
                },
              ],
            },
          ],
        },
        {
          label: 'Mobile bar',
          fields: [
            {
              name: 'mobileBarEnabled',
              type: 'checkbox',
              defaultValue: true,
              label: 'Show the WhatsApp quote button in the bottom bar on phones',
            },
            {
              name: 'mobileBarLabel',
              type: 'text',
              localized: true,
              defaultValue: 'Get a quote',
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateGlobalChange],
  },
}
