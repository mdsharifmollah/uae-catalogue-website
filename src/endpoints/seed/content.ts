/**
 * Starter website copy. Everything here is editable in the dashboard.
 * Rule followed throughout: describe capabilities and options to discuss —
 * never invent certifications, client counts, prices or delivery guarantees.
 */
import { doc, h2, h3, ol, p, ul } from './lexical'

/* ------------------------------------------------------------------ Media */
export const mediaFiles: Record<string, string> = {
  'draped-bronze-fabric-texture.webp': 'Close-up of draped bronze fabric with soft folds and shadows',
  'numbered-shade-card-fan-swatches.webp': 'Fanned colour shade card with numbered swatches from blue to green',
  'stacked-colour-fabric-swatches.webp': 'Stacked fabric swatches arranged by colour from red to yellow',
  'fabric-header-card-swatch-strips.webp': 'Fabric sample page with horizontal swatch strips in neutral tones',
  'upholstery-fabric-swatches-overlapping.webp': 'Overlapping upholstery fabric swatches in sage, beige and blue weaves',
  'designer-choosing-fabric-samples.webp': 'Designer choosing fabric samples from a spread of swatch cards',
  'fabric-sample-presentation-box.webp': 'Fabric swatches and sketches laid out for a client presentation',
  'material-samples-presentation-board.webp': 'Material and fabric samples arranged on a presentation board',
  'hanging-fabric-swatches-display.webp': 'Fabric swatches hanging on a display wall in a sampling studio',
  'plum-and-rust-fabric-swatches.webp': 'Plum and rust coloured fabric swatches folded together',
  'patterned-fabric-rolls-on-shelves.webp': 'Rolls of patterned and plain fabric stored on shelves',
  'tailor-scissors-cutting-swatches.webp': 'Tailor scissors used to cut fabric swatches',
  'stitching-fabric-samples-sewing-machine.webp': 'Hands guiding fabric through a sewing machine to finish sample edges',
  'textile-sampling-workshop.webp': 'Busy textile workshop with sewing stations and fabric',
  'thread-spools-workshop.webp': 'Spools of natural thread stacked in a textile workshop',
  'folded-fabric-stack-neutral.webp': 'Stack of folded fabrics in neutral, pink and peach tones',
  'green-upholstered-sofa-fabric.webp': 'Green upholstered sofa showing the texture of the fabric',
  'sheer-curtains-living-room.webp': 'Sheer and lined curtains in a bright living room',
  'grey-carpet-texture-closeup.webp': 'Close-up of a grey looped carpet texture',
  'wooden-window-blinds.webp': 'Wooden window blinds with sunlight between the slats',
  'floral-striped-wallpaper.webp': 'Floral striped wallpaper pattern in green, orange and cream',
  'damask-curtain-fabric.webp': 'Brown and cream damask curtain fabric',
  'gold-floral-velvet-fabric.webp': 'Gold floral pattern on dark brown velvet fabric',
  'dark-brown-velvet-texture.webp': 'Dark brown velvet fabric texture',
  'printed-wallpaper-fabric-coordinate.webp': 'Printed wallpaper and fabric coordinate with stag and tree motif',
  'mixed-texture-material-samples.webp': 'Mixed texture material samples including leather and woven fabric',
  'beige-linen-fabric-swirl.webp': 'Beige linen fabric twisted into a soft swirl',
  'colour-fan-deck-swatches.webp': 'Colour fan deck spread out to show a full spectrum of swatches',
}

export const iconFiles: Record<string, string> = {
  'icon-3d-scissor.webp': '3D scissors icon',
  'icon-3d-color-palette.webp': '3D colour palette icon',
  'icon-3d-notebook.webp': '3D sample book icon',
  'icon-3d-pin.webp': '3D pin icon',
  'icon-3d-gift-box.webp': '3D presentation box icon',
  'icon-3d-crown.webp': '3D crown icon',
  'icon-3d-tick.webp': '3D check mark icon',
  'icon-3d-chat-bubble.webp': '3D chat bubble icon',
  'icon-3d-shield.webp': '3D shield icon',
  'icon-3d-map-pin.webp': '3D location pin icon',
  'icon-3d-tools.webp': '3D tools icon',
  'icon-3d-rocket.webp': '3D rocket icon',
}

/* ------------------------------------------------------------------ FAQs */
export const faqs = [
  {
    key: 'types',
    category: 'general',
    question: 'What types of fabric sample catalogues do you make?',
    answer:
      'We make fabric sample books, hanging and waterfall samples, numbered shade cards, swatch and header cards, and sample boxes or presenters. Tell us how you sell your collection and we will suggest the format that fits.',
  },
  {
    key: 'custom',
    category: 'products',
    question: 'Can I request a custom sample catalogue?',
    answer:
      'Yes. Share your fabric range, the size you have in mind and how the samples will be used — showroom, sales visits or mailing — and we will discuss a suitable layout, binding and finish.',
  },
  {
    key: 'numbered',
    category: 'products',
    question: 'Can you make numbered fabric samples?',
    answer:
      'Yes. Swatches can be arranged by colour, pattern or article and numbered (for example 01–39) so buyers can note and re-order the exact shade.',
  },
  {
    key: 'quote',
    category: 'ordering',
    question: 'How do I get a quotation?',
    answer:
      'Message us on WhatsApp, call, email or use the quote form. Include the format, approximate size, number of swatches per catalogue and estimated quantity. Photos of a reference sample help us quote faster.',
  },
  {
    key: 'photos',
    category: 'ordering',
    question: 'Can I send reference photos?',
    answer:
      'Yes — reference photos are the quickest way to explain what you need. Send them on WhatsApp together with your requirements.',
  },
  {
    key: 'moq',
    category: 'ordering',
    question: 'Is there a minimum order quantity?',
    answer:
      'Minimums depend on the format and finishing you choose. We confirm the minimum quantity together with your quotation.',
  },
  {
    key: 'fabric',
    category: 'delivery',
    question: 'Do I need to supply the fabric?',
    answer:
      'Most clients supply their own fabric so the samples match their stock exactly. Contact us to discuss how much fabric is needed for your catalogue.',
  },
  {
    key: 'location',
    category: 'general',
    question: 'Where are you located?',
    answer:
      'We are based in Sharjah, United Arab Emirates, and work with textile and interior businesses across the UAE. Contact us to discuss delivery to your location.',
  },
] as const

/* ------------------------------------------------------------------ Industries */
export const industries = [
  {
    key: 'upholstery',
    title: 'Upholstery & Sofa Fabrics',
    slug: 'upholstery-sofa-fabrics',
    tag: 'Sofas & seating',
    cardTone: 'sage',
    image: 'green-upholstered-sofa-fabric.webp',
    summary:
      'Sample books and swatch cards that let furniture buyers feel the weave, compare colours and choose upholstery fabrics with confidence.',
    needs: [
      { title: 'Texture you can feel', text: 'Swatches large enough to show weave, pile and hand-feel — not just colour.' },
      { title: 'Large colour ranges', text: 'Numbered layouts that keep 20, 40 or more colourways easy to browse.' },
      { title: 'Built for handling', text: 'Sturdy binding and finished edges for daily use in showrooms and on sales visits.' },
    ],
    body: doc(
      h2('Upholstery fabric sample books that sell the feel of the fabric'),
      p(
        'Furniture manufacturers, sofa makers and upholstery suppliers choose fabrics by touch as much as by colour. A good upholstery sample book puts every colourway of a quality side by side, with swatches large enough to judge texture and durability.',
      ),
      h3('Formats that work well for upholstery'),
      ul([
        '**Fabric sample books** with one quality per page and numbered colourways',
        '**Shade cards** for wide colour ranges of a single fabric',
        '**Waterfall hangers** for showroom rails',
      ]),
    ),
  },
  {
    key: 'curtains',
    title: 'Curtain & Drapery Fabrics',
    slug: 'curtain-drapery',
    tag: 'Curtains & sheers',
    cardTone: 'sand',
    image: 'sheer-curtains-living-room.webp',
    summary:
      'Hanging samples and sample books that show how curtain fabrics drape, filter light and coordinate across a collection.',
    needs: [
      { title: 'Show the drape', text: 'Hanging formats let sheers and heavy drapes fall naturally, the way they will at the window.' },
      { title: 'Coordinate collections', text: 'Group plains, prints and sheers that belong together so designers can build a scheme.' },
      { title: 'Easy to re-order', text: 'Clear article numbers and colour references on every swatch.' },
    ],
    body: doc(
      h2('Curtain fabric sample catalogues'),
      p(
        'Curtain and drapery fabrics are judged by how they hang and how much light they let through. Waterfall hangers and long-format swatches show both, while sample books keep a full collection organised for designers and retailers.',
      ),
    ),
  },
  {
    key: 'carpets',
    title: 'Carpets & Rugs',
    slug: 'carpets-rugs',
    tag: 'Carpets & rugs',
    cardTone: 'charcoal',
    image: 'grey-carpet-texture-closeup.webp',
    summary:
      'Carpet sample books and boards that present pile, texture and colour ranges in a format buyers can carry and compare.',
    needs: [
      { title: 'Show pile and depth', text: 'Mounting suited to thicker materials so texture and pile height are visible.' },
      { title: 'Compare side by side', text: 'Layouts that put colourways of one range next to each other.' },
      { title: 'Portable', text: 'Formats sized for sales visits and project presentations.' },
    ],
    body: doc(
      h2('Carpet sample books and boards'),
      p(
        'Carpet and rug suppliers need samples that show pile, texture and colour at a glance. We discuss mounting and binding suited to thicker materials so your range stays neat and easy to compare.',
      ),
    ),
  },
  {
    key: 'blinds',
    title: 'Blinds',
    slug: 'blinds',
    tag: 'Roller & roman blinds',
    cardTone: 'ivory',
    image: 'wooden-window-blinds.webp',
    summary:
      'Blind sample books that organise roller, roman and blackout fabrics by opacity, colour and article — ready for quoting at the client’s home.',
    needs: [
      { title: 'Group by opacity', text: 'Sheer, dim-out and blackout fabrics clearly separated.' },
      { title: 'Specs at a glance', text: 'Article number, width and composition printed with each swatch.' },
      { title: 'Ready for home visits', text: 'Compact books that installers and sales teams can carry.' },
    ],
    body: doc(
      h2('Blind fabric sample books'),
      p(
        'Blind retailers and installers use sample books on every home visit. Organising fabrics by opacity and colour — with the article details beside each swatch — makes it faster to agree a choice and prepare a quotation.',
      ),
    ),
  },
  {
    key: 'wallpaper',
    title: 'Wallpaper & Wallcoverings',
    slug: 'wallpaper-wallcoverings',
    tag: 'Wallcoverings',
    cardTone: 'clay',
    image: 'floral-striped-wallpaper.webp',
    summary:
      'Pattern books and coordinate catalogues that present wallcoverings alongside matching fabrics.',
    needs: [
      { title: 'Show the full repeat', text: 'Page sizes that let a pattern repeat be seen properly.' },
      { title: 'Fabric coordinates', text: 'Wallcoverings and matching fabrics presented together.' },
      { title: 'Durable pages', text: 'Bindings that open flat for browsing and photography.' },
    ],
    body: doc(
      h2('Wallpaper and coordinate pattern books'),
      p(
        'Wallcovering brands often launch collections with matching fabrics. A coordinate book presents both together so designers can see the complete scheme in one place.',
      ),
    ),
  },
] as const

/* ------------------------------------------------------------------ Products */
export const products = [
  {
    key: 'books',
    order: 1,
    title: 'Fabric Sample Books',
    cardTitle: 'Fabric|Sample Books',
    slug: 'fabric-sample-books',
    cardTone: 'ivory',
    hero: 'upholstery-fabric-swatches-overlapping.webp',
    gallery: ['fabric-header-card-swatch-strips.webp', 'designer-choosing-fabric-samples.webp'],
    industries: ['upholstery', 'curtains', 'carpets', 'blinds'],
    faqs: ['custom', 'numbered', 'quote', 'moq'],
    summary:
      'Bound sample books that present your fabric range — colours, textures and patterns — in one organised, easy-to-browse catalogue.',
    whatsappMessage: "Hello, I'd like a quotation for fabric sample books.",
    specs: [
      { label: 'Common sizes', value: 'A4, A3, or custom to your swatch size' },
      { label: 'Binding', value: 'Ring, screw-post or hardcover — to discuss' },
      { label: 'Swatch layout', value: 'One quality per page, multi-swatch or numbered' },
      { label: 'Cover', value: 'Printed, logo-branded or fabric-wrapped' },
      { label: 'Minimum order', value: 'Confirmed with your quotation' },
    ],
    useCases: [
      'Upholstery and sofa fabric ranges',
      'Curtain and drapery collections',
      'Showrooms and interior designer studios',
      'Sales visits and trade presentations',
    ],
    body: doc(
      h2('Custom fabric sample books for textile and interior brands'),
      p(
        'A fabric sample book keeps your whole collection in one place. Buyers can browse every quality and colourway, compare textures side by side and note the exact article they want to order. For fabric traders, upholstery suppliers and curtain businesses, it is often the first thing a client touches.',
      ),
      h3('Formats we can discuss'),
      ul([
        'A4 and A3 books in portrait or landscape',
        'Ring-bound, screw-post and hardcover bindings',
        'Swatch windows, flaps or full-page swatches',
        'Numbered pages and article labels for easy re-ordering',
      ]),
      h3('Designed for how buyers browse'),
      p(
        'We organise swatches the way your customers shop — by colour family, by fabric quality or by collection — so the book is quick to use in a showroom or on a sales visit.',
      ),
      h3('What to send us'),
      ol([
        'Your fabric range or a list of qualities and colours',
        'Preferred size and binding (or a reference photo)',
        'Estimated quantity of books',
      ]),
    ),
  },
  {
    key: 'hangers',
    order: 2,
    title: 'Fabric Hangers & Waterfall Samples',
    cardTitle: 'Hangers &|Waterfalls',
    slug: 'fabric-hangers-waterfall-samples',
    cardTone: 'charcoal',
    hero: 'hanging-fabric-swatches-display.webp',
    gallery: ['damask-curtain-fabric.webp', 'sheer-curtains-living-room.webp'],
    industries: ['curtains', 'upholstery'],
    faqs: ['custom', 'quote', 'photos'],
    summary:
      'Header hangers and waterfall cards that let buyers flip through your colours on a rail, stand or showroom wall.',
    whatsappMessage: "Hello, I'd like a quotation for fabric hangers / waterfall samples.",
    specs: [
      { label: 'Formats', value: 'Single header hangers, waterfall cards, hanger sets' },
      { label: 'Display', value: 'Rails, stands or wall display' },
      { label: 'Header', value: 'Printed with logo, article and composition' },
      { label: 'Swatches per hanger', value: 'Planned to your colour range' },
      { label: 'Minimum order', value: 'Confirmed with your quotation' },
    ],
    useCases: ['Curtain and sheer fabrics', 'Showroom rails and stands', 'Large colour ranges of one quality'],
    body: doc(
      h2('Fabric sample hangers and waterfall cards'),
      p(
        'Hanging samples show fabric the way it will be used — falling freely, with its true drape and weight. A waterfall card staggers the colours of one quality so a buyer can see the whole range at once and lift a swatch to feel it.',
      ),
      h3('When to choose a hanging format'),
      ul([
        'Curtain, sheer and drapery fabrics where drape matters',
        'Showrooms with rails or display stands',
        'Collections with many colourways of a single quality',
      ]),
    ),
  },
  {
    key: 'shade',
    order: 3,
    title: 'Shade Cards & Numbered Swatches',
    cardTitle: 'Shade Cards|& Numbering',
    slug: 'shade-cards-numbered-swatches',
    cardTone: 'bronze',
    hero: 'numbered-shade-card-fan-swatches.webp',
    gallery: ['stacked-colour-fabric-swatches.webp', 'colour-fan-deck-swatches.webp'],
    industries: ['upholstery', 'blinds', 'curtains'],
    faqs: ['numbered', 'quote'],
    summary:
      'Numbered colour cards — for example 01 to 39 — that make it easy for buyers to choose, note and re-order the exact shade.',
    whatsappMessage: "Hello, I'd like a quotation for numbered shade cards.",
    specs: [
      { label: 'Numbering', value: 'Sequential, by colour family or by article' },
      { label: 'Layout', value: 'Rows, columns or fan-style' },
      { label: 'Card', value: 'Printed with logo and colour references' },
      { label: 'Minimum order', value: 'Confirmed with your quotation' },
    ],
    useCases: ['Plain fabrics with wide colour ranges', 'Re-order catalogues for regular buyers', 'Mailing to clients'],
    body: doc(
      h2('Numbered fabric shade cards'),
      p(
        'A shade card shows every colour of one fabric quality in a single view, with a clear number beside each swatch. Buyers can point to "shade 23" on WhatsApp instead of describing a colour — fewer mistakes, faster orders.',
      ),
      h3('Numbering options'),
      ul([
        'Simple sequence (01, 02, 03 …)',
        'Grouped by colour family',
        'Matched to your own article or SKU numbers',
      ]),
    ),
  },
  {
    key: 'cards',
    order: 4,
    title: 'Swatch Cards & Header Cards',
    cardTitle: 'Swatch &|Header Cards',
    slug: 'swatch-cards-header-cards',
    cardTone: 'sand',
    hero: 'fabric-header-card-swatch-strips.webp',
    gallery: ['plum-and-rust-fabric-swatches.webp', 'mixed-texture-material-samples.webp'],
    industries: ['upholstery', 'wallpaper'],
    faqs: ['custom', 'quote'],
    summary:
      'Single-quality swatch cards and printed header cards with your logo, article number and composition — ideal for mailing and showroom tables.',
    whatsappMessage: "Hello, I'd like a quotation for swatch cards / header cards.",
    specs: [
      { label: 'Card types', value: 'Swatch cards, header cards, memo samples' },
      { label: 'Printing', value: 'Logo, article, composition, care details' },
      { label: 'Use', value: 'Mailing, showroom tables, client folders' },
      { label: 'Minimum order', value: 'Confirmed with your quotation' },
    ],
    useCases: ['Sending samples to clients', 'Trade fair handouts', 'Quick reference for sales teams'],
    body: doc(
      h2('Fabric swatch cards and printed header cards'),
      p(
        'Swatch cards are the simplest way to put a fabric in a client’s hands. A printed header with your brand, article number and composition turns every swatch into a professional reference card.',
      ),
    ),
  },
  {
    key: 'boxes',
    order: 5,
    title: 'Sample Boxes & Presenters',
    cardTitle: 'Sample Boxes|& Presenters',
    slug: 'sample-boxes-presenters',
    cardTone: 'clay',
    hero: 'fabric-sample-presentation-box.webp',
    gallery: ['material-samples-presentation-board.webp', 'folded-fabric-stack-neutral.webp'],
    industries: ['upholstery', 'wallpaper', 'carpets'],
    faqs: ['custom', 'quote', 'moq'],
    summary:
      'Presentation boxes and folders that hold a curated selection of swatches — for launches, key clients and premium collections.',
    whatsappMessage: "Hello, I'd like a quotation for fabric sample boxes.",
    specs: [
      { label: 'Formats', value: 'Rigid boxes, presenter folders, swatch kits' },
      { label: 'Contents', value: 'Curated swatches, cards and printed inserts' },
      { label: 'Branding', value: 'Logo on lid or cover — to discuss' },
      { label: 'Minimum order', value: 'Confirmed with your quotation' },
    ],
    useCases: ['Collection launches', 'Key-account and designer gifts', 'Project presentations'],
    body: doc(
      h2('Custom fabric sample boxes and presenters'),
      p(
        'When a collection deserves a moment, a sample box presents a curated selection of swatches with your brand on the lid. It works for launches, interior designer kits and project presentations.',
      ),
    ),
  },
] as const

/* ------------------------------------------------------------------ Process */
export const processSteps = [
  {
    title: 'Share your requirements',
    text: 'Send your fabric range, intended use and preferred format on WhatsApp or by email. Reference photos help us understand exactly what you need.',
    image: 'patterned-fabric-rolls-on-shelves.webp',
  },
  {
    title: 'Cut & finish the swatches',
    text: 'Fabrics are cut to the agreed swatch size, with pinked or clean-finished edges to suit the format.',
    image: 'tailor-scissors-cutting-swatches.webp',
  },
  {
    title: 'Arrange & number',
    text: 'Swatches are arranged by colour, pattern or article and numbered so buyers can order exactly the shade they want.',
    image: 'stacked-colour-fabric-swatches.webp',
  },
  {
    title: 'Mount on pages or headers',
    text: 'Each swatch is mounted on pages, header cards or hanger strips with consistent spacing and alignment.',
    image: 'stitching-fabric-samples-sewing-machine.webp',
  },
  {
    title: 'Bind, hang or box',
    text: 'The catalogue is bound into books, fitted to hangers or packed into presentation boxes.',
    image: 'hanging-fabric-swatches-display.webp',
  },
  {
    title: 'Brand, check & deliver',
    text: 'Your logo and article details are added, every piece is checked, and the order is prepared for delivery.',
    image: 'fabric-sample-presentation-box.webp',
  },
]

/* ------------------------------------------------------------------ Projects (demo — replace with real work) */
export const projects = [
  {
    title: 'Numbered shade card for a 39-colour linen range',
    slug: 'numbered-linen-shade-card',
    cover: 'stacked-colour-fabric-swatches.webp',
    gallery: ['numbered-shade-card-fan-swatches.webp', 'beige-linen-fabric-swirl.webp'],
    products: ['shade'],
    industries: ['upholstery'],
    summary: 'A colour-ordered shade card with numbered swatches so buyers can re-order by number.',
    specs: [
      { label: 'Format', value: 'Numbered shade card' },
      { label: 'Swatches', value: '39 colours' },
    ],
  },
  {
    title: 'Upholstery collection sample book',
    slug: 'upholstery-collection-sample-book',
    cover: 'upholstery-fabric-swatches-overlapping.webp',
    gallery: ['fabric-header-card-swatch-strips.webp', 'plum-and-rust-fabric-swatches.webp'],
    products: ['books'],
    industries: ['upholstery'],
    summary: 'A multi-quality sample book organised by colour family for showroom and sales use.',
    specs: [
      { label: 'Format', value: 'A4 sample book' },
      { label: 'Layout', value: 'One quality per page' },
    ],
  },
  {
    title: 'Damask curtain collection on waterfall hangers',
    slug: 'damask-curtain-waterfall-hangers',
    cover: 'damask-curtain-fabric.webp',
    gallery: ['hanging-fabric-swatches-display.webp', 'sheer-curtains-living-room.webp'],
    products: ['hangers'],
    industries: ['curtains'],
    summary: 'Hanging samples that let a damask curtain range drape naturally on a showroom rail.',
    specs: [
      { label: 'Format', value: 'Waterfall hanger set' },
      { label: 'Display', value: 'Showroom rail' },
    ],
  },
  {
    title: 'Velvet collection presentation box',
    slug: 'velvet-collection-presentation-box',
    cover: 'gold-floral-velvet-fabric.webp',
    gallery: ['dark-brown-velvet-texture.webp', 'fabric-sample-presentation-box.webp'],
    products: ['boxes'],
    industries: ['upholstery'],
    summary: 'A curated box of velvet swatches for a premium collection launch.',
    specs: [
      { label: 'Format', value: 'Rigid presentation box' },
      { label: 'Contents', value: 'Curated swatches + printed card' },
    ],
  },
  {
    title: 'Wallcovering & fabric coordinates book',
    slug: 'wallcovering-fabric-coordinates-book',
    cover: 'printed-wallpaper-fabric-coordinate.webp',
    gallery: ['floral-striped-wallpaper.webp'],
    products: ['books', 'cards'],
    industries: ['wallpaper'],
    summary: 'A pattern book presenting wallcoverings alongside their matching fabrics.',
    specs: [{ label: 'Format', value: 'Coordinate pattern book' }],
  },
  {
    title: 'Designer material sample board',
    slug: 'designer-material-sample-board',
    cover: 'material-samples-presentation-board.webp',
    gallery: ['mixed-texture-material-samples.webp', 'designer-choosing-fabric-samples.webp'],
    products: ['cards', 'boxes'],
    industries: ['upholstery'],
    summary: 'A mixed-material board for an interior design presentation.',
    specs: [{ label: 'Format', value: 'Presentation board' }],
  },
]

/* ------------------------------------------------------------------ Guides */
export const guides = [
  {
    title: 'How a Fabric Sample Book Is Made: Step by Step',
    slug: 'how-a-fabric-sample-book-is-made',
    image: 'fabric-header-card-swatch-strips.webp',
    relatedProducts: ['books', 'shade'],
    excerpt:
      'From choosing the format to cutting, numbering, mounting and binding — what happens when a fabric collection becomes a sample book.',
    content: doc(
      p(
        'A fabric sample book looks simple: a cover, some pages and a set of swatches. Behind it is a sequence of decisions that decide whether buyers find it easy to use. Here is how a typical sample book comes together.',
      ),
      h2('1. Decide what the book needs to do'),
      p(
        'Start with the buyer. Will the book live in a showroom, travel with a sales team or be mailed to interior designers? That decides the size, how sturdy the binding needs to be and how many qualities go in one book.',
      ),
      h2('2. Choose the size and binding'),
      p(
        'A4 and A3 are the most common sizes. **Ring and screw-post bindings** make it easy to add or replace pages as a range changes; **hardcover books** feel more premium for a fixed collection.',
      ),
      h2('3. Cut and finish the swatches'),
      p(
        'Fabric is cut to a consistent swatch size. Edges are pinked or finished so they do not fray with handling. Larger swatches suit textured upholstery fabrics; smaller ones work for plain colour ranges.',
      ),
      h2('4. Arrange and number'),
      p(
        'Swatches are grouped by colour family, quality or collection and numbered. Clear numbering lets a client say "shade 23" on WhatsApp instead of describing a colour.',
      ),
      h2('5. Mount, bind and brand'),
      p(
        'Swatches are mounted with even spacing, labelled with article details, and the book is bound and branded with your logo.',
      ),
      h2('What to prepare before asking for a quote'),
      ul([
        'The list of qualities and colours to include',
        'Preferred size, binding and cover style',
        'Estimated number of books',
        'Photos of any sample book you like',
      ]),
    ),
  },
  {
    title: 'Sample Book, Waterfall Hanger or Shade Card: Which Format Fits Your Range?',
    slug: 'sample-book-vs-hanger-vs-shade-card',
    image: 'numbered-shade-card-fan-swatches.webp',
    relatedProducts: ['books', 'hangers', 'shade'],
    excerpt:
      'Each sample format suits a different way of selling. Compare sample books, waterfall hangers and numbered shade cards.',
    content: doc(
      p(
        'Choosing the right sample format makes your collection easier to sell. The best choice depends on the fabric, the size of the colour range and where buyers will see it.',
      ),
      h2('Fabric sample books'),
      p(
        'Best for **complete collections** with several qualities. Books are portable, organised and easy to update with ring or screw-post binding.',
      ),
      h2('Waterfall hangers'),
      p(
        'Best for **fabrics where drape matters** — curtains, sheers and soft upholstery. Hangers suit showroom rails and stands.',
      ),
      h2('Numbered shade cards'),
      p(
        'Best for **one quality in many colours**. Buyers see every shade at once and can order by number.',
      ),
      h2('Quick guide'),
      ul([
        'Many qualities, mixed buyers → **sample book**',
        'Showroom rail, curtain fabrics → **waterfall hanger**',
        'One fabric, wide colour range → **shade card**',
        'Launch or key client gift → **sample box**',
      ]),
    ),
  },
  {
    title: 'What Affects the Cost of a Fabric Sample Book?',
    slug: 'fabric-sample-book-cost-factors',
    image: 'mixed-texture-material-samples.webp',
    relatedProducts: ['books', 'boxes'],
    excerpt:
      'Size, number of swatches, binding, branding and quantity all shape the price of a sample book. Here is what to consider.',
    content: doc(
      p(
        'Every sample book is built to order, so prices depend on the specification. Understanding the main factors helps you plan a budget and get an accurate quotation faster.',
      ),
      h2('The main cost factors'),
      ul([
        '**Size and page count** — larger books and more pages use more material and handling time.',
        '**Number of swatches** — each swatch is cut, finished and mounted.',
        '**Binding and cover** — ring binding, screw-post and hardcover differ in material and labour.',
        '**Branding** — printed covers, logo application and labels.',
        '**Quantity** — set-up work is shared across a larger order.',
      ]),
      h2('How to get an accurate quote'),
      p(
        'Send the format, size, number of swatches per book and the quantity you need. A photo of a reference book removes most of the guesswork.',
      ),
    ),
  },
]

/* Copy added after launch prep (also applied to existing sites by migration 20261022_120000_content_updates). */

export const homeHero = {
  eyebrow: 'Catalogue Manufacturer · Sharjah, UAE',
  subheading:
    'Fabric sample books, waterfall hangers, shade cards, presentation boxes and catalogues of every kind — made for textile, upholstery, curtain and interior brands.',
}

export const otherCataloguesFaq = {
  key: 'other',
  category: 'general' as const,
  question: 'Do you make other kinds of catalogues, not only fabric?',
  answer:
    'Yes. Besides fabric, we make sample books and catalogues for wallpaper, carpets and rugs, blinds and other materials. Send us your samples and how you plan to present them, and we will suggest a suitable format.',
}

export const privacyPolicy = doc(
  p('**Last updated: 22 October 2026.**'),
  p(
    'This policy explains how Al Hejlah Catalogue Manufacture (“we”, “us”), based in Sharjah, United Arab Emirates, handles personal information collected through this website. We follow the UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021).',
  ),
  h2('Information we collect'),
  ul([
    '**Quote requests:** your name, company, email, phone number, the product you are interested in, quantity and any message you write in the form.',
    '**Messages:** what you send us by WhatsApp, phone or email.',
    '**Technical data:** our hosting provider records basic request data such as IP address, browser type and the pages requested, to keep the website secure and working.',
  ]),
  p('You do not need an account to use this website, and we do not ask for payment details online.'),
  h2('How we use it'),
  ul([
    'To reply to your enquiry, prepare quotations and discuss samples.',
    'To produce and deliver orders you place with us, and keep the related business records.',
    'To keep the website secure and fix problems.',
  ]),
  p('We do not sell your personal information, and we do not send marketing messages unless you ask for them.'),
  h2('Who we share it with'),
  p(
    'Only with service providers that help us run the website and reply to you — website hosting (Vercel), our database (Neon) and email delivery (Resend) — and with WhatsApp (Meta) when you choose to contact us there. These providers may process data outside the UAE under their own security and privacy commitments. We may also disclose information when the law requires it.',
  ),
  h2('Cookies and analytics'),
  p(
    'This website does not use advertising cookies. It does not currently use analytics cookies either; if we add analytics in future (for example Google Analytics), we will update this policy first.',
  ),
  h2('How long we keep it'),
  p(
    'Enquiries are kept for up to three years so we can follow up and refer back to previous quotations. Order records are kept for as long as UAE accounting and tax rules require.',
  ),
  h2('Your rights'),
  p(
    'You can ask to see the personal information we hold about you, correct it, delete it or stop us using it, and you can withdraw consent at any time. Contact us using the details below and we will respond within 30 days.',
  ),
  h2('Security'),
  p(
    'Data is sent to us over an encrypted (HTTPS) connection and access to the dashboard is limited to our team. No system is completely secure, but we take reasonable steps to protect your information.',
  ),
  h2('Contact'),
  p(
    'For any privacy question or request, email **saifuliths92@gmail.com** or message us on WhatsApp at **+971 55 849 3932**.',
  ),
)
