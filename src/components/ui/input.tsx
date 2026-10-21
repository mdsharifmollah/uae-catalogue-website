import { cn } from '@/utilities/ui'
import * as React from 'react'

export const fieldClass =
  'w-full min-w-0 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] px-5 text-[1.125rem] text-[color:var(--fg)] placeholder:text-[color:var(--muted)] transition-[border-color,box-shadow] duration-300 hover:border-[color:color-mix(in_srgb,var(--fg)_35%,transparent)] focus-visible:border-[color:var(--accent)] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[color:color-mix(in_srgb,var(--accent)_25%,transparent)] aria-invalid:border-[#c2410c] disabled:cursor-not-allowed disabled:opacity-50'

const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = ({ className, type, ...props }) => (
  <input data-slot="input" className={cn(fieldClass, 'h-14', className)} type={type} {...props} />
)

export { Input }
