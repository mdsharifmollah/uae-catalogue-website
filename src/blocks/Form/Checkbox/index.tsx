import type { CheckboxField } from '@payloadcms/plugin-form-builder/types'
import type { FieldErrorsImpl, FieldValues, UseFormRegister } from 'react-hook-form'

import React from 'react'

import { Error } from '../Error'
import { RequiredMark } from '../RequiredMark'
import { Width } from '../Width'

export const Checkbox: React.FC<
  CheckboxField & {
    errors: Partial<FieldErrorsImpl>
    register: UseFormRegister<FieldValues>
  }
> = ({ name, defaultValue, errors, label, register, required, width }) => (
  <Width width={width}>
    <label htmlFor={name} className="flex min-h-11 cursor-pointer items-start gap-3 text-[1.0625rem]">
      <input
        id={name}
        type="checkbox"
        defaultChecked={Boolean(defaultValue)}
        className="mt-1 size-5 shrink-0 accent-[#a78659]"
        {...register(name, { required })}
      />
      <span>
        {label}
        <RequiredMark required={required} />
      </span>
    </label>
    {errors[name] && <Error name={name} />}
  </Width>
)
