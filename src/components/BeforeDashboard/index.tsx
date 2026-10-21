import { Banner } from '@payloadcms/ui/elements/Banner'
import React from 'react'

import { SeedButton } from './SeedButton'
import './index.scss'

const baseClass = 'before-dashboard'

const BeforeDashboard: React.FC = () => {
  return (
    <div className={baseClass}>
      <Banner className={`${baseClass}__banner`} type="success">
        <h4>Welcome to your website dashboard</h4>
      </Banner>
      <ul className={`${baseClass}__instructions`}>
        <li>
          <strong>Site Settings</strong> — company name, WhatsApp number, phone, email, address and
          opening hours. Changes appear everywhere on the site.
        </li>
        <li>
          <strong>Product formats, Industries, Our Work</strong> — add photos and text. Each item
          gets its own Google-friendly page.
        </li>
        <li>
          <strong>Pages</strong> — edit the homepage and other pages. Drag sections to reorder,
          and use the SEO tab on every page.
        </li>
        <li>
          <strong>Media</strong> — always fill in the alt text describing the photo.
        </li>
        <li>
          <strong>Inquiries</strong> — every quote request sent from the website.
        </li>
        <li>
          First time only: <SeedButton /> to load the starter content and photos.
        </li>
      </ul>
    </div>
  )
}

export default BeforeDashboard
