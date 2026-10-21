import React from 'react'

/** Renders one or more JSON-LD objects. Nulls are skipped. */
export const JsonLd: React.FC<{ data: (object | null | undefined)[] | object | null | undefined }> = ({ data }) => {
  const items = (Array.isArray(data) ? data : [data]).filter(Boolean)
  if (!items.length) return null
  return (
    <>
      {items.map((item, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Escape "<" so content can never close the script tag.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(item).replace(/</g, '\\u003c') }}
        />
      ))}
    </>
  )
}
