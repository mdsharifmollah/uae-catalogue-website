import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  LinkFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { MediaBlock } from '@/blocks/MediaBlock/config'

/** Long-form editor for product, industry, project and guide bodies. */
export const contentEditor = lexicalEditor({
  features: ({ rootFeatures }) => [
    ...rootFeatures.filter((f) => f.key !== 'link'),
    HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
    LinkFeature({ enabledCollections: ['pages', 'posts', 'products', 'industries', 'projects'] }),
    BlocksFeature({ blocks: [MediaBlock] }),
    FixedToolbarFeature(),
    InlineToolbarFeature(),
    HorizontalRuleFeature(),
  ],
})
