import * as migration_20261020_144557_initial from './20261020_144557_initial';
import * as migration_20261020_145021_media_blob_storage from './20261020_145021_media_blob_storage';
import * as migration_20261021_090000_company_details from './20261021_090000_company_details';
import * as migration_20261021_120000_whatsapp_number from './20261021_120000_whatsapp_number';
import * as migration_20261022_100000_al_hejlah_brand from './20261022_100000_al_hejlah_brand';
import * as migration_20261022_110000_quote_notification from './20261022_110000_quote_notification';
import * as migration_20261022_120000_content_updates from './20261022_120000_content_updates';
import * as migration_20261022_123844_add_arabic_locale from './20261022_123844_add_arabic_locale';
import * as migration_20261022_140000_arabic_content from './20261022_140000_arabic_content';

export const migrations = [
  {
    up: migration_20261020_144557_initial.up,
    down: migration_20261020_144557_initial.down,
    name: '20261020_144557_initial',
  },
  {
    up: migration_20261020_145021_media_blob_storage.up,
    down: migration_20261020_145021_media_blob_storage.down,
    name: '20261020_145021_media_blob_storage',
  },
  {
    up: migration_20261021_090000_company_details.up,
    down: migration_20261021_090000_company_details.down,
    name: '20261021_090000_company_details',
  },
  {
    up: migration_20261021_120000_whatsapp_number.up,
    down: migration_20261021_120000_whatsapp_number.down,
    name: '20261021_120000_whatsapp_number',
  },
  {
    up: migration_20261022_100000_al_hejlah_brand.up,
    down: migration_20261022_100000_al_hejlah_brand.down,
    name: '20261022_100000_al_hejlah_brand',
  },
  {
    up: migration_20261022_110000_quote_notification.up,
    down: migration_20261022_110000_quote_notification.down,
    name: '20261022_110000_quote_notification',
  },
  {
    up: migration_20261022_120000_content_updates.up,
    down: migration_20261022_120000_content_updates.down,
    name: '20261022_120000_content_updates'
  },
  {
    up: migration_20261022_123844_add_arabic_locale.up,
    down: migration_20261022_123844_add_arabic_locale.down,
    name: '20261022_123844_add_arabic_locale'
  },
  {
    up: migration_20261022_140000_arabic_content.up,
    down: migration_20261022_140000_arabic_content.down,
    name: '20261022_140000_arabic_content'
  },
];
