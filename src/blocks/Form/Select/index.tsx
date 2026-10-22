import type { SelectField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import { fieldClass } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/utilities/ui'
import React from 'react'

import { Error } from '../Error'
import { RequiredMark } from '../RequiredMark'
import { Width } from '../Width'
import { useDictionary } from '@/i18n/client'

/** Native select: accessible, keyboard friendly, and uses the phone's own picker. */
export const Select: React.FC<
  SelectField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, errors, label, options, required, width, defaultValue, register }) => {
  const t = useDictionary()
  return (
  <Width width={width}>
    <Label htmlFor={name}>
      {label}
      <RequiredMark required={required} />
    </Label>
    <div className="relative">
      <select
        id={name}
        defaultValue={defaultValue || ''}
        className={cn(fieldClass, 'h-14 appearance-none pe-12')}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={errors[name] ? `${name}-error` : undefined}
        {...register(name, { required })}
      >
        <option value="" disabled>
          {t.form.choose}
        </option>
        {options.map(({ label: optionLabel, value }) => (
          <option key={value} value={value}>
            {optionLabel}
          </option>
        ))}
      </select>
      <svg aria-hidden="true" className="pointer-events-none absolute end-5 top-1/2 -translate-y-1/2" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="m6 9 6 6 6-6" />
      </svg>
    </div>
    {errors[name] && <Error name={name} />}
  </Width>
  )
}
