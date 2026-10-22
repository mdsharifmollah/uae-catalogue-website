import React from 'react'

/**
 * Renders editor text where words wrapped in *asterisks* become the italic
 * serif accent. "From Fabric Rolls to *Premium* Sample Collections"
 */
export const AccentText: React.FC<{ text?: string | null }> = ({ text }) => {
  if (!text) return null
  const parts = text.split(/(\*[^*]+\*)/g).filter(Boolean)
  return (
    <>
      {parts.map((part, i) =>
        part.startsWith('*') && part.endsWith('*') ? (
          <em key={i} className="accent-word">
            {part.slice(1, -1)}
          </em>
        ) : (
          <React.Fragment key={i}>{part}</React.Fragment>
        ),
      )}
    </>
  )
}

/** Plain-text version (for meta tags, aria labels). */
export const stripAccent = (text?: string | null) => (text || '').replace(/\*/g, '')
