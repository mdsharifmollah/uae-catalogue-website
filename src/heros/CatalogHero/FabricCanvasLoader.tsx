'use client'

import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react'

const FabricCanvas = dynamic(() => import('./FabricCanvas'), { ssr: false })

/**
 * True only when WebGL runs on a real GPU. Software renderers (SwiftShader,
 * llvmpipe — common in VMs, old devices and headless browsers) would render
 * the shader on the CPU and block the page, so the static image is kept.
 */
const hasHardwareWebGL = () => {
  try {
    const canvas = document.createElement('canvas')
    const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true }) as WebGLRenderingContext | null
    if (!gl) return false
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return !/swiftshader|llvmpipe|software|basic render/i.test(renderer)
  } catch {
    return false
  }
}

/**
 * Decides whether the WebGL fabric should run at all, and only after the page
 * is idle so it never competes with the first paint. Skipped for reduced
 * motion, Save-Data and low-power devices — the static image stays instead.
 */
export const FabricCanvasLoader: React.FC<{ src: string }> = ({ src }) => {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nav = navigator as Navigator & { connection?: { saveData?: boolean }; deviceMemory?: number }
    const saveData = nav.connection?.saveData
    const weak = (nav.hardwareConcurrency || 8) <= 2 || (nav.deviceMemory || 8) <= 2
    if (reduce || saveData || weak || !hasHardwareWebGL()) return

    // Start only once the page has fully loaded and the main thread is idle.
    let idleId: number | undefined
    let timer: number | undefined
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number
      cancelIdleCallback?: (id: number) => void
    }
    const start = () => {
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => setEnabled(true), { timeout: 2500 })
      else timer = window.setTimeout(() => setEnabled(true), 600)
    }
    if (document.readyState === 'complete') start()
    else window.addEventListener('load', start, { once: true })
    return () => {
      window.removeEventListener('load', start)
      if (idleId !== undefined) w.cancelIdleCallback?.(idleId)
      if (timer !== undefined) window.clearTimeout(timer)
    }
  }, [])

  return enabled ? <FabricCanvas src={src} /> : null
}
