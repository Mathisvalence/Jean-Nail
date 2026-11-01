import type {Metadata} from 'next'

import {Lighting} from '@/components/Lighting'
import {SiteFooter} from '@/components/SiteFooter'
import {SiteHeader} from '@/components/SiteHeader'
import {SITE_DESCRIPTION, SITE_NAME, SITE_URL} from '@/lib/site'

import {fontVariables} from './fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME}, peintre`,
    template: `%s · ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: {
    siteName: SITE_NAME,
    locale: 'fr_FR',
    type: 'website',
  },
}

export default function RootLayout({children}: LayoutProps<'/'>) {
  return (
    <html lang="fr" className={fontVariables}>
      <body>
        <SiteHeader />
        {children}
        <SiteFooter />
        <Lighting />
      </body>
    </html>
  )
}
