import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Data only: new WhatsApp / phone number (the previous one is no longer used),
// and a shorter phone quote label that fits the docked bottom bar.
export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   UPDATE "site_settings" SET
     "whatsapp_number" = '971558493932',
     "phone_number" = '971558493932',
     "phone_display" = '+971 55 849 3932';
   UPDATE "site_settings_locales" SET "mobile_bar_label" = 'Get a quote'
     WHERE "mobile_bar_label" = 'Get a quote on WhatsApp';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Content change only; nothing to restore.
}
