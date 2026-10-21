/**
 * CLI seed: `pnpm seed` — loads the starter content without opening the dashboard.
 * The dashboard "Seed" button does the same thing.
 */
import config from '@payload-config'
import { createLocalReq, getPayload } from 'payload'

import { seed } from '@/endpoints/seed'

const payload = await getPayload({ config })
const req = await createLocalReq({}, payload)
await seed({ payload, req })
process.exit(0)
