'use client'

import { cn } from '@/utilities/ui'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva('btn disabled:pointer-events-none disabled:opacity-50', {
  variants: {
    variant: {
      primary: 'btn-primary',
      default: 'btn-primary',
      glass: 'btn-glass',
      outline: 'btn-outline',
      link: 'btn-link',
      ghost: 'btn-link',
    },
    size: {
      default: '',
      sm: 'btn-sm',
      lg: 'btn-lg',
      clear: '',
      icon: 'btn-sm !px-0 w-[var(--btn-h)]',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'default',
  },
})

export interface ButtonProps
  extends React.ComponentProps<'button'>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button: React.FC<ButtonProps> = ({ asChild = false, className, size, variant, ...props }) => {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
}

export { Button, buttonVariants }
