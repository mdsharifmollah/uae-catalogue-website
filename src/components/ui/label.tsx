import { cn } from '@/utilities/ui'
import * as React from 'react'

const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ className, ...props }) => (
  <label className={cn('mb-2 block text-[1rem] font-semibold', className)} {...props} />
)

export { Label }
