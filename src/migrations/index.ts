import * as migration_20261020_144557_initial from './20261020_144557_initial';
import * as migration_20261020_145021_media_blob_storage from './20261020_145021_media_blob_storage';
import * as migration_20261021_090000_company_details from './20261021_090000_company_details';

export const migrations = [
  {
    up: migration_20261020_144557_initial.up,
    down: migration_20261020_144557_initial.down,
    name: '20261020_144557_initial',
  },
  {
    up: migration_20261020_145021_media_blob_storage.up,
    down: migration_20261020_145021_media_blob_storage.down,
    name: '20261020_145021_media_blob_storage'
  },
  {
    up: migration_20261021_090000_company_details.up,
    down: migration_20261021_090000_company_details.down,
    name: '20261021_090000_company_details'
  },
];
