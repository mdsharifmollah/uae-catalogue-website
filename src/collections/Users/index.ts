import type { CollectionConfig } from 'payload'
import { Forbidden } from 'payload'

import { authenticated } from '../../access/authenticated'

export const Users: CollectionConfig = {
  slug: 'users',
  access: {
    admin: authenticated,
    create: authenticated,
    delete: authenticated,
    read: authenticated,
    update: authenticated,
  },
  admin: {
    group: 'Settings',
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  auth: true,
  hooks: {
    beforeChange: [
      ({ data, operation, req }) => {
        // On a deployed site the "create first user" screen is public until an
        // admin exists. With ADMIN_EMAIL set, only that address can claim it.
        if (operation === 'create' && !req.user) {
          const allowed = process.env.ADMIN_EMAIL?.toLowerCase().trim()
          if (allowed && String(data?.email || '').toLowerCase().trim() !== allowed) {
            throw new Forbidden(req.t)
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
  ],
  timestamps: true,
}
