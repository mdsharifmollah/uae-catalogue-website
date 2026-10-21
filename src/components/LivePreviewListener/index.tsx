'use client'
import { getClientSideURL } from '@/utilities/getURL'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/navigation'
import React from 'react'

// Only rendered in draft mode; keep the live-preview client out of every page's bundle.
const PayloadLivePreview = dynamic(
  () => import('@payloadcms/live-preview-react').then((m) => m.RefreshRouteOnSave),
  { ssr: false },
)

export const LivePreviewListener: React.FC = () => {
  const router = useRouter()
  return <PayloadLivePreview refresh={router.refresh} serverURL={getClientSideURL()} />
}
