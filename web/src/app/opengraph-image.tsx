import {ImageResponse} from 'next/og'

import {SITE_DESCRIPTION, SITE_NAME} from '@/lib/site'

export const alt = `${SITE_NAME}, peintre`
export const size = {width: 1200, height: 630}
export const contentType = 'image/png'

/** Aperçu de partage par défaut : le nom sur le mur gris, comme l'en-tête du site. */
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 80,
        background: 'radial-gradient(circle at 50% 0%, #f4f4f4 0%, #e4e4e4 55%, #c9c9c9 100%)',
        color: '#111110',
      }}
    >
      <div style={{fontSize: 96, letterSpacing: 2, textTransform: 'uppercase'}}>{SITE_NAME}</div>
      <div style={{fontSize: 40, fontStyle: 'italic', color: '#77736c'}}>{SITE_DESCRIPTION}</div>
    </div>,
    size,
  )
}
