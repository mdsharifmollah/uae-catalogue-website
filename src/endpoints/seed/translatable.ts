/**
 * Finds every translatable string in a Payload document, using the
 * collection's own field config (only fields that are localized, directly or
 * through a localized parent, and that hold human-readable text).
 * Used to export English copy and to apply Arabic translations.
 */
import type { FlattenedField } from 'payload'

/** Text fields that hold codes, names or machine values, never prose. */
const SKIP = new Set([
  'id',
  'slug',
  'url',
  'name',
  'blockName',
  'value',
  'email',
  'emailTo',
  'cc',
  'bcc',
  'replyTo',
  'emailFrom',
  'gtmId',
  'ga4Id',
  'googleSiteVerification',
  'whatsappNumber',
  'phoneNumber',
  'phoneDisplay',
  'opens',
  'closes',
  'mapUrl',
  'countryCode',
  'postalCode',
  'clientName',
  'platform',
  'titleSuffix',
  'companyName',
  'shortName',
])

export type Entry = { path: (string | number)[]; text: string }

type Row = Record<string, unknown>

const lexicalTexts = (node: unknown, path: (string | number)[], out: Entry[]) => {
  if (!node || typeof node !== 'object') return
  const n = node as Row
  if (n.type === 'text' && typeof n.text === 'string' && n.text.trim()) {
    out.push({ path: [...path, 'text'], text: n.text })
  }
  if (Array.isArray(n.children)) {
    n.children.forEach((child, i) => lexicalTexts(child, [...path, 'children', i], out))
  }
}

/** Collects translatable strings with their path inside `doc`. */
export const collectStrings = (
  doc: Row,
  fields: FlattenedField[],
  out: Entry[] = [],
  path: (string | number)[] = [],
  localizedParent = false,
): Entry[] => {
  for (const field of fields) {
    if (!('name' in field) || !(field.name in doc)) continue
    const value = doc[field.name]
    if (value == null) continue
    const localized = localizedParent || Boolean((field as { localized?: boolean }).localized)
    const here = [...path, field.name]
    switch (field.type) {
      case 'text':
      case 'textarea':
        if (localized && !SKIP.has(field.name) && typeof value === 'string' && value.trim()) {
          out.push({ path: here, text: value })
        }
        break
      case 'richText':
        if (localized) lexicalTexts((value as Row).root, [...here, 'root'], out)
        break
      case 'group':
      case 'tab':
        collectStrings(value as Row, field.flattenedFields, out, here, localized)
        break
      case 'array':
        ;(value as Row[]).forEach((row, i) => collectStrings(row, field.flattenedFields, out, [...here, i], localized))
        break
      case 'blocks':
        ;(value as Row[]).forEach((row, i) => {
          const block = field.blocks.find((b) => b.slug === row.blockType)
          if (block) collectStrings(row, block.flattenedFields, out, [...here, i], localized)
        })
        break
      default:
        break
    }
  }
  return out
}

/**
 * Prepares a document for writing in another locale: rows of localized arrays
 * and blocks get new IDs there (each locale stores its own rows), so their
 * `id`s are removed. Rows of shared arrays keep their IDs.
 */
export const stripLocalizedRowIds = (doc: Row, fields: FlattenedField[], localizedParent = false): Row => {
  const out: Row = { ...doc }
  for (const field of fields) {
    if (!('name' in field) || !(field.name in doc) || doc[field.name] == null) continue
    const localized = localizedParent || Boolean((field as { localized?: boolean }).localized)
    const value = doc[field.name]
    if (field.type === 'group' || field.type === 'tab') {
      out[field.name] = stripLocalizedRowIds(value as Row, field.flattenedFields, localized)
    } else if (field.type === 'array' || field.type === 'blocks') {
      out[field.name] = (value as Row[]).map((row) => {
        const sub =
          field.type === 'array'
            ? field.flattenedFields
            : field.blocks.find((b) => b.slug === row.blockType)?.flattenedFields || []
        const cleaned = stripLocalizedRowIds(row, sub, localized)
        if (localized) delete cleaned.id
        return cleaned
      })
    }
  }
  return out
}

export const getAt = (obj: unknown, path: (string | number)[]): unknown =>
  path.reduce<unknown>((o, k) => (o == null ? o : (o as Row)[k as string]), obj)

export const setAt = (obj: unknown, path: (string | number)[], value: unknown) => {
  let o = obj as Row
  for (const k of path.slice(0, -1)) o = o[k as string] as Row
  o[path[path.length - 1] as string] = value
}
