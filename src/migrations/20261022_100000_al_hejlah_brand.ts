import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Data only: brand name Al Hejlah Catalogue Manufacture (short name "Al Hejlah")
// in Site Settings and SEO titles. Safe to run more than once.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "site_settings" SET
     "company_name" = 'Al Hejlah Catalogue Manufacture',
     "short_name" = 'Al Hejlah',
     "title_suffix" = 'Al Hejlah';
   UPDATE "pages_locales" SET "meta_description" = replace("meta_description", 'UAE Catalogue Manufacture', 'Al Hejlah Catalogue Manufacture') WHERE "meta_description" LIKE '%UAE Catalogue Manufacture%' AND "meta_description" NOT LIKE '%Al Hejlah%';
   UPDATE "_pages_v_locales" SET "version_meta_description" = replace("version_meta_description", 'UAE Catalogue Manufacture', 'Al Hejlah Catalogue Manufacture') WHERE "version_meta_description" LIKE '%UAE Catalogue Manufacture%' AND "version_meta_description" NOT LIKE '%Al Hejlah%';
   UPDATE "pages_locales" SET "meta_title" = replace("meta_title", '| UAE Catalogue', '| Al Hejlah') WHERE "meta_title" LIKE '%| UAE Catalogue';
   UPDATE "_pages_v_locales" SET "version_meta_title" = replace("version_meta_title", '| UAE Catalogue', '| Al Hejlah') WHERE "version_meta_title" LIKE '%| UAE Catalogue';
   UPDATE "products_locales" SET "meta_title" = replace("meta_title", '| UAE Catalogue', '| Al Hejlah') WHERE "meta_title" LIKE '%| UAE Catalogue';
   UPDATE "_products_v_locales" SET "version_meta_title" = replace("version_meta_title", '| UAE Catalogue', '| Al Hejlah') WHERE "version_meta_title" LIKE '%| UAE Catalogue';
   UPDATE "industries_locales" SET "meta_title" = replace("meta_title", '| UAE Catalogue', '| Al Hejlah') WHERE "meta_title" LIKE '%| UAE Catalogue';
   UPDATE "_industries_v_locales" SET "version_meta_title" = replace("version_meta_title", '| UAE Catalogue', '| Al Hejlah') WHERE "version_meta_title" LIKE '%| UAE Catalogue';
   UPDATE "posts_locales" SET "meta_title" = replace("meta_title", '| UAE Catalogue', '| Al Hejlah') WHERE "meta_title" LIKE '%| UAE Catalogue';
   UPDATE "_posts_v_locales" SET "version_meta_title" = replace("version_meta_title", '| UAE Catalogue', '| Al Hejlah') WHERE "version_meta_title" LIKE '%| UAE Catalogue';`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Content change only; nothing to restore.
}
