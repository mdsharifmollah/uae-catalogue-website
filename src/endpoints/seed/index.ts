import type { CollectionSlug, Payload, PayloadRequest } from 'payload'

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import {
  faqs,
  guides,
  homeHero,
  iconFiles,
  industries,
  mediaFiles,
  otherCataloguesFaq,
  privacyPolicy,
  processSteps,
  products,
  projects,
} from './content'
import { doc, h2, p } from './lexical'

const dirname = path.dirname(fileURLToPath(import.meta.url))
const ASSETS = path.resolve(dirname, 'assets')

const collections: CollectionSlug[] = [
  'pages',
  'posts',
  'projects',
  'products',
  'industries',
  'faqs',
  'testimonials',
  'categories',
  'forms',
  'form-submissions',
  'redirects',
  'media',
]

const ctx = { disableRevalidate: true }

/**
 * Loads the starter website: photos, product formats, industries, demo
 * projects, FAQs, guides, pages and settings. Safe to run again — it clears
 * content first (users are kept).
 */
export const seed = async ({ payload, req }: { payload: Payload; req: PayloadRequest }): Promise<void> => {
  payload.logger.info('Seeding database...')

  payload.logger.info('— Clearing content...')
  for (const collection of collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  /* ---------------------------------------------------------------- Media */
  payload.logger.info('— Uploading photos and 3D icons...')
  const media: Record<string, number> = {}
  const upload = async (file: string, alt: string, dir = ASSETS) => {
    const data = await fs.readFile(path.join(dir, file))
    // No shared `req` here: cloud-storage plugins flag `req.context.skipCloudStorage`
    // after an upload, which would silently skip every following file.
    const doc = await payload.create({
      collection: 'media',
      data: { alt },
      file: { data, mimetype: 'image/webp', name: file, size: data.length },
      context: { ...ctx },
    })
    media[file] = doc.id
  }
  for (const [file, alt] of Object.entries(mediaFiles)) await upload(file, alt)
  for (const [file, alt] of Object.entries(iconFiles)) await upload(file, alt, path.join(ASSETS, 'icons'))

  /* ---------------------------------------------------------------- FAQs */
  payload.logger.info('— FAQs...')
  const faqIds: Record<string, number> = {}
  for (const [i, f] of [faqs[0], otherCataloguesFaq, ...faqs.slice(1)].entries()) {
    const d = await payload.create({
      collection: 'faqs',
      data: { question: f.question, answer: f.answer, category: f.category, order: (i + 1) * 10 },
      req,
      context: ctx,
    })
    faqIds[f.key] = d.id
  }

  /* ---------------------------------------------------------------- Industries */
  payload.logger.info('— Industries...')
  const industryIds: Record<string, number> = {}
  for (const [i, ind] of industries.entries()) {
    const d = await payload.create({
      collection: 'industries',
      data: {
        title: ind.title,
        slug: ind.slug,
        tag: ind.tag,
        summary: ind.summary,
        heroImage: media[ind.image],
        needs: ind.needs.map((n) => ({ ...n })),
        body: ind.body,
        faqs: [faqIds.custom, faqIds.quote],
        order: (i + 1) * 10,
        cardTone: ind.cardTone,
        _status: 'published',
        meta: {
          title: `${ind.title} Sample Books & Catalogues | Al Hejlah`,
          description: ind.summary,
          image: media[ind.image],
        },
      },
      req,
      context: ctx,
    })
    industryIds[ind.key] = d.id
  }

  /* ---------------------------------------------------------------- Products */
  payload.logger.info('— Product formats...')
  const productIds: Record<string, number> = {}
  for (const prod of products) {
    const d = await payload.create({
      collection: 'products',
      data: {
        title: prod.title,
        cardTitle: prod.cardTitle,
        slug: prod.slug,
        summary: prod.summary,
        heroImage: media[prod.hero],
        gallery: prod.gallery.map((g) => ({ image: media[g] })),
        body: prod.body,
        specs: prod.specs.map((s) => ({ ...s })),
        useCases: prod.useCases.map((text) => ({ text })),
        whatsappMessage: prod.whatsappMessage,
        industries: prod.industries.map((k) => industryIds[k]),
        faqs: prod.faqs.map((k) => faqIds[k]),
        order: prod.order,
        cardTone: prod.cardTone,
        _status: 'published',
        meta: {
          title: `${prod.title} Manufacturer in UAE | Al Hejlah`,
          description: prod.summary,
          image: media[prod.hero],
        },
      },
      req,
      context: ctx,
    })
    productIds[prod.key] = d.id
  }
  // Related products: the next two formats in the list
  const keys = products.map((x) => x.key)
  for (const [i, key] of keys.entries()) {
    await payload.update({
      collection: 'products',
      id: productIds[key],
      data: { relatedProducts: [keys[(i + 1) % keys.length], keys[(i + 2) % keys.length]].map((k) => productIds[k]) },
      req,
      context: ctx,
    })
  }

  /* ---------------------------------------------------------------- Projects (demo) */
  payload.logger.info('— Demo projects...')
  const now = Date.now()
  for (const [i, pr] of projects.entries()) {
    await payload.create({
      collection: 'projects',
      data: {
        title: pr.title,
        slug: pr.slug,
        summary: pr.summary,
        coverImage: media[pr.cover],
        gallery: pr.gallery.map((g) => ({ image: media[g] })),
        specs: pr.specs.map((s) => ({ ...s })),
        products: pr.products.map((k) => productIds[k]),
        industries: pr.industries.map((k) => industryIds[k]),
        body: doc(p(pr.summary)),
        featured: true,
        publishedAt: new Date(now - i * 86400000).toISOString(),
        _status: 'published',
        meta: { description: pr.summary, image: media[pr.cover] },
      },
      req,
      context: ctx,
    })
  }

  /* ---------------------------------------------------------------- Guides */
  payload.logger.info('— Guides...')
  const category = await payload.create({
    collection: 'categories',
    data: { title: 'Sample book guides', slug: 'sample-book-guides' },
    req,
    context: ctx,
  })
  const guideIds: number[] = []
  for (const [i, g] of guides.entries()) {
    const d = await payload.create({
      collection: 'posts',
      data: {
        title: g.title,
        slug: g.slug,
        excerpt: g.excerpt,
        heroImage: media[g.image],
        content: g.content,
        categories: [category.id],
        relatedProducts: g.relatedProducts.map((k) => productIds[k]),
        publishedAt: new Date(now - (i + 1) * 3 * 86400000).toISOString(),
        _status: 'published',
        meta: { title: `${g.title} | Al Hejlah`, description: g.excerpt, image: media[g.image] },
      },
      req,
      context: ctx,
    })
    guideIds.push(d.id)
  }
  for (const [i, id] of guideIds.entries()) {
    await payload.update({
      collection: 'posts',
      id,
      data: { relatedPosts: guideIds.filter((_, j) => j !== i) },
      req,
      context: ctx,
    })
  }

  /* ---------------------------------------------------------------- Quote form */
  payload.logger.info('— Quote form...')
  const quoteForm = await payload.create({
    collection: 'forms',
    data: {
      title: 'Quote request',
      submitButtonLabel: 'Send quote request',
      confirmationType: 'message',
      confirmationMessage: doc(
        h2('Thank you — we have your request.'),
        p('Our team will reply shortly. For the fastest answer, continue the conversation on WhatsApp.'),
      ),
      fields: [
        { blockType: 'text', name: 'name', label: 'Your name', required: true, width: 50 },
        { blockType: 'text', name: 'company', label: 'Company', required: false, width: 50 },
        { blockType: 'text', name: 'phone', label: 'Phone / WhatsApp', required: true, width: 50 },
        { blockType: 'email', name: 'email', label: 'Email', required: false, width: 50 },
        {
          blockType: 'select',
          name: 'productType',
          label: 'Sample format',
          required: true,
          width: 50,
          options: [
            ...products.map((x) => ({ label: x.title, value: x.slug })),
            { label: 'Not sure yet', value: 'not-sure' },
          ],
        },
        { blockType: 'text', name: 'quantity', label: 'Estimated quantity', required: false, width: 50 },
        {
          blockType: 'textarea',
          name: 'message',
          label: 'Tell us about your collection (fabrics, size, finish)',
          required: false,
          width: 100,
        },
      ],
      emails: [
        {
          emailTo: '{{email}}',
          subject: 'We received your quote request',
          message: doc(p('Thank you for contacting us. We will reply shortly.')),
        },
        {
          // Notifies the business; replying goes straight to the customer.
          emailTo: 'saifuliths92@gmail.com',
          replyTo: '{{email}}',
          subject: 'New quote request: {{name}} ({{company}})',
          message: doc(p('New quote request from the website:'), p('{{*:table}}')),
        },
      ],
    },
    req,
    context: ctx,
  })

  /* ---------------------------------------------------------------- Pages */
  payload.logger.info('— Pages...')
  const wa = (label: string, message?: string, appearance: 'primary' | 'glass' = 'primary') => ({
    link: { type: 'whatsapp' as const, label, whatsappMessage: message, appearance },
  })
  const url = (label: string, href: string, appearance: 'primary' | 'glass' | 'outline' | 'link' = 'glass') => ({
    link: { type: 'custom' as const, url: href, label, appearance },
  })

  const capabilityItems = [
    { icon: media['icon-3d-scissor.webp'], title: 'Precise swatch cutting', text: 'Consistent swatch sizes with pinked or clean-finished edges.' },
    { icon: media['icon-3d-color-palette.webp'], title: 'Colour arrangement & numbering', text: 'Organised by colour, pattern or article — numbered for easy re-ordering.' },
    { icon: media['icon-3d-notebook.webp'], title: 'Sample books & binding', text: 'Ring, screw-post or hardcover books in standard or custom sizes.' },
    { icon: media['icon-3d-pin.webp'], title: 'Hangers & mounting', text: 'Header hangers and waterfall cards for rails, stands and walls.' },
    { icon: media['icon-3d-gift-box.webp'], title: 'Boxes & presenters', text: 'Presentation boxes and folders for launches and key clients.' },
    { icon: media['icon-3d-crown.webp'], title: 'Branding & finishing', text: 'Your logo, article details and composition on covers and labels.' },
  ]

  const pages = [
    {
      title: 'Home',
      slug: 'home',
      meta: {
        title: 'Fabric Sample Book Manufacturer in UAE | Al Hejlah',
        description:
          'Custom fabric sample books, waterfall hangers, numbered shade cards and sample boxes for textile and interior businesses. Made in Sharjah, UAE — request a quote on WhatsApp.',
        image: media['draped-bronze-fabric-texture.webp'],
      },
      hero: {
        type: 'catalog',
        tone: 'ink',
        eyebrow: homeHero.eyebrow,
        heading: 'Fabric Sample Books & Catalogues, *Crafted* in the UAE',
        subheading: homeHero.subheading,
        links: [wa('Request a quote on WhatsApp'), url('Explore our work', '/work')],
        trustItems: [{ text: 'Custom formats' }, { text: 'Organised, numbered swatches' }, { text: 'Professional presentation' }],
        media: media['draped-bronze-fabric-texture.webp'],
        fanProducts: ['shade', 'books', 'hangers', 'cards', 'boxes'].map((k) => productIds[k]),
      },
      layout: [
        {
          blockType: 'formatGrid',
          tone: 'ivory',
          eyebrow: 'What we manufacture',
          heading: 'Every sample *format* your collection needs',
          intro:
            'From bound sample books to numbered shade cards — we prepare your fabrics in the format your buyers find easiest to browse and order from.',
          showWhatsapp: true,
          enableLink: true,
          link: { type: 'custom', url: '/products', label: 'All product formats', appearance: 'glass' },
        },
        {
          blockType: 'processStory',
          tone: 'charcoal',
          eyebrow: 'How it’s made',
          heading: 'From fabric roll to *finished* sample book',
          intro: 'Six careful steps turn your fabric range into a catalogue buyers enjoy using.',
          steps: processSteps.map((s) => ({ ...s, image: media[s.image] })),
          enableLink: true,
          link: { type: 'whatsapp', label: 'Start your project', appearance: 'primary' },
        },
        {
          blockType: 'workGallery',
          tone: 'sand',
          eyebrow: 'Selected work',
          heading: 'Real samples. *Professional* presentation.',
          intro: 'Sample books, hanging swatches and numbered collections — every format built to present colour clearly.',
          layout: 'horizontal',
          limit: 8,
          enableLink: true,
          link: { type: 'custom', url: '/work', label: 'View all work', appearance: 'glass' },
        },
        {
          blockType: 'industriesCarousel',
          tone: 'ivory',
          eyebrow: 'Industries',
          heading: 'Made for brands that *sell* fabric',
          intro: 'Each market presents materials differently. We build the format that fits yours.',
        },
        {
          blockType: 'capabilities',
          tone: 'linen',
          layout: 'cards',
          eyebrow: 'Customisation',
          heading: 'Your collection, *your* presentation format',
          intro: 'Tell us what you need — every project is planned around your fabrics and how you sell them.',
          items: capabilityItems,
        },
        {
          blockType: 'capabilities',
          tone: 'charcoal',
          layout: 'checklist',
          eyebrow: 'Why work with us',
          heading: 'A practical, *dependable* sampling partner',
          media: media['folded-fabric-stack-neutral.webp'],
          items: [
            { title: 'Many formats under one roof', text: 'Books, hangers, shade cards, swatch cards and boxes.' },
            { title: 'Organised, numbered collections', text: 'Layouts that make choosing and re-ordering simple.' },
            { title: 'Customised to your project', text: 'Sizes, layouts and finishes planned around your range.' },
            { title: 'Direct WhatsApp communication', text: 'Talk to the team, share photos and get answers quickly.' },
            { title: 'Based in Sharjah, UAE', text: 'Close to the textile and interior businesses we serve.' },
          ],
          links: [wa('Discuss your project')],
        },
        {
          blockType: 'faq',
          tone: 'ivory',
          eyebrow: 'FAQ',
          heading: 'Questions buyers *ask* us',
          intro: 'Can’t find your answer? Message us on WhatsApp.',
          category: 'all',
          enableLink: true,
          link: { type: 'whatsapp', label: 'Ask a question', appearance: 'primary' },
        },
        {
          blockType: 'archive',
          tone: 'sand',
          eyebrow: 'Guides',
          heading: 'Plan your next *sample* catalogue',
          populateBy: 'collection',
          relationTo: 'posts',
          limit: 3,
        },
        {
          blockType: 'cta',
          tone: 'bronze',
          eyebrow: 'Request a quote',
          heading: 'Let’s discuss your fabric *sample* catalogue',
          text: 'Send your requirements, reference photos and estimated quantity. We will suggest the right format and share a quotation.',
          links: [wa('Request a quote on WhatsApp'), url('Send project details', '/contact#quote')],
          showContactDetails: true,
        },
      ],
    },
    {
      title: 'How We Make Fabric Sample Books',
      slug: 'process',
      meta: {
        title: 'How Fabric Sample Books Are Made | Our Process | Al Hejlah',
        description:
          'See how we turn your fabric range into sample books, hangers and shade cards: cutting, arranging, numbering, mounting, binding and branding.',
        image: media['tailor-scissors-cutting-swatches.webp'],
      },
      hero: {
        type: 'page',
        tone: 'ink',
        eyebrow: 'Our process',
        heading: 'How a fabric sample book is *made*',
        subheading: 'A clear, step-by-step process — from your fabric rolls to a finished, branded sample catalogue.',
        links: [wa('Start your project')],
        media: media['tailor-scissors-cutting-swatches.webp'],
      },
      layout: [
        {
          blockType: 'processStory',
          tone: 'charcoal',
          eyebrow: 'Step by step',
          heading: 'Six steps to a *finished* catalogue',
          steps: processSteps.map((s) => ({ ...s, image: media[s.image] })),
        },
        {
          blockType: 'capabilities',
          tone: 'linen',
          layout: 'cards',
          eyebrow: 'Options',
          heading: 'What we can *customise*',
          items: capabilityItems,
        },
        {
          blockType: 'faq',
          tone: 'ivory',
          eyebrow: 'FAQ',
          heading: 'Production *questions*',
          category: 'all',
        },
        {
          blockType: 'cta',
          tone: 'bronze',
          heading: 'Ready to *start*?',
          text: 'Share your fabric range and preferred format — we will guide you through the rest.',
          links: [wa('Request a quote on WhatsApp')],
          showContactDetails: true,
        },
      ],
    },
    {
      title: 'About',
      slug: 'about',
      meta: {
        title: 'About Us | Fabric Sample Catalogue Manufacturer, Sharjah | Al Hejlah',
        description:
          'Al Hejlah Catalogue Manufacture prepares fabric sample books, hangers, shade cards and sample boxes for textile and interior businesses from Sharjah, UAE.',
        image: media['textile-sampling-workshop.webp'],
      },
      hero: {
        type: 'page',
        tone: 'ink',
        eyebrow: 'About us',
        heading: 'A Sharjah workshop for fabric *sample* presentation',
        subheading:
          'We help textile and interior businesses present their fabric collections professionally — in formats designed for how buyers actually choose.',
        links: [wa('Talk to our team'), url('See our work', '/work')],
        media: media['textile-sampling-workshop.webp'],
      },
      layout: [
        {
          blockType: 'mediaText',
          tone: 'ivory',
          eyebrow: 'What we do',
          heading: 'We make fabric *easier* to choose',
          richText: doc(
            p(
              'A buyer’s first contact with your fabric is often a sample. We organise, cut, number and present your collection so that first impression is clear and professional.',
            ),
            p(
              'We work with fabric traders, upholstery and sofa manufacturers, curtain and blind businesses, carpet suppliers and interior brands.',
            ),
          ),
          media: media['thread-spools-workshop.webp'],
          imagePosition: 'left',
          pills: [{ text: 'Sharjah, UAE' }, { text: 'Custom formats' }],
        },
        {
          blockType: 'capabilities',
          tone: 'charcoal',
          layout: 'checklist',
          eyebrow: 'How we work',
          heading: 'Clear, *honest* and practical',
          media: media['designer-choosing-fabric-samples.webp'],
          items: [
            { title: 'Listen first', text: 'We start from how your customers buy — then suggest a format.' },
            { title: 'Show before we make', text: 'Layouts and specifications are agreed before production.' },
            { title: 'Communicate directly', text: 'WhatsApp, phone or email — whichever suits you.' },
          ],
        },
        {
          blockType: 'cta',
          tone: 'bronze',
          heading: 'Let’s talk about your *collection*',
          links: [wa('Message us on WhatsApp'), url('Contact page', '/contact')],
          showContactDetails: true,
        },
      ],
    },
    {
      title: 'Contact',
      slug: 'contact',
      meta: {
        title: 'Contact & Request a Quote | Fabric Sample Books UAE | Al Hejlah',
        description:
          'Request a quotation for fabric sample books, hangers, shade cards or sample boxes. WhatsApp, phone or email our Sharjah team.',
        image: media['designer-choosing-fabric-samples.webp'],
      },
      hero: {
        type: 'minimal',
        tone: 'ink',
        eyebrow: 'Contact',
        heading: 'Request a *quotation*',
        subheading:
          'Send your requirements, reference photos and estimated quantity. WhatsApp is the fastest way to reach us.',
        links: [wa('Chat on WhatsApp')],
      },
      layout: [
        {
          blockType: 'formBlock',
          tone: 'sand',
          eyebrow: 'Quote request',
          heading: 'Tell us about your *project*',
          intro: 'A few details help us suggest the right format and prepare an accurate quotation.',
          form: quoteForm.id,
          showContactPanel: true,
        },
        {
          blockType: 'faq',
          tone: 'ivory',
          eyebrow: 'Before you ask',
          heading: 'Ordering *questions*',
          category: 'ordering',
        },
      ],
    },
    {
      title: 'Products',
      slug: 'products',
      meta: {
        title: 'Fabric Sample Books, Hangers & Shade Cards | Products | Al Hejlah',
        description:
          'Fabric sample books, waterfall hangers, numbered shade cards, swatch cards and sample boxes manufactured in Sharjah, UAE.',
      },
      hero: {
        type: 'minimal',
        tone: 'ink',
        eyebrow: 'What we manufacture',
        heading: 'Fabric sample *formats* for every collection',
        subheading:
          'Sample books, waterfall hangers, numbered shade cards, swatch cards and presentation boxes — made in Sharjah for textile and interior brands.',
      },
      layout: [],
    },
    {
      title: 'Industries',
      slug: 'industries',
      meta: {
        title: 'Industries We Serve | Upholstery, Curtain, Carpet & Blind Sample Books | Al Hejlah',
        description:
          'Fabric sample books and catalogues for upholstery, curtain, carpet, blind and wallpaper businesses in the UAE.',
      },
      hero: {
        type: 'minimal',
        tone: 'ink',
        eyebrow: 'Industries we serve',
        heading: 'Sample catalogues built for *how* your industry sells',
        subheading:
          'Upholstery, curtains, carpets, blinds and wallcoverings — each market presents materials differently.',
      },
      layout: [],
    },
    {
      title: 'Our Work',
      slug: 'work',
      meta: {
        title: 'Our Work | Fabric Sample Books & Swatch Displays | Al Hejlah',
        description: 'Fabric sample books, waterfall hangers and numbered shade cards we have produced.',
      },
      hero: {
        type: 'minimal',
        tone: 'ink',
        eyebrow: 'Portfolio',
        heading: 'Real samples. *Professional* presentation.',
        subheading: 'A selection of sample books, hanging swatches and numbered fabric collections.',
      },
      layout: [],
    },
    {
      title: 'Guides',
      slug: 'guides',
      meta: {
        title: 'Fabric Sample Book Guides | Formats, Sizes & Costs | Al Hejlah',
        description: 'Practical guides to fabric sample book formats, sizes, numbering and costs.',
      },
      hero: {
        type: 'minimal',
        tone: 'ink',
        eyebrow: 'Guides',
        heading: 'Fabric sample books, *explained*',
        subheading: 'Practical guidance for brands planning their next sample catalogue.',
      },
      layout: [],
    },
    {
      title: 'Privacy Policy',
      slug: 'privacy-policy',
      meta: { title: 'Privacy Policy | Al Hejlah', description: 'How we handle information sent through this website.' },
      hero: { type: 'minimal', tone: 'ink', heading: 'Privacy policy' },
      layout: [
        {
          blockType: 'content',
          tone: 'ivory',
          columns: [
            {
              size: 'full',
              richText: privacyPolicy,
            },
          ],
        },
      ],
    },
  ]

  const pageIds: Record<string, number> = {}
  for (const page of pages) {
    const d = await payload.create({
      collection: 'pages',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: { ...(page as any), _status: 'published' },
      req,
      context: ctx,
    })
    pageIds[page.slug] = d.id
  }

  /* ---------------------------------------------------------------- Globals */
  payload.logger.info('— Settings, header and footer...')
  const ref = (relationTo: 'pages' | 'products' | 'industries', value: number, label: string) => ({
    link: { type: 'reference' as const, reference: { relationTo, value }, label },
  })

  await payload.updateGlobal({
    slug: 'site-settings',
    data: {
      companyName: 'Al Hejlah Catalogue Manufacture',
      shortName: 'Al Hejlah',
      tagline:
        'Specialists in all kinds of catalogues: fabric sample books, waterfall hangers, shade cards and presentation boxes for textile and interior businesses.',
      whatsappNumber: '971558493932',
      phoneDisplay: '+971 55 849 3932',
      phoneNumber: '971558493932',
      email: 'saifuliths92@gmail.com',
      whatsappDefaultMessage: "Hello, I'd like a quotation for catalogues.",
      address: { locality: 'Sharjah', region: 'Sharjah', countryCode: 'AE' },
      serviceArea: 'Sharjah, Dubai, Ajman, Abu Dhabi and the wider UAE',
      openingHours: [
        { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '18:00' },
      ],
      titleSuffix: 'Al Hejlah',
      defaultDescription:
        'All kinds of catalogues, made in Sharjah, UAE: fabric sample books, waterfall hangers, numbered shade cards and sample boxes for textile and interior brands.',
      defaultOgImage: media['draped-bronze-fabric-texture.webp'],
      mobileBarEnabled: true,
      mobileBarLabel: 'Get a quote',
    },
    req,
    context: ctx,
  })

  await payload.updateGlobal({
    slug: 'header',
    data: {
      navItems: [
        { link: { type: 'custom', url: '/products', label: 'Products' } },
        { link: { type: 'custom', url: '/industries', label: 'Industries' } },
        { link: { type: 'custom', url: '/work', label: 'Our Work' } },
        ref('pages', pageIds.process, 'Process'),
        ref('pages', pageIds.about, 'About'),
      ],
      actions: [
        { link: { ...ref('pages', pageIds.contact, 'Contact').link, appearance: 'glass' } },
        { link: { type: 'whatsapp', label: 'WhatsApp us', appearance: 'primary' } },
      ],
    },
    req,
    context: ctx,
  })

  await payload.updateGlobal({
    slug: 'footer',
    data: {
      ctaHeading: '',
      columns: [
        {
          title: 'Products',
          links: products.map((x) => ref('products', productIds[x.key], x.title)),
        },
        {
          title: 'Industries',
          links: industries.map((x) => ref('industries', industryIds[x.key], x.title)),
        },
        {
          title: 'Company',
          links: [
            ref('pages', pageIds.about, 'About'),
            ref('pages', pageIds.process, 'Our process'),
            { link: { type: 'custom', url: '/work', label: 'Our work' } },
            { link: { type: 'custom', url: '/guides', label: 'Guides' } },
            ref('pages', pageIds.contact, 'Contact'),
          ],
        },
      ],
      legalLinks: [ref('pages', pageIds['privacy-policy'], 'Privacy policy')],
      showWordmark: true,
    },
    req,
    context: ctx,
  })

  payload.logger.info('Seeded database successfully!')
}
