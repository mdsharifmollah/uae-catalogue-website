'use client'

import React from 'react'

import { useDictionary } from '@/i18n/client'

export const RequiredMark: React.FC<{ required?: boolean | null }> = ({ required }) => {
  const t = useDictionary()
  return required ? (
    <span className="text-accent">
      {' '}*<span className="sr-only"> {t.a11y.required}</span>
    </span>
  ) : null
}
