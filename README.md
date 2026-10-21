# UAE Catalogue Manufacture — website

Next.js 16 + Payload CMS 3 site for UAE Catalogue Manufacture, a Sharjah, UAE maker of all kinds of catalogues
(fabric sample books, waterfall hangers, shade cards, presentation boxes).
Everything (text, photos, products, FAQs, WhatsApp number, SEO) is edited from the dashboard at **/admin**.

## Run locally

```bash
pnpm install
cp .env.example .env        # fill DATABASE_URL and secrets
pnpm dev                    # http://localhost:3000 — dashboard at /admin
pnpm seed                   # optional: load starter content + photos (clears content, keeps users)
```

Local Postgres (Homebrew) must be started with a valid locale:
`LC_ALL=en_US.UTF-8 pg_ctl -D /usr/local/var/postgresql@17 -l /usr/local/var/log/postgresql@17.log start`

## Live deployment (Vercel)

- Project: `odleans-projects/ua-fabric-catalog` — https://ua-fabric-catalog.vercel.app
- Database: Neon Postgres (free, Frankfurt), connected via Vercel Marketplace → `DATABASE_URL`
- Images: Vercel Blob store `ua-fabric-media` (Frankfurt) → `BLOB_READ_WRITE_TOKEN`
- Functions region: `fra1` (closest to the UAE that Neon offers)
- Build: `pnpm run ci` = `payload migrate && next build` (schema changes ship as migrations in `src/migrations`)
- `ADMIN_EMAIL` env: only this address can create the first dashboard user
- `SITE_INDEXABLE` env: unset = `noindex` + robots disallow. Set to `true` only on launch with real content + domain.

After changing collections/fields: `pnpm payload migrate:create <name>` (run with `BLOB_READ_WRITE_TOKEN` set so storage fields are included), commit, deploy.

## Where things are edited (dashboard)

| What | Where |
|---|---|
| Company name, WhatsApp number, phone, email, address, hours, analytics IDs | Settings → Site Settings |
| Menu and footer links | Settings → Header / Footer |
| Homepage and other pages (drag sections to reorder) | Content → Pages |
| Product formats (each gets an SEO page) | Catalogue → Product formats |
| Industries, portfolio | Catalogue → Industries / Our Work |
| FAQs, guides (blog), testimonials | Content |
| Quote requests from the website | Leads → Inquiries |
| 301 redirects | Settings → Redirects |

Headings: wrap one word in `*asterisks*` to show it in the italic accent font.

## Before launch — must be replaced (starter content is placeholder)

- Logo and exact address (Site Settings). Company name, WhatsApp/phone and email are set
  (UAE Catalogue Manufacture · +971 55 652 8018 · saifuliths92@gmail.com).
- **All portfolio projects and photos** — the starter ones are stock images (Unsplash License) for layout only
- Confirm every product format, spec and process step matches what the business actually offers
- Privacy policy page
- Testimonials/client logos only with permission (only "verified" ones are shown)

## SEO built in

Server-rendered pages, per-page title/description/OG image (SEO tab), canonical URLs, `sitemap.xml`,
`robots.txt` (blocks indexing outside production), `llms.txt`, JSON-LD (Organization + LocalBusiness,
Service, BreadcrumbList, FAQPage, Article), descriptive image alt text, 301 redirects.

## Motion

GSAP ScrollTrigger + Lenis: scroll-blended section backgrounds, pinned process scrollytelling,
horizontal work gallery, WebGL fabric hero (OGL). All motion is disabled for `prefers-reduced-motion`,
and content stays visible without JavaScript.

## Credits

Stock photos: Unsplash (Unsplash License). 3D icons: 3dicons.co by Vijay Verma (CC0).
