import { cn } from '@/utilities/ui'
import * as React from 'react'

import { fieldClass } from './input'

const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => (
  <textarea data-slot="textarea" className={cn(fieldClass, 'min-h-36 py-4 leading-relaxed', className)} {...props} />
)

export { Textarea }
