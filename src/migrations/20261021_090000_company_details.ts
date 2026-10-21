import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Data only: real company name and contact details in place of the starter
// placeholders, and the new brand in SEO titles. Safe to run more than once.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "site_settings" SET
     "company_name" = 'UAE Catalogue Manufacture',
     "short_name" = 'UAE Catalogue',
     "title_suffix" = 'UAE Catalogue',
     "whatsapp_number" = '971556528018',
     "phone_number" = '971556528018',
     "phone_display" = '+971 55 652 8018',
     "email" = 'saifuliths92@gmail.com';
   UPDATE "site_settings_locales" SET
     "tagline" = 'Specialists in all kinds of catalogues: fabric sample books, waterfall hangers, shade cards and presentation boxes for textile and interior businesses.',
     "default_description" = 'All kinds of catalogues, made in Sharjah, UAE: fabric sample books, waterfall hangers, numbered shade cards and sample boxes for textile and interior brands.',
     "whatsapp_default_message" = 'Hello, I''d like a quotation for catalogues.';
   UPDATE "pages_locales" SET "meta_description" = replace("meta_description", 'UA Fabric Catalog Manufacturing', 'UAE Catalogue Manufacture') WHERE "meta_description" LIKE '%UA Fabric Catalog Manufacturing%';
   UPDATE "_pages_v_locales" SET "version_meta_description" = replace("version_meta_description", 'UA Fabric Catalog Manufacturing', 'UAE Catalogue Manufacture') WHERE "version_meta_description" LIKE '%UA Fabric Catalog Manufacturing%';
   UPDATE "pages_locales" SET "meta_title" = replace("meta_title", '| UA Fabric', '| UAE Catalogue') WHERE "meta_title" LIKE '%| UA Fabric';
   UPDATE "_pages_v_locales" SET "version_meta_title" = replace("version_meta_title", '| UA Fabric', '| UAE Catalogue') WHERE "version_meta_title" LIKE '%| UA Fabric';
   UPDATE "products_locales" SET "meta_title" = replace("meta_title", '| UA Fabric', '| UAE Catalogue') WHERE "meta_title" LIKE '%| UA Fabric';
   UPDATE "_products_v_locales" SET "version_meta_title" = replace("version_meta_title", '| UA Fabric', '| UAE Catalogue') WHERE "version_meta_title" LIKE '%| UA Fabric';
   UPDATE "industries_locales" SET "meta_title" = replace("meta_title", '| UA Fabric', '| UAE Catalogue') WHERE "meta_title" LIKE '%| UA Fabric';
   UPDATE "_industries_v_locales" SET "version_meta_title" = replace("version_meta_title", '| UA Fabric', '| UAE Catalogue') WHERE "version_meta_title" LIKE '%| UA Fabric';
   UPDATE "posts_locales" SET "meta_title" = replace("meta_title", '| UA Fabric', '| UAE Catalogue') WHERE "meta_title" LIKE '%| UA Fabric';
   UPDATE "_posts_v_locales" SET "version_meta_title" = replace("version_meta_title", '| UA Fabric', '| UAE Catalogue') WHERE "version_meta_title" LIKE '%| UA Fabric';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Content change only; the previous values were placeholders, nothing to restore.
}
