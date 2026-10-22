/**
 * Website copy for Al Hejlah: upholstery fabric sampling — fabric swatch
 * cutting, fabric sample hangers, and swatch books & sample catalogues.
 * Everything here is editable in the dashboard.
 * Rule followed throughout: describe what the business actually does — never
 * invent certifications, client counts, capacity, prices or delivery guarantees.
 */
import { doc, h2, h3, ol, p, ul } from './lexical'

/* ------------------------------------------------------------------ Media */
export const mediaFiles: Record<string, string> = {
  'draped-bronze-fabric-texture.webp': 'Close-up of draped bronze fabric with soft folds and shadows',
  'tailor-scissors-cutting-swatches.webp': 'Tailor scissors used to cut fabric swatches',
  'stacked-colour-fabric-swatches.webp': 'Fabric swatches with pinked edges arranged colour by colour',
  'fabric-header-card-swatch-strips.webp': 'Swatch book page with fabric strips in neutral tones',
  'designer-choosing-fabric-samples.webp': 'Hands flipping through fabric sample hangers with header cards',
  'upholstery-fabric-swatches-overlapping.webp': 'Overlapping upholstery fabric swatches in sage, beige and blue weaves',
  'hanging-fabric-swatches-display.webp': 'Fabric swatches hanging on a display wall in a sampling studio',
  'plum-and-rust-fabric-swatches.webp': 'Plum and rust coloured fabric swatches folded together',
  'patterned-fabric-rolls-on-shelves.webp': 'Rolls of patterned and plain fabric stored on shelves',
  'stitching-fabric-samples-sewing-machine.webp': 'Hands guiding fabric through a sewing machine to finish sample edges',
  'textile-sampling-workshop.webp': 'Busy textile workshop with sewing stations and fabric',
  'thread-spools-workshop.webp': 'Spools of natural thread stacked in a textile workshop',
  'folded-fabric-stack-neutral.webp': 'Stack of folded fabrics in neutral, pink and peach tones',
  'green-upholstered-sofa-fabric.webp': 'Green upholstered sofa showing the texture of the fabric',
  'sheer-curtains-living-room.webp': 'Sheer and lined curtains in a bright living room',
  'damask-curtain-fabric.webp': 'Brown and cream damask curtain fabric',
  'gold-floral-velvet-fabric.webp': 'Gold floral pattern on dark brown velvet fabric',
  'dark-brown-velvet-texture.webp': 'Dark brown velvet fabric texture',
  'mixed-texture-material-samples.webp': 'Mixed texture upholstery samples including leather and woven fabric',
  'material-samples-presentation-board.webp': 'Upholstery and material samples laid out for a client presentation',
  'fabric-sample-presentation-box.webp': 'Fabric swatches and sketches laid out for a client meeting',
  'beige-linen-fabric-swirl.webp': 'Beige linen fabric twisted into a soft swirl',
}

export const iconFiles: Record<string, string> = {
  'icon-3d-scissor.webp': '3D scissors icon',
  'icon-3d-color-palette.webp': '3D colour palette icon',
  'icon-3d-notebook.webp': '3D swatch book icon',
  'icon-3d-pin.webp': '3D pin icon',
  'icon-3d-gift-box.webp': '3D package icon',
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
    key: 'services',
    category: 'general',
    question: 'What services do you offer?',
    answer:
      'We specialise in upholstery fabric sampling: fabric swatch cutting, fabric sample hangers, and swatch books & sample catalogues. We cut your fabric rolls and turn them into organised samples — that is all we do.',
  },
  {
    key: 'swatches-only',
    category: 'products',
    question: 'Can you cut swatches only, without hangers or books?',
    answer:
      'Yes. We can cut your fabric into swatches or sample strips at the size you need and supply them sorted and ready to use. Hangers and swatch books are optional.',
  },
  {
    key: 'custom',
    category: 'products',
    question: 'Can the samples be made to our requirements?',
    answer:
      'Yes. Share your fabric range, the swatch size you need and how the samples will be used — showroom, sales visits or sending to dealers — and we will plan the layout and quantity with you.',
  },
  {
    key: 'sizes',
    category: 'products',
    question: 'Which swatch sizes can you cut?',
    answer:
      'We cut to the size you need. Tell us the swatch or strip size — or send a reference sample — and we will keep it consistent across the whole collection.',
  },
  {
    key: 'colour',
    category: 'products',
    question: 'Can the swatches be arranged colour-wise?',
    answer:
      'Yes. Swatches are sorted colour by colour, by article or by collection, so your customers can browse the range easily.',
  },
  {
    key: 'quote',
    category: 'ordering',
    question: 'How do I get a quotation?',
    answer:
      'Use the quote form or message us on WhatsApp. Include the service you need, the number of fabrics, the sample size, the quantity and your deadline. Photos of a reference sample help us quote faster.',
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
      'Minimums depend on the service and the number of pieces. We confirm the minimum quantity together with your quotation.',
  },
  {
    key: 'fabric',
    category: 'delivery',
    question: 'Do I need to supply the fabric?',
    answer:
      'Yes — we work with your own fabric rolls, so every sample matches your stock exactly. Tell us about your collection and we will confirm how much fabric is needed.',
  },
  {
    key: 'location',
    category: 'general',
    question: 'Where are you located?',
    answer:
      'We are based in Sharjah, United Arab Emirates, and work with furniture, upholstery and textile businesses across the UAE. Contact us to discuss delivery to your location.',
  },
] as const

/* ------------------------------------------------------------------ Who we serve (industries collection) */
export const industries = [
  {
    key: 'furniture',
    title: 'Furniture Manufacturers',
    slug: 'furniture-manufacturers',
    tag: 'Sofas & chairs',
    cardTone: 'sage',
    image: 'green-upholstered-sofa-fabric.webp',
    products: ['books', 'cutting'],
    summary:
      'Swatch books for sofa and chair collections, so your customers can compare every fabric option before they order.',
    needs: [
      { title: 'Every option in one place', text: 'All the fabrics offered for a sofa or chair collection, together in one book.' },
      { title: 'Texture you can feel', text: 'Swatches large enough to judge weave, pile and hand-feel — not just colour.' },
      { title: 'Easy to choose from', text: 'Sorted colour by colour, so customers find their option quickly.' },
    ],
    body: doc(
      h2('Fabric swatch books for furniture manufacturers'),
      p(
        'Customers choose a sofa or chair by its fabric as much as its shape. A swatch book puts every upholstery option for the collection in their hands, organised so they can compare colours and textures and decide with confidence.',
      ),
      h3('What we prepare for furniture makers'),
      ul([
        '**Swatch books & sample catalogues** for each sofa or chair collection',
        '**Fabric swatch cutting** from your rolls, sized to your requirement',
        '**Sample hangers** for the fabric corner of your showroom',
      ]),
    ),
  },
  {
    key: 'wholesalers',
    title: 'Upholstery Fabric Wholesalers',
    slug: 'upholstery-fabric-wholesalers',
    tag: 'Wholesale & dealers',
    cardTone: 'charcoal',
    image: 'patterned-fabric-rolls-on-shelves.webp',
    products: ['hangers', 'cutting'],
    summary:
      'Sample hangers that sofa and upholstery fabric wholesalers can hand to retailers and dealers to show the full range.',
    needs: [
      { title: 'Show the whole range', text: 'Every colour of a quality on one hanger that dealers can flip through.' },
      { title: 'Many sets, all the same', text: 'Consistent cutting and order across every hanger you send out.' },
      { title: 'Built for handling', text: 'Neat, finished swatches that stay presentable in busy shops.' },
    ],
    body: doc(
      h2('Sample hangers for upholstery fabric wholesalers'),
      p(
        'Wholesalers and sofa fabric suppliers sell through retailers and dealers who need to show your range to their own customers. Sample hangers cut from your rolls give every dealer the same organised view of each quality and its colours.',
      ),
      h3('What we prepare for wholesalers'),
      ul([
        '**Fabric sample hangers** sorted colour by colour',
        '**Fabric swatch cutting** in the quantities your dealer network needs',
        '**Swatch books** for collections you present as a set',
      ]),
    ),
  },
  {
    key: 'mills',
    title: 'Textile Mills & Fabric Suppliers',
    slug: 'textile-mills-fabric-suppliers',
    tag: 'Mills & importers',
    cardTone: 'sand',
    image: 'thread-spools-workshop.webp',
    products: ['books', 'hangers', 'cutting'],
    summary:
      'Swatches, hangers and sample catalogues that help textile mills, suppliers and importers present a new collection to buyers.',
    needs: [
      { title: 'Launch-ready samples', text: 'A new collection cut, sorted and assembled for presenting to buyers.' },
      { title: 'Organised by collection', text: 'Qualities and colours grouped the way your range is sold.' },
      { title: 'Consistent across sets', text: 'The same order and swatch size in every set you send out.' },
    ],
    body: doc(
      h2('Sample collections for textile mills and fabric suppliers'),
      p(
        'When a new collection arrives, buyers need to see and feel it before they order. We cut the fabrics from your rolls and assemble them into hangers or sample catalogues, so the collection is presented clearly from day one.',
      ),
      h3('What we prepare for mills, suppliers and importers'),
      ul([
        '**Swatch books & sample catalogues** for new collections',
        '**Fabric sample hangers** for each quality',
        '**Fabric swatch cutting** for samples you send to buyers yourself',
      ]),
    ),
  },
  {
    key: 'designers',
    title: 'Interior Design Companies',
    slug: 'interior-design-companies',
    tag: 'Interior design',
    cardTone: 'ivory',
    image: 'material-samples-presentation-board.webp',
    products: ['books', 'cutting'],
    summary:
      'Fabric swatches and compact swatch books that interior design teams use to show fabric options to their clients.',
    needs: [
      { title: 'Easy to present', text: 'Options organised so a client can compare them in one meeting.' },
      { title: 'True colour and texture', text: 'Real fabric, cut cleanly, so clients see exactly what they will get.' },
      { title: 'Compact and portable', text: 'Swatches and books that travel to site visits and client offices.' },
    ],
    body: doc(
      h2('Fabric samples for interior design companies'),
      p(
        'Interior designers present fabric options to clients for every project. Clean, consistently cut swatches and compact swatch books make those choices easier to show, compare and approve.',
      ),
      h3('What we prepare for interior designers'),
      ul([
        '**Fabric swatch cutting** for project selections',
        '**Swatch books** of the upholstery options you offer clients',
      ]),
    ),
  },
  {
    key: 'curtains',
    title: 'Curtain & Furnishing Suppliers',
    slug: 'curtain-furnishing-suppliers',
    tag: 'Curtains & furnishings',
    cardTone: 'clay',
    image: 'sheer-curtains-living-room.webp',
    products: ['hangers', 'books'],
    summary:
      'Physical samples of curtain and furnishing fabrics — on hangers that show the drape, or in books that keep a range organised.',
    needs: [
      { title: 'Show the drape', text: 'Hanging samples let fabrics fall naturally, the way they will at the window.' },
      { title: 'Real samples to touch', text: 'Customers feel weight and texture before they choose.' },
      { title: 'Organised ranges', text: 'Plains, textures and patterns grouped so a scheme comes together quickly.' },
    ],
    body: doc(
      h2('Fabric samples for curtain and furnishing suppliers'),
      p(
        'Curtain and furnishing fabrics are chosen by how they hang and how they feel. Sample hangers show the drape, while swatch books keep a full range organised for customers and designers.',
      ),
      h3('What we prepare for curtain suppliers'),
      ul(['**Fabric sample hangers** that show drape and weight', '**Swatch books & sample catalogues** for complete ranges']),
    ),
  },
  {
    key: 'showrooms',
    title: 'Furniture Showrooms',
    slug: 'furniture-showrooms',
    tag: 'Showrooms',
    cardTone: 'bronze',
    image: 'hanging-fabric-swatches-display.webp',
    products: ['hangers', 'books'],
    summary:
      'Hangers and swatch books that make fabric selection quick and easy for customers visiting your showroom.',
    needs: [
      { title: 'Quick to browse', text: 'Customers find the colour and texture they want without help.' },
      { title: 'Neat on display', text: 'Organised hangers and books that keep the showroom looking its best.' },
      { title: 'Easy to replace', text: 'Re-order the same samples when a range is updated.' },
    ],
    body: doc(
      h2('Fabric samples for furniture showrooms'),
      p(
        'In a showroom, fabric selection should be simple. Sample hangers on a rail and swatch books on the table let customers explore colours and textures at their own pace and choose with confidence.',
      ),
      h3('What we prepare for showrooms'),
      ul(['**Fabric sample hangers** for rails and stands', '**Swatch books & sample catalogues** for the selection table']),
    ),
  },
] as const

/* ------------------------------------------------------------------ Services (products collection) */
export const products = [
  {
    key: 'cutting',
    order: 1,
    title: 'Fabric Swatch Cutting',
    cardTitle: 'Fabric Swatch|Cutting',
    slug: 'fabric-swatch-cutting',
    cardTone: 'charcoal',
    hero: 'tailor-scissors-cutting-swatches.webp',
    gallery: ['stacked-colour-fabric-swatches.webp', 'patterned-fabric-rolls-on-shelves.webp'],
    faqs: ['swatches-only', 'sizes', 'fabric', 'quote'],
    summary:
      'We cut your upholstery fabric rolls into clean, consistent swatches and sample strips — sized to your requirement and sorted colour by colour.',
    whatsappMessage: "Hello, I'd like a quotation for fabric swatch cutting.",
    specs: [
      { label: 'Fabric', value: 'Upholstery and furnishing fabrics, cut from your rolls' },
      { label: 'Swatch size', value: 'Cut to your required size' },
      { label: 'Finishing', value: 'Neat, finished swatches ready for handling' },
      { label: 'Sorting', value: 'Colour-wise, by article or by collection' },
      { label: 'Supplied as', value: 'Loose swatches, or assembled on hangers or in books' },
      { label: 'Minimum order', value: 'Confirmed with your quotation' },
    ],
    useCases: [
      'Fabric wholesalers sending samples to dealers',
      'Textile suppliers launching a new collection',
      'Furniture makers preparing samples for customers',
      'Interior designers presenting project options',
    ],
    body: doc(
      h2('Fabric swatch cutting from your rolls'),
      p(
        'Every good sample starts with a clean cut. We take your fabric rolls and cut them into swatches or sample strips of the same size, so every piece in the collection looks consistent and professional.',
      ),
      h3('How we work'),
      ul([
        'Swatches and strips cut to the size you specify',
        'Finished so they look neat and hold up to handling',
        'Sorted colour by colour, by article or by collection',
        'Supplied loose, or assembled into hangers and swatch books',
      ]),
      h3('What to send us'),
      ol([
        'Your fabric rolls, or a list of the qualities and colours',
        'The swatch size you need (or a reference sample)',
        'The quantity and your deadline',
      ]),
    ),
  },
  {
    key: 'hangers',
    order: 2,
    title: 'Fabric Sample Hangers',
    cardTitle: 'Fabric Sample|Hangers',
    slug: 'fabric-sample-hangers',
    cardTone: 'sand',
    hero: 'designer-choosing-fabric-samples.webp',
    gallery: ['stacked-colour-fabric-swatches.webp', 'hanging-fabric-swatches-display.webp'],
    faqs: ['custom', 'colour', 'quote', 'moq'],
    summary:
      'Fabric swatches cut and assembled on hangers, so your customers can flip through colours and feel textures on a rail, stand or showroom wall.',
    whatsappMessage: "Hello, I'd like a quotation for fabric sample hangers.",
    specs: [
      { label: 'Fabric', value: 'Upholstery and furnishing fabrics, cut from your rolls' },
      { label: 'Swatches per hanger', value: 'Planned around your colour range' },
      { label: 'Arrangement', value: 'Colour-wise or by article' },
      { label: 'Display', value: 'Showroom rails, stands or walls' },
      { label: 'Minimum order', value: 'Confirmed with your quotation' },
    ],
    useCases: [
      'Upholstery fabric wholesalers supplying retailers and dealers',
      'Furniture showrooms',
      'Curtain and furnishing suppliers',
      'Qualities with many colours',
    ],
    body: doc(
      h2('Fabric sample hangers for upholstery collections'),
      p(
        'A sample hanger shows every colour of a fabric quality in one place. Customers can flip through the range, lift a swatch to feel it and choose without unrolling a single bolt.',
      ),
      h3('When to choose hangers'),
      ul([
        'Qualities with many colours',
        'Showrooms with rails, stands or wall space',
        'Ranges you send to retailers and dealers',
        'Curtain and furnishing fabrics where drape matters',
      ]),
    ),
  },
  {
    key: 'books',
    order: 3,
    title: 'Swatch Books & Sample Catalogues',
    cardTitle: 'Swatch Books &|Sample Catalogues',
    slug: 'swatch-books-sample-catalogues',
    cardTone: 'ivory',
    hero: 'fabric-header-card-swatch-strips.webp',
    gallery: ['upholstery-fabric-swatches-overlapping.webp', 'plum-and-rust-fabric-swatches.webp'],
    faqs: ['custom', 'colour', 'quote', 'moq'],
    summary:
      'Swatch books and sample catalogues that present your upholstery collection in one organised book — easy to carry, browse and choose from.',
    whatsappMessage: "Hello, I'd like a quotation for swatch books / sample catalogues.",
    specs: [
      { label: 'Contents', value: 'Your fabrics, cut and arranged page by page' },
      { label: 'Layout', value: 'Colour-wise, by quality or by collection' },
      { label: 'Size', value: 'Planned around your swatch size and range' },
      { label: 'Binding & cover', value: 'Discussed with your quotation' },
      { label: 'Minimum order', value: 'Confirmed with your quotation' },
    ],
    useCases: [
      'Sofa and chair collections',
      'New collection launches',
      'Showrooms and interior design studios',
      'Sales visits and client meetings',
    ],
    body: doc(
      h2('Swatch books and sample catalogues for upholstery fabrics'),
      p(
        'A swatch book keeps a whole collection in one place. Customers can browse every quality and colour, compare textures side by side and note exactly what they want to order.',
      ),
      h3('Organised the way your customers choose'),
      p(
        'We arrange the swatches colour by colour, by quality or by collection — whichever makes your range easiest to browse in a showroom or on a sales visit.',
      ),
      h3('What to send us'),
      ol([
        'Your fabric rolls, or a list of the qualities and colours',
        'The swatch size and preferred layout (or a reference photo)',
        'The number of books and your deadline',
      ]),
    ),
  },
] as const

/* ------------------------------------------------------------------ Process */
export const processSteps = [
  {
    title: 'Receive your fabric rolls',
    text: 'You send the fabric rolls for the collection with your requirements: swatch size, quantity and how the samples will be presented.',
    image: 'patterned-fabric-rolls-on-shelves.webp',
  },
  {
    title: 'Cut to size',
    text: 'Each fabric is cut into swatches or sample strips at the agreed size, keeping every piece consistent.',
    image: 'tailor-scissors-cutting-swatches.webp',
  },
  {
    title: 'Finish',
    text: 'Cut pieces are finished so every swatch looks neat and holds up to handling by your customers.',
    image: 'stitching-fabric-samples-sewing-machine.webp',
  },
  {
    title: 'Sort colour by colour',
    text: 'Swatches are sorted colour-wise, by article or by collection — the order your customers will browse them in.',
    image: 'stacked-colour-fabric-swatches.webp',
  },
  {
    title: 'Assemble hangers & books',
    text: 'Sorted swatches are assembled onto sample hangers or into swatch books and sample catalogues.',
    image: 'fabric-header-card-swatch-strips.webp',
  },
  {
    title: 'Quality check',
    text: 'Every hanger and book is checked for the right order, alignment and clean edges before packing.',
    image: 'designer-choosing-fabric-samples.webp',
  },
  {
    title: 'Pack & deliver',
    text: 'Finished samples are packed with care and prepared for delivery or collection.',
    image: 'folded-fabric-stack-neutral.webp',
  },
]

/* ------------------------------------------------------------------ Projects (examples — replace with real work and photos) */
export const projects = [
  {
    title: 'Colour-wise sample hangers for an upholstery fabric wholesaler',
    slug: 'upholstery-wholesaler-sample-hangers',
    cover: 'stacked-colour-fabric-swatches.webp',
    gallery: ['designer-choosing-fabric-samples.webp', 'hanging-fabric-swatches-display.webp'],
    products: ['cutting', 'hangers'],
    industries: ['wholesalers'],
    summary: 'Fabric cut from the wholesaler’s rolls, sorted colour by colour and assembled on hangers for dealers and retailers.',
    specs: [
      { label: 'Service', value: 'Fabric sample hangers' },
      { label: 'Arrangement', value: 'Colour-wise' },
    ],
  },
  {
    title: 'Swatch book for a sofa collection',
    slug: 'sofa-collection-swatch-book',
    cover: 'upholstery-fabric-swatches-overlapping.webp',
    gallery: ['fabric-header-card-swatch-strips.webp', 'green-upholstered-sofa-fabric.webp'],
    products: ['cutting', 'books'],
    industries: ['furniture'],
    summary: 'A swatch book presenting the fabric options for a sofa and chair collection, organised by colour family.',
    specs: [
      { label: 'Service', value: 'Swatch book' },
      { label: 'Layout', value: 'By colour family' },
    ],
  },
  {
    title: 'New collection swatches for a fabric supplier',
    slug: 'fabric-supplier-collection-swatches',
    cover: 'plum-and-rust-fabric-swatches.webp',
    gallery: ['patterned-fabric-rolls-on-shelves.webp', 'folded-fabric-stack-neutral.webp'],
    products: ['cutting'],
    industries: ['mills'],
    summary: 'Swatches cut from a new collection’s rolls, finished and sorted by article so the supplier could send them to buyers.',
    specs: [
      { label: 'Service', value: 'Fabric swatch cutting' },
      { label: 'Sorting', value: 'By article' },
    ],
  },
  {
    title: 'Velvet upholstery sample catalogue',
    slug: 'velvet-upholstery-sample-catalogue',
    cover: 'gold-floral-velvet-fabric.webp',
    gallery: ['dark-brown-velvet-texture.webp', 'draped-bronze-fabric-texture.webp'],
    products: ['books'],
    industries: ['showrooms', 'designers'],
    summary: 'A sample catalogue for a velvet upholstery range, made for showroom and designer use.',
    specs: [{ label: 'Service', value: 'Sample catalogue' }],
  },
  {
    title: 'Curtain fabric sample hangers for a furnishing supplier',
    slug: 'curtain-fabric-sample-hangers',
    cover: 'damask-curtain-fabric.webp',
    gallery: ['sheer-curtains-living-room.webp', 'hanging-fabric-swatches-display.webp'],
    products: ['hangers'],
    industries: ['curtains'],
    summary: 'Hanging samples that let a curtain and furnishing range show its drape on a showroom rail.',
    specs: [
      { label: 'Service', value: 'Fabric sample hangers' },
      { label: 'Display', value: 'Showroom rail' },
    ],
  },
  {
    title: 'Fabric selection book for an interior design studio',
    slug: 'interior-studio-fabric-selection-book',
    cover: 'beige-linen-fabric-swirl.webp',
    gallery: ['material-samples-presentation-board.webp', 'mixed-texture-material-samples.webp'],
    products: ['cutting', 'books'],
    industries: ['designers'],
    summary: 'A compact swatch book of upholstery options that an interior design team uses in client meetings.',
    specs: [{ label: 'Service', value: 'Swatch book' }],
  },
]

/* ------------------------------------------------------------------ Guides */
export const guides = [
  {
    title: 'How Fabric Sample Hangers and Swatch Books Are Made',
    slug: 'how-fabric-samples-are-made',
    image: 'fabric-header-card-swatch-strips.webp',
    relatedProducts: ['cutting', 'hangers', 'books'],
    excerpt:
      'From receiving the fabric rolls to cutting, finishing, sorting and assembly — what happens when a fabric collection becomes a set of samples.',
    content: doc(
      p(
        'A sample hanger or swatch book looks simple, but it is the result of careful steps that decide whether customers find it easy to use. Here is how a fabric collection becomes a finished set of samples.',
      ),
      h2('1. Plan the samples'),
      p(
        'Start with the customer. Will the samples hang in a showroom, travel with a sales team or go to dealers? That decides the swatch size, the format — hanger or book — and how many sets are needed.',
      ),
      h2('2. Receive the fabric rolls'),
      p('The fabric for the collection arrives on rolls, together with the list of qualities and colours to include.'),
      h2('3. Cut and finish the swatches'),
      p(
        'Each fabric is cut to the same swatch size and finished so the edges stay neat with handling. Larger swatches suit textured upholstery fabrics; smaller ones work for plain colour ranges.',
      ),
      h2('4. Sort colour by colour'),
      p(
        'Swatches are sorted colour-wise, by article or by collection — the order in which customers will browse them.',
      ),
      h2('5. Assemble, check and pack'),
      p(
        'The sorted swatches are assembled onto hangers or into swatch books, every piece is checked for order and alignment, and the finished samples are packed for delivery.',
      ),
      h2('What to prepare before asking for a quote'),
      ul([
        'The list of qualities and colours to include',
        'The swatch size you need',
        'Hangers, swatch books or loose swatches',
        'The quantity and your deadline',
      ]),
    ),
  },
  {
    title: 'Sample Hangers or Swatch Books: Which Suits Your Fabric Collection?',
    slug: 'sample-hangers-vs-swatch-books',
    image: 'stacked-colour-fabric-swatches.webp',
    relatedProducts: ['hangers', 'books'],
    excerpt:
      'Hangers and swatch books suit different ways of selling fabric. Here is how to choose — and when cut swatches alone are enough.',
    content: doc(
      p(
        'The right sample format makes your collection easier to sell. The best choice depends on the fabric, the size of the colour range and where customers will see it.',
      ),
      h2('Fabric sample hangers'),
      p(
        'Best for **one quality in many colours**, and for fabrics where drape matters. Hangers suit showroom rails and stands, and are easy for dealers to flip through.',
      ),
      h2('Swatch books & sample catalogues'),
      p(
        'Best for **complete collections** with several qualities — for example all the fabrics offered for a sofa range. Books are portable and keep everything organised.',
      ),
      h2('Cut swatches only'),
      p(
        'Best when you **send samples to buyers yourself** or need loose swatches for designers. We cut and sort them, ready to use.',
      ),
      h2('Quick guide'),
      ul([
        'One fabric, many colours, showroom rail → **sample hanger**',
        'Several qualities, one collection → **swatch book**',
        'Samples to send or hand out → **cut swatches**',
      ]),
    ),
  },
  {
    title: 'What Affects the Cost of Fabric Sampling?',
    slug: 'fabric-sampling-cost-factors',
    image: 'mixed-texture-material-samples.webp',
    relatedProducts: ['cutting', 'books'],
    excerpt:
      'The number of fabrics, swatch size, format and quantity all shape the price of fabric samples. Here is what to consider.',
    content: doc(
      p(
        'Every set of samples is made to order, so prices depend on the specification. Knowing the main factors helps you plan a budget and get an accurate quotation faster.',
      ),
      h2('The main cost factors'),
      ul([
        '**Number of fabrics and colours** — each one is cut, finished and sorted.',
        '**Swatch size** — larger swatches use more fabric and handling time.',
        '**Format** — loose swatches, hangers or swatch books.',
        '**Quantity** — set-up work is shared across a larger order.',
        '**Deadline** — tell us early if the samples are needed by a fixed date.',
      ]),
      h2('How to get an accurate quote'),
      p(
        'Send the service you need, the number of fabrics, the swatch size, the quantity and your deadline. A photo of a reference sample removes most of the guesswork.',
      ),
    ),
  },
]

export const privacyPolicy = doc(
  p('**Last updated: 22 October 2026.**'),
  p(
    'This policy explains how Al Hejlah Catalogue Manufacture (“we”, “us”), based in Sharjah, United Arab Emirates, handles personal information collected through this website. We follow the UAE Personal Data Protection Law (Federal Decree-Law No. 45 of 2021).',
  ),
  h2('Information we collect'),
  ul([
    '**Quote requests:** your name, company, email, phone number, the service you need, quantity, sample size, deadline and any message you write in the form.',
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
