import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'

import { seed } from '../endpoints/seed'

/**
 * Content for the real business — upholstery fabric sampling: fabric swatch
 * cutting, fabric sample hangers, and swatch books & sample catalogues; who we
 * serve, the seven-step process, the new home page and quote form — in
 * English and Arabic. Replaces the earlier starter content. Users and quote
 * enquiries are kept, and existing photos are reused.
 */
export async function up({ payload, req }: MigrateUpArgs): Promise<void> {
  await seed({ payload, req })
}

export async function down(_args: MigrateDownArgs): Promise<void> {
  // Content change only; edit in the dashboard to change it.
}
