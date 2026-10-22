import type { EmailField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { RequiredMark } from '../RequiredMark'
import { Width } from '../Width'
import { useDictionary } from '@/i18n/client'

export const Email: React.FC<
  EmailField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => {
  const t = useDictionary()
  return (
  <Width width={width}>
    <Label htmlFor={name}>
      {label}
      <RequiredMark required={required} />
    </Label>
    <Input
      defaultValue={defaultValue}
      id={name}
      type="email"
      autoComplete="email"
      inputMode="email"
      dir="ltr"
      aria-invalid={Boolean(errors[name])}
      aria-describedby={errors[name] ? `${name}-error` : undefined}
      {...register(name, {
        pattern: { value: /^\S[^\s@]*@\S+\.\S+$/, message: t.form.invalidEmail },
        required,
      })}
    />
    {errors[name] && <Error name={name} />}
  </Width>
  )
}
