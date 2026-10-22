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

  // Pages from the first version of the site (before it focused on upholstery
  // fabric sampling), in both languages.
  const moved: [string, string][] = [
    ['/products/fabric-sample-books', '/products/swatch-books-sample-catalogues'],
    ['/products/fabric-hangers-waterfall-samples', '/products/fabric-sample-hangers'],
    ['/products/shade-cards-numbered-swatches', '/products/swatch-books-sample-catalogues'],
    ['/products/swatch-cards-header-cards', '/products'],
    ['/products/sample-boxes-presenters', '/products'],
    ['/industries/upholstery-sofa-fabrics', '/industries/furniture-manufacturers'],
    ['/industries/curtain-drapery', '/industries/curtain-furnishing-suppliers'],
    ['/industries/carpets-rugs', '/industries'],
    ['/industries/blinds', '/industries'],
    ['/industries/wallpaper-wallcoverings', '/industries'],
    ['/work/numbered-linen-shade-card', '/work'],
    ['/work/upholstery-collection-sample-book', '/work/sofa-collection-swatch-book'],
    ['/work/damask-curtain-waterfall-hangers', '/work/curtain-fabric-sample-hangers'],
    ['/work/velvet-collection-presentation-box', '/work/velvet-upholstery-sample-catalogue'],
    ['/work/wallcovering-fabric-coordinates-book', '/work'],
    ['/work/designer-material-sample-board', '/work/interior-studio-fabric-selection-book'],
    ['/guides/how-a-fabric-sample-book-is-made', '/guides/how-fabric-samples-are-made'],
    ['/guides/sample-book-vs-hanger-vs-shade-card', '/guides/sample-hangers-vs-swatch-books'],
    ['/guides/fabric-sample-book-cost-factors', '/guides/fabric-sampling-cost-factors'],
  ]
  const oldPages = moved.flatMap(([source, destination]) => [
    { source, destination, permanent: true },
    { source: `/ar${source}`, destination: `/ar${destination}`, permanent: true },
  ])

  return [internetExplorerRedirect, ...englishPrefix, ...oldPages]
}
