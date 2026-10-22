import type { NextConfig } from 'next'

export const redirects: NextConfig['redirects'] = async () => {
  const internetExplorerRedirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header' as const,
        key: 'user-agent',
        value: '(.*Trident.*)', // all ie browsers
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)', // all pages except the incompatibility page
  }

  // English is served without a prefix, so /en/... is a duplicate of the canonical URL.
  const englishPrefix = [
    { source: '/en', destination: '/', permanent: true },
    { source: '/en/:path*', destination: '/:path*', permanent: true },
  ]

  return [internetExplorerRedirect, ...englishPrefix]
}
