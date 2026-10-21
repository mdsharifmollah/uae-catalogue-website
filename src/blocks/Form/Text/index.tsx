import type { TextField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import React from 'react'

import { Error } from '../Error'
import { RequiredMark } from '../RequiredMark'
import { Width } from '../Width'

const autoComplete = (name: string) =>
  /phone|whatsapp|mobile/i.test(name) ? 'tel' : /company/i.test(name) ? 'organization' : /name/i.test(name) ? 'name' : undefined

export const Text: React.FC<
  TextField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => (
  <Width width={width}>
    <Label htmlFor={name}>
      {label}
      <RequiredMark required={required} />
    </Label>
    <Input
      defaultValue={defaultValue}
      id={name}
      type={/phone|whatsapp|mobile/i.test(name) ? 'tel' : 'text'}
      autoComplete={autoComplete(name)}
      aria-invalid={Boolean(errors[name])}
      aria-describedby={errors[name] ? `${name}-error` : undefined}
      {...register(name, { required })}
    />
    {errors[name] && <Error name={name} />}
  </Width>
)
