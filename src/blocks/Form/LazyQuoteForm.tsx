'use client'
import dynamic from 'next/dynamic'

// react-hook-form and the field components are split into their own chunk, so
// they only load on pages that actually render a form (still server-rendered there).
export const QuoteForm = dynamic(() => import('./QuoteForm').then((m) => m.QuoteForm))
