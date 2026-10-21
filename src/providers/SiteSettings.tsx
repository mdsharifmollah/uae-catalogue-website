'use client'

import React, { createContext, useContext } from 'react'

export type PublicSettings = {
  companyName: string
  shortName: string
  whatsappNumber: string
  whatsappDefaultMessage: string
  phoneNumber?: string | null
  phoneDisplay?: string | null
  email?: string | null
}

const SiteSettingsContext = createContext<PublicSettings | null>(null)

export const SiteSettingsProvider: React.FC<{
  children: React.ReactNode
  value: PublicSettings
}> = ({ children, value }) => (
  <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>
)

export const useSiteSettings = (): PublicSettings => {
  const ctx = useContext(SiteSettingsContext)
  if (!ctx) throw new Error('useSiteSettings must be used inside SiteSettingsProvider')
  return ctx
}
