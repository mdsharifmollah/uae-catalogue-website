import Script from 'next/script'
import React from 'react'

/** GTM or GA4, configured from Site Settings. Nothing loads until an ID is entered. */
export const Analytics: React.FC<{ gtmId?: string | null; ga4Id?: string | null }> = ({ gtmId, ga4Id }) => {
  const gtm = gtmId?.match(/^GTM-[A-Z0-9]+$/) ? gtmId : null
  const ga4 = !gtm && ga4Id?.match(/^G-[A-Z0-9]+$/) ? ga4Id : null

  if (gtm) {
    return (
      <Script id="gtm" strategy="afterInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','${gtm}');`}
      </Script>
    )
  }

  if (ga4) {
    return (
      <>
        <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4}`} strategy="afterInteractive" />
        <Script id="ga4" strategy="afterInteractive">
          {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;gtag('js',new Date());gtag('config','${ga4}');`}
        </Script>
      </>
    )
  }

  return null
}
