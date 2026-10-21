'use client'

import * as React from 'react'
import { useFormContext } from 'react-hook-form'

export const Error = ({ name }: { name: string }) => {
  const {
    formState: { errors },
  } = useFormContext()
  return (
    <p id={`${name}-error`} role="alert" className="mt-2 text-[1rem] font-medium text-[#c2410c]">
      {(errors[name]?.message as string) || 'Please fill in this field.'}
    </p>
  )
}
