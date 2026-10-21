import React, { Fragment } from 'react'

import type { Page } from '@/payload-types'

import { ArchiveBlock } from '@/blocks/ArchiveBlock/Component'
import { CallToActionBlock } from '@/blocks/CallToAction/Component'
import { CapabilitiesBlock } from '@/blocks/Capabilities/Component'
import { ContentBlock } from '@/blocks/Content/Component'
import { FAQBlockComponent } from '@/blocks/FAQ/Component'
import { FormBlock } from '@/blocks/Form/Component'
import { FormatGridBlock } from '@/blocks/FormatGrid/Component'
import { IndustriesCarouselBlock } from '@/blocks/IndustriesCarousel/Component'
import { LogosBlockComponent } from '@/blocks/Logos/Component'
import { MediaBlock } from '@/blocks/MediaBlock/Component'
import { MediaTextBlock } from '@/blocks/MediaText/Component'
import { ProcessStoryBlock } from '@/blocks/ProcessStory/Component'
import { StatsBandBlock } from '@/blocks/StatsBand/Component'
import { TestimonialsBlockComponent } from '@/blocks/Testimonials/Component'
import { WorkGalleryBlock } from '@/blocks/WorkGallery/Component'
import { Section } from '@/components/site/Section'

const blockComponents = {
  archive: ArchiveBlock,
  capabilities: CapabilitiesBlock,
  content: ContentBlock,
  cta: CallToActionBlock,
  faq: FAQBlockComponent,
  formBlock: FormBlock,
  formatGrid: FormatGridBlock,
  industriesCarousel: IndustriesCarouselBlock,
  logos: LogosBlockComponent,
  mediaText: MediaTextBlock,
  processStory: ProcessStoryBlock,
  statsBand: StatsBandBlock,
  testimonials: TestimonialsBlockComponent,
  workGallery: WorkGalleryBlock,
}

export const RenderBlocks: React.FC<{
  blocks: NonNullable<Page['layout']>[number][] | null | undefined
}> = ({ blocks }) => {
  if (!blocks || !Array.isArray(blocks) || blocks.length === 0) return null

  return (
    <Fragment>
      {blocks.map((block, index) => {
        const { blockType } = block

        if (blockType === 'mediaBlock') {
          return (
            <Section key={block.id || index} tone="ivory" className="!py-12">
              <div className="shell">
                <MediaBlock {...block} disableInnerContainer enableGutter={false} />
              </div>
            </Section>
          )
        }

        if (blockType && blockType in blockComponents) {
          const Block = blockComponents[blockType as keyof typeof blockComponents]
          if (Block) {
            // @ts-expect-error each block receives its own typed props
            return <Block key={block.id || index} {...block} />
          }
        }
        return null
      })}
    </Fragment>
  )
}
