import type { FlattenedField, Payload, PayloadRequest } from 'payload'

import content from './ar-content.json'
import { getAt, setAt, stripLocalizedRowIds } from './translatable'

type Path = (string | number)[]
type Doc = Record<string, unknown>
type Entry = {
  collection?: string
  global?: string
  by?: string
  value?: string
  strings: { path: Path; en: string; ar: string }[]
}

// Skip the site-wide revalidation hooks; they need a Next.js request and the
// deploy rebuilds every page anyway.
const context = { disableRevalidate: true }

/** Marks the rich-text blocks around a translated text node as right-to-left. */
const markRtl = (doc: Doc, path: Path) => {
  for (let i = path.length - 1; i > 0; i--) {
    const node = getAt(doc, path.slice(0, i))
    if (node && typeof node === 'object' && 'direction' in (node as Doc)) (node as Doc).direction = 'rtl'
  }
}

/** Arabic version of `doc`: only the top-level fields that hold translated text. */
const arabicData = (doc: Doc, strings: Entry['strings'], fields: FlattenedField[]) => {
  const copy = structuredClone(doc)
  const touched = new Set<string>()
  for (const s of strings) {
    // Leave a string in English if it was edited since this translation was made.
    if (getAt(doc, s.path) !== s.en) continue
    setAt(copy, s.path, s.ar)
    if (s.path.includes('root')) markRtl(copy, s.path)
    touched.add(String(s.path[0]))
  }
  const cleaned = stripLocalizedRowIds(copy, fields)
  const data: Doc = Object.fromEntries([...touched].map((key) => [key, cleaned[key]]))
  // A new Arabic row would otherwise get a field's English default value where
  // the English page has deliberately left it empty.
  for (const field of fields) {
    if (!('name' in field) || !field.localized || field.type !== 'text' || field.name in data) continue
    if ('defaultValue' in field && !doc[field.name]) data[field.name] = ''
    // A required field without a translation keeps the English text, so the update stays valid.
    else if (field.required && doc[field.name]) data[field.name] = doc[field.name]
  }
  return data
}

const applyCollection = async (payload: Payload, req: PayloadRequest, entry: Entry) => {
  const slug = entry.collection as 'pages'
  const config = payload.collections[slug]?.config
  if (!config || !entry.by) return
  const found = await payload.find({
    collection: slug,
    where: { [entry.by]: { equals: entry.value } },
    locale: 'en',
    depth: 0,
    limit: 1,
    // Media are written without the shared request (see the seed), so read them the same way.
    ...(slug === ('media' as string) ? {} : { req }),
  })
  const doc = found.docs[0] as unknown as Doc | undefined
  if (!doc) return
  const data = arabicData(doc, entry.strings, config.flattenedFields)
  if (!Object.keys(data).length) return
  if (config.versions?.drafts) data._status = 'published'
  if (slug === ('media' as string)) {
    await payload.update({ collection: slug, id: doc.id as number, locale: 'ar', depth: 0, data, context })
  } else {
    await payload.update({ collection: slug, id: doc.id as number, locale: 'ar', depth: 0, data, req, context })
  }
}

const applyGlobal = async (payload: Payload, req: PayloadRequest, entry: Entry) => {
  const slug = entry.global as 'site-settings'
  const config = payload.config.globals.find((g) => g.slug === slug)
  if (!config) return
  const doc = (await payload.findGlobal({ slug, locale: 'en', depth: 0, req })) as unknown as Doc
  const data = arabicData(doc, entry.strings, config.flattenedFields)
  if (!Object.keys(data).length) return
  await payload.updateGlobal({ slug, locale: 'ar', depth: 0, data, req, context })
}

/**
 * Arabic translation of the site content (pages, services, who we serve,
 * work, guides, FAQs, image descriptions, form labels, header, footer and
 * settings). Each document is matched by slug (or another stable field) and
 * only text still matching the English it was translated from is replaced.
 */
export const applyArabic = async (payload: Payload, req: PayloadRequest): Promise<void> => {
  for (const entry of (content as { docs: Entry[] }).docs) {
    if (entry.global) await applyGlobal(payload, req, entry)
    else await applyCollection(payload, req, entry)
  }
}
