/* Tiny builders for Lexical rich-text JSON used by the seed. */

type Node = Record<string, unknown>

const text = (value: string, format = 0): Node => ({
  type: 'text',
  text: value,
  format,
  detail: 0,
  mode: 'normal',
  style: '',
  version: 1,
})

/** Supports **bold** spans inside a string. */
const inline = (value: string): Node[] =>
  value
    .split(/(\*\*[^*]+\*\*)/g)
    .filter(Boolean)
    .map((part) => (part.startsWith('**') ? text(part.slice(2, -2), 1) : text(part)))

const block = (type: string, children: Node[], extra: Node = {}): Node => ({
  type,
  children,
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
  ...extra,
})

export const p = (value: string) => block('paragraph', inline(value), { textFormat: 0, textStyle: '' })
export const h2 = (value: string) => block('heading', inline(value), { tag: 'h2' })
export const h3 = (value: string) => block('heading', inline(value), { tag: 'h3' })
export const ul = (items: string[]) =>
  block(
    'list',
    items.map((item, i) => block('listitem', inline(item), { value: i + 1 })),
    { listType: 'bullet', start: 1, tag: 'ul' },
  )
export const ol = (items: string[]) =>
  block(
    'list',
    items.map((item, i) => block('listitem', inline(item), { value: i + 1 })),
    { listType: 'number', start: 1, tag: 'ol' },
  )

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const doc = (...children: Node[]): any => ({
  root: {
    type: 'root',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  },
})
