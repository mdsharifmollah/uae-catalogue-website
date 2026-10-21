import React from 'react'

export const RequiredMark: React.FC<{ required?: boolean | null }> = ({ required }) =>
  required ? (
    <span className="text-accent">
      {' '}*<span className="sr-only"> (required)</span>
    </span>
  ) : null
