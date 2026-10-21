/** Builds a wa.me deep link. `number` must be digits only, international format. */
export const whatsappHref = (number?: string | null, message?: string | null): string => {
  const digits = (number || '').replace(/\D/g, '')
  const base = `https://wa.me/${digits}`
  return message ? `${base}?text=${encodeURIComponent(message)}` : base
}

export const telHref = (number?: string | null) => `tel:+${(number || '').replace(/\D/g, '')}`
