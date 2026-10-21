import { ImageResponse } from 'next/og'

export const runtime = 'nodejs'

/** Branded fallback social image: /og?title=Fabric%20Sample%20Books */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const title = (searchParams.get('title') || 'Fabric Sample Books & Catalogues').slice(0, 110)

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
          <div style={{ display: 'flex', width: 46, height: 46, borderRadius: 10, background: 'linear-gradient(135deg,#e3c792,#a78659)' }} />
          SAMPLE BOOK MANUFACTURER · UAE
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
