'use client'

import * as React from 'react'
import { useFormContext } from 'react-hook-form'

import { useDictionary } from '@/i18n/client'

export const Error = ({ name }: { name: string }) => {
  const {
    formState: { errors },
  } = useFormContext()
  const t = useDictionary()
  return (
    <p id={`${name}-error`} role="alert" className="mt-2 text-[1rem] font-medium text-[#c2410c]">
      {(errors[name]?.message as string) || t.form.required}
    </p>
  )
}
