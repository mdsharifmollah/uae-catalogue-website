export const collectionPrefixMap = {
  pages: '',
  posts: '/guides',
  products: '/products',
  industries: '/industries',
  projects: '/work',
} as const

export type RoutableCollection = keyof typeof collectionPrefixMap

/** Public path for a document. The page with slug `home` is served at `/`. */
export const docPath = (collection: RoutableCollection, slug?: string | null): string => {
  if (!slug) return collectionPrefixMap[collection] || '/'
  if (collection === 'pages' && slug === 'home') return '/'
  return `${collectionPrefixMap[collection]}/${slug}`
}
