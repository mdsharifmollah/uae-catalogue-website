'use client'

import { Mesh, Program, Renderer, Texture, Triangle } from 'ogl'
import React, { useEffect, useRef, useState } from 'react'

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`

/*
 * Fragment-only "draped fabric": a height field of soft folds (plus a bulge that
 * follows the pointer) is lit with a fake normal, and the fabric photo is
 * refracted along that normal. Cheap enough for phones — one texture fetch.
 */
const fragment = /* glsl */ `
  precision highp float;
  uniform sampler2D tMap;
  uniform vec2 uRes;
  uniform vec2 uImg;
  uniform float uTime;
  uniform vec2 uMouse;
  uniform float uHover;
  uniform float uScroll;
  varying vec2 vUv;

  float folds(vec2 p) {
    float t = uTime * 0.22;
    float v = sin(p.x * 2.6 + t * 1.3 + sin(p.y * 1.9 + t) * 0.9) * 0.5;
    v += sin(p.y * 4.1 - t * 0.8 + p.x * 1.4) * 0.24;
    v += sin((p.x + p.y) * 7.0 + t * 1.6) * 0.07;
    v *= 1.0 + uScroll * 0.8;
    vec2 m = uMouse * vec2(uRes.x / uRes.y, 1.0);
    float d = distance(p, m);
    v += uHover * 0.42 * exp(-d * d * 7.0);
    return v;
  }

  vec2 coverUv(vec2 uv) {
    float rs = uRes.x / uRes.y;
    float ri = uImg.x / uImg.y;
    vec2 scale = rs > ri ? vec2(1.0, ri / rs) : vec2(rs / ri, 1.0);
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    vec2 aspect = vec2(uRes.x / uRes.y, 1.0);
    vec2 p = vUv * aspect;
    float e = 0.0025;
    float c = folds(p);
    float hx = folds(p + vec2(e, 0.0)) - c;
    float hy = folds(p + vec2(0.0, e)) - c;
    vec3 n = normalize(vec3(-hx / e * 0.07, -hy / e * 0.07, 1.0));

    vec2 uv = coverUv(vUv) + n.xy * 0.03;
    uv.y = 1.0 - uv.y;
    vec3 col = texture2D(tMap, uv).rgb;

    vec3 L = normalize(vec3(-0.45, 0.6, 0.75));
    float diff = clamp(dot(n, L), 0.0, 1.0);
    float sheen = pow(clamp(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0, 1.0), 22.0);
    col *= 0.68 + 0.48 * diff;
    col += vec3(1.0, 0.88, 0.7) * sheen * 0.22;

    float vig = smoothstep(1.25, 0.15, length((vUv - 0.5) * vec2(1.1, 1.0)));
    col *= mix(0.4, 1.0, vig);
    gl_FragColor = vec4(col, 1.0);
  }
`

const FabricCanvas: React.FC<{ src: string }> = ({ src }) => {
  const hostRef = useRef<HTMLDivElement>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const host = hostRef.current
    if (!host) return

    let renderer: Renderer
    try {
      renderer = new Renderer({
        dpr: Math.min(window.devicePixelRatio || 1, window.innerWidth < 768 ? 1 : 1.5),
        alpha: false,
        antialias: false,
        powerPreference: 'low-power',
      })
    } catch {
      return // No WebGL: the static image stays.
    }

    const gl = renderer.gl
    gl.clearColor(0.07, 0.075, 0.067, 1)
    const canvas = gl.canvas as HTMLCanvasElement
    canvas.setAttribute('aria-hidden', 'true')
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block'
    host.appendChild(canvas)

    const texture = new Texture(gl, { generateMipmaps: false })
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        tMap: { value: texture },
        uRes: { value: [1, 1] },
        uImg: { value: [1, 1] },
        uTime: { value: 0 },
        uMouse: { value: [0.5, 0.5] },
        uHover: { value: 0 },
        uScroll: { value: 0 },
      },
    })
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

    const resize = () => {
      const { width, height } = host.getBoundingClientRect()
      renderer.setSize(width, height)
      program.uniforms.uRes.value = [width, height]
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(host)

    let disposed = false
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.decoding = 'async'
    img.onload = () => {
      if (disposed) return
      texture.image = img
      program.uniforms.uImg.value = [img.naturalWidth, img.naturalHeight]
      renderer.render({ scene: mesh })
      setReady(true)
    }
    img.src = src

    // Pointer, smoothed
    const target = { x: 0.5, y: 0.5, hover: 0 }
    const current = { x: 0.5, y: 0.5, hover: 0 }
    const section = host.closest('section') || host
    const onMove = (e: PointerEvent) => {
      const r = host.getBoundingClientRect()
      target.x = (e.clientX - r.left) / r.width
      target.y = 1 - (e.clientY - r.top) / r.height
      target.hover = 1
    }
    const onLeave = () => (target.hover = 0)
    section.addEventListener('pointermove', onMove as EventListener, { passive: true })
    section.addEventListener('pointerleave', onLeave)

    // Run only while visible
    let visible = true
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible) loop()
    })
    io.observe(host)

    let raf = 0
    let last = performance.now()
    let t = 0
    const loop = () => {
      cancelAnimationFrame(raf)
      if (disposed || !visible || document.hidden) return
      raf = requestAnimationFrame((now) => {
        // ~30fps is plenty for slow fabric motion and halves GPU work.
        if (now - last < 32) {
          loop()
          return
        }
        const dt = Math.min((now - last) / 1000, 0.05)
        last = now
        t += dt
        current.x += (target.x - current.x) * 0.06
        current.y += (target.y - current.y) * 0.06
        current.hover += (target.hover - current.hover) * 0.04
        const rect = host.getBoundingClientRect()
        const scroll = Math.min(Math.max(-rect.top / Math.max(rect.height, 1), 0), 1)
        program.uniforms.uTime.value = t
        program.uniforms.uMouse.value = [current.x, current.y]
        program.uniforms.uHover.value = current.hover
        program.uniforms.uScroll.value = scroll
        if (texture.image) renderer.render({ scene: mesh })
        loop()
      })
    }
    const onVis = () => {
      last = performance.now()
      if (!document.hidden) loop()
    }
    document.addEventListener('visibilitychange', onVis)
    loop()

    return () => {
      disposed = true
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      section.removeEventListener('pointermove', onMove as EventListener)
      section.removeEventListener('pointerleave', onLeave)
      gl.getExtension('WEBGL_lose_context')?.loseContext()
      canvas.remove()
    }
  }, [src])

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="absolute inset-0 transition-opacity duration-[1400ms] ease-out"
      style={{ opacity: ready ? 1 : 0 }}
    />
  )
}

export default FabricCanvas
