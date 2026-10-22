import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

// Al Hejlah scissors mark (same as /public/brand/al-hejlah-mark.svg).
const MARK = `data:image/svg+xml;base64,${Buffer.from(
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="64" y2="64"><stop offset="0" stop-color="#e6c98f"/><stop offset="1" stop-color="#a78659"/></linearGradient></defs><path d="M47 32h3.5M54 32h3.5M61 32h3" stroke="url(#g)" stroke-width="2.2" stroke-linecap="round"/><path d="M28.6 30.6C38 26.6 46 21.6 55.5 14.6 47.6 23.6 40.8 30.2 33.4 35.2Z" fill="url(#g)"/><path d="M28.6 33.4C38 37.4 46 42.4 55.5 49.4 47.6 40.4 40.8 33.8 33.4 28.8Z" fill="url(#g)"/><path d="M19.4 25.4 30.2 31.1M19.4 38.6 30.2 32.9" stroke="url(#g)" stroke-width="4" stroke-linecap="round"/><ellipse cx="13.2" cy="21.6" rx="7" ry="6.2" fill="none" stroke="url(#g)" stroke-width="3.6"/><ellipse cx="13.2" cy="42.4" rx="7" ry="6.2" fill="none" stroke="url(#g)" stroke-width="3.6"/><circle cx="31" cy="32" r="2.4" fill="url(#g)"/><circle cx="31" cy="32" r=".9" fill="#121311"/></svg>',
).toString('base64')}`

/** Branded fallback social image: /og?title=Fabric%20Sample%20Books */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') || 'Fabric Swatches, Sample Hangers & Swatch Books').slice(0, 110)

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px',
          background: 'radial-gradient(circle at 85% 10%, #7d623d 0%, #242521 45%, #121311 100%)',
          color: '#f4f1ea',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, fontSize: 30, letterSpacing: 6, color: '#c9a66b' }}>
          {/* eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text */}
          <img src={MARK} width={64} height={64} />
          AL HEJLAH · UPHOLSTERY FABRIC SAMPLING · UAE
        </div>
        <div style={{ display: 'flex', fontSize: 76, fontWeight: 700, lineHeight: 1.05, letterSpacing: -2, maxWidth: 980 }}>
          {title}
        </div>
        <div style={{ display: 'flex', gap: 14 }}>
          {['#c9a66b', '#a78659', '#ede6da', '#77766f', '#b86b52', '#8e9c86', '#1f2a44'].map((c) => (
            <div key={c} style={{ display: 'flex', width: 84, height: 18, borderRadius: 6, background: c }} />
          ))}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
