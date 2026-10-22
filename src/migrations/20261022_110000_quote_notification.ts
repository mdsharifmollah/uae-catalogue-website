import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

// Data only: email the business (not just the customer) for every quote request.
// Added once per form; replying to the email goes to the customer.
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   WITH f AS (
     SELECT "id" FROM "forms"
     WHERE NOT EXISTS (
       SELECT 1 FROM "forms_emails" e WHERE e."_parent_id" = "forms"."id" AND e."email_to" = 'saifuliths92@gmail.com'
     )
   ), e AS (
     INSERT INTO "forms_emails" ("_order", "_parent_id", "id", "email_to", "reply_to")
     SELECT 2, f."id", md5(random()::text || f."id"::text)::varchar(24), 'saifuliths92@gmail.com', '{{email}}' FROM f
     RETURNING "id"
   )
   INSERT INTO "forms_emails_locales" ("subject", "message", "_locale", "_parent_id")
   SELECT 'New quote request: {{name}} ({{company}})',
     '{"root":{"type":"root","format":"","indent":0,"version":1,"direction":"ltr","children":[{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","textStyle":"","textFormat":0,"children":[{"mode":"normal","text":"New quote request from the website:","type":"text","style":"","detail":0,"format":0,"version":1}]},{"type":"paragraph","format":"","indent":0,"version":1,"direction":"ltr","textStyle":"","textFormat":0,"children":[{"mode":"normal","text":"{{*:table}}","type":"text","style":"","detail":0,"format":0,"version":1}]}]}}'::jsonb,
     'en', e."id" FROM e;`)
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Content change only; remove the email in the dashboard if no longer wanted.
}
