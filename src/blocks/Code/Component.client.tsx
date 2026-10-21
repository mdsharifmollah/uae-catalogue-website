'use client'
import dynamic from 'next/dynamic'

// prism-react-renderer is split into its own chunk, so it only loads on pages
// that actually render a code block (still server-rendered there).
export const Code = dynamic(() => import('./Highlighted').then((m) => m.Highlighted))
