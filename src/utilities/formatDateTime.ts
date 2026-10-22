import type { Locale } from '@/i18n/config'

/** "20 Oct 2026" / "20 أكتوبر 2026" — unambiguous for UAE and international readers. */
export const formatDateTime = (timestamp: string, locale: Locale = 'en'): string => {
  const date = timestamp ? new Date(timestamp) : new Date()
  // Arabic keeps Western digits, as is usual on UAE business sites.
  return date.toLocaleDateString(locale === 'ar' ? 'ar-AE-u-nu-latn' : 'en-GB', {
    day: 'numeric',
    month: locale === 'ar' ? 'long' : 'short',
    year: 'numeric',
    timeZone: 'Asia/Dubai',
  })
}
