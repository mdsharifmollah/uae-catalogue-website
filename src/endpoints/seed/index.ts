import type { CollectionSlug, Payload, PayloadRequest } from 'payload'

import fs from 'fs/promises'
import path from 'path'
import { fileURLToPath } from 'url'

import { applyArabic } from './arabic'
import { faqs, guides, iconFiles, industries, mediaFiles, privacyPolicy, processSteps, products, projects } from './content'
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
  'redirects',
]

const ctx = { disableRevalidate: true }

/**
 * Loads the website content in English and Arabic: services, who we serve,
 * example projects, FAQs, guides, pages and settings. Safe to run again — it
 * replaces the content (users and enquiries are kept, and photos already in
 * the media library are reused rather than uploaded twice).
 */
export const seed = async ({
  payload,
  req,
  clearSubmissions = false,
}: {
  payload: Payload
  req: PayloadRequest
  /** Also delete the enquiries sent through the quote form. */
  clearSubmissions?: boolean
}): Promise<void> => {
  payload.logger.info('Seeding database...')

  /* ---------------------------------------------------------------- Media */
  payload.logger.info('— Photos and 3D icons...')
  const media: Record<string, number> = {}
  const existing = await payload.find({ collection: 'media', depth: 0, limit: 1000, pagination: false, locale: 'en', req })
  const byFilename = new Map(existing.docs.map((d) => [d.filename, d.id]))
  const upload = async (file: string, alt: string, dir = ASSETS) => {
    const found = byFilename.get(file)
    if (found) {
      // Inside the shared transaction: outside it, this write would wait on the
      // migration's own locks and never finish.
      await payload.update({ collection: 'media', id: found, data: { alt }, locale: 'en', depth: 0, req, context: ctx })
      media[file] = found
      return
    }
    // New files go without the shared `req`: cloud-storage plugins flag
    // `req.context.skipCloudStorage` after an upload, which would silently skip
    // every following file.
    const data = await fs.readFile(path.join(dir, file))
    const created = await payload.create({
      collection: 'media',
      data: { alt },
      file: { data, mimetype: 'image/webp', name: file, size: data.length },
      context: { ...ctx },
    })
    media[file] = created.id
  }
  for (const [file, alt] of Object.entries(mediaFiles)) await upload(file, alt)
  for (const [file, alt] of Object.entries(iconFiles)) await upload(file, alt, path.join(ASSETS, 'icons'))

  payload.logger.info('— Clearing content...')
  for (const collection of clearSubmissions ? [...collections, 'form-submissions' as const] : collections) {
    await payload.db.deleteMany({ collection, req, where: {} })
    if (payload.collections[collection].config.versions) {
      await payload.db.deleteVersions({ collection, req, where: {} })
    }
  }

  /* ---------------------------------------------------------------- FAQs */
  payload.logger.info('— FAQs...')
  const faqIds: Record<string, number> = {}
  for (const [i, f] of faqs.entries()) {
    const d = await payload.create({
      collection: 'faqs',
      data: { question: f.question, answer: f.answer, category: f.category, order: (i + 1) * 10 },
      req,
      context: ctx,
    })
    faqIds[f.key] = d.id
  }

  /* ---------------------------------------------------------------- Who we serve */
  payload.logger.info('— Who we serve...')
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
          title: `Fabric Samples for ${ind.title} | Al Hejlah`,
          description: ind.summary,
          image: media[ind.image],
        },
      },
      req,
      context: ctx,
    })
    industryIds[ind.key] = d.id
  }

  /* ---------------------------------------------------------------- Services */
  payload.logger.info('— Services...')
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
        industries: industries
          .filter((ind) => (ind.products as readonly string[]).includes(prod.key))
          .map((ind) => industryIds[ind.key]),
        faqs: prod.faqs.map((k) => faqIds[k]),
        order: prod.order,
        cardTone: prod.cardTone,
        _status: 'published',
        meta: {
          title: `${prod.title} in Sharjah & Dubai, UAE | Al Hejlah`,
          description: prod.summary,
          image: media[prod.hero],
        },
      },
      req,
      context: ctx,
    })
    productIds[prod.key] = d.id
  }
  // Related services: the other two
  const keys = products.map((x) => x.key)
  for (const key of keys) {
    await payload.update({
      collection: 'products',
      id: productIds[key],
      data: { relatedProducts: keys.filter((k) => k !== key).map((k) => productIds[k]) },
      req,
      context: ctx,
    })
  }

  /* ---------------------------------------------------------------- Projects (examples) */
  payload.logger.info('— Example projects...')
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
    data: { title: 'Fabric sampling guides', slug: 'fabric-sampling-guides' },
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
        { blockType: 'text', name: 'company', label: 'Company name', required: true, width: 50 },
        { blockType: 'text', name: 'name', label: 'Contact person', required: true, width: 50 },
        { blockType: 'text', name: 'phone', label: 'Phone / WhatsApp', required: true, width: 50 },
        { blockType: 'email', name: 'email', label: 'Email', required: false, width: 50 },
        {
          blockType: 'select',
          name: 'productType',
          label: 'Required product',
          required: true,
          width: 50,
          options: [
            ...products.map((x) => ({ label: x.title, value: x.slug })),
            { label: 'Not sure yet', value: 'not-sure' },
          ],
        },
        { blockType: 'text', name: 'quantity', label: 'Quantity', required: false, width: 50 },
        { blockType: 'text', name: 'sampleSize', label: 'Sample size', required: false, width: 50 },
        { blockType: 'text', name: 'deadline', label: 'Deadline', required: false, width: 50 },
        {
          blockType: 'textarea',
          name: 'message',
          label: 'Project details (fabrics, number of colours, how the samples will be used)',
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

  const steps = processSteps.map((s) => ({ ...s, image: media[s.image] }))

  // Verified benefits only — no capacity or turnaround claims.
  const whyUs = [
    { icon: media['icon-3d-scissor.webp'], title: 'Cut to your specification', text: 'Swatch sizes, layouts and quantities planned around your collection.' },
    { icon: media['icon-3d-tick.webp'], title: 'Consistent, clean swatches', text: 'Every piece cut to the same size and finished neatly.' },
    { icon: media['icon-3d-color-palette.webp'], title: 'Organised colour by colour', text: 'Sorted the way your customers browse, so choosing is easy.' },
    { icon: media['icon-3d-shield.webp'], title: 'Checked before delivery', text: 'Each hanger and swatch book is checked before it is packed.' },
    { icon: media['icon-3d-chat-bubble.webp'], title: 'Direct WhatsApp contact', text: 'Talk to the team, share photos and get answers quickly.' },
    { icon: media['icon-3d-map-pin.webp'], title: 'Based in Sharjah, UAE', text: 'Close to the furniture and textile businesses we serve.' },
  ]

  const options = [
    { icon: media['icon-3d-scissor.webp'], title: 'Swatch size', text: 'Swatches and strips cut to the size you need.' },
    { icon: media['icon-3d-color-palette.webp'], title: 'Sorting', text: 'Colour-wise, by article or by collection.' },
    { icon: media['icon-3d-pin.webp'], title: 'Sample hangers', text: 'For rails, stands and showroom walls.' },
    { icon: media['icon-3d-notebook.webp'], title: 'Swatch books', text: 'Collections organised page by page.' },
    { icon: media['icon-3d-gift-box.webp'], title: 'Quantity', text: 'From a few sets to a full dealer network.' },
    { icon: media['icon-3d-tick.webp'], title: 'Quality check', text: 'Order, alignment and edges checked before packing.' },
  ]

  const pages = [
    {
      title: 'Home',
      slug: 'home',
      meta: {
        title: 'Fabric Swatch Book Manufacturers UAE | Al Hejlah',
        description:
          'Fabric swatch cutting, sample hangers and swatch books for furniture makers, fabric wholesalers and interior brands. Upholstery sampling in Sharjah, UAE.',
        image: media['draped-bronze-fabric-texture.webp'],
      },
      hero: {
        type: 'catalog',
        tone: 'ink',
        eyebrow: 'Upholstery Fabric Sampling · Sharjah, UAE',
        heading: 'From Fabric Rolls to *Premium* Sample Collections',
        subheading:
          'We transform upholstery fabrics into organised, professional sample hangers and swatch books that help your customers explore colours, textures and collections with confidence.',
        links: [url('Request a Quote', '#quote', 'primary'), wa('Discuss Your Project', undefined, 'glass')],
        trustItems: [{ text: 'Cut from your fabric rolls' }, { text: 'Sorted colour by colour' }, { text: 'Checked before delivery' }],
        media: media['draped-bronze-fabric-texture.webp'],
        fanProducts: keys.map((k) => productIds[k]),
      },
      layout: [
        {
          blockType: 'formatGrid',
          tone: 'ivory',
          eyebrow: 'Products & services',
          heading: 'From cutting to *finished* sample collections',
          intro:
            'Fabric sampling is all we do — so every swatch, hanger and swatch book gets our full attention.',
          showWhatsapp: true,
          enableLink: true,
          link: { type: 'custom', url: '/products', label: 'All services', appearance: 'glass' },
        },
        {
          blockType: 'processStory',
          tone: 'charcoal',
          eyebrow: 'How it works',
          heading: 'From fabric roll to *finished* sample',
          intro: 'Seven careful steps turn your fabric rolls into samples your customers enjoy using.',
          steps,
          enableLink: true,
          link: { type: 'custom', url: '#quote', label: 'Request a quote', appearance: 'primary' },
        },
        {
          blockType: 'industriesCarousel',
          tone: 'ivory',
          eyebrow: 'Who we serve',
          heading: 'Made for businesses that *sell* upholstery fabric',
          intro: 'Each customer presents fabric differently. We prepare the samples that fit the way you sell.',
        },
        {
          blockType: 'capabilities',
          tone: 'linen',
          layout: 'cards',
          eyebrow: 'Why choose us',
          heading: 'Consistent swatches, *organised* presentation',
          intro: 'A focused sampling partner for upholstery fabric businesses in the UAE.',
          items: whyUs,
        },
        {
          blockType: 'workGallery',
          tone: 'sand',
          eyebrow: 'Our work',
          heading: 'Real samples. *Professional* presentation.',
          intro: 'Examples of the swatch cutting, sample hangers and swatch books we prepare.',
          layout: 'horizontal',
          limit: 8,
          enableLink: true,
          link: { type: 'custom', url: '/work', label: 'View all work', appearance: 'glass' },
        },
        {
          blockType: 'faq',
          tone: 'ivory',
          eyebrow: 'FAQ',
          heading: 'Questions customers *ask* us',
          intro: 'Can’t find your answer? Message us on WhatsApp.',
          category: 'all',
          enableLink: true,
          link: { type: 'whatsapp', label: 'Ask a question', appearance: 'primary' },
        },
        {
          blockType: 'formBlock',
          tone: 'sand',
          eyebrow: 'Request a quote',
          heading: 'Tell us about your *sample* project',
          intro:
            'Share your company, the product you need, quantity, sample size and deadline. We reply with options and a quotation.',
          form: quoteForm.id,
          showContactPanel: true,
        },
      ],
    },
    {
      title: 'How We Make Fabric Samples',
      slug: 'process',
      meta: {
        title: 'How Fabric Samples Are Made | Our Process | Al Hejlah',
        description:
          'See how we turn your fabric rolls into swatches, sample hangers and swatch books: receiving, cutting, finishing, sorting, assembly, quality check and packing.',
        image: media['tailor-scissors-cutting-swatches.webp'],
      },
      hero: {
        type: 'page',
        tone: 'ink',
        eyebrow: 'Our process',
        heading: 'From fabric roll to *finished* sample',
        subheading: 'A clear, seven-step process — from receiving your fabric rolls to packing the finished samples.',
        links: [url('Request a Quote', '/contact#quote', 'primary'), wa('Discuss Your Project', undefined, 'glass')],
        media: media['tailor-scissors-cutting-swatches.webp'],
      },
      layout: [
        {
          blockType: 'processStory',
          tone: 'charcoal',
          eyebrow: 'Step by step',
          heading: 'Seven steps to *finished* samples',
          steps,
        },
        {
          blockType: 'capabilities',
          tone: 'linen',
          layout: 'cards',
          eyebrow: 'Options',
          heading: 'What we can *customise*',
          items: options,
        },
        {
          blockType: 'faq',
          tone: 'ivory',
          eyebrow: 'FAQ',
          heading: 'Production *questions*',
          category: 'products',
        },
        {
          blockType: 'cta',
          tone: 'bronze',
          heading: 'Ready to *start*?',
          text: 'Share your fabric range, the sample size and the quantity — we will guide you through the rest.',
          links: [url('Request a Quote', '/contact#quote', 'primary'), wa('Discuss Your Project', undefined, 'glass')],
          showContactDetails: true,
        },
      ],
    },
    {
      title: 'About',
      slug: 'about',
      meta: {
        title: 'About Us | Upholstery Fabric Sampling Specialists, Sharjah | Al Hejlah',
        description:
          'Al Hejlah cuts upholstery fabric rolls into swatches, sample hangers and swatch books for furniture and textile businesses in Sharjah, Dubai and across the UAE.',
        image: media['textile-sampling-workshop.webp'],
      },
      hero: {
        type: 'page',
        tone: 'ink',
        eyebrow: 'About us',
        heading: 'Upholstery fabric *sampling* specialists in Sharjah',
        subheading:
          'We cut fabric and make sample collections — nothing else. That focus keeps every swatch, hanger and swatch book consistent.',
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
              'A customer’s first contact with your fabric is often a sample. We cut your fabric rolls and turn them into organised swatches, sample hangers and swatch books, so that first impression is clear and professional.',
            ),
            p(
              'We work with furniture manufacturers, upholstery fabric wholesalers, textile mills and suppliers, interior design companies, curtain and furnishing suppliers and furniture showrooms.',
            ),
          ),
          media: media['thread-spools-workshop.webp'],
          imagePosition: 'left',
          pills: [{ text: 'Sharjah, UAE' }, { text: 'Upholstery sampling' }],
        },
        {
          blockType: 'capabilities',
          tone: 'charcoal',
          layout: 'checklist',
          eyebrow: 'How we work',
          heading: 'Clear, *honest* and practical',
          media: media['designer-choosing-fabric-samples.webp'],
          items: [
            { title: 'Listen first', text: 'We start from how your customers choose fabric — then plan the samples.' },
            { title: 'Agree before we cut', text: 'Swatch size, layout and quantity are agreed before production.' },
            { title: 'Communicate directly', text: 'WhatsApp, phone or email — whichever suits you.' },
          ],
        },
        {
          blockType: 'cta',
          tone: 'bronze',
          heading: 'Let’s talk about your *collection*',
          links: [url('Request a Quote', '/contact#quote', 'primary'), wa('Message us on WhatsApp', undefined, 'glass')],
          showContactDetails: true,
        },
      ],
    },
    {
      title: 'Contact',
      slug: 'contact',
      meta: {
        title: 'Request a Quote | Fabric Sample Hangers & Swatch Books UAE | Al Hejlah',
        description:
          'Request a quotation for fabric swatch cutting, sample hangers or swatch books. WhatsApp, phone or email our Sharjah team.',
        image: media['designer-choosing-fabric-samples.webp'],
      },
      hero: {
        type: 'minimal',
        tone: 'ink',
        eyebrow: 'Contact',
        heading: 'Request a *quotation*',
        subheading:
          'Tell us the product you need, the quantity, sample size and deadline. WhatsApp is the fastest way to reach us.',
        links: [wa('Chat on WhatsApp')],
      },
      layout: [
        {
          blockType: 'formBlock',
          tone: 'sand',
          eyebrow: 'Quote request',
          heading: 'Tell us about your *project*',
          intro: 'A few details help us plan your samples and prepare an accurate quotation.',
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
      title: 'Products & Services',
      slug: 'products',
      meta: {
        title: 'Fabric Swatch Cutting, Sample Hangers & Swatch Books | Al Hejlah',
        description:
          'Fabric swatch cutting, fabric sample hangers, and swatch books & sample catalogues for upholstery businesses — made in Sharjah, UAE.',
      },
      hero: {
        type: 'minimal',
        tone: 'ink',
        eyebrow: 'Products & services',
        heading: 'Fabric swatches, hangers and *swatch* books',
        subheading:
          'Three focused services for upholstery fabric businesses — cut, sorted and assembled in Sharjah.',
      },
      layout: [],
    },
    {
      title: 'Who We Serve',
      slug: 'industries',
      meta: {
        title: 'Who We Serve | Upholstery Fabric Sampling UAE | Al Hejlah',
        description:
          'Fabric swatches, sample hangers and swatch books for furniture manufacturers, fabric wholesalers, textile suppliers, interior designers, curtain suppliers and showrooms.',
      },
      hero: {
        type: 'minimal',
        tone: 'ink',
        eyebrow: 'Who we serve',
        heading: 'Fabric samples for businesses that *sell* upholstery',
        subheading:
          'Furniture makers, fabric wholesalers, textile suppliers, interior designers, curtain suppliers and showrooms — each needs samples that make choosing easy.',
      },
      layout: [],
    },
    {
      title: 'Our Work',
      slug: 'work',
      meta: {
        title: 'Our Work | Fabric Sample Hangers & Swatch Books | Al Hejlah',
        description: 'Examples of fabric swatch cutting, sample hangers and swatch books prepared in Sharjah, UAE.',
      },
      hero: {
        type: 'minimal',
        tone: 'ink',
        eyebrow: 'Portfolio',
        heading: 'Real samples. *Professional* presentation.',
        subheading: 'Examples of the swatches, sample hangers and swatch books we prepare.',
      },
      layout: [],
    },
    {
      title: 'Guides',
      slug: 'guides',
      meta: {
        title: 'Fabric Sampling Guides | Swatches, Hangers & Swatch Books | Al Hejlah',
        description: 'Practical guides to fabric swatch cutting, sample hangers, swatch books and sampling costs.',
      },
      hero: {
        type: 'minimal',
        tone: 'ink',
        eyebrow: 'Guides',
        heading: 'Fabric sampling, *explained*',
        subheading: 'Practical guidance for businesses planning their next upholstery sample collection.',
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
        'Upholstery fabric sampling specialists: fabric swatch cutting, sample hangers and swatch books for furniture and textile businesses.',
      whatsappNumber: '971558493932',
      phoneDisplay: '+971 55 849 3932',
      phoneNumber: '971558493932',
      email: 'saifuliths92@gmail.com',
      whatsappDefaultMessage: "Hello, I'd like a quotation for fabric samples.",
      address: { locality: 'Sharjah', region: 'Sharjah', countryCode: 'AE' },
      serviceArea: 'Sharjah, Dubai, Ajman, Abu Dhabi and the wider UAE',
      openingHours: [
        { days: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], opens: '08:00', closes: '18:00' },
      ],
      titleSuffix: 'Al Hejlah',
      defaultDescription:
        'Fabric swatch book and sample hanger manufacturer in Sharjah, UAE: fabric swatch cutting, sample hangers and swatch books for upholstery businesses.',
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
        { link: { type: 'custom', url: '/products', label: 'Services' } },
        { link: { type: 'custom', url: '/industries', label: 'Who we serve' } },
        ref('pages', pageIds.process, 'Process'),
        { link: { type: 'custom', url: '/work', label: 'Our work' } },
        ref('pages', pageIds.about, 'About'),
      ],
      actions: [
        { link: { type: 'whatsapp', label: 'WhatsApp', appearance: 'glass' } },
        { link: { type: 'custom', url: '/contact#quote', label: 'Request a quote', appearance: 'primary' } },
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
          title: 'Services',
          links: products.map((x) => ref('products', productIds[x.key], x.title)),
        },
        {
          title: 'Who we serve',
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

  payload.logger.info('— Arabic...')
  await applyArabic(payload, req)

  payload.logger.info('Seeded database successfully!')
}
