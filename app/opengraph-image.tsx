import { ImageResponse } from 'next/og'
export const alt = 'Dafourlance — Digital Services & Consulting'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export default function Image() {
  return new ImageResponse(<div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center',
    width: '100%', height: '100%', padding: 90, background: '#1f2b3b', color: 'white' }}>
    <div style={{ fontSize: 88, color: '#fe6a52', fontWeight: 700 }}>Dafourlance</div>
    <div style={{ fontSize: 34, marginTop: 24 }}>Digital Services &amp; Consulting</div>
  </div>, size)
}
